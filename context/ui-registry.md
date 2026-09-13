# UI Registry

Living document. Updated after every component is built. Read this before building any new component — match existing patterns exactly before inventing new ones.

---

## How to Use

Before building any component:

1. Check if a similar component already exists here
2. If yes — match its exact classes
3. If no — build it following ui-rules.md and ui-tokens.md, then add it here

After building any component — update this file with the component name, file path, and exact classes used.

---

## Components

Homepage components recorded below. Last updated: 2026-09-12.

## Global Foundation

- `app/globals.css` uses Tailwind 3.4 directives and defines semantic RGB color variables in `:root`, mapped through `tailwind.config.ts`. Original token values are preserved.
- Base styles apply `--color-background`, `--color-text-primary`, and `--font-sans` to the body; borders default to `--color-border`.
- `app/layout.tsx` loads Inter through `next/font/google`, exposing `--font-sans` on `<html>` with classes `${inter.variable} h-full antialiased`. Body classes: `min-h-full flex flex-col`.
- Use semantic utilities such as `bg-surface`, `text-text-primary`, `border-border`, and `rounded-md`. PostCSS uses `tailwindcss` and `autoprefixer`; token mappings live in `tailwind.config.ts`.

## Homepage — Reference-specific patterns

The user explicitly requested `context/designs/landing-page.png`. Its dark CTAs, pastel promotional sections, square section borders, and larger headings take precedence over generic application-card styling on this page. These exceptions do not change the dashboard/form design system.

### BrandLogo

File: `components/layout/BrandLogo.tsx`

- Wrapper: `relative block aspect-[5.7/1] overflow-hidden`.
- Uses `/logo.png`; its transparent margins are framed with `absolute top-1/2 left-[-2%] h-auto w-[104%] max-w-none -translate-y-[49.3%]` so the full wordmark remains visible at narrow widths.
- Never recreate the wordmark as text or change the source image. Supply sizing through the optional `className` prop.

### Navbar

File: `components/layout/Navbar.tsx`

- Surface: `border-b border-border/60 bg-surface`.
- Navigation: `gap-8 text-sm text-text-secondary`; links use `transition-colors hover:text-accent focus-visible:outline-accent`.
- Brand focus: `rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent`.
- Mobile keeps all three links visible on a second row. Includes a keyboard-accessible skip link.

### Footer

File: `components/layout/Footer.tsx`

- Surface: `border-x border-border/60 px-6 py-12`.
- Navigation: `gap-6 text-xs text-text-secondary`; links use `hover:text-accent focus-visible:outline-accent`.
- Reuses BrandLogo. Legal routes are reserved destinations, pending actual legal content.

### CtaButtons

File: `components/homepage/CtaButtons.tsx`

- Group: `flex flex-wrap items-center justify-center gap-4`.
- Primary: `landing-primary gap-1.5 px-6 py-3 text-sm`.
- Shared `landing-primary` in `app/globals.css`: `inline-flex min-h-10 items-center justify-center rounded-md border border-text-slate-medium/40 bg-gradient-to-b from-text-darker to-text-slate px-4 py-2 font-medium text-accent-foreground shadow-sm transition-colors hover:from-text-dark hover:to-text-darker focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent`.
- Secondary: `inline-flex min-h-11 items-center justify-center rounded-md border border-border bg-surface/40 px-6 py-3 text-sm font-medium text-text-slate shadow-sm transition-colors hover:bg-surface focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent`.
- Both actions link to `/login` when signed out. Get Started links to `/dashboard` and Find Your First Match to `/find-jobs` when signed in. State is supplied by the homepage Server Component.

### Hero

File: `components/homepage/Hero.tsx`

- Surface: `landing-glow`; shared CSS uses only existing color tokens in layered radial gradients.
- Spacing: `px-5 py-16 text-center`.
- Heading: `text-[36px] leading-[1.08] font-bold tracking-[-0.055em] text-balance text-text-black`; desktop uses 60px.
- Copy: `mt-6 mb-6 text-base leading-7 text-text-secondary`.
- Reuses CtaButtons; no client state.

### DashboardPreview

File: `components/homepage/DashboardPreview.tsx`

- Surface: `border-y border-border/60 bg-surface-secondary px-3 py-6`.
- Image: `/images/dashboard-demo.png`, `h-auto w-full`; image contains the original preview shadow and rounded browser frame.
- Token-based overlays cover the original brand and address; reuses BrandLogo.
- Next Image has intrinsic dimensions, responsive sizes, and eager loading for the prominent preview.

### Features

File: `components/homepage/Features.tsx`

- Sections: `grid border-y border-border/60`; alternate image/text order on desktop and stack text before illustration on mobile.
- Illustration panels: `bg-background`; job image uses `h-auto w-full rounded-xl`.
- Assets: `/images/jobs-lists.png` and AgentPreview.
- Separators: `bg-surface-secondary/30`.

### FeaturePanel

File: `components/homepage/FeaturePanel.tsx`

- Surface: `bg-surface`.
- Heading: `px-7 py-12 text-[32px] leading-[1.12] font-semibold tracking-[-0.045em] text-text-slate`; desktop uses 44px.
- Rows: `border-t border-border/60 pl-6`; inner spacing `border-l-2 px-5 py-6`.
- Accent line: `border-accent/40` or `border-success-dark/40`; other rows `border-transparent`.
- Row title: `mb-2 text-base font-semibold leading-6 text-text-slate`.
- Body: `text-sm leading-6 text-text-secondary`; desktop 18px with 1.65 line height.
- Accent lines are static illustration emphasis, not tabs or interactive controls.

### AgentPreview

File: `components/homepage/AgentPreview.tsx`

- Wrapper: `relative w-full overflow-hidden rounded-xl bg-surface [container-type:inline-size]`.
- Image: `/images/agnet-log.png`, `h-auto w-full`.
- Brand overlay: `whitespace-nowrap bg-surface font-mono text-[3.1cqw] text-text-black`, with `text-info-dark` for the system label.
- This is an illustrative reference asset, not a live agent feed.

### Testimonial

File: `components/homepage/Testimonial.tsx`

- Spacing: `px-7 py-20 text-center`.
- Eyebrow: `mb-6 text-xs font-medium tracking-[0.08em] text-accent`.
- Quote: `text-xl leading-[1.45] font-medium tracking-[-0.025em] text-text-slate`; desktop uses 30px.
- Attribution: `mt-6 gap-3 text-left`; name `text-sm font-semibold text-text-slate`; role `mt-1 text-xs text-text-secondary`.
- Uses supplied `/images/user-icon.png` with `size-11 rounded-md`; quote and attribution come from the reference mockup.

### FinalCta

File: `components/homepage/FinalCta.tsx`

- Surface and spacing: `landing-glow px-6 py-16 text-center`.
- Heading: `text-[32px] leading-[1.08] font-semibold tracking-[-0.05em] text-text-slate`; desktop uses 52px.
- Copy: `mt-7 mb-7 text-sm leading-6 text-text-secondary`.
- Reuses CtaButtons to keep hero and closing actions identical.

## Authentication ? 2026-09-13

### LoginCard

File: `components/auth/LoginCard.tsx`

- Surface: `rounded-xl border border-border bg-surface p-6 shadow-sm`.
- Heading: `text-3xl font-semibold tracking-tight text-text-primary`.
- Eyebrow: `text-xs font-medium uppercase tracking-widest text-accent`.
- Body: `text-sm leading-6 text-text-secondary`.
- Error: `rounded-md border border-error/30 bg-surface p-3 text-sm leading-6 text-text-primary`, with `role="alert"`.
- Reuses BrandLogo; no auth/data logic inside the card.

### OAuthForm and SignOutButton

Files: `components/auth/OAuthForm.tsx`, `components/auth/SignOutButton.tsx`

- Shared `auth-provider` class: `rounded-md border border-border bg-surface px-4 py-3 text-sm font-medium text-text-primary`.
- States: `hover:bg-surface-secondary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent disabled:cursor-wait disabled:opacity-60`.
- Action state handled with React `useActionState`; pending sign-in text uses `role="status"`.
- Navbar accepts session state as props. Authenticated app pages show SignOutButton; the public homepage shows Open dashboard.

### Authenticated dashboard destination

File: `app/(protected)/dashboard/page.tsx`

- Uses LoginCard's surface, heading, eyebrow, and body typography patterns for a minimal signed-in welcome.
- Full dashboard implementation remains Feature 14.
