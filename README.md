# Apply Copilot

Apply Copilot is an AI-powered job hunting assistant for developers and technical job seekers.

Finding a job often means repeating the same work: searching through job boards, comparing roles with your skills, researching companies, and preparing for interviews. Apply Copilot brings these steps together in one place.

## How It Works

1. Sign in with Google or GitHub.
2. Create your profile and upload your resume.
3. Search for jobs by title and location.
4. Apply Copilot finds jobs through Adzuna and scores them against your profile using AI.
5. Review the match score, matched skills, missing skills, and explanation for each job.
6. Research a company to get an overview of its technology, culture, and interview talking points.
7. Open the original job post and apply when you are ready.

The goal is simple: help you spend less time sorting through job listings and more time applying to roles that fit.

## Main Features

- Responsive marketing homepage
- Google and GitHub authentication
- User profile and resume management
- AI-assisted resume extraction and resume generation
- Job discovery through the Adzuna API
- AI job matching with scores and explanations
- Company research using Browserbase and Stagehand
- Dashboard with job activity and analytics
- PostHog event tracking

## Technology

- Next.js 16 with the App Router
- React 19 and TypeScript
- Tailwind CSS
- InsForge for authentication, database, storage, and realtime services
- OpenAI GPT-4o for matching, extraction, and content generation
- Adzuna for job discovery
- Browserbase and Stagehand for company research
- PostHog for analytics

## Project Status

The homepage and authentication flow are implemented. Google and GitHub OAuth use a server-side PKCE flow with protected routes and session refresh.

The profile, job discovery, company research, database schema, and full dashboard features are planned next and are not all implemented yet.

## Run Locally

Install dependencies:

```bash
npm install
```

Create a `.env.local` file with the required InsForge configuration. Keep this file private and do not commit it.

Start the development server:

```bash
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000).

## Validation

Run the available checks with:

```bash
npm run test:auth
npm run lint
npx tsc --noEmit
npm run build
```
