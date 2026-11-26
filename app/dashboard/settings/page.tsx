import Link from "next/link";
import { getUser } from "@/lib/auth";
import { q } from "@/lib/db";
import { SettingsForm } from "@/components/SettingsForm";
import { Badge } from "@/components/ui";
import { dateFmt, money } from "@/lib/utils";
export const metadata = { title: "Account settings" };
export default async function Page() {
  const u = (await getUser())!;
  const orders = await q<any>("select o.*, (select string_agg(name, ', ') from order_items where order_id=o.id) names from orders o where user_id=$1 and status<>'pending' order by created_at desc", [u.id]);
  return <div className="space-y-10"><div><h1 className="mb-8 font-display text-5xl font-semibold">Account settings</h1><SettingsForm name={u.name} email={u.email} /></div>
    <section><h2 className="mb-4 font-display text-3xl font-semibold">Order history</h2>{orders.length ? <div className="overflow-x-auto rounded-3xl border border-line bg-white"><table className="w-full text-sm"><thead className="text-left text-xs text-muted"><tr><th className="p-4">Order</th><th>Date</th><th>Items</th><th>Total</th><th>Status</th></tr></thead><tbody>{orders.map((o: any) => <tr key={o.id} className="border-t border-line"><td className="p-4 font-mono"><Link href={`/order/${o.id}`} className="hover:underline">{o.id.slice(0, 8)}</Link></td><td>{dateFmt(o.created_at)}</td><td className="max-w-48 truncate">{o.names}</td><td>{money(o.total_cents)}</td><td><Badge tone={o.status === "paid" ? "ok" : o.status === "refunded" ? "plain" : "bad"}>{o.status}</Badge></td></tr>)}</tbody></table></div> : <p className="text-sm text-muted">No orders yet.</p>}</section></div>;
}
