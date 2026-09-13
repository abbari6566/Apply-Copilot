# Progress Tracker

Update this file after every completed feature. Any AI agent reading this should immediately know what is done, what is in progress, and what is next.

---

## Current Status

**Phase:** Phase 1 — Foundation
**Last completed:** 01 Homepage — complete responsive UI from landing-page.png, with Apply Copilot branding
**In progress:** 02 Auth — implementation and automated checks complete; real-account OAuth and visual validation pending
**Next:** Finish auth validation, then 03 PostHog Initialization

---

## Progress

### Phase 1 — Foundation

- [x] 01 Homepage (UI complete; session-aware CTA routing implemented with 02 Auth)
- [ ] 02 Auth (implemented; real-account OAuth and visual validation pending)
- [ ] 03 PostHog Initialization
- [ ] 04 Database Schema

### Phase 2 — Profile Page

- [ ] 05 Profile Page — Full UI
- [ ] 06 Profile Save Logic
- [ ] 07 AI Profile Extraction from Resume
- [ ] 08 Resume PDF Generation from Profile

### Phase 3 — Find Jobs Page

- [ ] 09 Find Jobs Page — Full UI
- [ ] 10 Adzuna Job Discovery
- [ ] 11 Filter + Sort + Pagination

### Phase 4 — Job Details Page

- [ ] 12 Job Details Page — Full UI
- [ ] 13 Company Research Agent

### Phase 5 — Dashboard

- [ ] 14 Dashboard Page — Full UI
- [ ] 15 Stats Bar — Real Data
- [ ] 16 Recent Activity — Real Data
- [ ] 17 Analytics Charts — PostHog Data

---

## Decisions Made During Build

_Add decisions here as they are made during implementation._

- Homepage follows the supplied landing-page.png over generic app-card rules: square bordered sections, dark gradient CTAs, pastel hero/closing CTA, and alternating preview panels.
- Apply Copilot is the website brand. `public/logo.png` is framed with CSS to remove transparent padding from its rendered footprint. Original assets stay unchanged; small HTML overlays replace JobPilot branding in illustrative previews.
- The reference's copy, testimonial, and agent-log illustration are retained as requested. They are mock marketing content, not evidence of implemented URL import, tailoring, cover letters, or interview tracking. Those features remain out of scope.
- Homepage navigation uses planned routes. `/login`, `/dashboard`, `/find-jobs`, `/profile`, `/privacy`, and `/terms` do not exist yet. No fabricated auth/session behavior or legal policies were added.

---

## Notes

_Add notes here as the build progresses — workarounds, patterns, anything that differs from the context files._

- Global styling setup: copied the complete UI token block into `app/globals.css`, added token-based body and border defaults, and loaded Inter via `next/font/google`. Existing Tailwind v4 PostCSS configuration was already correct.
- Validation: production build and TypeScript passed with network access for the Google Fonts download; direct PostCSS compilation verified semantic color, radius, and font utilities.
- Homepage validation: ESLint, TypeScript, and production build passed. Headless Chrome checked 1440, 768, 390, and 320 pixel widths: all images loaded, no horizontal overflow, and no runtime exceptions. Desktop and mobile full-page screenshots were visually reviewed against the reference.

## Feature 02 implementation ? 2026-09-13

- Google/GitHub login, server OAuth callback with PKCE, SDK session cookies and refresh, server-side user validation, protected-route redirects, sign-out, and session-aware homepage CTAs implemented.
- Minimal authenticated dashboard added as the login destination; full dashboard, profile, and Find Jobs features remain in later phases. `/privacy` and `/terms` still have no content.
- InsForge MCP supplied current docs, provider metadata, and the public anonymous key; placeholder local URL/key replaced. Local `APP_URL` is `http://localhost:3000`.
- Current SDK is `@insforge/sdk` 1.5.2 with its `/ssr` helpers. Next.js 16 uses `proxy.ts`. See `context/auth-implementation.md` for exact patterns and verification limits.
- Tailwind 3.4.19 was already installed and pinned; migrated the leftover v4 CSS/PostCSS setup to 3.4 while preserving semantic tokens and homepage styling. This supersedes the earlier v4 setup note.
- Validation: production build, TypeScript, ESLint, all 12 auth regression tests, and live provider initiation passed. Full real-account OAuth and visual checks remain pending because browser controls are unavailable.
