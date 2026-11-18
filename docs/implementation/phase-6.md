# Develysverse — Phase 6 automated QA and review findings

18 November 2026. Local implementation and automated QA complete. **Release gates
remain open** for native Safari, real mobile devices, actual screen-reader testing
and mobile loading performance. This report is not a WCAG certification or a
production Core Web Vitals pass.

## Checkpoints and authorization

Elisa accepted phase five; it is saved locally as `09d9f00` on
`redesign/v10-phase-5`. This reviewed round is authorized for commit and push on `redesign/v10-phase-6` in the
same dedicated worktree. Main remains at `45acb76`. Phase one was pushed earlier; Elisa subsequently authorized pushing this reviewed
round to its feature branch. No merge, deployment, pull request or Linear access
is authorized by that approval.

Elisa confirmed that her mobile checks used a resized desktop browser, not a real
phone. She explicitly approved the isolated headless Chromium/Firefox/WebKit tests
and headless Chrome Lighthouse measurements. Her standing requirement to explain
and obtain approval before controlling external apps was saved separately in global
Codex guidance; existing OS permissions do not replace that approval.

## Changes and regression correction

- Fixed the reported mobile Color Picker card height: v10 used `align-self: start`,
  leaving that card shorter. It now stretches to the shared carousel row height
  through 800px. Card widths, copy, images and desktop compact layout are retained.
  The owner-approved override is in `design-amendments.md`; reference files remain
  unchanged. Comparison tests apply this exact amendment only to the live reference
  page in the browser, never to the packaged HTML/CSS/PNGs.
- Added pinned development-only `axe-core` 4.14.1 and reusable release checks for
  overview/expanded/error states, reflow, 200% text enlargement, browser accessibility
  tree structure and static metadata/delivery.
- Corrected Expertise back-button accessible names to begin with the visible phrase
  “Back to overview”, followed by the discipline. This fixes the detected
  label/content mismatch for speech users without changing visible text or layout.
  Removed an unused/undefined CSS-module token from the same button.
- Added the canonical production URL. Existing OG image, icon and their branding
  remain intact: the handoff does not approve new social/favicon artwork. Title and
  description retain the approved Software Developer positioning.
- Added full-character-set, losslessly compressed WOFF2 derivatives of all nine
  original fonts, with original TTFs/CSS/licenses retained unchanged. Total source
  bytes: **1,823,024 → 634,160**, a **65.2%** reduction. No glyph subsetting. FontTools
  4.60.2/Brotli 1.2.1 were used in a task-only environment; no new production runtime
  or service is required. The manifest records source/output hashes; all font tables
  except reconstructed head/glyf/loca were compared, with every glyph program and
  glyph order also checked individually. The output helper records regeneration.
- Prioritized the initially frontmost Software Engineering Hero image for loading.
  No image recompression, replacement, layout redesign or copy rewrite.

## Verification results

| Check | Result |
|---|---|
| Production build / static export | PASS |
| TypeScript 7 / ESLint | PASS |
| Jest | 2 tests in 2 suites PASS |
| Full browser suite | **222 passed in 76.3s**, no failures/skips/flaky tests |
| Live-v10 visual regression gates | **87 passed**; max changed-pixel fraction 0.0630% beyond 8/255 per channel, within 0.2% gate |
| Axe WCAG A/AA and best-practice checks | **36 page states, zero detected violations** |
| Mobile project heights / last-link alignment | PASS at 320/390/520/800px in Chromium, Firefox and WebKit |
| Desktop compact contribution card | Retained at 900px; v10 visual comparisons PASS |
| Reflow | PASS at 320/640/720 CSS px with expanded content |
| Text-only enlargement analogue | PASS at 200% font sizes in a fixed 720px viewport |
| Accessibility structure | Native Chromium AX tree excludes inert face; complete 18-skill alternative exposed; focus return PASS |
| Metadata | Canonical/title/description/language/viewport/OG/icon/CNAME checks PASS |
| Immutable handoff | All **92 original hashes match** |
| Current direct dependencies | `npm outdated --json` returned an empty object |
| Runtime dependency audit | **0 vulnerabilities reported** |
| Full dependency audit | **18 moderate development-tool findings**, no high/critical findings |
| Whitespace / local preview | PASS; current export served on port 4173 |

Coverage includes prior Hero/Projects, Expertise/papers, constellation and
Journey/Contact regressions, six link destinations, clipboard success/failure,
no-JS/Canvas fallbacks, touch emulation, reduced motion and document overflow.
Visual checks retain the historical font/browser limitation documented in phase
one; they compare the live v10 source in the same browser with approved amendments.

The new mobile-card captures were visually inspected. First and contribution
cards have equal outer heights and bottom link alignment; the contribution card
keeps its original smaller title/type spacing and asset.

## Accessibility limits and manual review

The 36 axe scans cover initial, all Expertise/Journey expanded and copy-fallback
states at 320/390/900/1440px in three engines. No rule was disabled to hide a
violation. The corrected back-button label now passes the detected label-in-name
rule. Some rules remain **incomplete**, including contrast over image/gradient
backgrounds and contextual ARIA/label decisions; these require human review.
The detailed axe evidence includes every incomplete result.

The 200% check doubles computed font sizes; reflow uses narrower CSS viewports.
These are useful automation, not proof of real browser zoom, iOS/Android behavior
or assistive-technology usability. The Chromium native accessibility tree check is
not an actual screen-reader session. Native Safari control timed out and the
native-control tool later became unavailable; no actual Safari/VoiceOver pass is
claimed. User permissions were not diagnosed as denied.

## Local performance measurements — release follow-up required

Lighthouse 13.6.0 ran locally with isolated Chrome 157 profiles. Three mobile runs
use Lighthouse's simulated mobile network/CPU preset. Desktop uses the official
desktop configuration at 1440×1000. These are local lab measurements, with no
production field data and no measured field INP. The static preview deliberately
serves uncompressed, no-store responses; real hosting/cache behavior will differ.

| Metric | Mobile median (3 runs) | Desktop |
|---|---:|---:|
| Performance score | 72/100 | 96/100 |
| Largest Contentful Paint | 7.86s | 1.42s |
| Total Blocking Time | 5.5ms | 0.0ms |
| Cumulative Layout Shift | 0.119 | 0.002 |
| Automated accessibility / best practices / SEO | 100 / 100 / 100 | 100 / 100 / 100 |

**Mobile performance is not signed off.** Lossless font compression reduces the
font transfer footprint and local median LCP improved from the recorded initial
~12.68s to ~7.86s, but it remains slow under throttling; measured CLS is also
~0.119. These scores must not be presented as a production Core Web Vitals pass.
Remaining opportunities include font-loading/layout stability, framework delivery
and correctly compressed hosting responses. Image-size recommendations remain
unapplied to preserve the exact approved images. No new analytics, external fonts,
remote services or visual replacements were introduced for a score.

Initial/before and final Lighthouse JSONs are retained separately. A later run
while the preview process was stopped produced a Chrome error page; those invalid
measurements were replaced by valid final runs after restoring the preview. The
final reported runs completed after the regression suite, without competing test
workers. The initial baseline is indicative rather than a controlled production
benchmark; the byte reduction is directly verified.

## Dependency and release gates

The 18 moderate findings are in Jest's development-only glob/minimatch chain.
The registry's proposed fix downgrades Jest to 29.7.0; it was not applied because
Elisa requested current stable libraries. No force overrides were introduced.
Existing ESLint plugin peer-range warnings remain documented. The production-only
audit reports zero findings. GitHub Actions/Linux CI has not run remotely.

Before deployment, the open checks are:

1. Resolve/reassess throttled mobile loading and layout-shift results on an
   approved preview with representative hosting and a defined performance budget.
2. Native Safari, actual iPhone/iPad and Android checks, including responsive
   carousel, Hero selection, flips, publications, touch scrolling and clipboard.
3. Actual screen-reader navigation/announcements, real 200%/400% browser zoom,
   contrast/manual WCAG review and keyboard usability across engines.
4. Owner review of the retained pre-redesign OG/favicon artwork if it should be
   redesigned; no new artwork is assumed approved.
5. Separate authorization for push/merge/deployment, followed by real-host checks
   and eventual field performance data. Source third-party rights and future
   external destination availability retain the handoff's limitations.

## Review evidence

- [Equal-height first project card](390-project-card-1-equal-height.png)
- [Equal-height Color Picker contribution](390-project-card-3-equal-height.png)
- [Complete browser results](browser-results.json), [log](browser-tests.log)
- [Visual comparison metrics](visual-comparison-results.json)
- [Axe results, including incomplete checks](axe-results.json)
- [Lighthouse summary](lighthouse-summary.json)
- [Font provenance and hashes](woff2-manifest.json)

Refresh http://127.0.0.1:4173/#projects and swipe to the third card in a narrow
window. Its outer bottom edge should now align with the first two cards. The reviewed round is being committed and pushed to its feature branch only;
no merge or deployment is included.

## Scope clarification before publishing the branch

Elisa clarified that “proceed” meant commit and push the reviewed round. Later
common-text font subsetting, temporary fallback metrics and hosting-profile
experiments were parked outside the repository and excluded from this commit.
The previously reviewed, fully tested font delivery is retained. The 222-test
evidence above applies to this reviewed implementation; the later probes are not
release requirements or part of the pushed source.
