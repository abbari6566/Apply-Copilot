import type { ReactElement } from "react";
import { CtaButtons } from "@/components/homepage/CtaButtons";

export function Hero({ authenticated = false }: { authenticated?: boolean }): ReactElement {
  return (
    <section aria-labelledby="hero-heading" className="landing-glow flex flex-col items-center px-5 py-16 text-center lg:min-h-[414px] lg:justify-center lg:py-[60px]">
      <h1 id="hero-heading" className="text-[36px] leading-[1.08] font-bold tracking-[-0.055em] text-balance text-text-black sm:text-5xl lg:text-[60px]">Job hunting is hard.<br />Your tools shouldn’t be.</h1>
      <p className="mt-6 mb-6 max-w-[630px] text-base leading-7 text-text-secondary lg:text-lg">Stop applying blind. Apply Copilot finds the jobs, researches the companies, and gives you everything you need to stand out.</p>
      <CtaButtons authenticated={authenticated} />
    </section>
  );
}
