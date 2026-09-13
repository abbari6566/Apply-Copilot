import Image from "next/image";
import type { ReactElement } from "react";
import { BrandLogo } from "@/components/layout/BrandLogo";

export function DashboardPreview(): ReactElement {
  return (
    <section aria-label="Apply Copilot dashboard preview" className="border-y border-border/60 bg-surface-secondary px-3 py-6 sm:px-8 lg:px-10 lg:py-8">
      <div className="relative mx-auto max-w-[1192px]">
        <Image src="/images/dashboard-demo.png" alt="Dashboard preview with 284 jobs found, an 82 percent average match rate, company research activity, and recent job searches." width={4788} height={2416} sizes="(max-width: 767px) 92vw, (max-width: 1439px) 84vw, 1192px" loading="eager" className="h-auto w-full" />
        <div aria-hidden="true" className="absolute top-[15.2%] left-[5.6%] flex h-[5.8%] w-[20%] items-center bg-surface"><BrandLogo className="w-[60%]" /></div>
        <div aria-hidden="true" className="absolute top-[6.5%] left-[30%] flex h-[5.4%] w-[40%] items-center justify-center rounded-sm bg-surface-secondary font-mono text-[5px] text-text-muted sm:text-[9px] lg:text-xs">apply-copilot / dashboard</div>
      </div>
    </section>
  );
}
