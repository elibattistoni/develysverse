# develysverse

Elisa Battistoni’s portfolio. Next.js App Router, TypeScript and static export for GitHub Pages.

## Development

Use Node **26.13.1** (`.nvmrc` / `.node-version`) and npm **12.2.3**.
With nvm: `nvm install && nvm use`, then `npm install --global npm@12.2.3`.

```sh
npm ci
npm run dev
```

TypeScript 7 provides the `tsc` CLI through `@typescript/native`. The `typescript`
alias supplies Microsoft’s TypeScript 6 compatibility API for ESLint/Next/Jest.
This is intentional; see the phase-one report for the official migration source.

## Checks and static preview

```sh
npm run typecheck
npm run lint
npm test -- --runInBand
npm run build
npm start
```

Preview: http://127.0.0.1:4173. Stop `npm run dev` before building: both use `.next/`.

## Browser QA

```sh
npx playwright install chromium firefox webkit
npm run test:e2e
```

The tests serve `out/` and a read-only reference URL on port 4174. They never run
`docs/design-handoff/verification/capture-and-check.cjs`. Approved references are
immutable; new screenshots and traces go to `test-results/revision-2026-11-20/` and the HTML
report to `playwright-report/revision-2026-11-20/`. Port 4174 must be free; the normal preview can remain on port 4173.

## Design and implementation status

Use the [20 November revision](docs/design-handoff/2026-11-20/DESIGN_UX_SPECIFICATION.md)
for the current design and the [v10 handoff](docs/design-handoff/README.md) for the
original baseline. The original v10 files are preserved byte-for-byte. Phase one was pushed as `17a9485` on `redesign/v10-phase-1`.
Phase two (Hero/Projects), phase three (Expertise/publications) and phase four
(Skills Constellation) were reviewed and committed locally as `d495e4e`, `0dd34e4`
and `06796ed`. Phase five (Journey/Contact/footer) was reviewed and committed
locally as `09d9f00`. The `redesign/v10-phase-6` branch contains final automated
QA, lossless WOFF2 font derivatives, loading/metadata/accessibility fixes and the
owner-requested equal mobile project-card heights. Native Safari/real-device and
screen-reader checks remain release gates. See `docs/implementation/phase-6.md`.

Explicit owner changes to v10 are in `docs/implementation/design-amendments.md`.

GitHub Pages configuration and `public/CNAME` are retained. A push to `main`
triggers deployment; do not push, merge or deploy without Elisa’s separate approval.

## Font delivery

The original v10 TTFs, CSS and OFL licenses remain unchanged in `public/assets/fonts`.
Production uses lossless WOFF2 derivatives via `fonts-woff2.css`; no glyphs are
subsetted. `woff2-manifest.json` records source/output hashes and verification.
All derivatives are checked in, so normal install/build needs no font-conversion
runtime or extra service. The phase-six report records regeneration tooling.
