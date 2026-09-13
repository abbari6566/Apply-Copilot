import Link from "next/link";
import type { ReactElement } from "react";
import { BrandLogo } from "@/components/layout/BrandLogo";
import { SignOutButton } from "@/components/auth/SignOutButton";

type Props = { authenticated?: boolean; accountControls?: boolean };

export function Navbar({ authenticated = false, accountControls = false }: Props): ReactElement {
  return (
    <header className="border-b border-border/60 bg-surface">
      <a href="#main-content" className="sr-only focus:not-sr-only focus:block focus:p-4 focus:text-accent">Skip to content</a>
      <div className="mx-auto grid max-w-[1440px] grid-cols-[1fr_auto] items-center gap-y-5 px-4 py-5 sm:px-8 md:grid-cols-[1fr_auto_1fr] lg:h-20 lg:px-[84px] lg:py-0">
        <Link href="/" aria-label="Apply Copilot home" className="w-fit rounded-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"><BrandLogo /></Link>
        <nav aria-label="Main navigation" className="col-span-2 row-start-2 flex justify-center gap-8 text-sm text-text-secondary md:col-span-1 md:col-start-2 md:row-start-1">
          <Link href="/dashboard" className="transition-colors hover:text-accent focus-visible:outline-accent">Dashboard</Link>
          <Link href="/find-jobs" className="transition-colors hover:text-accent focus-visible:outline-accent">Find Jobs</Link>
          <Link href="/profile" className="transition-colors hover:text-accent focus-visible:outline-accent">Profile</Link>
        </nav>
        {accountControls ? <SignOutButton /> : <Link href={authenticated ? "/dashboard" : "/login"} className="landing-primary justify-self-end px-4 py-2.5 text-xs sm:px-5 sm:text-sm">{authenticated ? "Open dashboard" : "Start for free"}</Link>}
      </div>
    </header>
  );
}
