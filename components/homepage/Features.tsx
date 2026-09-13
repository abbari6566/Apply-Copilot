import Image from "next/image";
import type { ReactElement } from "react";
import { FeaturePanel } from "@/components/homepage/FeaturePanel";
import { AgentPreview } from "@/components/homepage/AgentPreview";

export function Features(): ReactElement {
  return (
    <div>
      <div aria-hidden="true" className="h-12 bg-surface-secondary/30 lg:h-[72px]" />
      <section aria-label="Manage your job search" className="grid border-y border-border/60 md:grid-cols-2">
        <FeaturePanel title={<>Manage Your Job<br />Search With Ease</>} activeIndex={0} accent="purple" items={[
          { title: "Find jobs that actually fit", description: "Search by title and location or paste a job link. Get matched roles you can quickly scan." },
          { title: "Know the Company Before You Apply", description: "Stop guessing what a company is about. Apply Copilot browses their site and gives you everything you need to apply with confidence." },
          { title: "Keep track of every application", description: "Keep a clear view of every job you’ve found, tailored. Your activity and progress all stay in one simple place." },
        ]} />
        <div className="flex items-center justify-center border-t border-border/60 bg-background px-6 py-14 md:border-t-0 md:border-l lg:px-7">
          <Image src="/images/jobs-lists.png" alt="Example job matches for Vercel, Stripe, Linear, Notion, OpenAI, and Figma, with match scores and salary estimates." width={2364} height={1778} sizes="(max-width: 767px) 85vw, 580px" className="h-auto w-full rounded-xl" />
        </div>
      </section>
      <div aria-hidden="true" className="h-12 bg-surface-secondary/30 lg:h-20" />
      <section aria-label="Apply with more confidence" className="grid border-y border-border/60 md:grid-cols-2">
        <div className="order-2 flex items-center justify-center border-t border-border/60 bg-background px-7 py-16 md:order-1 md:border-t-0 md:border-r lg:px-12"><AgentPreview /></div>
        <div className="order-1 md:order-2"><FeaturePanel title="Apply With More Confidence, Every Time" activeIndex={1} accent="green" items={[
          { title: "Understand your match score", description: "See how your profile lines up with each role before you apply. Get a clear breakdown of what fits and what’s missing." },
          { title: "AI-Powered Job Matching", description: "Stop guessing which jobs are worth applying to. Apply Copilot scores every role against your actual skills so you can focus on the ones that matter." },
          { title: "Focus on the right roles", description: "Filter out low fit jobs and stay on the ones that actually matter. Spend less time sorting and more time applying." },
        ]} /></div>
      </section>
    </div>
  );
}
