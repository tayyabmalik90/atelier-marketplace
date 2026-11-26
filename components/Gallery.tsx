"use client";
import Image from "next/image";
import { useState } from "react";
export function Gallery({ shots, name }: { shots: string[]; name: string }) {
  const [i, setI] = useState(0);
  return <div><div className="relative aspect-[8/5.2] overflow-hidden rounded-3xl border border-line bg-white shadow-sm"><Image key={shots[i]} src={shots[i]} alt={`${name} screenshot ${i + 1}`} fill priority sizes="(max-width:1024px) 100vw, 60vw" className="animate-[fade_.4s_ease] object-cover" unoptimized /></div>
    <div className="mt-4 grid grid-cols-3 gap-3">{shots.map((s, k) => <button key={s} onClick={() => setI(k)} aria-label={`Show screenshot ${k + 1}`} aria-current={k === i} className={"relative aspect-[8/5.2] overflow-hidden rounded-2xl border-2 transition " + (k === i ? "border-brand" : "border-transparent opacity-70 hover:opacity-100")}><Image src={s} alt="" fill sizes="20vw" className="object-cover" unoptimized /></button>)}</div>
    <style>{`@keyframes fade{from{opacity:0;transform:scale(1.01)}to{opacity:1;transform:none}}`}</style></div>;
}
