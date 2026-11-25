# Approved implementation amendments to v10

The [v10 prototype and test fixtures](../design-handoff/README.md) retain their
original bytes. These decisions supplement the [design and UX specification](../design-handoff/2026-11-20/DESIGN_UX_SPECIFICATION.md).

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

## 21 November 2026 — Portfolio review

- **Expertise.** Desktop cards are 265 px high. Fronts show disciplines and
  technologies. Backs highlight key phrases and keep the four Neuroscience DOI
  links in a scrollable desktop body. Mobile faces size to their content. The
  bottom row flips each face independently, with an arrow on either face and a
  smaller discipline icon on the back.
- **Skills Constellation.** The desktop map keeps its proportions. On mobile the
  heading toggles the inline map, with filters above the canvas and rotation,
  zoom, and reset controls below.
- **Journey.** Keep the original chapter borders and use teal chevrons. The
  reviewed chapter subtitles and copy live in `lib/data/chapters.ts`.
- **Contact.** GitHub and LinkedIn precede the email address. All three actions
  use regular 16 px violet text and become bold on hover or keyboard focus.
  Activating the address copies it and shows an “Email copied.” toast after
  success. The address remains selectable for manual copying.

## 25 November 2026 — Software Engineer title

Elisa chose "Software Engineer" over "Software Developer" for the site title,
the meta and social descriptions, and the hero description, which drops
"Experienced" ("Software Engineer with a PhD in Cognitive Neuroscience and a
background in Data Science."). The current Journey chapter role is "Software
Engineer". The Expertise and Journey intros say "software engineering" instead
of "software development". The social preview image
(`public/og-image.svg`) is redrawn in the v10 style with the hero headline and
fragment stack, replacing the earlier Cormorant Garamond design.

## 25 November 2026 — Contact icons, Journey alignment, mobile constellation

- **Contact.** GitHub and LinkedIn show their brand logo before the label, and
  the email address shows a mail icon. The address is now hello@develysverse.com.
  Labels, the external-link arrow and the copy icon stay.
- **Journey.** Chapter text starts directly below the chapter title instead of
  being centered against the illustration, so every chapter has the same gap.
- **Skills Constellation (mobile).** The heading chevron is teal, and the
  section glow is hidden while the map is collapsed (it showed as a thin line).
- **Wordmark.** "develysverse" is always lowercase, including the footer and
  the accessible name of the home link.
