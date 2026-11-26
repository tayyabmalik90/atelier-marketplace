import { one, q } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { fail, ok } from "@/lib/http";
import { stripe, stripeEnabled } from "@/lib/stripe";
import { sendMail } from "@/lib/mail";
export async function POST(_: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await requireAdmin())) return fail("Forbidden", 403);
  const { id } = await params;
  const o = await one<any>("select * from orders where id=$1", [id]);
  if (!o) return fail("Order not found", 404);
  if (o.status !== "paid") return fail("Only paid orders can be refunded", 409);
  if (o.provider === "stripe" && stripeEnabled() && o.provider_ref) {
    const s = await stripe().checkout.sessions.retrieve(o.provider_ref);
    if (s.payment_intent) await stripe().refunds.create({ payment_intent: String(s.payment_intent) });
  }
  await q("update orders set status='refunded', refunded_at=now() where id=$1", [id]);
  await q("update templates set sales=greatest(sales-1,0) where id in (select template_id from order_items where order_id=$1)", [id]);
  await sendMail(o.email, "Your Atelier refund", `Your order ${id} has been refunded. Access to the downloads has been removed. Funds typically arrive within 5–10 business days.`);
  return ok();
}
