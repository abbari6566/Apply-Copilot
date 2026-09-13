import type { ReactElement } from "react";
import { CtaButtons } from "@/components/homepage/CtaButtons";

export function FinalCta({ authenticated = false }: { authenticated?: boolean }): ReactElement {
  return (
    <section aria-labelledby="final-cta-heading" className="landing-glow flex flex-col items-center px-6 py-16 text-center lg:min-h-[410px] lg:justify-center lg:py-20">
      <h2 id="final-cta-heading" className="max-w-[820px] text-[32px] leading-[1.08] font-semibold tracking-[-0.05em] text-text-slate sm:text-[44px] lg:text-[52px]">Your next job search can feel a<br className="hidden lg:block" /> lot less overwhelming</h2>
      <p className="mt-7 mb-7 text-sm leading-6 text-text-secondary lg:text-lg">Set up your profile, upload your resume, and start finding matches in minutes.</p>
      <CtaButtons authenticated={authenticated} />
    </section>
  );
}
