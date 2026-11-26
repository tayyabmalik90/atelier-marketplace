import { z } from "zod";
import { one } from "@/lib/db";
import { checkPassword, startSession } from "@/lib/auth";
import { fail, ok, parse } from "@/lib/http";
const S = z.object({ email: z.string().trim().toLowerCase().email("Enter a valid email"), password: z.string().min(1, "Enter your password") });
export async function POST(req: Request) {
  const { data, err } = await parse(req, S); if (err) return err;
  const u = await one<any>("select id,password_hash,role from users where email=$1", [data!.email]);
  if (!u?.password_hash || !(await checkPassword(data!.password, u.password_hash))) return fail("Incorrect email or password", 401);
  await startSession(u.id);
  return ok({ role: u.role });
}
