import type { ReactElement } from "react";
import { requireUser } from "@/lib/auth";

export default async function DashboardPage(): Promise<ReactElement> {
  const user = await requireUser();
  return (
    <section className="rounded-xl border border-border bg-surface p-6 shadow-sm">
      <p className="mb-3 text-xs font-medium uppercase tracking-widest text-accent">Your workspace</p>
      <h1 className="text-3xl font-semibold tracking-tight text-text-primary">You’re signed in.</h1>
      <p className="mt-4 break-words text-sm text-text-secondary">Welcome, {user.profile?.name || user.email}.</p>
      <p className="mt-3 text-sm leading-6 text-text-secondary">Your dashboard will bring your job matches and company research together here.</p>
    </section>
  );
}
