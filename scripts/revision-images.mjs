import sharp from "sharp"
import { mkdir, readFile } from "node:fs/promises"
import { fileURLToPath } from "node:url"

const design = new URL("../docs/design-handoff/", import.meta.url)
const output = new URL("../public/assets/images/", import.meta.url)
const journey = new URL("journey/", output)
await mkdir(journey, { recursive: true })

// Downsample the full transparent image, without trimming or flattening.
for (let number = 1; number <= 5; number++) {
  const source = new URL(`2026-11-20/assets/journey/immagine-${number}.png`, design)
  const target = new URL(`chapter-${number}.webp`, journey)
  const image = sharp(await readFile(source))
  if (!(await image.metadata()).hasAlpha) throw new Error(`Missing alpha: ${source.pathname}`)
  const result = await image
    .resize({ width: 440 })
    .webp({ quality: 88, alphaQuality: 100 })
    .toFile(fileURLToPath(target))
  console.log(`${target.pathname}: ${result.width}×${result.height}, ${result.size} bytes`)
}

// The original Raycast captures include background beyond the app windows.
// Reframe the real UI at 8:5, retaining a small margin around the windows.
const crops = [
  { source: "palette-colors", target: "palette", left: 210, top: 130, width: 1584, height: 990, outputWidth: 1200 },
  { source: "color-picker", target: "picker", left: 205, top: 126, width: 1592, height: 995, outputWidth: 880 },
]
for (const { source, target, outputWidth, ...crop } of crops) {
  const input = new URL(`assets/originals/${source}-original.png`, design)
  const result = await sharp(await readFile(input))
    .extract(crop)
    .resize(outputWidth)
    .webp({ quality: 90 })
    .toFile(fileURLToPath(new URL(`project-${target}-v12.webp`, output)))
  console.log(`${target}: ${result.width}×${result.height}, ${result.size} bytes`)
}
