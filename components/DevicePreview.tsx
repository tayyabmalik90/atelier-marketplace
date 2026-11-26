"use client";
import Link from "next/link";
import { useState } from "react";
import { ArrowLeft, ExternalLink, Monitor, Smartphone, Tablet } from "lucide-react";
import { Button, LinkButton } from "./ui";
import { useApp } from "./Providers";
import { money } from "@/lib/utils";
const D = [["desktop", Monitor, "100%"], ["tablet", Tablet, "768px"], ["mobile", Smartphone, "390px"]] as const;
export function DevicePreview({ id, slug, name, price, demo }: { id: number; slug: string; name: string; price: number; demo: string }) {
  const [d, setD] = useState<"desktop" | "tablet" | "mobile">("desktop"); const { addCart } = useApp();
  const w = D.find((x) => x[0] === d)![2];
  return <div className="fixed inset-0 z-[60] flex flex-col bg-[#ecebe5]">
    <header className="flex h-14 shrink-0 items-center justify-between gap-3 border-b border-line bg-white px-3 sm:px-5">
      <Link href={`/templates/${slug}`} className="flex items-center gap-2 text-sm text-muted hover:text-ink"><ArrowLeft size={16} /><span className="hidden sm:inline">Back to details</span></Link>
      <div className="flex items-center gap-1 rounded-full bg-black/5 p-1" role="tablist" aria-label="Device">{D.map(([k, I]) => <button key={k} role="tab" aria-selected={d === k} aria-label={k} onClick={() => setD(k)} className={"grid h-8 w-10 place-items-center rounded-full transition " + (d === k ? "bg-white shadow-sm" : "text-muted hover:text-ink")}><I size={16} /></button>)}</div>
      <div className="flex items-center gap-2"><Link href="/templates" className="hidden text-sm text-muted hover:text-ink md:block">Marketplace</Link><a href={demo} target="_blank" rel="noreferrer" aria-label="Open in new tab" className="hidden rounded-full p-2 hover:bg-black/5 sm:block"><ExternalLink size={16} /></a>
        <LinkButton href="/cart" s="sm" v="brand" onClick={() => addCart(id)}>Buy {money(price)}</LinkButton></div></header>
    <div className="flex flex-1 justify-center overflow-auto p-0 sm:p-6"><div style={{ width: w, maxWidth: "100%" }} className={"h-full overflow-hidden bg-white shadow-2xl transition-all duration-500 " + (d === "desktop" ? "sm:rounded-xl" : "rounded-[1.75rem] border-[10px] border-ink")}><iframe title={`${name} live demo`} src={demo} className="h-full w-full border-0" /></div></div>
  </div>;
}
