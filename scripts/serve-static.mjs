import { createServer } from "node:http"
import { readFile, stat } from "node:fs/promises"
import { resolve, extname, sep } from "node:path"

const root = resolve("out")
const reference = resolve("docs/design-handoff")
const allowReference = process.env.QA_REFERENCE === "1"
const mime = { ".html": "text/html; charset=utf-8", ".css": "text/css", ".js": "text/javascript", ".json": "application/json", ".svg": "image/svg+xml", ".png": "image/png", ".webp": "image/webp", ".ttf": "font/ttf", ".woff2": "font/woff2", ".ico": "image/x-icon", ".txt": "text/plain; charset=utf-8", ".xml": "application/xml", ".webmanifest": "application/manifest+json" }
const server = createServer(async (req, res) => {
  try {
    const pathname = decodeURIComponent(new URL(req.url, "http://localhost").pathname)
    const isReference = allowReference && pathname.startsWith("/__reference/")
    const base = isReference ? reference : root
    const relative = isReference ? pathname.slice("/__reference/".length) : pathname.slice(1)
    let file = resolve(base, relative || "index.html")
    if (file !== base && !file.startsWith(base + sep)) { res.writeHead(403).end(); return }
    const info = await stat(file)
    if (info.isDirectory()) file = resolve(file, "index.html")
    const data = await readFile(file)
    res.writeHead(200, { "Content-Type": mime[extname(file)] || "application/octet-stream", "Cache-Control": "no-store" })
    res.end(data)
  } catch { res.writeHead(404).end("Not found") }
})
server.listen(Number(process.env.PORT || 4173), "127.0.0.1", () => console.log("Static preview: http://127.0.0.1:" + (process.env.PORT || 4173)))
for (const signal of ["SIGINT", "SIGTERM"]) process.on(signal, () => server.close())
