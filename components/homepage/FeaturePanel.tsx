import type { ReactElement, ReactNode } from "react";

type Props = {
  title: ReactNode;
  items: { title: string; description: string }[];
  activeIndex: number;
  accent: "purple" | "green";
};

export function FeaturePanel({ title, items, activeIndex, accent }: Props): ReactElement {
  return (
    <div className="bg-surface">
      <h2 className="flex min-h-[180px] items-center px-7 py-12 text-[32px] leading-[1.12] font-semibold tracking-[-0.045em] text-text-slate lg:min-h-[224px] lg:px-16 lg:text-[44px]"><span>{title}</span></h2>
      <div>
        {items.map((item, index) => (
          <article key={item.title} className="border-t border-border/60 pl-6 lg:pl-11">
            <div className={`border-l-2 px-5 py-6 lg:min-h-[154px] ${index === activeIndex ? accent === "purple" ? "border-accent/40" : "border-success-dark/40" : "border-transparent"}`}>
              <h3 className="mb-2 text-base font-semibold leading-6 text-text-slate lg:text-lg">{item.title}</h3>
              <p className="text-sm leading-6 text-text-secondary lg:text-lg lg:leading-[1.65]">{item.description}</p>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
