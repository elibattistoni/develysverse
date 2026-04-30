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

- Hosted on **GitHub Pages** via `.github/workflows/deploy.yml`
- Any push to `main` triggers build + deploy automatically
- Static export: `output: "export"` in `next.config.mjs`
- Base path: `/develysverse`

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
- `NEXT_PUBLIC_BASE_PATH=/develysverse` must be set in the GitHub Actions workflow env
- Nav uses `IntersectionObserver` to highlight the active section link
- All Framer Motion animations use `useInView` with `once: true` so they only fire once

## Career chapters (narrative content)

1. **The Origin** (2010–2015, Trento · Amsterdam) — BSc Cognitive Science, MSc Neuroscience, first EEG/eye-tracking experiments, co-authored first paper
2. **The Depth** (2015–2018, Rovereto) — PhD CIMeC, MEG brain decoding with ML, 4 publications
3. **The Bridge** (2018–2021, Milan) — Data Scientist at BTData + JAKALA, NLP, predictive models
4. **The Crossing** (2021–2023, Trento · Vienna) — Frontend + DS at BlueTensor, full pivot at bestbytes
5. **The Craft** (2024–now, Remote) — Software Developer at Namecheap (EasyWP team), open-source Raycast extensions, AI-assisted dev tooling

## Skills clusters (constellation)

- **The Brain** (fuchsia #e879f9): Neuroscience, Vision, Attention, MEG, EEG, Psychophysics, Matlab, R, Brain Decoding
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
