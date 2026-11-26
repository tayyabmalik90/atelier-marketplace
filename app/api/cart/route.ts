import { z } from "zod";
import { priceCart } from "@/lib/orders";
import { ok, parse } from "@/lib/http";
export async function POST(req: Request) {
  const { data, err } = await parse(req, z.object({ ids: z.array(z.number().int()).max(50), coupon: z.string().optional() })); if (err) return err;
  return ok(await priceCart(data!.ids, data!.coupon));
}
