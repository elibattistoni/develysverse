# Develysverse — Phase 3: Expertise and publications

18 November 2026. Completed locally; stopped before phase 4 for review.

## Checkpoints and scope

Elisa reviewed phase two and confirmed the appearance and working buttons. Its
local checkpoint is `d495e4e` on `redesign/v10-phase-2`. It was **not pushed**.
Phase one remains the only pushed round, commit `17a9485` on
`redesign/v10-phase-1`. No changes to main, merge, deployment, PR or Linear access.

Phase three is uncommitted on local branch `redesign/v10-phase-3`, in the dedicated
redesign worktree.
The definitive v10 design, copy, icon paths, responsive rules and animation
values are preserved. The handoff and all 92 checksums remain unchanged.

## Implementation

- Added the three independent Expertise flip cards, using typed data and a shared
  card component. Desktop uses the 1.12fr/1fr/1fr grid, 24px gaps and 400px minimum
  height; mobile uses one column and natural card heights.
- Preserved the Primary focus label/gradient, exact descriptions, SVG icons with
  stroke 1.4 and 32px sizing, detail groups and spacing. Technologies appear only
  on the reverse faces.
- All four approved publications are server-rendered in the Neuroscience card,
  with exact titles/DOIs, external-arrow SVG, target and rel attributes. No dates
  or claims that all papers belong to the PhD were added.
- Flip uses the original 480ms cubic-bezier animation, perspective and hidden back
  faces. The inactive face is inert. State and focus are coordinated after DOM
  updates: opening focuses the reverse heading, closing restores the trigger,
  and opening Neuroscience resets the publication body to the top.
- Neuroscience keeps its heading and Back action fixed on desktop. Only its body
  scrolls, with the original thin scrollbar and remaining-content fade; mobile
  has no internal scroll. ResizeObserver, media and scroll listeners are cleaned up.
- Progressive enhancement uses a hydration snapshot hook. Without JavaScript,
  both faces and every publication remain readable, and action buttons stay hidden.
- Reduced motion removes rotations/transitions while retaining selection, focus
  and content. No dependency, asset or infrastructure change was needed.

The section heading and detail/publication content remain server-rendered. Client
components handle card state/focus and the research scroll indicator. New UI icon
variants use the exact v10 arrow paths; no icon library was introduced.

## Verification

| Check | Result |
|---|---|
| Build/static export | PASS |
| TypeScript 7 | PASS |
| ESLint | PASS |
| Jest | PASS, existing media subscription/cleanup test |
| Playwright regression suite | **100 passed**, zero skipped/flaky/failed |
| Handoff integrity | **92 hashes** verified, no reference edits |
| Git diff whitespace check | PASS |

The suite retains the 67 earlier checks and adds 33 Expertise checks across
Chromium, Firefox and WebKit. Front and all-open back geometry/copy are compared
with the original v10 at 320, 390, 800, 801, 900, 1060 and 1440px. Coordinates are
measured in document space so scroll positions do not disguise layout changes.

Functional checks cover independent opening/closing, focus transfer/return,
inert faces, stable desktop height, four exact DOI destinations, keyboard scrolling
to the last paper, fixed heading/Back action, scroll reset, mobile natural height,
reduced motion and the no-JavaScript fallback. Existing Hero/Projects touch and
navigation regressions still pass.

Fifteen screenshot comparisons cover front/back at 390 and 1440px and desktop
publication-bottom states in the three desktop engines. Compared with v10 rendered
in the same browser, the largest changed-pixel fraction above an 8/255 channel
threshold is **0.0631%**, below the 0.2% gate. Screenshots were visually inspected
for card composition, headings/icons, detail groups, publication reachability and
mobile layout. Historical font-rasterisation differences noted in phase one remain;
this is not a claim of byte-identical historical PNGs.

New screenshots/traces are under `test-results/phase3/`; a review copy accompanies
this report. The approved `visual-references/` directory and capture script were
not modified or regenerated.

## Review checklist

Refresh the local preview, then scroll to Expertise:
1. Desktop: three cards, Software marked Primary focus. Open each card; multiple
   cards should remain open together and the row should retain its height.
2. Neuroscience: scroll its content to all four papers. The heading and Back
   action should stay still; close and reopen to confirm the scroll resets.
3. Keyboard: activate View details with Enter, confirm focus moves to the reverse
   heading, then use Back and confirm focus returns. Hidden-face links must not
   enter the Tab sequence. On macOS WebKit/Safari use Option+Tab when required by
   system keyboard-navigation preferences.
4. At 390/320px: one column; the open Neuroscience card should grow to fit all
   papers, with page scrolling rather than a nested publication scrollbar.
5. With reduced motion, switching faces should be immediate; without JavaScript,
   descriptions, detail groups and all four paper links should still be readable.

## Remaining work and limits

The Skills Constellation is phase four. Journey and Contact/footer bodies remain
for phase five. No subsequent phase has started. Live DOI availability, physical
Safari/iOS/Android, screen-reader and full WCAG/performance audits remain for
final QA. Native inert support is tested in the automated desktop engines; no
accessibility certification is implied. Phase-one development-tool audit/peer
warnings remain unchanged; no dependency changes were made in this phase.

## User review

Elisa checked phase three and confirmed it is perfect (18 November 2026).
Accepted for a local checkpoint and continuation to the Constellation phase.
No additional push or deployment was authorized.
