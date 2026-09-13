import Link from "next/link";
import type { ReactElement } from "react";

type Props = { authenticated?: boolean };

export function CtaButtons({ authenticated = false }: Props): ReactElement {
  return (
    <div className="flex flex-wrap items-center justify-center gap-4">
      <Link href={authenticated ? "/dashboard" : "/login"} className="landing-primary gap-1.5 px-6 py-3 text-sm sm:text-base">Get Started <span aria-hidden="true" className="text-xs">▸</span></Link>
      <Link href={authenticated ? "/find-jobs" : "/login"} className="inline-flex min-h-11 items-center justify-center rounded-md border border-border bg-surface/40 px-6 py-3 text-sm font-medium text-text-slate shadow-sm transition-colors hover:bg-surface focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent sm:text-base">Find Your First Match</Link>
    </div>
  );
}
