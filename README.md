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
immutable; new screenshots and traces go to `test-results/phase2/` and the HTML
report to `playwright-report/`. Port 4174 must be free; the normal preview can remain on port 4173.

## Design and implementation status

The definitive source is `docs/design-handoff/DESIGN_UX_SPECIFICATION.md`, followed
by the v10 prototype/CSS/script and `visual-references/`. The handoff is preserved
byte-for-byte. Phase one was reviewed and pushed as commit `17a9485` on
`redesign/v10-phase-1`. The local `redesign/v10-phase-2` branch adds the interactive
Hero and Selected Projects; Expertise, Constellation, Journey and Contact bodies
remain for subsequent phases. See `docs/implementation/phase-2.md` for validation,
limitations and the review checklist.

GitHub Pages configuration and `public/CNAME` are retained. A push to `main`
triggers deployment; do not push, merge or deploy without Elisa’s separate approval.
