# Develysverse — Phase 4: Skills Constellation

18 November 2026. Completed locally; stopped before phase 5 for review.

## Checkpoints

Elisa approved phase three. Its local checkpoint is `0dd34e4` on
`redesign/v10-phase-3`. Phase two remains `d495e4e`. Neither was pushed; the only
pushed round remains phase one (`17a9485`, `redesign/v10-phase-1`).

Phase four is uncommitted on local branch `redesign/v10-phase-4`, in the dedicated
redesign worktree.
No push, merge, deployment, PR or Linear access. Main is unchanged.

## Implementation

- Replaced the old WebGL constellation with the approved Canvas 2D projection,
  nested beneath Expertise. Retained all 18 node labels/coordinates, three cluster
  centers/colors, 31 connections, depth ordering, label-placement/collision
  algorithm, line styles, type and halos from v10.
- Extracted typed data and a separate renderer/view reducer; React handles the
  filter/control UI and accessibility, while the renderer handles pixels.
- Preserved All disciplines and three filters with pressed state. Descriptive
  notes below the graph were removed after Elisa’s explicit review request; see
  `docs/implementation/design-amendments.md`.
- Mouse drag and equivalent controls/keyboard: arrow keys rotate, +/− zoom, Home
  resets the view. Zoom is clamped to .72–1.4; initial yaw/pitch are −.12/.07.
  Reset preserves the selected discipline, as v10 does.
- Retained the narrow vertical layout and compact overview behavior at the
  renderer’s actual 550/380px canvas thresholds, and the original CSS breakpoints.
- Touch rotates horizontally after the original directional threshold and retains
  native vertical page scrolling. Pointer release/cancel ends dragging.
- Draws only on initial setup, input, resize or font availability; one pending
  requestAnimationFrame is coalesced. DPR is capped at two. Observers, font/resize
  listeners and pending frames are cleaned up on unmount. No autorotation, inertia,
  continuous animation, wheel zoom or new visual effects were added.
- Added the complete server-rendered accessible text alternative using the same
  approved labels, grouped by discipline. It stays visually hidden with a working
  canvas; becomes visible when JavaScript is disabled or context creation returns
  null/throws. Nonfunctional controls/help/canvas are hidden in those fallbacks.
  This fulfills the handoff’s text-alternative requirement without changing the
  working-canvas composition or inventing skill copy.
- Removed unused `three` and `@types/three` dependencies and their now-unneeded
  transitive packages after replacing the last Three.js import. No new package or
  asset was added; remaining dependency versions and the static-export setup stay.

## Verification

| Check | Result |
|---|---|
| Production build/static export | PASS |
| TypeScript 7 | PASS |
| ESLint | PASS |
| Jest | PASS, 2 tests in 2 suites |
| Browser regression suite | **146 passed**, no failures/skips/flaky tests |
| Immutable handoff | All **92 hashes** verified, references unchanged |
| Git diff whitespace | PASS |

Constellation tests cover 320/390/415/416/585/586/800/801/900/1440px in Chromium,
Firefox and WebKit. The comparison loads fonts and performs a font-ready resize
at the requested viewport so the original prototype also redraws with its fonts,
rather than comparing against an incidental fallback-font frame.

Across the viewport/filter/rotated states, raw canvas RGBA hashes match the v10
reference rendered in the same engine. Eighteen full-map screenshot comparisons
at 390×1000 and 1440×1000 (All/Neuroscience/rotated, three engines) have **zero
pixels beyond an 8/255 per-channel difference threshold**. Approved historical PNGs
were also inspected side by side; the browser/OS font and scrollbar differences
recorded in phase one still apply. No historical PNG was resized or overwritten.

Functional checks exercise filters/pressed state, keyboard/button equivalence,
zoom clamps, reset behavior, keyboard focus, mouse dragging/release, idle redraw
count, DPR 3→2 cap, resizing, and full text fallbacks for no JavaScript, null Canvas
and blocked/throwing Canvas. A native-touch Chromium simulation confirms horizontal
rotation and vertical page scrolling, with no page overflow. The existing Hero,
Projects and Expertise regressions still pass.

New captures/traces are under `test-results/phase4/`; this folder contains a review
copy and machine-readable evidence. The handoff capture script was never run.

## Review checklist

Refresh the local preview and scroll below Expertise:
1. Inspect the initial map and switch among all four filters. Only one should be
   selected; no discipline should show descriptive text below the graph.
2. Drag to rotate. Try left/right, −/+, Reset; Reset should retain the filter.
3. Tab onto the canvas: keyboard instructions/focus appear. Use arrow keys, +/−,
   then Home. Normal page scrolling should work outside the focused canvas.
4. On a narrow/touch viewport, inspect the vertical clusters, swipe horizontally
   to rotate and vertically to scroll the page. No horizontal page overflow.

## Remaining work and limitations

Journey, Contact and footer are next (phase 5), then final integrated QA (phase 6).
Real mobile hardware/Safari, screen-reader QA, a full WCAG audit and Core Web Vitals
measurements remain for that final verification. Touch here is browser emulation.
Earlier development-tool peer/audit advisories are not claimed resolved by this
phase; only the unused Three.js dependency tree was removed.

## Review amendment

Elisa confirmed that the other phase-four checks pass and requested removal of
the two descriptive notes. The note element, data and spacing have been removed.
The immutable v10 handoff is unchanged; the explicit override is recorded in
`design-amendments.md`. Original full-suite results above predate this small
follow-up; the focused follow-up results are recorded below.

Follow-up verification after note removal:

- Production build/static export, TypeScript and ESLint: PASS.
- Focused constellation and touch regressions: **47 passed in 21.1s**, with no
  failures, skips or flaky tests, across Chromium, Firefox, WebKit and touch Chromium.
- All four filters assert absence of both notes and the paragraph below Canvas,
  while preserving pressed state and all 18 accessible labels.
- Desktop and mobile screenshots of Software Engineering and Data Science were
  visually inspected; both notes and their reserved spacing are absent.
- Refreshed preview at `http://127.0.0.1:4173/` verified.
- All 92 immutable handoff hashes still match; Git diff whitespace check passes.
- Separate follow-up browser results, log and four filtered captures accompany
  this report. The earlier full-suite evidence is retained unchanged.
