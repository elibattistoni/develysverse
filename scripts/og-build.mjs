// Render public/og-image.svg → public/og-image.png at 2400×1260 (1200×630 at 2× for sharp text).
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
  const page = await browser.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 2 })
  await page.goto(pathToFileURL(input).href, { waitUntil: "load" })
  await page.evaluate(() => document.fonts.ready)
  // document.fonts.check() returns true when no font face is declared at all (e.g. the font
  // stylesheet failed to load), and load() can return a different weight (asking for DM Sans 700
  // without a 700 face returns 800). So require a loaded face whose weight covers the requested one.
  const missing = await page.evaluate(async () => {
    const fonts = [
      ["700 60px 'DM Sans'", 700],
      ["700 15px Inter", 700],
      ["400 21px Inter", 400],
      ["600 17px Inter", 600],
    ]
    const covers = (face, weight) => {
      const [min, max = min] = face.weight
        .split(/\s+/)
        .map(w => (w === "normal" ? 400 : w === "bold" ? 700 : Number(w)))
      return face.status === "loaded" && min <= weight && weight <= max
    }
    const loaded = await Promise.all(fonts.map(([font]) => document.fonts.load(font).catch(() => [])))
    return fonts.filter(([, weight], i) => !loaded[i].some(face => covers(face, weight))).map(([font]) => font)
  })
  if (missing.length) throw new Error(`Fonts not loaded: ${missing.join(", ")}`)
  await page.screenshot({ path: output, clip: { x: 0, y: 0, width: 1200, height: 630 } })
} finally {
  await browser.close()
}

const size = fs.statSync(output).size
console.log(`✓ ${path.relative(process.cwd(), output)} (${(size / 1024).toFixed(1)}KB)`)
