"use client";
import { useState } from "react";
import { Lock } from "lucide-react";
import { Alert, Button, Field, Input } from "./ui";
import { money } from "@/lib/utils";
import { useApp } from "./Providers";
export function PayForm({ orderId, total }: { orderId: string; total: number }) {
  const { clearCart } = useApp(); const [f, setF] = useState({ number: "", exp: "", cvc: "" }); const [msg, setMsg] = useState(""); const [busy, setBusy] = useState(false);
  const fmt = (v: string) => v.replace(/\D/g, "").slice(0, 16).replace(/(.{4})/g, "$1 ").trim();
  const exp = (v: string) => { const d = v.replace(/\D/g, "").slice(0, 4); return d.length > 2 ? d.slice(0, 2) + " / " + d.slice(2) : d; };
  async function go(e: React.FormEvent) {
    e.preventDefault(); setBusy(true); setMsg("");
    const r = await fetch("/api/checkout/test", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ orderId, ...f }) }); const d = await r.json();
    if (!d.ok) { setBusy(false); return setMsg(d.error); }
    clearCart(); location.href = `/order/${orderId}`;
  }
  return <div className="mx-auto max-w-md px-5 py-14"><div className="rounded-3xl border border-line bg-white p-8 shadow-sm"><h1 className="font-display text-4xl font-semibold">Secure payment</h1><p className="mt-1 text-sm text-muted">Total due <b className="text-ink">{money(total)}</b></p>
    <div className="mt-4"><Alert kind="info">Test mode: use card <b>4242 4242 4242 4242</b>, any future expiry and any CVC. (Card 4000 0000 0000 0002 simulates a decline.) Add a Stripe key to take real payments.</Alert></div>
    <form onSubmit={go} className="mt-5 space-y-4">{msg && <Alert kind="error">{msg}</Alert>}
      <Field label="Card number"><Input inputMode="numeric" autoComplete="cc-number" placeholder="4242 4242 4242 4242" value={f.number} onChange={(e) => setF({ ...f, number: fmt(e.target.value) })} /></Field>
      <div className="grid grid-cols-2 gap-4"><Field label="Expiry"><Input autoComplete="cc-exp" placeholder="MM / YY" value={f.exp} onChange={(e) => setF({ ...f, exp: exp(e.target.value) })} /></Field><Field label="CVC"><Input inputMode="numeric" autoComplete="cc-csc" placeholder="123" maxLength={4} value={f.cvc} onChange={(e) => setF({ ...f, cvc: e.target.value.replace(/\D/g, "") })} /></Field></div>
      <Button v="brand" s="lg" className="w-full" disabled={busy}><Lock size={15} />{busy ? "Processing…" : `Pay ${money(total)}`}</Button></form></div></div>;
}
