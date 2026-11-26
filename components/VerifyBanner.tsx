"use client";
import { useState } from "react";
import { Alert, Button } from "./ui";
export function VerifyBanner() {
  const [s, setS] = useState(false);
  return <Alert kind="info"><div className="flex flex-wrap items-center justify-between gap-3"><span>Please verify your email address to secure your account.</span>{s ? <b>Sent. Check your inbox.</b> : <Button s="sm" v="outline" onClick={async () => { await fetch("/api/auth/resend", { method: "POST" }); setS(true); }}>Resend verification email</Button>}</div></Alert>;
}
