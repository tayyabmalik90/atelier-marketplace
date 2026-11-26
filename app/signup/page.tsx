import { Suspense } from "react";
import { AuthForm } from "@/components/AuthForms";
export const metadata = { title: "Sign up" };
export default function Page() { return <Suspense><AuthForm mode="signup" /></Suspense>; }
