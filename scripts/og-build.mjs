// Render public/og-image.svg → public/og-image.png at 1200×630.
// Re-run after editing the SVG: `npm run og`
// Uses Playwright's Chromium (a devDependency already) instead of sharp, because the SVG
// loads the site's self-hosted DM Sans and Inter, which librsvg can't use.
// Needs the browser once: `npx playwright install chromium`.
import { chromium } from "@playwright/test"
import fs from "node:fs"
import path from "node:path"
import { pathToFileURL } from "node:url"

const input = path.resolve("public/og-image.svg")
const output = path.resolve("public/og-image.png")

const browser = await chromium.launch()
try {
  const page = await browser.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 })
  await page.goto(pathToFileURL(input).href, { waitUntil: "load" })
  await page.evaluate(() => document.fonts.ready)
  const missing = await page.evaluate(() =>
    ["700 60px 'DM Sans'", "700 15px Inter", "400 21px Inter", "600 17px Inter"].filter(
      font => !document.fonts.check(font),
    ),
  )
  if (missing.length) throw new Error(`Fonts not loaded: ${missing.join(", ")}`)
  await page.screenshot({ path: output, clip: { x: 0, y: 0, width: 1200, height: 630 } })
} finally {
  await browser.close()
}

const size = fs.statSync(output).size
console.log(`✓ ${path.relative(process.cwd(), output)} (${(size / 1024).toFixed(1)}KB)`)
