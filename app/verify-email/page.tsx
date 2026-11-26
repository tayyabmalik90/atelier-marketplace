import Link from "next/link";
import { Alert, LinkButton } from "@/components/ui";
export const metadata = { title: "Verify email" };
export default async function Page({ searchParams }: { searchParams: Promise<{ status?: string }> }) {
  const ok = (await searchParams).status === "success";
  return <div className="mx-auto max-w-md px-5 py-24 text-center"><h1 className="font-display text-5xl font-semibold">{ok ? "Email verified" : "Link expired"}</h1><div className="my-6">{ok ? <Alert kind="success">Your email address is confirmed. Thanks!</Alert> : <Alert kind="error">This verification link is invalid or has expired. Request a new one from your dashboard.</Alert>}</div><LinkButton href="/dashboard">Go to dashboard</LinkButton></div>;
}
