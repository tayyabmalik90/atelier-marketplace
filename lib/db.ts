import fs from "node:fs";
import path from "node:path";
import bcrypt from "bcryptjs";

type Row = Record<string, any>;
interface Driver { query(text: string, params?: any[]): Promise<Row[]>; }

const SCHEMA = `
create table if not exists users(
  id uuid primary key default gen_random_uuid(),
  email text unique not null, name text not null default '', password_hash text,
  role text not null default 'customer', email_verified boolean not null default false,
  created_at timestamptz not null default now());
create table if not exists auth_tokens(
  id uuid primary key default gen_random_uuid(), user_id uuid not null references users(id) on delete cascade,
  kind text not null, token_hash text not null, expires_at timestamptz not null, used boolean not null default false);
create table if not exists templates(
  id serial primary key, slug text unique not null, name text not null, description text not null default '',
  category text not null, type text not null default '', style text not null default 'Modern',
  tech text[] not null default '{}', features text[] not null default '{}', tags text[] not null default '{}',
  price_cents int not null check (price_cents >= 0), preview_url text not null default '', screenshots text[] not null default '{}',
  demo_url text not null default '', file_path text, badge text not null default '', status text not null default 'published',
  sales int not null default 0, created_at timestamptz not null default now());
create table if not exists wishlist(user_id uuid references users(id) on delete cascade, template_id int references templates(id) on delete cascade, created_at timestamptz default now(), primary key(user_id, template_id));
create table if not exists coupons(code text primary key, percent int not null check (percent between 1 and 100), active boolean not null default true);
create table if not exists orders(
  id uuid primary key default gen_random_uuid(), user_id uuid not null references users(id),
  email text not null, status text not null default 'pending', subtotal_cents int not null, discount_cents int not null default 0,
  total_cents int not null, coupon_code text, provider text not null default 'test', provider_ref text,
  created_at timestamptz not null default now(), paid_at timestamptz, refunded_at timestamptz);
create table if not exists order_items(id serial primary key, order_id uuid not null references orders(id) on delete cascade, template_id int not null references templates(id), name text not null, price_cents int not null);
create table if not exists emails(id serial primary key, to_email text not null, subject text not null, body text not null, created_at timestamptz not null default now());
`;

declare global { var __db: Promise<Driver> | undefined; }

async function open(): Promise<Driver> {
  let drv: Driver;
  if (process.env.DATABASE_URL) {
    const postgres = (await import("postgres")).default;
    const sql = postgres(process.env.DATABASE_URL, { max: 5, prepare: false });
    drv = { query: async (t, p) => (await sql.unsafe(t, p ?? [])) as unknown as Row[] };
  } else {
    const { PGlite } = await import("@electric-sql/pglite");
    const dir = process.env.VERCEL ? undefined : path.join(process.cwd(), ".data", "pg");
    if (dir) fs.mkdirSync(path.dirname(dir), { recursive: true });
    const pg = new PGlite(dir);
    await pg.waitReady;
    drv = { query: async (t, p) => (await pg.query(t, p ?? [])).rows as Row[] };
  }
  for (const stmt of SCHEMA.split(";").map((s) => s.trim()).filter(Boolean)) await drv.query(stmt);
  await seed(drv);
  return drv;
}

async function seed(d: Driver) {
  const [{ n }] = await d.query("select count(*)::int as n from templates");
  if (n === 0) {
    const file = path.join(process.cwd(), "data", "templates.json");
    const list: any[] = JSON.parse(fs.readFileSync(file, "utf8"));
    for (const t of list) {
      await d.query(
        `insert into templates(slug,name,description,category,type,style,tech,features,tags,price_cents,preview_url,screenshots,demo_url,badge,sales,created_at)
         values($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15, now() - ($16 || ' days')::interval)`,
        [t.slug, t.name, t.desc, t.category, t.type, t.style, t.tech, t.features, t.tags, t.price * 100, t.preview, t.screenshots, t.demoUrl, t.badge, t.sales, String(t.days)]
      );
    }
    await d.query("insert into coupons(code,percent) values('WELCOME10',10),('LAUNCH20',20) on conflict do nothing");
  }
  const email = (process.env.ADMIN_EMAIL || "admin@atelier.test").toLowerCase();
  const exists = await d.query("select 1 from users where email=$1", [email]);
  if (!exists.length) {
    const hash = await bcrypt.hash(process.env.ADMIN_PASSWORD || "admin12345", 10);
    await d.query("insert into users(email,name,password_hash,role,email_verified) values($1,'Admin',$2,'admin',true)", [email, hash]);
  }
}

export function db(): Promise<Driver> {
  if (!globalThis.__db) globalThis.__db = open();
  return globalThis.__db;
}
export async function q<T = Row>(text: string, params: any[] = []): Promise<T[]> {
  return (await (await db()).query(text, params)) as T[];
}
export async function one<T = Row>(text: string, params: any[] = []): Promise<T | undefined> {
  return (await q<T>(text, params))[0];
}
