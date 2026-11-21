# Develysverse — Phase 2: Hero and Selected Projects

18 November 2026. Completed locally; stopped before phase 3 for review.

## Git checkpoints

Phase 1 was committed and pushed, as authorized:
- Commit: [`17a94859388af0ad6dc2a541ae5d9e22ccf08a97`](https://github.com/elibattistoni/develysverse/commit/17a94859388af0ad6dc2a541ae5d9e22ccf08a97).
- Remote branch: `redesign/v10-phase-1`.

Phase 2 is on local branch `redesign/v10-phase-2`, based on that commit, in the dedicated redesign worktree. Its changes remain uncommitted and unpushed for review. `main` is unchanged. No merge, deployment, PR creation or Linear access was performed.

## Implemented

### Hero

- Approved H1, paragraph and both anchor CTAs, rendered immediately from server components.
- All three exact WebP illustrations, decorative empty alt text and visible button names; Software in front, Data upper and Neuroscience lower initially.
- Click, tap, Enter and Space swap the selected fragment with the front slot. Exactly one fragment has `aria-pressed=true`.
- Original slot transforms and 520ms swap, 240ms tilt and 180ms CTA-arrow timings/easing preserved from v10 CSS.
- Fine mouse pointer tilt is bounded to ±3.5°/±4.5°, scheduled with requestAnimationFrame and reset on pointer leave/cancel, selection, media preference changes and unmount. No touch tilt or reduced-motion tilt.
- Replaced the old Hero component; removed its unreferenced particle and typewriter implementations.

### Selected Projects

- Server-rendered reusable cards and typed project data extracted/reviewed against the approved HTML: exact descriptions, roles, alt text and six destinations, including the Color Picker contribution attribution.
- Desktop: two featured cards followed by a full-width compact contribution. Mobile ≤800px: native manual scroll-snap rail, 84%/390px card sizing, 14px gap, arrows and native touch/trackpad scrolling.
- Controls hide when unnecessary and disable at the ends; layout/scroll state updates via ResizeObserver and passive scroll events, with cleanup.
- Exact original WebP files and `<picture>` for the separate Brenta crops; intrinsic annotations use the manifest’s real dimensions rather than historical approximate HTML values. The visible 8:5 crop, contain fit, image border and spacing are unchanged.
- No image zoom or autoplay. Approved hover, underline, external arrows and keyboard focus retained.

Only the interactive stack and carousel require client components. Project card/heading content stays server rendered. SVG paths come from v10; no icon library or new dependency was added. Public asset URLs retain support for the repository’s optional static base path.

## Verification

| Check | Result |
|---|---|
| Production build/static export | PASS |
| TypeScript 7 typecheck | PASS |
| ESLint | PASS |
| Jest | PASS, 1 existing media subscription/cleanup test |
| Playwright | **67 passed**, no failures, skipped or flaky tests |
| Git whitespace check for phase-two edits | PASS |
| Immutable handoff | All **92 hashes** verified; no baseline files changed |

Desktop engines: Chromium, Firefox and WebKit. Foundation checks cover 320/390/520/800/801/900/1060/1061/1440px; phase-two geometry and visible-copy comparisons cover 320/390/800/801/900/1440px in all three engines. Tested Hero slot changes with mouse/keyboard, focus retention, tilt reset and reduced motion; carousel arrows/end states, horizontal wheel scrolling, resize, image hover, keyboard link focus and no-JavaScript content/CTA navigation. A Chromium Pixel 7 context also passes tap selection and a native swipe generated through browser touch input.

Initial Hero/Projects screenshots at 390×1000 and 1440×1000 are compared against v10 rendered in the same browser. Geometry differs by less than 0.15 CSS px at the measured elements; visible copy and destinations match. Across the **12 screenshot comparisons**, no pixel exceeds the 8/255 per-channel threshold (allowed changed-pixel fraction: 0.2%). This is a same-environment comparison, not a claim of byte-identical historical screenshots.

All new captures are under `test-results/phase2/`, with a review copy alongside this report. Playwright uses port 4174 so the normal static preview on port 4173 can remain available. The handoff capture script was never executed. Historical screenshot dimensions/font rasterisation differences documented in phase 1 still apply; side-by-side approved/live/current images are provided for inspection.

## Remaining scope and limitations

- Expertise flip cards/publications, Constellation, Journey bodies and Contact/footer remain for phases 3–5. Their current section headers are still the phase-one shell.
- Real iOS/Android hardware, Safari itself, screen-reader QA and frame-by-frame motion review remain for final QA. The touch test is emulated Chromium; WebKit is an engine test.
- External URLs are preserved and checked against v10, but their live availability was not revalidated.
- No dependency changes in phase 2. The development-tool audit/peer warnings disclosed in the phase-one report remain; they are not claimed resolved here.

## Review checklist

Open the local preview and refresh:
1. Desktop: inspect the three Hero illustrations, switch Data/Neuroscience to the front by click and keyboard, move the mouse over a card and leave the stack to check tilt reset.
2. Check Explore Projects and Get in Touch anchor navigation.
3. Desktop Projects: two featured cards plus compact Color Picker below; unchanged image scale on hover, all six destination links.
4. At 390px and 320px: stacked Hero; manual Projects carousel via arrows/swipe/trackpad, correct Brenta crop, disabled end arrows and no page overflow.
5. Check spacing within Hero/Projects and the transition from the last project to Expertise; later section bodies are intentionally pending.

After review, the next phase is Expertise and its four publications. No further phase has started.

## User review

Elisa reviewed the rendered Hero/Projects and confirmed that they look good and
that the buttons work (18 November 2026). Phase two is accepted for a local
checkpoint. No additional push was authorized.
