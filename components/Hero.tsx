"use client";
import Image from "next/image";
import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { LinkButton, Container } from "./ui";
const words = "Beautiful websites, ready the day you buy them.".split(" ");
export function Hero({ shots }: { shots: string[] }) {
  const ref = useRef(null); const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y1 = useTransform(scrollYProgress, [0, 1], [0, -90]); const y2 = useTransform(scrollYProgress, [0, 1], [0, 60]); const y3 = useTransform(scrollYProgress, [0, 1], [0, -40]);
  return (
    <section ref={ref} className="relative overflow-hidden pb-20 pt-12 sm:pt-20">
      <motion.div style={{ y: y2 }} aria-hidden className="pointer-events-none absolute -left-32 top-0 h-96 w-96 rounded-full bg-indigo-300/30 blur-3xl" />
      <motion.div style={{ y: y1 }} aria-hidden className="pointer-events-none absolute -right-24 top-40 h-96 w-96 rounded-full bg-amber-200/40 blur-3xl" />
      <Container className="relative">
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} className="mx-auto mb-6 w-fit rounded-full border border-line bg-white px-4 py-1.5 text-xs font-medium text-muted">One price. One licence. Zero subscriptions.</motion.p>
        <h1 className="mx-auto max-w-4xl text-center font-display text-[clamp(2.75rem,7vw,5.5rem)] font-semibold leading-[0.98] tracking-tight">
          {words.map((w, i) => <span key={i} className="mr-[0.22em] inline-block overflow-hidden align-bottom"><motion.span className="inline-block" initial={{ y: "110%" }} animate={{ y: 0 }} transition={{ duration: 0.7, delay: 0.15 + i * 0.07, ease: [0.22, 1, 0.36, 1] }}>{w}</motion.span></span>)}
        </h1>
        <motion.p initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }} className="mx-auto mt-6 max-w-xl text-center text-lg text-muted">Browse professionally designed website templates, test the live demo on any device, and download the files instantly.</motion.p>
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.95 }} className="mt-9 flex flex-wrap justify-center gap-3">
          <LinkButton href="/templates" v="brand" s="lg">Explore Templates</LinkButton><LinkButton href="/#categories" v="outline" s="lg">Browse Categories</LinkButton>
        </motion.div>
        <div className="relative mx-auto mt-16 grid max-w-5xl grid-cols-3 items-center gap-4 sm:gap-6">
          {[0, 1, 2].map((i) => (
            <motion.div key={i} style={{ y: [y3, y1, y2][i] }} initial={{ opacity: 0, y: 60 }} animate={{ opacity: 1 }} transition={{ delay: 1 + i * 0.12, duration: 0.8 }} className={i === 1 ? "float -mt-8" : ""}>
              <div className="overflow-hidden rounded-2xl border border-line bg-white shadow-[0_30px_60px_-30px_rgba(20,20,60,.35)]"><div className="relative aspect-[8/5.2]"><Image src={shots[i]} alt="Template preview" fill sizes="33vw" priority className="object-cover" unoptimized /></div></div>
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  );
}
