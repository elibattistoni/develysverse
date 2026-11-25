# develysverse: project instructions for coding agents

This is the single instruction file for every coding agent (Codex reads it directly,
Claude Code reads it through `CLAUDE.md`). Keep agent-specific files as thin pointers.

## What this project is

Elisa Battistoni's personal portfolio: a software engineer with a PhD in Cognitive
Neuroscience and a background in Data Science. One static page that tells her story,
deployed at https://develysverse.com.

## Design authority

- Current design: `docs/design-handoff/2026-11-20/DESIGN_UX_SPECIFICATION.md`, together with
  the approved changes in `docs/implementation/design-amendments.md` (newer entries win).
- The v10 prototype and test fixtures are listed in `docs/design-handoff/README.md`.
- **Never regenerate or edit `docs/design-handoff/`**, including `visual-references/`.
  QA output goes to `test-results/revision-2026-11-20/` and `playwright-report/revision-2026-11-20/`.
- Real-device, native Safari and screen-reader checks remain release gates.
- When code and this file disagree, the code and the design documents win. Fix this file.

## Tech stack

- **Next.js 16** (App Router) with `output: "export"` in `next.config.mjs`: a fully static
  site, no server code. Keep it that way; it is a large part of the security model.
- **React 19**, **TypeScript** (strict). TypeScript 7 provides the `tsc` CLI through the
  `@typescript/native` alias; the `typescript` alias is Microsoft's TypeScript 6 compatibility
  API used by ESLint, Next and Jest. Don't "fix" these aliases.
- **CSS Modules** per component plus design tokens in `app/globals.css`. Tailwind 4 is loaded
  for utilities only, without Preflight (v10 relies on browser defaults).
- **No animation or 3D library.** The skills constellation is plain Canvas 2D
  (`components/skills/constellation-renderer.ts`).
- **Fonts:** DM Sans (display) and Inter (body), self-hosted as WOFF2 via
  `public/assets/fonts/fonts-woff2.css`. Only 3 runtime dependencies: `next`, `react`, `react-dom`.
- Toolchain: Node 26.13.1 (`.nvmrc`), npm 12.2.3. Exact versions in `package.json`, no `^`/`~`.

## Page structure

`app/page.tsx` renders, in order:

| Anchor | Component | Content source |
|---|---|---|
| `#top` | `components/hero/HeroSection.tsx` | inline copy, `HeroArt.tsx` |
| `#projects` | `components/projects/ProjectsSection.tsx` | `lib/data/projects.ts` |
| `#expertise` | `components/expertise/ExpertiseSection.tsx` (includes the skills constellation, `components/skills/`) | `lib/data/expertise.ts`, `lib/data/skills.ts` |
| `#journey` | `components/timeline/TimelineSection.tsx` | `lib/data/chapters.ts` |
| `#contact` | `components/contact/ContactSection.tsx`, then `Footer.tsx` | inline copy |

`components/nav/Nav.tsx` is the header with plain anchor links to the sections; the wordmark is text.
Content lives in `lib/data/*.ts`: change copy there, not in components.

## Design tokens

Defined on `:root` in `app/globals.css`. Use the variables, never hard-coded colours.

- Background `--bg: #090f19`, surface `--surface: #111a28`, text `--text: #f2f5fb`,
  muted `--muted: #acb9cb`.
- Accents: `--accent: #bdb3ff` (violet), `--accent2: #76d9d3` (teal).
- Constellation clusters (`lib/data/skills.ts`): Software Engineering `#76d9d3`,
  Data Science `#aabdf7`, Cognitive Neuroscience `#c6b7ff`.
- A global `prefers-reduced-motion` rule disables animation; keep new motion compatible with it.

## Implementation notes

- Interactive components are client components (`"use client"`): `HeroArt`, `ProjectCarousel`,
  `ExpertiseCard`, `ExpertiseBackBody`, `Constellation`, `CopyEmail`.
- Content must stay readable without JavaScript (`hooks/useHydrated.ts`, `<noscript>` fallback
  in `components/skills/SkillsSection.tsx`). The constellation has a text list of skills next to the canvas.
- Accessibility is a requirement, not polish: keep the skip link, visible focus, `inert` on hidden
  card faces, focus management after a flip, and the axe checks in `tests/e2e/release.spec.ts`.
- Public asset URLs go through `assetUrl()` in `lib/assets.ts` (optional `NEXT_PUBLIC_BASE_PATH`).
- ESLint `react/no-unescaped-entities` is active: use `&apos;` for apostrophes in JSX text.
- Every `target="_blank"` link needs `rel="noopener noreferrer"`.
- A Content Security Policy meta tag in `app/layout.tsx` (production builds only) allows scripts,
  styles, images, fonts and requests from this site only. Anything loaded from another host
  (fonts, analytics, embeds, APIs) is blocked until the policy is updated on purpose.
- **Only deploy what the site uses.** Everything in `public/` is published. Design sources live in
  `docs/brand/`: logos in `logo/` (`npm run logos:rgb` converts the OKLCH originals to hex), the
  social preview source in `og/`, font subsetting notes in `fonts/`. Original v10 assets and TTF
  fonts are in `docs/design-handoff/`. Keep the OFL licence texts next to the WOFF2 fonts in
  `public/assets/fonts/`.

## Commands

```bash
npm ci                 # install exactly what package-lock.json says
npm run dev            # local dev server
npm run typecheck      # tsc --noEmit
npm run lint           # ESLint
npm run format         # Prettier: format everything (format:check only checks; CI runs it)
npm test               # Jest unit tests
npm run build          # static export to ./out
npm start              # serve ./out at http://127.0.0.1:4173
npm run test:e2e       # Playwright (needs: npx playwright install chromium firefox webkit)
npm run og             # rebuild public/og-image.png from docs/brand/og/og-image.svg
```

- **Don't run `npm run build` while `npm run dev` is running.** Both use `.next/`, and the dev
  server starts returning 404s.
- After real changes, run typecheck, lint and test, then review your own diff.

## Deployment

- GitHub Pages with the custom domain `develysverse.com` (`public/CNAME`, verified on GitHub).
- Every push to `main` builds and deploys (`.github/workflows/deploy.yml`).
- After changing the title, description or `docs/brand/og/og-image.svg` (then `npm run og`), run
  https://www.linkedin.com/post-inspector/ on the URL once deployed. LinkedIn's Featured section
  caches the OG data when a link is added: if the card is stale, delete the Featured entry and add it again.

## Working conventions

- **Never push, merge or deploy without Elisa's explicit approval.** Work on a branch and
  commit locally; Elisa pushes and merges.
- **No AI co-author trailers** (`Co-Authored-By: …`) in commits, and no AI-attribution line in PR descriptions.
- **The site title is "Software Engineer"** (changed from "Software Developer" on 25 Nov 2026), not "Frontend Engineer". The site tells a story;
  LinkedIn is for keyword matching. Keep the site's voice when pulling content from outside profiles.
- **Copy should sound confident and specific.** Avoid both abstract self-praise and bare facts;
  back confidence with a concrete comparison. When offering alternatives, range them from bolder to safer.
- Elisa may write in Italian; always reply in English.

## Security

- **This repository is public.** Never commit secrets, `.env` files, personal data beyond what the
  site already shows, or security findings. Security reviews and notes live outside the repo;
  commit messages and PR descriptions for security fixes stay neutral.
- A pre-commit hook (`.githooks/pre-commit`, switched on by `npm ci`) runs gitleaks, ESLint and
  Prettier on the staged files. Never bypass it with `--no-verify`; fix the finding instead.
- Before a commit, run the `aw-review` skill in `diff` mode; before a push or PR, in `branch`
  mode. It is installed per user (not part of this repo), reads project facts from `REVIEW.md`,
  and writes nothing into this repo.
- Workflows: keep permissions minimal per job, pin every action to a full commit SHA with a
  version comment, and never put `${{ github.event.* }}` inside `run:`.
- A new dependency needs a reason. Prefer a devDependency; check the exact package name and publisher.

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
