import { CardSkeleton } from "@/components/TemplateCard";
import { Container } from "@/components/ui";
export default function Loading() { return <Container className="py-14"><div className="skeleton mb-8 h-14 w-80" /><div className="skeleton mb-8 h-14 w-full rounded-full" /><div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">{Array.from({ length: 6 }, (_, i) => <CardSkeleton key={i} />)}</div></Container>; }
