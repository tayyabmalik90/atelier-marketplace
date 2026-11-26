import { getUser } from "@/lib/auth";
import { q } from "@/lib/db";
import { ok } from "@/lib/http";
export async function GET() {
  const u = await getUser();
  const wl = u ? (await q<{ template_id: number }>("select template_id from wishlist where user_id=$1", [u.id])).map((r) => r.template_id) : [];
  return ok({ user: u && { id: u.id, name: u.name, email: u.email, role: u.role, verified: u.email_verified }, wishlist: wl });
}
