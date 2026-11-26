import { q } from "@/lib/db";
import { money } from "@/lib/utils";
export default async function Page() {
  const [s] = await q<any>("select coalesce(sum(total_cents) filter (where status='paid'),0)::int rev, count(*) filter (where status='paid')::int paid, count(*) filter (where status='refunded')::int refunded, count(*) filter (where status='pending')::int pending from orders");
  const [c] = await q<any>("select count(*)::int n from users where role='customer'");
  const [t] = await q<any>("select count(*) filter (where status='published')::int pub, count(*) filter (where status<>'published')::int other from templates");
  const days = await q<any>("select to_char(d,'Mon DD') label, coalesce((select sum(total_cents) from orders where status='paid' and paid_at::date=d::date),0)::int rev from generate_series(now()::date - 13, now()::date, '1 day') d order by d");
  const top = await q<any>("select t.name, count(*)::int n, sum(oi.price_cents)::int rev from order_items oi join orders o on o.id=oi.order_id join templates t on t.id=oi.template_id where o.status='paid' group by t.name order by n desc limit 5");
  const max = Math.max(1, ...days.map((d: any) => d.rev));
  const cards = [["Revenue", money(s.rev)], ["Paid orders", s.paid], ["Customers", c.n], ["Live templates", t.pub], ["Refunded", s.refunded], ["Pending", s.pending]];
  return <div className="space-y-8"><h1 className="font-display text-5xl font-semibold">Overview</h1>
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">{cards.map(([l, v]) => <div key={l as string} className="rounded-3xl border border-line bg-white p-5"><div className="text-sm text-muted">{l}</div><div className="mt-1 font-display text-4xl">{v}</div></div>)}</div>
    <section className="rounded-3xl border border-line bg-white p-6"><h2 className="mb-5 font-semibold">Revenue, last 14 days</h2><div className="flex h-40 items-end gap-1.5" role="img" aria-label="Revenue bar chart">{days.map((d: any) => <div key={d.label} className="group flex flex-1 flex-col items-center justify-end" title={`${d.label}: ${money(d.rev)}`}><div className="w-full rounded-t-md bg-brand/80 transition group-hover:bg-brand" style={{ height: Math.max(3, (d.rev / max) * 100) + "%", opacity: d.rev ? 1 : 0.15 }} /></div>)}</div><div className="mt-2 flex justify-between text-xs text-muted"><span>{days[0].label}</span><span>{days[days.length - 1].label}</span></div></section>
    <section className="rounded-3xl border border-line bg-white p-6"><h2 className="mb-3 font-semibold">Top sellers</h2>{top.length ? <ul className="divide-y divide-line text-sm">{top.map((x: any) => <li key={x.name} className="flex justify-between py-2.5"><span>{x.name}</span><span className="text-muted">{x.n} sold · {money(x.rev)}</span></li>)}</ul> : <p className="text-sm text-muted">No sales yet.</p>}</section></div>;
}
