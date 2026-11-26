import { NextResponse } from "next/server";
import { q } from "@/lib/db";
import { markPaid } from "@/lib/orders";
import { stripe, stripeEnabled } from "@/lib/stripe";
export async function POST(req: Request) {
  if (!stripeEnabled() || !process.env.STRIPE_WEBHOOK_SECRET) return NextResponse.json({ error: "not configured" }, { status: 503 });
  const body = await req.text();
  let ev;
  try { ev = stripe().webhooks.constructEvent(body, req.headers.get("stripe-signature") || "", process.env.STRIPE_WEBHOOK_SECRET); }
  catch { return NextResponse.json({ error: "bad signature" }, { status: 400 }); }
  const s: any = ev.data.object;
  if (ev.type === "checkout.session.completed" && s.payment_status === "paid" && s.metadata?.order_id) await markPaid(s.metadata.order_id, s.payment_intent);
  if (ev.type === "checkout.session.expired" && s.metadata?.order_id) await q("update orders set status='failed' where id=$1 and status='pending'", [s.metadata.order_id]);
  return NextResponse.json({ received: true });
}
