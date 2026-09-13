"use client";

import { useActionState, type ReactElement } from "react";
import { signIn } from "@/actions/auth";

export function OAuthForm(): ReactElement {
  const [state, action, pending] = useActionState(signIn, { success: false });
  return (
    <form action={action} className="flex flex-col gap-3" aria-busy={pending}>
      {state.error && <p role="alert" className="mb-2 text-sm leading-6 text-text-primary">{state.error}</p>}
      <button type="submit" name="provider" value="google" disabled={pending} className="auth-provider">Continue with Google</button>
      <button type="submit" name="provider" value="github" disabled={pending} className="auth-provider">Continue with GitHub</button>
      {pending && <p role="status" className="text-center text-xs text-text-secondary">Connecting to your sign-in provider…</p>}
    </form>
  );
}
