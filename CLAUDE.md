# develysverse — Project Brief for Claude Code

## What this project is

Personal portfolio website for Elisa Battistoni — a frontend developer with a PhD in
Cognitive Neuroscience. The site tells her story as a cinematic, scroll-driven narrative.

## The core tagline

> "I studied how brains see. Now I build what they look at."

## Tech stack

- **Next.js 14** (App Router, static export for GitHub Pages)
- **TypeScript**
- **Tailwind CSS**
- **Framer Motion** — scroll-reveal animations, section transitions
- **Three.js** — skills constellation (3D interactive globe) and hero particle field
- **Cormorant Garamond + Inter** — display serif + clean sans pairing

## Deployment

- Hosted on **GitHub Pages** at `https://develysverse.com` (custom domain via Namecheap; CNAME file at `public/CNAME`)
- Any push to `main` triggers build + deploy automatically
- Static export: `output: "export"` in `next.config.mjs`
- Site serves at root (no base path); the legacy `elibattistoni.github.io/develysverse/` URL auto-redirects to the custom domain

## Design language

- Dark palette: background `#080012`, surface `#0a0016`
- Purple accent scale: `#7c3aed` (deep) → `#9333ea` (core) → `#c084fc` (bright)
- Minimal, cinematic, editorial — no gradients on surfaces, no heavy shadows
- Section labels: 10px, 0.3em letter-spacing, uppercase, purple
- Display headings: Cormorant Garamond Light/300
- Body: Inter Regular

## Site structure (single scroll page)

```
/ (page.tsx)
├── #hero      — Typewriter tagline + particle field (Three.js canvas)
├── #story     — Interactive 5-chapter career timeline
├── #skills    — 3D skills constellation (Three.js, draggable)
└── #contact   — Links + closing statement
```

## File structure

```
develysverse/
├── app/
│   ├── globals.css
│   ├── layout.tsx          (Inter + Cormorant Garamond fonts, metadata)
│   └── page.tsx
├── components/
│   ├── contact/ContactSection.tsx
│   ├── hero/
│   │   ├── HeroSection.tsx
│   │   ├── ParticleField.tsx   (client-only, dynamic import)
│   │   └── useTypewriter.ts
│   ├── nav/Nav.tsx             (fixed, IntersectionObserver active state)
│   ├── skills/
│   │   ├── Constellation.tsx   (client-only, dynamic import)
│   │   └── SkillsSection.tsx
│   ├── timeline/
│   │   ├── ChapterCard.tsx
│   │   └── TimelineSection.tsx
│   └── ui/SectionLabel.tsx
├── lib/data/
│   ├── chapters.ts         (5 career chapters, typed)
│   └── skills.ts           (24 skills, 3 clusters)
├── public/logo/
│   ├── original/           (source SVGs from designer — use OKLCH; Affinity can't render them)
│   ├── original-rgb/       (originals with OKLCH→hex via `npm run logos:rgb` — print/edit in any tool; *-on-dark.svg variants have site bg)
│   └── muted/              (site-palette versions used in nav + footer; smaller, no embedded font)
├── jest.config.ts
├── jest.setup.ts
├── next.config.mjs
├── postcss.config.mjs
├── tailwind.config.ts
└── .github/workflows/deploy.yml
```

## Key implementation notes

- `ParticleField` and `Constellation` must use `dynamic(() => import(...), { ssr: false })`
  because they use browser APIs (canvas, WebGL, ResizeObserver)
- Three.js is used directly (not @react-three/fiber) — import as `import * as THREE from "three"`
- The constellation uses a 2D canvas overlay for crisp text labels on top of the WebGL canvas
- Nav uses `IntersectionObserver` to highlight the active section link
- All Framer Motion animations use `useInView` with `once: true` so they only fire once

## Career chapters (narrative content)

1. **The Origin** (2010–2015, Trento · Amsterdam) — BSc Cognitive Science, MSc Neuroscience, first EEG/eye-tracking experiments, co-authored first paper
2. **The Depth** (2015–2018, Rovereto) — PhD CIMeC, MEG brain decoding with ML, 4 publications
3. **The Bridge** (2018–2021, Milan) — Data Scientist at BTData + JAKALA, NLP, predictive models
4. **The Crossing** (2021–2023, Trento · Vienna) — Frontend + DS at BlueTensor, full pivot at bestbytes
5. **The Craft** (2024–now, Remote) — Software Developer at Namecheap (EasyWP team), open-source Raycast extensions, AI-assisted dev tooling

## Skills clusters (constellation)

- **Cognitive Neuroscience** (fuchsia #e879f9): Neuroscience, Vision, Attention, MEG, EEG, Psychophysics, Matlab, R, Brain Decoding
- **Data Science** (indigo #818cf8): Machine Learning, Deep Learning, Statistical Models, NLP, Results Display, Python
- **Software Development** (cyan #67e8f9): JavaScript, TypeScript, React, Next.js, CSS, Mantine, Testing, Optimization, Open Source

## Commands

```bash
npm run dev      # local dev
npm test         # jest
npm run build    # static export to ./out
git push origin main  # triggers deploy
```

## Setup notes

- Next.js 14.2 does not support `next.config.ts` — use `next.config.mjs` instead
- Jest config uses `setupFilesAfterEnv` (not `setupFilesAfterFramework`)
- Test script uses `--passWithNoTests` since no test files exist yet
- ESLint `react/no-unescaped-entities` is active — use `&apos;` for apostrophes in JSX text

## Open points

Moved here from machine-local Claude memory so they survive a fresh clone.

### Logo typography mismatch

The logo colors in `public/logo/muted/` match the site palette, but the wordmark
doesn't match the site's type. The embedded Space Grotesk was stripped and the
font set to `Inter, sans-serif`. Because `Nav.tsx` and `ContactSection.tsx` load
the logo through `<img>`, the SVG can't use the page's fonts. So it falls back to
the browser's default sans (Helvetica/Arial), while headings use Cormorant
Garamond serif. Shipped as-is on purpose; revisit later. Two ways to fix it:

1. **Inline the SVG in JSX** (recommended, small refactor). Use the SVG markup
   directly, or a React component, so the wordmark picks up the page's loaded fonts.
2. **Re-export the logos with the right typeface.** This is a designer step: they
   redo the wordmark in Cormorant Garamond. It needs no code change.

Minor items from the same review:
- The footer text "PhD · Cognitive Neuroscience · Software Developer" is 14px
  next to a 100px logo, so the logo dominates. Elisa chose these proportions
  explicitly, so only revisit them if she asks.
- The logo's orbital "e·b" mark shares its look with the Skills constellation.
  If the constellation is re-tuned, keep the two in sync.

### OG image + LinkedIn Featured cache

- The 1200×630 OG card is `public/og-image.png`, generated from
  `public/og-image.svg` by `scripts/og-build.mjs` (uses `sharp`). Run
  `npm run og` after editing the SVG and commit the PNG. The meta tags are in
  `app/layout.tsx`.
- Update flow: edit the SVG → `npm run og` → commit → push → run
  https://www.linkedin.com/post-inspector/ on the URL.
- LinkedIn's **Featured section caches the OG data when a link is added**, and
  updating the site does not refresh it. If the Featured card shows the old
  image or none, delete the Featured entry and add it again.

## Working conventions

Moved here from machine-local Claude memory.

- **Don't push to `main`.** A push triggers a deploy. Commit locally and let
  Elisa push.
- **No `Co-Authored-By: Claude` trailer** on commits.
- **After real changes, run** `npx tsc --noEmit`, `npm run lint` and `npm test`,
  then self-review the diff.
- **Don't run `npm run build` while `npm run dev` is running.** It overwrites
  `.next/` and the dev server starts returning 404s.
- **The site title stays "Software Developer"**, not "Frontend Engineer". The
  site tells a story; LinkedIn is for keyword matching. Keep the site's voice
  when pulling content from outside profiles.
- **Copy should sound confident and specific.** When softening copy, avoid both
  abstract self-praise and bare facts; back confidence with a concrete
  comparison. When offering alternatives, range them from bolder to safer.
- Elisa may write in Italian; always reply in English.
