"use server";

import { createAuthActions, clearAuthCookies } from "@insforge/sdk/ssr";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { appOrigin } from "@/lib/auth";
import { insforgeConfig, PKCE_COOKIE } from "@/lib/insforge-config";
import type { AuthActionState } from "@/types/auth";

export async function signIn(_previous: AuthActionState, formData: FormData): Promise<AuthActionState> {
  const provider = formData.get("provider");
  if (provider !== "google" && provider !== "github") {
    return { success: false, error: "Choose Google or GitHub to continue." };
  }
  let destination: string;
  try {
    const cookieStore = await cookies();
    const auth = createAuthActions({ ...insforgeConfig(), cookies: cookieStore });
    const { data, error } = await auth.signInWithOAuth(provider, {
      redirectTo: `${appOrigin()}/api/auth/callback`,
      skipBrowserRedirect: true,
    });
    if (error || !data?.url || !data.codeVerifier) {
      console.error("[auth/sign-in] OAuth initialization failed", error?.statusCode);
      return { success: false, error: "We couldn’t connect to your sign-in provider. Please try again." };
    }
    const url = new URL(data.url);
    if (url.protocol !== "https:") throw new Error("Invalid provider URL");
    cookieStore.set(PKCE_COOKIE, data.codeVerifier, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/api/auth/callback",
      maxAge: 600,
    });
    destination = url.toString();
  } catch {
    console.error("[auth/sign-in] Unable to start OAuth");
    return { success: false, error: "Sign-in is temporarily unavailable. Please try again shortly." };
  }
  redirect(destination);
}

export async function signOut(): Promise<AuthActionState> {
  try {
    const cookieStore = await cookies();
    try {
      const auth = createAuthActions({ ...insforgeConfig(), cookies: cookieStore });
      const { error } = await auth.signOut();
      if (error) console.error("[auth/sign-out] Remote sign-out failed", error.statusCode);
    } finally {
      // Always end this browser's session, including during a backend outage.
      clearAuthCookies(cookieStore);
    }
  } catch {
    console.error("[auth/sign-out] Unable to complete remote sign-out");
  }
  revalidatePath("/", "layout");
  redirect("/login");
}
