"use client";
import { useState } from "react";
import { Alert, Button, Field, Input, Textarea } from "./ui";
export function ContactForm() {
  const [f, setF] = useState({ name: "", email: "", message: "" }); const [m, setM] = useState<{ k: "error" | "success"; t: string } | null>(null); const [busy, setBusy] = useState(false);
  async function go(e: React.FormEvent) { e.preventDefault(); setBusy(true); const d = await (await fetch("/api/contact", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(f) })).json(); setBusy(false); if (d.ok) { setM({ k: "success", t: "Thanks! We'll reply within one business day." }); setF({ name: "", email: "", message: "" }); } else setM({ k: "error", t: d.error }); }
  return <form onSubmit={go} className="space-y-4 rounded-3xl border border-line bg-white p-6">{m && <Alert kind={m.k}>{m.t}</Alert>}<Field label="Name"><Input value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} /></Field><Field label="Email"><Input type="email" value={f.email} onChange={(e) => setF({ ...f, email: e.target.value })} /></Field><Field label="Message"><Textarea value={f.message} onChange={(e) => setF({ ...f, message: e.target.value })} /></Field><Button disabled={busy}>{busy ? "Sending…" : "Send message"}</Button></form>;
}
