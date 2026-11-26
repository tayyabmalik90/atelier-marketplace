import { Page } from "@/components/Prose";
import { FAQ } from "@/lib/data";
export const metadata = { title: "FAQs" };
export default function P() { return <Page title="FAQs" intro="Quick answers to common questions.">{FAQ.map(([q, a]) => <details key={q} className="group rounded-2xl border border-line bg-white p-5 open:shadow-sm"><summary className="cursor-pointer list-none font-medium text-ink">{q}</summary><p className="mt-3 text-muted">{a}</p></details>)}</Page>; }
