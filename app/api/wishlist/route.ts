import { z } from "zod";
import { q } from "@/lib/db";
import { getUser } from "@/lib/auth";
import { fail, ok, parse } from "@/lib/http";
const S = z.object({ templateId: z.number().int() });
export async function POST(req: Request) {
  const u = await getUser(); if (!u) return fail("Sign in to save templates", 401);
  const { data, err } = await parse(req, S); if (err) return err;
  await q("insert into wishlist(user_id,template_id) values($1,$2) on conflict do nothing", [u.id, data!.templateId]);
  return ok();
}
export async function DELETE(req: Request) {
  const u = await getUser(); if (!u) return fail("Please sign in", 401);
  const { data, err } = await parse(req, S); if (err) return err;
  await q("delete from wishlist where user_id=$1 and template_id=$2", [u.id, data!.templateId]);
  return ok();
}
