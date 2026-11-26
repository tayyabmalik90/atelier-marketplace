"use client";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { useApp } from "@/components/Providers";
import { Button, Container, Empty, Field, Input, LinkButton, Alert } from "@/components/ui";
import { money } from "@/lib/utils";
export default function Cart() {
  const { cart, removeCart, me, loaded } = useApp(); const router = useRouter();
  const [p, setP] = useState<any>(null); const [code, setCode] = useState(""); const [applied, setApplied] = useState(""); const [msg, setMsg] = useState("");
  useEffect(() => { if (!loaded) return; fetch("/api/cart", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ids: cart, coupon: applied }) }).then((r) => r.json()).then(setP); }, [cart, applied, loaded]);
  function apply() { if (!code.trim()) return; fetch("/api/cart", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ids: cart, coupon: code }) }).then((r) => r.json()).then((d) => { if (d.coupon) { setApplied(d.coupon); setMsg(`${d.coupon} applied: ${d.percent}% off`); } else setMsg("That code isn't valid"); }); }
  if (!loaded || !p) return <Container className="py-14"><div className="skeleton h-12 w-64" /><div className="skeleton mt-8 h-40 w-full" /></Container>;
  if (!p.items.length) return <Container className="py-20"><Empty title="Your cart is empty" body="Find a template you love and it will show up here." action={<LinkButton href="/templates" v="brand">Explore Templates</LinkButton>} /></Container>;
  return <Container className="py-10 sm:py-14"><h1 className="font-display text-5xl font-semibold">Your cart</h1>
    <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_380px]">
      <ul className="space-y-4">{p.items.map((i: any) => <li key={i.id} className="flex items-center gap-4 rounded-3xl border border-line bg-white p-4"><Link href={`/templates/${i.slug}`} className="relative h-20 w-32 shrink-0 overflow-hidden rounded-xl"><Image src={i.preview_url} alt={i.name} fill sizes="128px" className="object-cover" unoptimized /></Link><div className="flex-1"><Link href={`/templates/${i.slug}`} className="font-semibold hover:underline">{i.name}</Link><p className="text-xs text-muted">One-time licence</p></div><div className="font-semibold tabular-nums">{money(i.price_cents)}</div><button onClick={() => removeCart(i.id)} aria-label={`Remove ${i.name}`} className="rounded-full p-2 text-muted transition hover:bg-red-50 hover:text-bad"><Trash2 size={17} /></button></li>)}</ul>
      <aside className="h-fit rounded-3xl border border-line bg-white p-6"><h2 className="font-semibold">Order summary</h2>
        <dl className="mt-4 space-y-2 text-sm"><div className="flex justify-between"><dt className="text-muted">Subtotal</dt><dd className="tabular-nums">{money(p.subtotal)}</dd></div>{p.discount > 0 && <div className="flex justify-between text-ok"><dt>Discount ({p.coupon})</dt><dd className="tabular-nums">−{money(p.discount)}</dd></div>}<div className="flex justify-between border-t border-line pt-3 text-base font-semibold"><dt>Total</dt><dd className="tabular-nums">{money(p.total)}</dd></div></dl>
        <div className="mt-5 flex gap-2"><Input placeholder="Coupon code" value={code} onChange={(e) => setCode(e.target.value)} aria-label="Coupon code" /><Button v="outline" onClick={apply}>Apply</Button></div>{msg && <p className="mt-2 text-xs text-muted">{msg}</p>}
        <Button v="brand" s="lg" className="mt-5 w-full" onClick={() => router.push(me ? "/checkout" + (applied ? "?coupon=" + applied : "") : "/login?next=" + encodeURIComponent("/checkout" + (applied ? "?coupon=" + applied : "")))}>{me ? "Checkout" : "Log in to checkout"}</Button>
        <p className="mt-3 text-center text-xs text-muted">Secure payment · 14-day refund window</p></aside></div></Container>;
}
