import { z } from "zod";
import { q, one } from "@/lib/db";
import { getUser } from "@/lib/auth";
import { fail, ok, parse } from "@/lib/http";
import { markPaid, priceCart } from "@/lib/orders";
import { stripe, stripeEnabled } from "@/lib/stripe";
import { appUrl } from "@/lib/mail";
const S = z.object({ ids: z.array(z.number().int()).min(1, "Your cart is empty").max(50), coupon: z.string().optional(), email: z.string().trim().toLowerCase().email("Enter a valid email"), name: z.string().trim().min(2, "Enter your full name"), country: z.string().trim().min(2, "Select your country") });
export async function POST(req: Request) {
  const u = await getUser(); if (!u) return fail("Please sign in to check out", 401);
  const { data: d, err } = await parse(req, S); if (err) return err;
  const owned = (await q<{ template_id: number }>("select oi.template_id from order_items oi join orders o on o.id=oi.order_id where o.user_id=$1 and o.status='paid'", [u.id])).map((r) => r.template_id);
  const ids = [...new Set(d!.ids)].filter((i) => !owned.includes(i));
  if (!ids.length) return fail("You already own the templates in your cart", 409);
  const p = await priceCart(ids, d!.coupon);
  if (!p.items.length) return fail("These templates are no longer available", 410);
  const provider = stripeEnabled() ? "stripe" : "test";
  const order = (await q("insert into orders(user_id,email,subtotal_cents,discount_cents,total_cents,coupon_code,provider) values($1,$2,$3,$4,$5,$6,$7) returning id", [u.id, d!.email, p.subtotal, p.discount, p.total, p.coupon, provider]))[0];
  for (const it of p.items) await q("insert into order_items(order_id,template_id,name,price_cents) values($1,$2,$3,$4)", [order.id, it.id, it.name, it.price_cents]);
  if (p.total === 0) { await markPaid(order.id, "free"); return ok({ url: `${appUrl()}/order/${order.id}` }); }
  if (provider === "stripe") {
    const s = stripe();
    const coupon = p.percent ? await s.coupons.create({ percent_off: p.percent, duration: "once" }) : null;
    const session = await s.checkout.sessions.create({
      mode: "payment", customer_email: d!.email, metadata: { order_id: order.id },
      line_items: p.items.map((i) => ({ quantity: 1, price_data: { currency: "usd", unit_amount: i.price_cents, product_data: { name: i.name } } })),
      ...(coupon ? { discounts: [{ coupon: coupon.id }] } : {}),
      success_url: `${appUrl()}/order/${order.id}?checkout=return`, cancel_url: `${appUrl()}/cart`,
    });
    await q("update orders set provider_ref=$1 where id=$2", [session.id, order.id]);
    return ok({ url: session.url });
  }
  return ok({ url: `/checkout/pay/${order.id}` });
}
