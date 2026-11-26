import { Suspense } from "react";
import { AuthForm } from "@/components/AuthForms";
export const metadata = { title: "Reset password" };
export default function Page() { return <Suspense><AuthForm mode="reset" /></Suspense>; }
