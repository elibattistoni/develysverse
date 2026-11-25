# REVIEW.md

<!--
Project context for the aw-review skill (installed per user, not part of this repo).
Facts about the project only: no secrets and no list of known weaknesses (this repo is public).
Findings belong in the review reports, which are written outside the repo.
-->

## Project

- **Stack:** Next.js 16 (App Router), React 19, TypeScript, CSS Modules. Static export (`output: "export"`).
- **Hosting:** GitHub Pages, custom domain `develysverse.com` (`public/CNAME`). Every push to `main` deploys.
- **Visibility:** public.
- **Backend / API routes / AI features:** none.

## Must stay true

- The site is a static export: `output: "export"` stays in `next.config.mjs`, and there is no server code.
- Only 3 runtime dependencies: `next`, `react`, `react-dom`. Exact versions, no `^` or `~`.
- The Content Security Policy meta tag in `app/layout.tsx` allows scripts, styles, images, fonts and
  requests from this site only. Anything from another host needs a deliberate policy change.
- Every `target="_blank"` link has `rel="noopener noreferrer"`.
- Workflows: minimal `permissions` per job; `pages: write` and `id-token: write` only in the deploy job,
  and that job runs no npm code. Every `uses:` is pinned to a full commit SHA with a version comment.
  No `${{ github.event.* }}` or `${{ github.head_ref }}` inside `run:`. `actions/checkout` uses
  `persist-credentials: false` when no later step pushes.

## Extra checks

- Everything in `public/` is published as-is, linked or not. New files there must be used by the site;
  design sources belong in `docs/brand/`. Check images for EXIF data and screenshots for personal data.
- `NEXT_PUBLIC_*` variables ship to every visitor. A name with `KEY`, `SECRET` or `TOKEN` is a red flag.
- `public/CNAME` changes affect the live domain.
- Agent instructions (`AGENTS.md`, `CLAUDE.md`, `.agents/`, `.claude/`): flag anything that tells an
  agent to push, merge, deploy, skip checks or disable hooks, and new hooks that run commands.

## Ignore

- `.next/`, `out/`: local build output, never committed (gitleaks flags the Next.js preview-mode keys in `.next/`).
- `node_modules/`: dependencies; audited through the lockfile instead.
- `test-results/`, `playwright-report/`: local Playwright output, gitignored.

## Accepted risks

- None.
