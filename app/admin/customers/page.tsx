import { q } from "@/lib/db";
import { Badge } from "@/components/ui";
import { dateFmt, money } from "@/lib/utils";
export default async function Page() {
  const rows = await q<any>("select u.*, (select count(*) from orders where user_id=u.id and status='paid')::int orders, (select coalesce(sum(total_cents),0) from orders where user_id=u.id and status='paid')::int spent from users u order by created_at desc");
  return <div><h1 className="mb-8 font-display text-5xl font-semibold">Customers</h1><div className="overflow-x-auto rounded-3xl border border-line bg-white"><table className="w-full text-sm"><thead className="text-left text-xs text-muted"><tr><th className="p-4">Name</th><th>Email</th><th>Role</th><th>Orders</th><th>Spent</th><th>Joined</th></tr></thead><tbody>{rows.map((u: any) => <tr key={u.id} className="border-t border-line"><td className="p-4 font-medium">{u.name}</td><td>{u.email} {u.email_verified && <Badge tone="ok">verified</Badge>}</td><td>{u.role}</td><td>{u.orders}</td><td>{money(u.spent)}</td><td>{dateFmt(u.created_at)}</td></tr>)}</tbody></table></div></div>;
}
