import { q } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { fail, ok, parse } from "@/lib/http";
import { TemplateInput } from "@/lib/adminSchema";
type P = { params: Promise<{ id: string }> };
export async function PUT(req: Request, { params }: P) {
  if (!(await requireAdmin())) return fail("Forbidden", 403);
  const id = Number((await params).id);
  const { data: d, err } = await parse(req, TemplateInput); if (err) return err;
  const dup = d!.slug ? await q("select 1 from templates where slug=$1 and id<>$2", [d!.slug, id]) : [];
  if (dup.length) return fail("A template with this slug already exists", 409);
  await q("update templates set slug=coalesce($2,slug),name=$3,description=$4,category=$5,type=$6,style=$7,tech=$8,features=$9,tags=$10,price_cents=$11,preview_url=$12,screenshots=$13,demo_url=$14,file_path=$15,badge=$16,status=$17 where id=$1", [id, d!.slug ?? null, d!.name, d!.description, d!.category, d!.type, d!.style, d!.tech, d!.features, d!.tags, Math.round(d!.price * 100), d!.previewUrl, d!.screenshots, d!.demoUrl, d!.filePath ?? null, d!.badge, d!.status]);
  return ok();
}
export async function DELETE(req: Request, { params }: P) {
  if (!(await requireAdmin())) return fail("Forbidden", 403);
  const id = Number((await params).id);
  const hard = new URL(req.url).searchParams.get("hard") === "1";
  const sold = await q("select 1 from order_items where template_id=$1 limit 1", [id]);
  if (hard && !sold.length) { await q("delete from templates where id=$1", [id]); return ok({ deleted: true }); }
  await q("update templates set status='archived' where id=$1", [id]); // templates with orders are archived, never destroyed
  return ok({ archived: true });
}
