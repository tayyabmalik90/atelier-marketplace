"use client";
import Link from "next/link";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Alert, Button, Field, Input } from "./ui";
type Mode = "login" | "signup" | "forgot" | "reset";
const META = { login: ["Welcome back", "Log in to access your purchases and wishlist."], signup: ["Create your account", "Free to join. Needed only to purchase and download."], forgot: ["Forgot password", "Enter your email and we'll send a reset link."], reset: ["Choose a new password", "Pick something at least 8 characters long."] } as const;
export function AuthForm({ mode }: { mode: Mode }) {
  const router = useRouter(); const sp = useSearchParams(); const next = sp.get("next") || "/dashboard"; const token = sp.get("token") || "";
  const [f, setF] = useState({ name: "", email: "", password: "" }); const [errs, setErrs] = useState<Record<string, string>>({}); const [msg, setMsg] = useState(""); const [busy, setBusy] = useState(false); const [done, setDone] = useState(false);
  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement>) => { setF({ ...f, [k]: e.target.value }); setErrs({ ...errs, [k]: "" }); };
  async function submit(e: React.FormEvent) {
    e.preventDefault(); setMsg(""); const er: Record<string, string> = {};
    if (mode === "signup" && f.name.trim().length < 2) er.name = "Enter your name";
    if (mode !== "reset" && !/^\S+@\S+\.\S+$/.test(f.email)) er.email = "Enter a valid email";
    if (mode !== "forgot" && (mode === "login" ? !f.password : f.password.length < 8)) er.password = mode === "login" ? "Enter your password" : "Password must be at least 8 characters";
    setErrs(er); if (Object.keys(er).length) return;
    setBusy(true);
    const body = mode === "reset" ? { token, password: f.password } : mode === "forgot" ? { email: f.email } : mode === "signup" ? f : { email: f.email, password: f.password };
    const r = await fetch("/api/auth/" + mode, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) }); const d = await r.json(); setBusy(false);
    if (!d.ok) return setMsg(d.error);
    if (mode === "forgot" || mode === "reset") return setDone(true);
    location.href = d.role === "admin" && mode === "login" && next === "/dashboard" ? "/admin" : next.startsWith("/") ? next : "/dashboard";
  }
  const [t, s] = META[mode];
  if (done) return <Shell t={mode === "forgot" ? "Check your inbox" : "Password updated"} s={mode === "forgot" ? "If an account exists for that email, a reset link is on its way. It expires in one hour." : "You can now log in with your new password."}>{mode === "reset" ? <Button className="w-full" onClick={() => router.push("/login")}>Go to login</Button> : <Link href="/login" className="text-sm text-brand hover:underline">Back to login</Link>}</Shell>;
  if (mode === "reset" && !token) return <Shell t="Invalid link" s="This password reset link is missing its token."><Link href="/forgot-password" className="text-sm text-brand hover:underline">Request a new link</Link></Shell>;
  return <Shell t={t} s={s}><form onSubmit={submit} noValidate className="space-y-4">
    {msg && <Alert kind="error">{msg}</Alert>}
    {mode === "signup" && <Field label="Full name" error={errs.name}><Input autoComplete="name" value={f.name} onChange={set("name")} aria-invalid={!!errs.name} /></Field>}
    {mode !== "reset" && <Field label="Email" error={errs.email}><Input type="email" autoComplete="email" value={f.email} onChange={set("email")} aria-invalid={!!errs.email} /></Field>}
    {mode !== "forgot" && <Field label={mode === "reset" ? "New password" : "Password"} error={errs.password}><Input type="password" autoComplete={mode === "login" ? "current-password" : "new-password"} value={f.password} onChange={set("password")} aria-invalid={!!errs.password} /></Field>}
    {mode === "login" && <div className="text-right"><Link href="/forgot-password" className="text-sm text-brand hover:underline">Forgot password?</Link></div>}
    <Button v="brand" s="lg" className="w-full" disabled={busy}>{busy ? "Please wait…" : { login: "Log in", signup: "Create account", forgot: "Send reset link", reset: "Update password" }[mode]}</Button>
    {mode === "login" && <p className="text-center text-sm text-muted">New here? <Link href={"/signup" + (sp.get("next") ? "?next=" + encodeURIComponent(next) : "")} className="text-brand hover:underline">Create an account</Link></p>}
    {mode === "signup" && <p className="text-center text-sm text-muted">Already have an account? <Link href={"/login" + (sp.get("next") ? "?next=" + encodeURIComponent(next) : "")} className="text-brand hover:underline">Log in</Link></p>}
  </form></Shell>;
}
function Shell({ t, s, children }: { t: string; s: string; children: React.ReactNode }) {
  return <div className="mx-auto flex min-h-[70vh] max-w-md items-center px-5 py-14"><div className="w-full rounded-3xl border border-line bg-white p-8 shadow-sm"><h1 className="font-display text-4xl font-semibold">{t}</h1><p className="mb-6 mt-2 text-sm text-muted">{s}</p>{children}</div></div>;
}
