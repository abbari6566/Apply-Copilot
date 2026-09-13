"use client";

import { createBrowserClient } from "@insforge/sdk/ssr";
import { insforgeConfig } from "@/lib/insforge-config";

let client: ReturnType<typeof createBrowserClient> | undefined;

export function getInsforgeBrowser(): ReturnType<typeof createBrowserClient> {
  client ??= createBrowserClient({ ...insforgeConfig(), refreshUrl: "/api/auth/refresh" });
  return client;
}
