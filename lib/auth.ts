import "server-only";
import { cache } from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { DEFAULT_ACCESS_TOKEN_COOKIE } from "@insforge/sdk/ssr";
import { createInsforgeServer } from "@/lib/insforge-server";

type ServerClient = Awaited<ReturnType<typeof createInsforgeServer>>;
type UserResponse = Awaited<ReturnType<ServerClient["auth"]["getCurrentUser"]>>;
type AuthUser = NonNullable<UserResponse["data"]>["user"];

export const getAuthUser = cache(async (): Promise<AuthUser> => {
  if (!(await cookies()).get(DEFAULT_ACCESS_TOKEN_COOKIE)?.value) return null;
  try {
    const client = await createInsforgeServer();
    const { data, error } = await client.auth.getCurrentUser();
    if (error) {
      console.error("[auth/user] Session validation failed", error.statusCode);
      return null;
    }
    return data?.user ?? null;
  } catch {
    console.error("[auth/user] Session service unavailable");
    return null;
  }
});

export async function requireUser(): Promise<NonNullable<AuthUser>> {
  const user = await getAuthUser();
  if (!user) redirect("/login?error=session");
  return user;
}

export function appOrigin(): string {
  const configured = process.env.APP_URL;
  if (!configured) throw new Error("APP_URL is required for OAuth.");
  const url = new URL(configured);
  if (url.protocol !== "https:" && !(url.protocol === "http:" && ["localhost", "127.0.0.1"].includes(url.hostname))) {
    throw new Error("APP_URL must use HTTPS except on localhost.");
  }
  return url.origin;
}
