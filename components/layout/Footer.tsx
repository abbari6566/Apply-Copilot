import Link from "next/link";
import type { ReactElement } from "react";
import { BrandLogo } from "@/components/layout/BrandLogo";

export function Footer(): ReactElement {
  return (
    <footer className="mx-auto w-full max-w-[1440px] px-4 sm:px-8 lg:px-[84px]">
      <div className="flex flex-col items-center justify-between gap-8 border-x border-border/60 px-6 py-12 sm:flex-row lg:px-10 lg:py-12">
        <Link href="/" aria-label="Apply Copilot home" className="rounded-sm focus-visible:outline-accent"><BrandLogo /></Link>
        <nav aria-label="Footer navigation" className="flex flex-wrap justify-center gap-6 text-xs text-text-secondary sm:text-sm">
          <Link href="/dashboard" className="hover:text-accent focus-visible:outline-accent">Dashboard</Link>
          <Link href="/privacy" className="hover:text-accent focus-visible:outline-accent">Privacy Policy</Link>
          <Link href="/terms" className="hover:text-accent focus-visible:outline-accent">Terms &amp; Condition</Link>
        </nav>
      </div>
    </footer>
  );
}
