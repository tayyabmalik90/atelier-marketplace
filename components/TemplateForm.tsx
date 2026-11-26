"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Alert, Button, Field, Input, Select, Textarea } from "./ui";
import { CATEGORIES, FEATURES, STYLES, TECHS, TYPES } from "@/lib/utils";
export type FormT = { id?: number; name: string; slug: string; description: string; category: string; type: string; style: string; tech: string[]; features: string[]; tags: string[]; price: number; previewUrl: string; screenshots: string[]; demoUrl: string; filePath: string | null; badge: string; status: string };
export const EMPTY: FormT = { name: "", slug: "", description: "", category: CATEGORIES[0].name, type: TYPES[0], style: "Modern", tech: ["HTML"], features: ["Responsive"], tags: [], price: 59, previewUrl: "", screenshots: [], demoUrl: "", filePath: null, badge: "", status: "published" };
async function upload(file: File, kind: "image" | "file") { const fd = new FormData(); fd.append("file", file); fd.append("kind", kind); return (await fetch("/api/admin/upload", { method: "POST", body: fd })).json(); }
export function TemplateForm({ initial }: { initial: FormT }) {
  const r = useRouter(); const [f, setF] = useState(initial); const [msg, setMsg] = useState(""); const [busy, setBusy] = useState(false); const [tags, setTags] = useState(initial.tags.join(", "));
  const set = (k: keyof FormT, v: any) => setF((x) => ({ ...x, [k]: v }));
  const tog = (k: "tech" | "features", v: string) => set(k, f[k].includes(v) ? f[k].filter((x) => x !== v) : [...f[k], v]);
  async function img(e: React.ChangeEvent<HTMLInputElement>, to: "preview" | "shots") {
    const files = [...(e.target.files || [])]; for (const file of files) { const d = await upload(file, "image"); if (!d.ok) return setMsg(d.error); to === "preview" ? set("previewUrl", d.url) : setF((x) => ({ ...x, screenshots: [...x.screenshots, d.url] })); }
  }
  async function file(e: React.ChangeEvent<HTMLInputElement>) { const x = e.target.files?.[0]; if (!x) return; const d = await upload(x, "file"); d.ok ? set("filePath", d.path) : setMsg(d.error); }
  async function save(e: React.FormEvent) {
    e.preventDefault(); setBusy(true); setMsg("");
    const body = { ...f, slug: f.slug || undefined, tags: tags.split(",").map((s) => s.trim()).filter(Boolean), price: Number(f.price) };
    const res = await fetch(f.id ? `/api/admin/templates/${f.id}` : "/api/admin/templates", { method: f.id ? "PUT" : "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) }); const d = await res.json(); setBusy(false);
    if (!d.ok) return setMsg(d.error); r.push("/admin/templates"); r.refresh();
  }
  const Chk = ({ k, opts }: { k: "tech" | "features"; opts: string[] }) => <div className="flex flex-wrap gap-2">{opts.map((o) => <button type="button" key={o} aria-pressed={f[k].includes(o)} onClick={() => tog(k, o)} className={"rounded-full border px-3.5 py-1.5 text-sm transition " + (f[k].includes(o) ? "border-ink bg-ink text-white" : "border-line bg-white hover:border-ink/30")}>{o}</button>)}</div>;
  return <form onSubmit={save} className="max-w-3xl space-y-5">{msg && <Alert kind="error">{msg}</Alert>}
    <div className="grid gap-5 rounded-3xl border border-line bg-white p-6 sm:grid-cols-2">
      <Field label="Name"><Input required value={f.name} onChange={(e) => set("name", e.target.value)} /></Field>
      <Field label="Slug" hint="Auto-generated if empty"><Input value={f.slug} onChange={(e) => set("slug", e.target.value)} placeholder="my-template" /></Field>
      <div className="sm:col-span-2"><Field label="Description"><Textarea required value={f.description} onChange={(e) => set("description", e.target.value)} /></Field></div>
      <Field label="Category"><Select value={f.category} onChange={(e) => set("category", e.target.value)}>{CATEGORIES.map((c) => <option key={c.slug}>{c.name}</option>)}</Select></Field>
      <Field label="Website type"><Select value={f.type} onChange={(e) => set("type", e.target.value)}>{TYPES.map((c) => <option key={c}>{c}</option>)}</Select></Field>
      <Field label="Design style"><Select value={f.style} onChange={(e) => set("style", e.target.value)}>{STYLES.map((c) => <option key={c}>{c}</option>)}</Select></Field>
      <Field label="Fixed price (USD)"><Input type="number" min={0} step="1" required value={f.price} onChange={(e) => set("price", e.target.value as any)} /></Field>
      <div className="sm:col-span-2"><div className="mb-2 text-sm font-medium">Technology</div><Chk k="tech" opts={TECHS} /></div>
      <div className="sm:col-span-2"><div className="mb-2 text-sm font-medium">Features</div><Chk k="features" opts={FEATURES} /></div>
      <div className="sm:col-span-2"><Field label="Tags" hint="Comma separated"><Input value={tags} onChange={(e) => setTags(e.target.value)} placeholder="saas, startup, dark" /></Field></div>
      <Field label="Label"><Select value={f.badge} onChange={(e) => set("badge", e.target.value)}><option value="">None</option><option value="featured">Featured</option><option value="popular">Popular</option><option value="new">New</option></Select></Field>
      <Field label="Status"><Select value={f.status} onChange={(e) => set("status", e.target.value)}><option value="published">Published</option><option value="draft">Draft</option><option value="archived">Archived</option></Select></Field></div>
    <div className="grid gap-5 rounded-3xl border border-line bg-white p-6">
      <Field label="Live demo URL" hint="Opens in a new tab and is embedded in the device preview. Use a full https:// URL or a /path on this site."><Input value={f.demoUrl} onChange={(e) => set("demoUrl", e.target.value)} placeholder="https://demo.example.com" /></Field>
      <Field label="Preview image" hint={f.previewUrl || "PNG, JPG or WEBP, max 8 MB"}><Input type="file" accept="image/png,image/jpeg,image/webp" onChange={(e) => img(e, "preview")} /></Field>
      <Field label="Extra screenshots" hint={`${f.screenshots.length} uploaded`}><Input type="file" multiple accept="image/png,image/jpeg,image/webp" onChange={(e) => img(e, "shots")} /></Field>
      {f.screenshots.length > 0 && <Button type="button" s="sm" v="outline" onClick={() => set("screenshots", [])}>Clear screenshots</Button>}
      <Field label="Downloadable template file (.zip)" hint={f.filePath ? `Uploaded: ${f.filePath}` : "If empty, a starter bundle is generated from the demo."}><Input type="file" accept=".zip" onChange={file} /></Field></div>
    <div className="flex gap-3"><Button v="brand" s="lg" disabled={busy}>{busy ? "Saving…" : f.id ? "Save changes" : "Create template"}</Button><Button type="button" v="outline" s="lg" onClick={() => r.push("/admin/templates")}>Cancel</Button></div></form>;
}
