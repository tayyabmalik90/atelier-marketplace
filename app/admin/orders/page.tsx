import { q } from "@/lib/db";
import { RefundButton } from "@/components/AdminActions";
import { Badge } from "@/components/ui";
import { dateFmt, money } from "@/lib/utils";
export default async function Page() {
  const rows = await q<any>("select o.*, u.name uname, (select string_agg(name, ', ') from order_items where order_id=o.id) names from orders o join users u on u.id=o.user_id order by o.created_at desc limit 200");
  return <div><h1 className="mb-8 font-display text-5xl font-semibold">Orders</h1><div className="overflow-x-auto rounded-3xl border border-line bg-white"><table className="w-full text-sm"><thead className="text-left text-xs text-muted"><tr><th className="p-4">Order</th><th>Customer</th><th>Items</th><th>Total</th><th>Payment</th><th>Date</th><th /></tr></thead><tbody>{rows.map((o: any) => <tr key={o.id} className="border-t border-line"><td className="p-4 font-mono">{o.id.slice(0, 8)}</td><td>{o.uname}<div className="text-xs text-muted">{o.email}</div></td><td className="max-w-48 truncate">{o.names}</td><td>{money(o.total_cents)}</td><td><Badge tone={o.status === "paid" ? "ok" : o.status === "pending" ? "plain" : o.status === "refunded" ? "brand" : "bad"}>{o.status}</Badge> <span className="text-xs text-muted">{o.provider}</span></td><td>{dateFmt(o.created_at)}</td><td className="p-3 text-right">{o.status === "paid" && <RefundButton id={o.id} />}</td></tr>)}{!rows.length && <tr><td colSpan={7} className="p-10 text-center text-muted">No orders yet.</td></tr>}</tbody></table></div></div>;
}
