import { z } from "zod";
import { q } from "@/lib/db";
import { consumeToken, hashPassword } from "@/lib/auth";
import { fail, ok, parse } from "@/lib/http";
export async function POST(req: Request) {
  const { data, err } = await parse(req, z.object({ token: z.string().min(10), password: z.string().min(8, "Password must be at least 8 characters").max(100) })); if (err) return err;
  const uid = await consumeToken(data!.token, "reset");
  if (!uid) return fail("This reset link is invalid or has expired", 400);
  await q("update users set password_hash=$1 where id=$2", [await hashPassword(data!.password), uid]);
  return ok();
}
