"use client";
import { useState } from "react";
import { Alert, Button, Field, Input } from "./ui";
export function SettingsForm({ name, email }: { name: string; email: string }) {
  const [f, setF] = useState({ name, email, currentPassword: "", newPassword: "" }); const [m, setM] = useState<{ k: "error" | "success"; t: string } | null>(null); const [busy, setBusy] = useState(false);
  async function save(e: React.FormEvent) {
    e.preventDefault(); setBusy(true); setM(null);
    const body: any = { name: f.name, email: f.email }; if (f.newPassword) { body.currentPassword = f.currentPassword; body.newPassword = f.newPassword; }
    const d = await (await fetch("/api/account", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) })).json(); setBusy(false);
    setM(d.ok ? { k: "success", t: "Your changes were saved." } : { k: "error", t: d.error }); if (d.ok) setF({ ...f, currentPassword: "", newPassword: "" });
  }
  return <form onSubmit={save} className="max-w-lg space-y-4 rounded-3xl border border-line bg-white p-6 sm:p-8">{m && <Alert kind={m.k}>{m.t}</Alert>}
    <Field label="Full name"><Input value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} /></Field><Field label="Email" hint="Changing your email requires re-verification."><Input type="email" value={f.email} onChange={(e) => setF({ ...f, email: e.target.value })} /></Field>
    <div className="border-t border-line pt-4"><h3 className="mb-3 text-sm font-semibold">Change password</h3><div className="space-y-4"><Field label="Current password"><Input type="password" autoComplete="current-password" value={f.currentPassword} onChange={(e) => setF({ ...f, currentPassword: e.target.value })} /></Field><Field label="New password"><Input type="password" autoComplete="new-password" value={f.newPassword} onChange={(e) => setF({ ...f, newPassword: e.target.value })} /></Field></div></div>
    <Button disabled={busy}>{busy ? "Saving…" : "Save changes"}</Button></form>;
}
