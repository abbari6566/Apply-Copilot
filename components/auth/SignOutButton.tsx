"use client";

import { useActionState, type ReactElement } from "react";
import { signOut } from "@/actions/auth";

export function SignOutButton(): ReactElement {
  const [state, action, pending] = useActionState(signOut, { success: false });
  return (
    <form action={action} className="justify-self-end">
      <button disabled={pending} className="auth-provider">{pending ? "Signing out…" : "Sign out"}</button>
      {state.error && <p role="alert" className="text-sm text-text-primary">{state.error}</p>}
    </form>
  );
}
