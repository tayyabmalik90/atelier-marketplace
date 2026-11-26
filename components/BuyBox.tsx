"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ExternalLink, Heart, ShieldCheck, Download, RefreshCw } from "lucide-react";
import { useApp } from "./Providers";
import { Button, LinkButton } from "./ui";
import { money } from "@/lib/utils";
export function BuyBox({ id, slug, price, demo, owned }: { id: number; slug: string; price: number; demo: string; owned?: string }) {
  const { addCart, cart, wishlist, toggleWish } = useApp(); const router = useRouter(); const saved = wishlist.includes(id);
  return <div className="rounded-3xl border border-line bg-white p-6 shadow-[0_20px_40px_-28px_rgba(20,20,60,.3)]">
    <div className="flex items-end justify-between"><div><div className="text-xs text-muted">One-time price</div><div className="font-display text-6xl font-semibold leading-none tabular-nums">{money(price)}</div></div><span className="mb-1 rounded-full bg-green-100 px-2.5 py-1 text-xs text-ok">No subscription</span></div>
    <div className="mt-6 space-y-3">
      {owned ? <LinkButton href="/dashboard/purchases" v="brand" className="w-full" s="lg">You own this · Download</LinkButton>
        : <Button v="brand" s="lg" className="w-full" onClick={() => { addCart(id); router.push("/cart"); }}>Purchase Template</Button>}
      <div className="grid grid-cols-2 gap-3"><a href={demo} target="_blank" rel="noreferrer" className="inline-flex h-11 items-center justify-center gap-2 rounded-full border border-line text-sm font-medium transition hover:border-ink/30"><ExternalLink size={15} />Live Preview</a>
        <Button v="outline" onClick={() => toggleWish(id)} aria-pressed={saved}><Heart size={15} className={saved ? "fill-brand text-brand" : ""} />{saved ? "Saved" : "Wishlist"}</Button></div>
      <Link href={`/preview/${slug}`} className="block text-center text-sm text-muted underline-offset-4 hover:text-ink hover:underline">Test on desktop, tablet & mobile</Link></div>
    <ul className="mt-6 space-y-3 border-t border-line pt-5 text-sm text-muted"><li className="flex gap-3"><Download size={16} className="mt-0.5 shrink-0 text-ink" />Instant download after payment</li><li className="flex gap-3"><ShieldCheck size={16} className="mt-0.5 shrink-0 text-ink" />Secure checkout, licence for one project</li><li className="flex gap-3"><RefreshCw size={16} className="mt-0.5 shrink-0 text-ink" />14-day refund window</li></ul></div>;
}
