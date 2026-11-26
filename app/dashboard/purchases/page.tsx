import Image from "next/image";
import Link from "next/link";
import { Download, ExternalLink, BookOpen } from "lucide-react";
import { getUser } from "@/lib/auth";
import { q } from "@/lib/db";
import { Empty, LinkButton } from "@/components/ui";
import { dateFmt } from "@/lib/utils";
export const metadata = { title: "My purchases" };
export default async function Page() {
  const u = (await getUser())!;
  const rows = await q<any>("select t.id tid,t.name,t.slug,t.preview_url,t.demo_url,o.id order_id,o.paid_at from order_items oi join orders o on o.id=oi.order_id join templates t on t.id=oi.template_id where o.user_id=$1 and o.status='paid' order by o.paid_at desc", [u.id]);
  return <div><h1 className="font-display text-5xl font-semibold">My purchases</h1>
    <div className="mt-8 space-y-4">{rows.length ? rows.map((r: any) => <div key={r.order_id + r.tid} className="flex flex-col gap-4 rounded-3xl border border-line bg-white p-4 sm:flex-row sm:items-center">
      <div className="relative aspect-[8/5.2] w-full overflow-hidden rounded-2xl sm:w-44"><Image src={r.preview_url} alt="" fill sizes="176px" className="object-cover" unoptimized /></div>
      <div className="flex-1"><Link href={`/templates/${r.slug}`} className="text-lg font-semibold hover:underline">{r.name}</Link><p className="text-sm text-muted">Purchased {dateFmt(r.paid_at)} · Order <span className="font-mono">{r.order_id.slice(0, 8)}</span></p></div>
      <div className="flex flex-wrap gap-2"><a href={`/api/download/${r.order_id}/${r.tid}`} className="inline-flex h-10 items-center gap-1.5 rounded-full bg-ink px-4 text-sm text-white hover:bg-black"><Download size={14} />Download</a><Link href="/help" className="inline-flex h-10 items-center gap-1.5 rounded-full border border-line px-4 text-sm hover:border-ink/30"><BookOpen size={14} />Docs</Link><a href={r.demo_url} target="_blank" rel="noreferrer" className="inline-flex h-10 items-center gap-1.5 rounded-full border border-line px-4 text-sm hover:border-ink/30"><ExternalLink size={14} />Live demo</a></div></div>)
      : <Empty title="Nothing here yet" body="Your purchased templates will be listed here with download links." action={<LinkButton href="/templates" v="brand">Explore Templates</LinkButton>} />}</div></div>;
}
