import type { ReactElement, ReactNode } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { requireUser } from "@/lib/auth";

export default async function ProtectedLayout({ children }: { children: ReactNode }): Promise<ReactElement> {
  await requireUser();
  return <><Navbar authenticated accountControls /><main id="main-content" className="mx-auto w-full max-w-[1440px] p-4 sm:p-8">{children}</main></>;
}
