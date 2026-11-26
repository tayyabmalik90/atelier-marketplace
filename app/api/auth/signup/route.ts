import { z } from "zod";
import { one, q } from "@/lib/db";
import { createToken, hashPassword, startSession } from "@/lib/auth";
import { fail, ok, parse } from "@/lib/http";
import { sendMail, appUrl } from "@/lib/mail";
const S = z.object({ name: z.string().trim().min(2, "Enter your name").max(80), email: z.string().trim().toLowerCase().email("Enter a valid email"), password: z.string().min(8, "Password must be at least 8 characters").max(100) });
export async function POST(req: Request) {
  const { data, err } = await parse(req, S); if (err) return err;
  if (await one("select 1 from users where email=$1", [data!.email])) return fail("An account with this email already exists", 409);
  const u = (await q("insert into users(email,name,password_hash) values($1,$2,$3) returning id", [data!.email, data!.name, await hashPassword(data!.password)]))[0];
  const tok = await createToken(u.id, "verify", 48);
  await sendMail(data!.email, "Verify your Atelier email", `Welcome to Atelier, ${data!.name}!\n\nConfirm your email address:\n${appUrl()}/api/auth/verify?token=${tok}\n`);
  await startSession(u.id);
  return ok();
}
