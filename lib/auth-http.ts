import "server-only";
import { createAuthActions, refreshAuth } from "@insforge/sdk/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { appOrigin } from "@/lib/auth";
import { insforgeConfig, PKCE_COOKIE } from "@/lib/insforge-config";

export async function completeOAuth(request: NextRequest): Promise<NextResponse> {
  const failure = NextResponse.redirect(new URL("/login?error=oauth", request.url));
  failure.headers.set("Cache-Control", "no-store");
  failure.headers.set("Referrer-Policy", "no-referrer");
  failure.cookies.set(PKCE_COOKIE, "", { path: "/api/auth/callback", maxAge: 0 });
  try {
    const code = request.nextUrl.searchParams.get("insforge_code");
    const verifier = request.cookies.get(PKCE_COOKIE)?.value;
    if (!code || !verifier || code.length > 4096 || request.nextUrl.searchParams.has("insforge_error")) return failure;
    const response = NextResponse.redirect(new URL("/dashboard", appOrigin()));
    const auth = createAuthActions({
      ...insforgeConfig(),
      requestCookies: request.cookies,
      responseCookies: response.cookies,
    });
    const { data, error } = await auth.exchangeOAuthCode(code, verifier);
    if (error || !data?.user) {
      console.error("[auth/callback] OAuth exchange failed", error?.statusCode);
      return failure;
    }
    response.cookies.set(PKCE_COOKIE, "", { path: "/api/auth/callback", maxAge: 0 });
    response.headers.set("Cache-Control", "no-store");
    response.headers.set("Referrer-Policy", "no-referrer");
    return response;
  } catch {
    console.error("[auth/callback] Unable to complete OAuth");
    return failure;
  }
}

export async function refreshSession(request: NextRequest): Promise<Response> {
  try {
    if (request.headers.get("origin") !== appOrigin()) {
      return NextResponse.json({ success: false, error: "Request not allowed." }, { status: 403 });
    }
    const result = await refreshAuth({ ...insforgeConfig(), request });
    const headers = new Headers(result.response.headers);
    headers.set("Cache-Control", "no-store");
    // Keep the SDK's accessToken field for its browser refresh adapter; never return a refresh token.
    return NextResponse.json(
      result.error
        ? { success: false, error: "Your session has expired. Please sign in again." }
        : { success: true, accessToken: result.accessToken, data: { user: result.data?.user } },
      { status: result.response.status, headers },
    );
  } catch {
    console.error("[auth/refresh] Session refresh unavailable");
    return NextResponse.json({ success: false, error: "Unable to refresh your session." }, { status: 503 });
  }
}
