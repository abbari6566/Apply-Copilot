import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "@insforge/sdk/ssr/middleware";
import { insforgeConfig } from "@/lib/insforge-config";

export async function proxy(request: NextRequest): Promise<NextResponse> {
  const pending = NextResponse.next();
  const protectedRoute = ["/dashboard", "/profile", "/find-jobs"].some(
    (path: string): boolean => request.nextUrl.pathname === path || request.nextUrl.pathname.startsWith(`${path}/`),
  );
  let hasSession = false;
  try {
    const result = await updateSession({
      ...insforgeConfig(), requestCookies: request.cookies, responseCookies: pending.cookies,
    });
    hasSession = Boolean(result.accessToken);
    if (result.error) console.error("[auth/proxy] Session refresh failed", result.error.statusCode);
  } catch {
    console.error("[auth/proxy] Session refresh unavailable");
  }
  // Construct the forwarded request after refresh so Server Components see the new cookies.
  const response = protectedRoute && !hasSession
    ? NextResponse.redirect(new URL("/login", request.url))
    : NextResponse.next({ request: { headers: request.headers } });
  for (const cookie of pending.cookies.getAll()) response.cookies.set(cookie);
  response.headers.set("Cache-Control", "private, no-store");
  return response;
}

export const config = {
  matcher: ["/", "/login", "/dashboard/:path*", "/profile/:path*", "/find-jobs/:path*"],
};
