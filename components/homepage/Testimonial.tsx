import Image from "next/image";
import type { ReactElement } from "react";

export function Testimonial(): ReactElement {
  return (
    <section aria-labelledby="testimonial-heading" className="flex flex-col items-center px-7 py-20 text-center lg:pt-32 lg:pb-16">
      <h2 id="testimonial-heading" className="mb-6 text-xs font-medium tracking-[0.08em] text-accent">SUCCESS STORIES</h2>
      <figure className="flex max-w-[860px] flex-col items-center">
        <blockquote className="text-xl leading-[1.45] font-medium tracking-[-0.025em] text-text-slate lg:text-[30px]">“I used to spend my evenings copy-pasting resumes. Now I open my dashboard to see interviews waiting. It feels like cheating. Had 3 offers on the table simultaneously.”</blockquote>
        <figcaption className="mt-6 flex items-center gap-3 text-left">
          <Image src="/images/user-icon.png" alt="" width={44} height={44} className="size-11 rounded-md" />
          <div><p className="text-sm font-semibold text-text-slate">Tom Wilson</p><p className="mt-1 text-xs text-text-secondary">Junior Developer</p></div>
        </figcaption>
      </figure>
    </section>
  );
}
