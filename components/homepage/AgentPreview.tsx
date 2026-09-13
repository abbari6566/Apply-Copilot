import Image from "next/image";
import type { ReactElement } from "react";

export function AgentPreview(): ReactElement {
  return (
    <div className="relative w-full overflow-hidden rounded-xl bg-surface [container-type:inline-size]">
      <Image src="/images/agnet-log.png" alt="Illustrative agent log showing matching roles and application preparation." width={2144} height={1656} sizes="(max-width: 767px) 85vw, 540px" className="h-auto w-full" />
      <div aria-hidden="true" className="absolute top-[22.4%] left-[12.5%] flex h-[7%] w-[84%] items-center whitespace-nowrap bg-surface font-mono text-[3.1cqw] text-text-black">
        <span><span className="text-info-dark">[SYSTEM]</span> Initializing Apply Copilot...</span>
      </div>
    </div>
  );
}
