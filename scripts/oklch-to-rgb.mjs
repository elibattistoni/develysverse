// Convert OKLCH colors in the original brand SVGs to sRGB hex so they render
// correctly in editors that don't yet support the oklch() CSS function
// (Affinity Designer, older Inkscape, etc.). Output: public/logo/original-rgb/.
// Re-run after editing the originals: `npm run logos:rgb`
import fs from "node:fs"
import path from "node:path"

const SRC_DIR = "public/logo/original"
const OUT_DIR = "public/logo/original-rgb"
const FILES = [
  "logo-extended.svg",
  "logo-compact.svg",
  "logo-compact-tagline.svg",
]

// OKLab → linear sRGB → sRGB hex. Pure JS, no deps. Reference:
// https://bottosson.github.io/posts/oklab/
function oklchToHex(L, C, H) {
  const hRad = (H * Math.PI) / 180
  const a = C * Math.cos(hRad)
  const b = C * Math.sin(hRad)
  const l_ = L + 0.3963377774 * a + 0.2158037573 * b
  const m_ = L - 0.1055613458 * a - 0.0638541728 * b
  const s_ = L - 0.0894841775 * a - 1.2914855480 * b
  const l = l_ ** 3
  const m = m_ ** 3
  const s = s_ ** 3
  const r = +4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s
  const g = -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s
  const bl = -0.0041960863 * l - 0.7034186147 * m + 1.7076147010 * s
  const gamma = (x) => (x <= 0.0031308 ? 12.92 * x : 1.055 * Math.pow(x, 1 / 2.4) - 0.055)
  const clip = (v) => Math.max(0, Math.min(1, gamma(v)))
  const toHex = (v) => Math.round(v * 255).toString(16).padStart(2, "0")
  return `#${toHex(clip(r))}${toHex(clip(g))}${toHex(clip(bl))}`
}

const OKLCH_RE = /oklch\(\s*([\d.]+)\s+([\d.]+)\s+([\d.]+)\s*\)/g

// Site primary background — matches `--bg-primary` in app/globals.css
const SITE_BG = "#080012"

fs.mkdirSync(OUT_DIR, { recursive: true })

const seenColors = new Map()
for (const file of FILES) {
  const src = fs.readFileSync(path.join(SRC_DIR, file), "utf8")

  // 1) Plain hex variant (transparent background)
  const out = src.replace(OKLCH_RE, (_, L, C, H) => {
    const hex = oklchToHex(parseFloat(L), parseFloat(C), parseFloat(H))
    seenColors.set(`oklch(${L} ${C} ${H})`, hex)
    return hex
  })
  fs.writeFileSync(path.join(OUT_DIR, file), out)
  console.log(`✓ ${path.join(OUT_DIR, file)} (${(out.length / 1024).toFixed(1)}KB)`)

  // 2) On-dark variant (site bg as a full-canvas rect right after the opening <svg>)
  const onDark = out.replace(
    /(<svg[^>]+>)/,
    `$1<rect width="100%" height="100%" fill="${SITE_BG}" />`,
  )
  const onDarkName = file.replace(/\.svg$/, "-on-dark.svg")
  fs.writeFileSync(path.join(OUT_DIR, onDarkName), onDark)
  console.log(`✓ ${path.join(OUT_DIR, onDarkName)} (${(onDark.length / 1024).toFixed(1)}KB)`)
}

console.log("\nColor map:")
for (const [oklch, hex] of seenColors) console.log(`  ${oklch}  →  ${hex}`)
