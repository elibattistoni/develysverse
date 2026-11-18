# Approved implementation amendments to v10

The original `docs/design-handoff/` package remains an immutable historical
baseline. Explicit owner changes recorded here override only the stated behavior.

## 18 November 2026 — Remove constellation discipline notes

Elisa requested removal of the Software Engineering and Data Science descriptive
sentences below the constellation. No discipline should display a note below the
graph. Remove the note element, copy data and associated spacing. Preserve filters,
pressed state, graph rendering, controls and the accessible skills alternative.
The remaining phase-four checks were confirmed as passing by Elisa.

## 18 November 2026 — Equal mobile project card heights

Elisa reported that the Color Picker contribution card is shorter than the other
cards in the mobile carousel. Stretch it to the same grid row height as the two
featured projects at widths up to 800px. Keep its content, illustration, card
width, spacing and desktop compact layout. This overrides v10's mobile
`align-self: start` for that card; the immutable handoff remains unchanged.
