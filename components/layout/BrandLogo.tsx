import Image from "next/image";
import type { ReactElement } from "react";

type Props = { className?: string };

export function BrandLogo({
  className = "w-[170px] sm:w-[190px]",
}: Props): ReactElement {
  return (
    <span
      className={`relative block aspect-[5.7/1] overflow-hidden ${className}`}
    >
      <Image
        src="/logo.png"
        alt="Apply Copilot"
        width={1280}
        height={1280}
        sizes="210px"
        className="absolute top-1/2 left-[-2%] h-auto w-[104%] max-w-none -translate-y-[49.3%]"
      />
    </span>
  );
}
