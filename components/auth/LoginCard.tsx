import Link from "next/link";
import type { ReactElement, ReactNode } from "react";
import { BrandLogo } from "@/components/layout/BrandLogo";

type Props = { children: ReactNode; error?: string };

export function LoginCard({ children, error }: Props): ReactElement {
  return (
    <main id="main-content" className="flex min-h-screen flex-col items-center justify-center gap-8 bg-background px-4 py-12 sm:px-8">
      <Link href="/" aria-label="Apply Copilot home" className="rounded-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent">
        <BrandLogo className="w-[210px]" />
      </Link>
      <section aria-labelledby="login-heading" className="w-full max-w-md rounded-xl border border-border bg-surface p-6 shadow-sm sm:p-8">
        <p className="mb-3 text-xs font-medium uppercase tracking-widest text-accent">Your next chapter starts here</p>
        <h1 id="login-heading" className="text-3xl font-semibold tracking-tight text-text-primary">Welcome to Apply Copilot</h1>
        <p className="mb-8 mt-4 text-sm leading-6 text-text-secondary">Find the right jobs. Get to know the companies. Take your next step with confidence.</p>
        {error && <p role="alert" className="mb-5 rounded-md border border-error/30 bg-surface p-3 text-sm leading-6 text-text-primary">{error}</p>}
        {children}
        <p className="mt-6 text-center text-xs leading-5 text-text-secondary">Use your Google or GitHub account to sign in or get started.</p>
      </section>
      <Link href="/" className="text-sm text-text-secondary hover:text-accent focus-visible:outline-accent">Back to home</Link>
    </main>
  );
}
