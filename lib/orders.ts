import { q, one } from "./db";
import { sendMail, appUrl } from "./mail";
import { money } from "./utils";

export async function priceCart(ids: number[], coupon?: string) {
  if (!ids.length) return { items: [] as any[], subtotal: 0, discount: 0, total: 0, coupon: null as string | null, percent: 0 };
  const items = await q<{ id: number; name: string; price_cents: number; slug: string; preview_url: string }>("select id,name,price_cents,slug,preview_url from templates where id = any($1::int[]) and status='published'", [ids]);
  const subtotal = items.reduce((s, i) => s + i.price_cents, 0);
  let percent = 0, code: string | null = null;
  if (coupon) { const c = await one<{ code: string; percent: number }>("select code,percent from coupons where code=$1 and active", [coupon.trim().toUpperCase()]); if (c) { percent = c.percent; code = c.code; } }
  const discount = Math.round((subtotal * percent) / 100);
  return { items, subtotal, discount, total: subtotal - discount, coupon: code, percent };
}

export async function markPaid(orderId: string, providerRef?: string) {
  const o = await one<{ id: string; status: string; email: string; total_cents: number }>("update orders set status='paid', paid_at=now(), provider_ref=coalesce($2,provider_ref) where id=$1 and status='pending' returning id,status,email,total_cents", [orderId, providerRef ?? null]);
  if (!o) return false; // already processed — idempotent
  await q("update templates set sales = sales + 1 where id in (select template_id from order_items where order_id=$1)", [orderId]);
  const items = await q<{ name: string }>("select name from order_items where order_id=$1", [orderId]);
  await sendMail(o.email, `Your Atelier order is confirmed`, `Thank you for your purchase!\n\nOrder: ${o.id}\nTotal: ${money(o.total_cents)}\n\n${items.map((i) => "• " + i.name).join("\n")}\n\nDownload your templates any time from your dashboard:\n${appUrl()}/dashboard/purchases\n\nDocumentation: ${appUrl()}/help`);
  return true;
}
