import { Container } from "./ui";
export function Page({ title, intro, children }: { title: string; intro?: string; children: React.ReactNode }) {
  return <Container className="max-w-3xl py-14"><h1 className="font-display text-6xl font-semibold tracking-tight">{title}</h1>{intro && <p className="mt-4 text-lg text-muted">{intro}</p>}<div className="mt-10 space-y-5 leading-relaxed text-ink/80 [&_h2]:mt-10 [&_h2]:font-display [&_h2]:text-3xl [&_h2]:font-semibold [&_h2]:text-ink [&_ul]:list-disc [&_ul]:space-y-1.5 [&_ul]:pl-6 [&_a]:text-brand [&_a]:underline">{children}</div></Container>;
}
