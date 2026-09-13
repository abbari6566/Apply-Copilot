import type { ReactElement } from "react";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { LoginCard } from "@/components/auth/LoginCard";
import { OAuthForm } from "@/components/auth/OAuthForm";
import { getAuthUser } from "@/lib/auth";

export const metadata: Metadata = { title: "Sign in | Apply Copilot" };

type Props = { searchParams: Promise<{ error?: string }> };

export default async function LoginPage({ searchParams }: Props): Promise<ReactElement> {
  if (await getAuthUser()) redirect("/dashboard");
  const { error } = await searchParams;
  const message = error === "oauth"
    ? "We couldn’t finish signing you in. Please try again with Google or GitHub."
    : error === "session" ? "Your session has ended. Please sign in again." : undefined;
  return (
    <LoginCard error={message}>
      <OAuthForm />
    </LoginCard>
  );
}
