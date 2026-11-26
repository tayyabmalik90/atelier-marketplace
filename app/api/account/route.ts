import { z } from "zod";
import { one, q } from "@/lib/db";
import { checkPassword, getUser, hashPassword } from "@/lib/auth";
import { fail, ok, parse } from "@/lib/http";
const S = z.object({ name: z.string().trim().min(2, "Enter your name").max(80).optional(), email: z.string().trim().toLowerCase().email("Enter a valid email").optional(), currentPassword: z.string().optional(), newPassword: z.string().min(8, "New password must be at least 8 characters").max(100).optional() });
export async function POST(req: Request) {
  const u = await getUser(); if (!u) return fail("Please sign in", 401);
  const { data: d, err } = await parse(req, S); if (err) return err;
  if (d!.name) await q("update users set name=$1 where id=$2", [d!.name, u.id]);
  if (d!.email && d!.email !== u.email) {
    if (await one("select 1 from users where email=$1", [d!.email])) return fail("That email is already in use", 409);
    await q("update users set email=$1, email_verified=false where id=$2", [d!.email, u.id]);
  }
  if (d!.newPassword) {
    const row = await one<any>("select password_hash from users where id=$1", [u.id]);
    if (!d!.currentPassword || !(await checkPassword(d!.currentPassword, row!.password_hash))) return fail("Current password is incorrect", 403);
    await q("update users set password_hash=$1 where id=$2", [await hashPassword(d!.newPassword), u.id]);
  }
  return ok();
}
