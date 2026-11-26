import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { CheckCircle2, Clock, Download } from "lucide-react";
import { getUser } from "@/lib/auth";
import { one, q } from "@/lib/db";
import { OrderWatcher } from "@/components/OrderWatcher";
import { Container, LinkButton } from "@/components/ui";
import { dateFmt, money } from "@/lib/utils";
export const dynamic = "force-dynamic"; export const metadata = { title: "Order confirmation" };
export default async function Order({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params; const u = await getUser(); if (!u) redirect("/login?next=/order/" + id);
  if (!/^[0-9a-f-]{36}$/.test(id)) notFound();
  const o = await one<any>("select * from orders where id=$1 and user_id=$2", [id, u.id]); if (!o) notFound();
  const items = await q<any>("select oi.*, t.slug from order_items oi join templates t on t.id=oi.template_id where order_id=$1", [id]);
  const paid = o.status === "paid";
  return <Container className="max-w-3xl py-14"><OrderWatcher id={id} status={o.status} />
    <div className="text-center">{paid ? <CheckCircle2 className="mx-auto text-ok" size={52} /> : <Clock className="mx-auto text-muted" size={52} />}
      <h1 className="mt-4 font-display text-5xl font-semibold">{paid ? "Thank you, your order is confirmed" : o.status === "pending" ? "Confirming your payment…" : o.status === "refunded" ? "Order refunded" : "Payment didn't go through"}</h1>
      <p className="mt-3 text-muted">{paid ? `A confirmation email is on its way to ${o.email}.` : o.status === "pending" ? "This usually takes a few seconds. Downloads unlock as soon as payment is verified." : "No charge was made. You can try again from your cart."}</p></div>
    <div className="mt-10 rounded-3xl border border-line bg-white p-6 sm:p-8">
      <div className="flex flex-wrap justify-between gap-2 border-b border-line pb-4 text-sm"><span className="text-muted">Order <b className="font-mono text-ink">{id.slice(0, 8)}</b></span><span className="text-muted">{dateFmt(o.created_at)}</span></div>
      <ul className="divide-y divide-line">{items.map((i: any) => <li key={i.id} className="flex items-center justify-between gap-3 py-4"><span className="font-medium">{i.name}</span><span className="flex items-center gap-3"><span className="tabular-nums text-sm text-muted">{money(i.price_cents)}</span>{paid && <a href={`/api/download/${id}/${i.template_id}`} className="inline-flex h-9 items-center gap-1.5 rounded-full bg-ink px-4 text-sm text-white transition hover:bg-black"><Download size={14} />Download</a>}</span></li>)}</ul>
      <div className="space-y-1 border-t border-line pt-4 text-sm">{o.discount_cents > 0 && <div className="flex justify-between text-ok"><span>Discount {o.coupon_code}</span><span>−{money(o.discount_cents)}</span></div>}<div className="flex justify-between text-base font-semibold"><span>Total paid</span><span>{money(o.total_cents)}</span></div></div></div>
    {paid && <div className="mt-6 rounded-3xl border border-line bg-white p-6 sm:p-8"><h2 className="font-display text-3xl font-semibold">How to launch</h2><ol className="mt-3 list-decimal space-y-2 pl-5 text-sm text-muted"><li>Download the .zip and unzip it.</li><li>Open <code className="rounded bg-black/5 px-1">index.html</code> to preview locally.</li><li>Edit text and colours (see README inside).</li><li>Upload to Vercel, Netlify or any static host.</li></ol><p className="mt-3 text-sm text-muted">Need help? <Link href="/help" className="text-brand underline">Documentation & support</Link>. Your licence terms are on the <Link href="/license" className="text-brand underline">License page</Link>.</p></div>}
    <div className="mt-8 flex justify-center gap-3"><LinkButton href="/dashboard/purchases" v="brand">My purchases</LinkButton><LinkButton href="/templates" v="outline">Keep browsing</LinkButton></div></Container>;
}
