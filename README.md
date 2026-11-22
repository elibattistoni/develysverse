# develysverse

Elisa Battistoni’s portfolio. Next.js App Router, TypeScript and static export for GitHub Pages.

## Development

Use Node **26.13.1** (`.nvmrc` / `.node-version`) and npm **12.2.3**.
With nvm: `nvm install && nvm use`, then `npm install --global npm@12.2.3`.

```sh
npm ci
npm run dev
```

`npm ci` also switches on the pre-commit hook in `.githooks/`: before each commit it
scans the staged files for secrets (gitleaks, `brew install gitleaks`) and runs ESLint on them.

TypeScript 7 provides the `tsc` CLI through `@typescript/native`. The `typescript`
alias supplies Microsoft’s TypeScript 6 compatibility API for ESLint/Next/Jest.
This follows Microsoft’s TypeScript 7 compatibility setup.

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

The tests serve `out/` and the retained v10 prototype at `/__reference/` on
port 4174. Keep the baseline files read-only. New screenshots and traces go to
`test-results/revision-2026-11-20/`, and the HTML report goes to
`playwright-report/revision-2026-11-20/`. The normal preview can run on port 4173.

## Design references

Use the [current design specification](docs/design-handoff/2026-11-20/DESIGN_UX_SPECIFICATION.md)
and the [approved implementation decisions](docs/implementation/design-amendments.md).
The [design references](docs/design-handoff/README.md) describe the prototype,
test fixtures, and the source PNGs used to regenerate the Journey and project
images. Historical reports and review screenshots are archived separately.

GitHub Pages configuration and `public/CNAME` are retained. A push to `main`
triggers deployment; do not push, merge or deploy without Elisa’s separate approval.

## Font delivery

The original v10 TTFs, CSS and OFL licenses remain unchanged in `public/assets/fonts`.
Production uses lossless WOFF2 derivatives via `fonts-woff2.css`; no glyphs are
subsetted. `woff2-manifest.json` records source/output hashes and verification.
All derivatives are checked in. The production build uses them directly.
