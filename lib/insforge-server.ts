import "server-only";
import { createServerClient } from "@insforge/sdk/ssr";
import { cookies } from "next/headers";
import { insforgeConfig } from "@/lib/insforge-config";

export async function createInsforgeServer(): Promise<ReturnType<typeof createServerClient>> {
  return createServerClient({ ...insforgeConfig(), cookies: await cookies() });
}
