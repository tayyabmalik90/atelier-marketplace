import { z } from "zod";
import { one, q } from "@/lib/db";
import { getUser } from "@/lib/auth";
import { fail, ok, parse } from "@/lib/http";
import { markPaid } from "@/lib/orders";
import { stripeEnabled } from "@/lib/stripe";
// Built-in test-mode payment processor, active only when Stripe isn't configured.
export async function POST(req: Request) {
  if (stripeEnabled()) return fail("Test payments are disabled when Stripe is configured", 403);
  const u = await getUser(); if (!u) return fail("Please sign in", 401);
  const { data: d, err } = await parse(req, z.object({ orderId: z.string().uuid(), number: z.string(), exp: z.string(), cvc: z.string() })); if (err) return err;
  const o = await one<any>("select id,status from orders where id=$1 and user_id=$2", [d!.orderId, u.id]);
  if (!o) return fail("Order not found", 404);
  if (o.status === "paid") return ok();
  const n = d!.number.replace(/\s/g, "");
  if (!/^\d{16}$/.test(n)) return fail("Enter a valid 16-digit card number", 422);
  if (!/^(0[1-9]|1[0-2])\s*\/\s*\d{2}$/.test(d!.exp)) return fail("Enter expiry as MM / YY", 422);
  if (!/^\d{3,4}$/.test(d!.cvc)) return fail("Enter a valid CVC", 422);
  if (n === "4000000000000002") { await q("update orders set status='failed' where id=$1", [o.id]); return fail("Your card was declined. Try a different card.", 402); }
  if (n !== "4242424242424242") return fail("Test mode: use card 4242 4242 4242 4242", 402);
  await markPaid(o.id, "test_" + Date.now());
  return ok();
}
