import type { ReactElement } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/homepage/Hero";
import { DashboardPreview } from "@/components/homepage/DashboardPreview";
import { Features } from "@/components/homepage/Features";
import { Testimonial } from "@/components/homepage/Testimonial";
import { FinalCta } from "@/components/homepage/FinalCta";
import { getAuthUser } from "@/lib/auth";

export default async function Home(): Promise<ReactElement> {
  const authenticated = Boolean(await getAuthUser());
  return (
    <div className="min-h-screen bg-surface text-text-slate">
      <Navbar authenticated={authenticated} />
      <main id="main-content" className="mx-auto max-w-[1440px] px-4 pt-8 sm:px-8 lg:px-[84px] lg:pt-[60px]">
        <div className="border-x border-t border-border/60">
          <Hero authenticated={authenticated} />
          <DashboardPreview />
          <Features />
          <Testimonial />
          <div aria-hidden="true" className="h-12 border-y border-border/60 bg-surface-secondary/30 lg:h-20" />
          <FinalCta authenticated={authenticated} />
          <div aria-hidden="true" className="h-12 border-y border-border/60 bg-surface-secondary/30 lg:h-20" />
        </div>
      </main>
      <Footer />
    </div>
  );
}
