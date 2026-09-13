export function insforgeConfig(): { baseUrl: string; anonKey: string; fetch: typeof fetch } {
  const baseUrl = process.env.NEXT_PUBLIC_INSFORGE_URL;
  const anonKey = process.env.NEXT_PUBLIC_INSFORGE_ANON_KEY;
  if (!baseUrl || !anonKey) throw new Error("InsForge configuration is missing.");
  return {
    baseUrl,
    anonKey,
    fetch: (input: RequestInfo | URL, init?: RequestInit): Promise<Response> =>
      fetch(input, { ...init, cache: "no-store", signal: init?.signal ?? AbortSignal.timeout(10_000) }),
  };
}

export const PKCE_COOKIE = "apply_copilot_oauth_verifier";
