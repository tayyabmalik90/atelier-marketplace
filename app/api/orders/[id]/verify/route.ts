import { one } from "@/lib/db";
import { getUser } from "@/lib/auth";
import { fail, ok } from "@/lib/http";
import { markPaid } from "@/lib/orders";
import { stripe, stripeEnabled } from "@/lib/stripe";
// Re-checks payment with the provider (server-side). Downloads unlock only when status becomes 'paid'.
export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params; const u = await getUser(); if (!u) return fail("Please sign in", 401);
  const o = await one<any>("select id,status,provider,provider_ref from orders where id=$1 and user_id=$2", [id, u.id]);
  if (!o) return fail("Order not found", 404);
  if (o.status === "pending" && o.provider === "stripe" && stripeEnabled() && o.provider_ref) {
    const s = await stripe().checkout.sessions.retrieve(o.provider_ref);
    if (s.payment_status === "paid") await markPaid(o.id, typeof s.payment_intent === "string" ? s.payment_intent : undefined);
  }
  const fresh = await one<any>("select status from orders where id=$1", [id]);
  return ok({ status: fresh.status });
}
