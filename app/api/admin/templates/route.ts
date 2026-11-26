import { q } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { fail, ok, parse } from "@/lib/http";
import { TemplateInput } from "@/lib/adminSchema";
import { slugify } from "@/lib/utils";
export async function POST(req: Request) {
  if (!(await requireAdmin())) return fail("Forbidden", 403);
  const { data: d, err } = await parse(req, TemplateInput); if (err) return err;
  const slug = d!.slug || slugify(d!.name);
  if ((await q("select 1 from templates where slug=$1", [slug])).length) return fail("A template with this slug already exists", 409);
  const r = await q("insert into templates(slug,name,description,category,type,style,tech,features,tags,price_cents,preview_url,screenshots,demo_url,file_path,badge,status) values($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16) returning id", [slug, d!.name, d!.description, d!.category, d!.type, d!.style, d!.tech, d!.features, d!.tags, Math.round(d!.price * 100), d!.previewUrl, d!.screenshots, d!.demoUrl, d!.filePath ?? null, d!.badge, d!.status]);
  return ok({ id: r[0].id, slug });
}
