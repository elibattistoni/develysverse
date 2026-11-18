# Develysverse — Phase 5: Journey, Contact and footer

18 November 2026. Implemented locally; stopped before phase six for review.

## Checkpoints and scope

Phase four was approved and saved locally as `06796ed` on
`redesign/v10-phase-4`, including removal of both constellation discipline notes.
The phase-five work is uncommitted on `redesign/v10-phase-5`, in the same dedicated
worktree. Main remains unchanged. Only phase one has been pushed; there was no
push, merge, deployment, pull request or Linear access in this phase.

The original v10 handoff remains immutable. The owner-approved constellation
amendment still applies. New captures are saved outside `visual-references/`.

## Implementation

- Replaced the Journey heading shell and legacy timeline with five chronological,
  server-rendered native `details/summary` disclosures. The Present is open on
  first load; any number of chapters can be open independently, including with
  JavaScript disabled. Native keyboard behavior and focus are preserved.
- Retained approved dates, headings, organizations, complete copy, separate Present
  paragraphs and tags in typed chapter data. Reused all five original Journey SVG
  geometries as scoped JSX, preserving stroke widths, theme colors and gradients.
- Matched the vertical spine, teal outlined/filled dots, border and chevron
  transitions, 180ms body entrance, desktop illustration column and mobile visual
  placement. No height animation, scroll reveal, auto-scroll or exclusive accordion.
- Integrated the v10 Contact layout with the exact approved copy, ambient gradient,
  single primary Copy email action and GitHub/LinkedIn links. Preserved 13fr/7fr
  desktop columns, the 800px stacking breakpoint, spacing and text-link styles.
- Isolated clipboard enhancement in a small client component. It copies only on
  explicit activation, guards duplicate pending writes, announces success through
  `role=status`, retains the 146px button width and clears success after 2500ms.
  Denied/missing Clipboard shows a selectable address and manual instruction;
  subsequent successful copying hides the fallback. No-JavaScript HTML exposes
  the address and hides the inactive button. Timers are cleaned up on unmount and
  pending completions do not update an unmounted component.
- Added the original copyright and Back to top link in a server-rendered footer.
- Removed the unused legacy email modal, star field and section label, and the last
  Framer Motion dependency plus its two transitive packages. No package or asset
  was added; existing pinned toolchain versions are retained.

## Acceptance and verification

Journey must match the approved default and multiple-open states, preserve all
five chapter bodies/illustrations, respond to pointer/keyboard/touch, show teal
state dots, retain focus and remain usable without JavaScript.

Contact must match default/copied/fallback states, preserve link destinations,
copy the exact address only on activation, announce feedback, reset after 2.5s
without button-width changes and offer manual copying when unavailable. Footer
must preserve the copyright, wrapping, link/focus treatment and top anchor.

| Check | Result |
|---|---|
| Production build / static export | PASS |
| TypeScript 7 and ESLint | PASS |
| Jest | PASS — 2 tests / 2 suites |
| Complete browser regression suite | **192 passed in 66.2s**, no skips, failures or flaky tests |
| Journey / Contact / footer screenshots | **42 comparisons passed** across Chromium, Firefox and WebKit |
| Immutable handoff and source assets | **92 original hashes match**, no reference changes |
| Git whitespace check | PASS |
| Existing local preview | Final export served at port 4173 |

Layout and copy were compared with the live v10 reference at
320/390/520/800/801/900/1060/1061/1440px. The screenshot comparison covers
Journey default, multiple-open and all-open; Contact default, copied and fallback;
and footer, at 390px and 1440px in all three engines. Maximum changed-pixel ratio
beyond 8/255 per channel was **0.0000%**, below the 0.2% gate.

The approved historical screenshots were also inspected alongside live v10 and
the implementation. Browser/font rasterization differences documented in phase
one still apply; they can also affect historical line wrapping. Comparison panels
keep original PNG dimensions and pad the panes rather than resizing references.
No approved screenshot or original asset was regenerated or changed.

Functional checks cover keyboard/pointer/touch disclosures, independent open
state and initial Present, exact chapter copy, state-dot colors and focus,
normal/reduced motion, exact 2500ms clipboard feedback and repeated activation,
slow/denied/missing clipboard, recovery, real Chromium clipboard readback, no-JS
manual copying and disclosures, external-link attributes and footer navigation.
Earlier-section regression tests also pass.

Evidence in this review folder: [browser results](browser-results.json),
[log](browser-tests.log), [visual metrics](visual-comparison-results.json).
Inspect [desktop Journey](1440-journey-present-comparison.png),
[mobile Journey](390-journey-multiple-open-comparison.png),
[desktop Contact](1440-contact-default-comparison.png),
[mobile Contact](390-contact-default-comparison.png),
[manual fallback](390-contact-fallback-comparison.png) and [footer](1440-footer.png).

## Review checklist

Refresh `http://127.0.0.1:4173/` and check desktop and a narrow window:

1. Open Journey: only The Present starts open. Open Origin and another chapter;
   existing open chapters should stay open. Close them independently. Check the
   teal dots, paragraph spacing, tags and illustrations.
2. Use Tab, Enter and Space on Journey headers. Focus should stay visible on the
   header you activate. On mobile the illustration sits below its text.
3. Click Copy email, paste into an empty local text field and verify
   `elisa.battistoni.dev@gmail.com`. The label should show Email copied for 2.5s,
   then return to Copy email, without changing width.
4. Check GitHub/LinkedIn destinations and Back to top. Resize: Contact should stack
   below 801px and the page should not overflow horizontally.

Denied/missing clipboard, no JavaScript and exact timer behavior are covered by
automated tests; you do not need to disable browser features for routine review.

## Remaining work

Phase six is the final release QA: real Safari/mobile hardware and screen-reader
checks, zoom/accessibility audit, performance and production metadata review.
Browser engines and touch emulation here do not replace those checks. Previously
recorded development-tool peer/audit advisories are not claimed resolved by this
phase. The original v10-to-current font rasterization differences remain a known
historical screenshot limitation; source assets and reference images are intact.
