"use client";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { Lock } from "lucide-react";
import { useApp } from "@/components/Providers";
import { Alert, Button, Container, Field, Input, Select } from "@/components/ui";
import { money } from "@/lib/utils";
const COUNTRIES = ["United States", "United Kingdom", "Canada", "Australia", "Germany", "France", "Pakistan", "India", "United Arab Emirates", "Other"];
function Checkout() {
  const { me, cart, loaded } = useApp(); const router = useRouter(); const sp = useSearchParams(); const coupon = sp.get("coupon") || "";
  const [p, setP] = useState<any>(null); const [f, setF] = useState({ name: "", email: "", country: "United States" }); const [e, setE] = useState<Record<string, string>>({}); const [msg, setMsg] = useState(""); const [busy, setBusy] = useState(false);
  useEffect(() => { if (!loaded) return; if (!me) return void router.replace("/login?next=" + encodeURIComponent("/checkout" + (coupon ? "?coupon=" + coupon : ""))); setF((x) => ({ ...x, name: me.name, email: me.email })); }, [loaded, me]);
  useEffect(() => { if (!loaded) return; fetch("/api/cart", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ids: cart, coupon }) }).then((r) => r.json()).then(setP); }, [loaded, cart]);
  async function pay(ev: React.FormEvent) {
    ev.preventDefault(); const er: Record<string, string> = {};
    if (f.name.trim().length < 2) er.name = "Enter your full name"; if (!/^\S+@\S+\.\S+$/.test(f.email)) er.email = "Enter a valid email"; setE(er); if (Object.keys(er).length) return;
    setBusy(true); setMsg("");
    const r = await fetch("/api/checkout", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ids: cart, coupon, ...f }) }); const d = await r.json();
    if (!d.ok) { setBusy(false); return setMsg(d.error); }
    location.href = d.url;
  }
  if (!loaded || !me || !p) return <Container className="py-14"><div className="skeleton h-12 w-64" /><div className="skeleton mt-8 h-72" /></Container>;
  if (!p.items.length) return <Container className="py-20 text-center"><p className="text-muted">Your cart is empty.</p></Container>;
  return <Container className="py-10 sm:py-14"><h1 className="font-display text-5xl font-semibold">Checkout</h1>
    <form onSubmit={pay} noValidate className="mt-8 grid gap-8 lg:grid-cols-[1fr_380px]">
      <div className="space-y-5 rounded-3xl border border-line bg-white p-6 sm:p-8"><h2 className="font-semibold">Customer information</h2>{msg && <Alert kind="error">{msg}</Alert>}
        <Field label="Full name" error={e.name}><Input value={f.name} onChange={(x) => setF({ ...f, name: x.target.value })} autoComplete="name" /></Field>
        <Field label="Email for receipt & delivery" error={e.email}><Input type="email" value={f.email} onChange={(x) => setF({ ...f, email: x.target.value })} autoComplete="email" /></Field>
        <Field label="Billing country"><Select value={f.country} onChange={(x) => setF({ ...f, country: x.target.value })}>{COUNTRIES.map((c) => <option key={c}>{c}</option>)}</Select></Field>
        <p className="text-xs text-muted">Card details are entered on the next secure step.</p></div>
      <aside className="h-fit rounded-3xl border border-line bg-white p-6"><h2 className="font-semibold">Order summary</h2>
        <ul className="mt-4 space-y-2 text-sm">{p.items.map((i: any) => <li key={i.id} className="flex justify-between"><span>{i.name}</span><span className="tabular-nums">{money(i.price_cents)}</span></li>)}</ul>
        {p.discount > 0 && <div className="mt-3 flex justify-between text-sm text-ok"><span>Discount ({p.coupon})</span><span>−{money(p.discount)}</span></div>}
        <div className="mt-3 flex justify-between border-t border-line pt-3 text-lg font-semibold"><span>Total</span><span className="tabular-nums">{money(p.total)}</span></div>
        <Button v="brand" s="lg" className="mt-5 w-full" disabled={busy}><Lock size={15} />{busy ? "Preparing payment…" : `Pay ${money(p.total)}`}</Button></aside></form></Container>;
}
export default function Page() { return <Suspense><Checkout /></Suspense>; }
