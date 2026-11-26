"use client";
import { cva, type VariantProps } from "class-variance-authority";
import Link from "next/link";
import { cn } from "@/lib/utils";
import React from "react";
const btn = cva("inline-flex items-center justify-center gap-2 rounded-full text-sm font-medium transition-all duration-200 disabled:opacity-50 disabled:pointer-events-none active:scale-[.98] cursor-pointer whitespace-nowrap", {
  variants: { v: { primary: "bg-ink text-white hover:bg-black hover:-translate-y-0.5 hover:shadow-lg", brand: "bg-brand text-white hover:bg-indigo-600 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-indigo-500/25", outline: "border border-line bg-card hover:border-ink/30 hover:bg-white", ghost: "hover:bg-black/5", danger: "bg-bad/10 text-bad hover:bg-bad/15" }, s: { sm: "h-9 px-4", md: "h-11 px-6", lg: "h-13 px-8 text-base" } },
  defaultVariants: { v: "primary", s: "md" } });
type BP = VariantProps<typeof btn>;
export function Button({ v, s, className, ...p }: React.ButtonHTMLAttributes<HTMLButtonElement> & BP) { return <button className={cn(btn({ v, s }), className)} {...p} />; }
export function LinkButton({ v, s, className, ...p }: React.ComponentProps<typeof Link> & BP) { return <Link className={cn(btn({ v, s }), className)} {...p} />; }
export const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(function Input({ className, ...p }, ref) { return <input ref={ref} className={cn("h-11 w-full rounded-xl border border-line bg-white px-4 text-sm outline-none transition focus:border-brand focus:ring-4 focus:ring-brand/10 placeholder:text-muted/70", className)} {...p} />; });
export function Textarea({ className, ...p }: React.TextareaHTMLAttributes<HTMLTextAreaElement>) { return <textarea className={cn("min-h-28 w-full rounded-xl border border-line bg-white p-4 text-sm outline-none transition focus:border-brand focus:ring-4 focus:ring-brand/10", className)} {...p} />; }
export function Select({ className, ...p }: React.SelectHTMLAttributes<HTMLSelectElement>) { return <select className={cn("h-11 w-full rounded-xl border border-line bg-white px-3 text-sm outline-none focus:border-brand focus:ring-4 focus:ring-brand/10", className)} {...p} />; }
export function Field({ label, error, children, hint }: { label: string; error?: string; hint?: string; children: React.ReactNode }) {
  return <label className="block"><span className="mb-1.5 block text-sm font-medium">{label}</span>{children}{hint && !error && <span className="mt-1 block text-xs text-muted">{hint}</span>}{error && <span role="alert" className="mt-1 block text-xs text-bad">{error}</span>}</label>;
}
export function Badge({ children, tone = "plain" }: { children: React.ReactNode; tone?: "plain" | "brand" | "ok" | "bad" | "dark" }) {
  return <span className={cn("inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium", { plain: "bg-black/5 text-ink/70", brand: "bg-brand-soft text-brand", ok: "bg-green-100 text-ok", bad: "bg-red-100 text-bad", dark: "bg-ink text-white" }[tone])}>{children}</span>;
}
export function Alert({ kind, children }: { kind: "error" | "success" | "info"; children: React.ReactNode }) {
  return <div role={kind === "error" ? "alert" : "status"} className={cn("rounded-xl border px-4 py-3 text-sm", { error: "border-red-200 bg-red-50 text-bad", success: "border-green-200 bg-green-50 text-ok", info: "border-indigo-200 bg-brand-soft text-brand" }[kind])}>{children}</div>;
}
export function Empty({ title, body, action }: { title: string; body: string; action?: React.ReactNode }) {
  return <div className="flex flex-col items-center rounded-3xl border border-dashed border-line bg-white/60 px-6 py-16 text-center"><div className="mb-4 h-12 w-12 rounded-2xl bg-brand-soft" /><h3 className="font-display text-3xl">{title}</h3><p className="mt-2 max-w-sm text-sm text-muted">{body}</p>{action && <div className="mt-6">{action}</div>}</div>;
}
export const Container = ({ className, ...p }: React.HTMLAttributes<HTMLDivElement>) => <div className={cn("mx-auto w-full max-w-7xl px-5 sm:px-8", className)} {...p} />;
