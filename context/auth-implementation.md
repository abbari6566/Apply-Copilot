# Authentication implementation

Implemented 2026-09-13 for Feature 02. Google and GitHub OAuth only.

## Documentation and decisions

- InsForge MCP: fetched setup instructions, TypeScript authentication docs, and backend metadata before implementation.
- Installed SDK 1.5.2: `node_modules/@insforge/sdk/README.md`, SSR / Next.js section, and `SDK-REFERENCE.md`.
- Installed Next.js 16.3.5: authentication, Proxy, cookies, Server Actions, and Route Handlers guides under `node_modules/next/dist/docs/`.
- Use `@insforge/sdk/ssr`, not the older `@insforge/ssr` examples. Its factory functions take an options object; auth mutations run on the server.
- General browser SDK callback auto-exchange does not apply to the SSR client. The app completes OAuth on the server.
- Use `proxy.ts` in Next.js 16. Proxy handles refresh and optimistic redirects; `requireUser()` validates the session with InsForge before protected content renders. Future protected pages, actions, and API routes must validate the user at the point of data access, not rely solely on the layout or proxy.

## Flow

1. `/login` renders Google and GitHub buttons with pending and friendly error states. An existing validated session redirects to `/dashboard`.
2. `actions/auth.ts` validates the provider and calls `createAuthActions().signInWithOAuth()`.
3. The app stores the SDK-generated PKCE verifier in an HTTP-only, SameSite=Lax cookie, scoped to `/api/auth/callback` and expiring after 10 minutes. Production cookies are Secure.
4. `/api/auth/callback` exchanges `insforge_code` with that verifier. The SDK sets app-domain session cookies; the app deletes the verifier and redirects to `/dashboard`. Missing/invalid callbacks return to `/login?error=oauth` without exposing backend errors.
5. Proxy refreshes expired sessions before Server Components render and forwards updated request cookies. Dashboard and protected layout validate the user through `getCurrentUser()`.
6. `/api/auth/refresh` accepts same-origin POSTs only. It keeps the SDK-required access token response field and never returns the refresh token in JSON.
7. Sign-out runs on the server, clears local session cookies even if the backend is unavailable, and redirects to `/login`.

The SDK's access token cookie is browser-readable for future Storage/Realtime clients; its refresh token cookie is HTTP-only. No tokens are returned from Server Actions or stored in localStorage by application code.

## Files and boundaries

- `lib/insforge-config.ts`: SDK environment configuration and bounded fetch.
- `lib/insforge-server.ts`: request-scoped server client.
- `lib/insforge-client.ts`: lazy browser client for consuming an established SSR session.
- `lib/auth.ts`: validated current user, protected-page guard, and configured application origin.
- `actions/auth.ts`: OAuth initiation and sign-out.
- `lib/auth-http.ts`: callback and refresh handlers; `app/api/auth/*/route.ts` exposes them.
- `proxy.ts`: session refresh and protected-route redirects.
- `components/auth/`: presentational login card and action forms.
- `app/(protected)/`: authenticated layout and minimal dashboard destination. Profile, job search, and full dashboard features remain in their original later phases.

Homepage remains public. Get Started and the navbar CTA go to `/login` when signed out and `/dashboard` when signed in. Find Your First Match goes to `/login` when signed out and `/find-jobs` when signed in.

## Configuration

Use `.env.local` locally; configure the same variables in the deployment environment:

```dotenv
NEXT_PUBLIC_INSFORGE_URL=<connected project base URL>
NEXT_PUBLIC_INSFORGE_ANON_KEY=<public anonymous key from InsForge MCP>
APP_URL=http://localhost:3000
```

`APP_URL` is the canonical application origin. Use its HTTPS deployment origin in production. Register `${APP_URL}/api/auth/callback` in InsForge's redirect allowlist for production. Both providers were enabled in backend metadata; the allowlist was empty at inspection, and live localhost OAuth initiation succeeded for both. No backend auth settings were changed.

## Validation

- `node tests/auth.test.mjs`: regression tests using the real installed SDK with a mocked backend and Next request context. Covers provider validation, PKCE, callback success/failure, cookie attributes, cross-origin refresh rejection, token rotation, forwarding refreshed cookies, anonymous redirects, forged-token rejection, revoked refresh tokens, and sign-out.
- TypeScript, ESLint, and production build.
- Live HTTP form submissions: both providers return 303 redirects to their correct provider hosts and an HTTP-only verifier cookie.
- Live unauthenticated protected-route and invalid callback checks.
- Pending: full Google/GitHub sign-in, refresh and sign-out with a real account, plus desktop/mobile visual review. Browser control is unavailable in this session. Mocked tests do not replace that final check.

## Styling compatibility

Dependencies were already pinned to Tailwind 3.4.19. Updated the remaining v4 CSS/PostCSS setup to match that required version. Semantic color names are preserved through RGB CSS variables and `tailwind.config.ts`; no component uses raw color classes. Inter still loads through `next/font/google`.
