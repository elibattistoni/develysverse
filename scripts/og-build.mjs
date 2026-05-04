// Convert public/og-image.svg → public/og-image.png at 1200×630.
// Re-run after editing the SVG: `npm run og`
import sharp from "sharp"
import fs from "node:fs"

const input = "public/og-image.svg"
const output = "public/og-image.png"

const svg = fs.readFileSync(input)

await sharp(svg, { density: 200 })
  .resize(1200, 630, { fit: "cover" })
  .png({ compressionLevel: 9 })
  .toFile(output)

const size = fs.statSync(output).size
console.log(`✓ ${output} (${(size / 1024).toFixed(1)}KB)`)
