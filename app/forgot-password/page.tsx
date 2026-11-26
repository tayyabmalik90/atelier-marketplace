import { Suspense } from "react";
import { AuthForm } from "@/components/AuthForms";
export const metadata = { title: "Forgot password" };
export default function Page() { return <Suspense><AuthForm mode="forgot" /></Suspense>; }
