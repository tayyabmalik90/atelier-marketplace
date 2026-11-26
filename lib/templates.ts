import { q, one } from "./db";
import type { Template } from "./template-types";
export { label, isNew } from "./template-types";
export type { Template } from "./template-types";

export type Filters = { q?: string; category?: string[]; type?: string[]; style?: string[]; tech?: string[]; features?: string[]; min?: number; max?: number; sort?: string; page?: number; per?: number; badge?: string };

export async function searchTemplates(f: Filters) {
  const where = ["status='published'"]; const p: any[] = [];
  const add = (sql: string, v: any) => { p.push(v); where.push(sql.replace("?", "$" + p.length)); };
  if (f.q) { p.push("%" + f.q.toLowerCase() + "%"); where.push(`(lower(name) like $${p.length} or lower(description) like $${p.length} or lower(category) like $${p.length} or lower(type) like $${p.length} or exists(select 1 from unnest(tags) t where lower(t) like $${p.length}))`); }
  if (f.category?.length) add("category = any(?::text[])", f.category);
  if (f.type?.length) add("type = any(?::text[])", f.type);
  if (f.style?.length) add("style = any(?::text[])", f.style);
  if (f.tech?.length) add("tech && ?::text[]", f.tech);
  if (f.features?.length) add("features @> ?::text[]", f.features);
  if (f.badge) add("badge = ?", f.badge);
  if (f.min != null) add("price_cents >= ?", f.min * 100);
  if (f.max != null) add("price_cents <= ?", f.max * 100);
  const order = { popular: "sales desc", newest: "created_at desc", "price-asc": "price_cents asc", "price-desc": "price_cents desc", featured: "(badge='featured') desc, sales desc" }[f.sort || "featured"] || "sales desc";
  const per = f.per ?? 9, page = Math.max(1, f.page ?? 1);
  const w = where.join(" and ");
  const [{ n }] = await q<{ n: number }>(`select count(*)::int n from templates where ${w}`, p);
  const rows = await q<Template>(`select * from templates where ${w} order by ${order}, id limit ${per} offset ${(page - 1) * per}`, p);
  return { rows, total: n, pages: Math.max(1, Math.ceil(n / per)), page };
}
export const getTemplate = (slug: string) => one<Template>("select * from templates where slug=$1 and status<>'draft'", [slug]);
export const related = (t: Template) => q<Template>("select * from templates where status='published' and id<>$1 order by (category=$2) desc, (style=$3) desc, sales desc limit 3", [t.id, t.category, t.style]);
