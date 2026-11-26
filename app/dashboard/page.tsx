import Image from "next/image";
import Link from "next/link";
import { getUser } from "@/lib/auth";
import { q } from "@/lib/db";
import { Alert, Empty, LinkButton } from "@/components/ui";
import { VerifyBanner } from "@/components/VerifyBanner";
import { dateFmt } from "@/lib/utils";
export const metadata = { title: "Dashboard" };
export default async function Page() {
  const u = (await getUser())!;
  const rows = await q<any>("select t.name,t.slug,t.preview_url,o.id order_id,o.paid_at from order_items oi join orders o on o.id=oi.order_id join templates t on t.id=oi.template_id where o.user_id=$1 and o.status='paid' order by o.paid_at desc", [u.id]);
  return <div className="space-y-8"><div><h1 className="font-display text-5xl font-semibold">Welcome, {u.name.split(" ")[0]}</h1><p className="mt-2 text-muted">Here's a quick look at your account.</p></div>
    {!u.email_verified && <VerifyBanner />}
    <div className="grid gap-4 sm:grid-cols-3"><div className="rounded-3xl border border-line bg-white p-6"><div className="text-sm text-muted">Total purchases</div><div className="mt-1 font-display text-5xl">{rows.length}</div></div>
      {[["Browse templates", "/templates"], ["Download your files", "/dashboard/purchases"]].map(([l, h]) => <Link key={h} href={h} className="rounded-3xl border border-line bg-white p-6 transition hover:-translate-y-0.5 hover:shadow-lg"><div className="text-sm text-muted">Quick link</div><div className="mt-2 text-lg font-semibold">{l} →</div></Link>)}</div>
    <section><h2 className="mb-4 font-semibold">Recently purchased</h2>{rows.length ? <div className="grid gap-4 sm:grid-cols-3">{rows.slice(0, 3).map((r: any) => <Link key={r.order_id + r.slug} href="/dashboard/purchases" className="overflow-hidden rounded-3xl border border-line bg-white"><div className="relative aspect-[8/5.2]"><Image src={r.preview_url} alt="" fill sizes="33vw" className="object-cover" unoptimized /></div><div className="p-4"><div className="font-semibold">{r.name}</div><div className="text-xs text-muted">{dateFmt(r.paid_at)}</div></div></Link>)}</div> : <Empty title="No purchases yet" body="When you buy a template it will appear here, ready to download." action={<LinkButton href="/templates" v="brand">Explore Templates</LinkButton>} />}</section></div>;
}
