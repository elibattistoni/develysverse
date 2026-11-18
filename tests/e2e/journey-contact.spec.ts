import { expect, test, type Page } from "@playwright/test"
import sharp from "sharp"

const EMAIL = "elisa.battistoni.dev@gmail.com"
const widths = [320, 390, 520, 800, 801, 900, 1060, 1061, 1440]
const summaries = (page: Page) => page.locator("#journey summary")
const copy = (page: Page) => page.locator("#contact button")

async function ready(page: Page) {
  await page.evaluate(async () => {
    await document.fonts.ready
    await Promise.all([...document.querySelectorAll<HTMLImageElement>("#top img, #projects img")].map(image => { image.loading = "eager"; return image.decode() }))
    await new Promise(requestAnimationFrame)
    await new Promise(requestAnimationFrame)
  })
  await expect(copy(page)).toBeVisible()
}
async function clipboard(page: Page, fails = false) {
  await page.evaluate(fails => {
    Object.assign(window, { copiedAddress: "", copyCalls: 0 })
    Object.defineProperty(navigator, "clipboard", { configurable: true, value: { writeText: async (value: string) => {
      Reflect.set(window, "copyCalls", Number(Reflect.get(window, "copyCalls")) + 1)
      if (fails) throw new Error("Simulated clipboard denial")
      Reflect.set(window, "copiedAddress", value)
    } } })
  }, fails)
}

for (const width of widths) {
  test(`Journey, Contact and footer match v10 at ${width}px`, async ({ page, context }, info) => {
    await page.setViewportSize({ width, height: 1000 })
    await page.emulateMedia({ reducedMotion: "reduce" })
    await page.goto("/"); await ready(page)
    const reference = await context.newPage()
    await reference.setViewportSize({ width, height: 1000 })
    await reference.emulateMedia({ reducedMotion: "reduce" })
    await reference.goto("/__reference/"); await ready(reference)
    for (const p of [page, reference]) await clipboard(p)

    async function compare(selector: string, state: string) {
      const actual = page.locator(selector), baseline = reference.locator(selector)
      const metrics = (element: Element) => {
        const r = element.getBoundingClientRect(), style = getComputedStyle(element)
        return { x: r.x, width: r.width, height: r.height, font: style.font, color: style.color }
      }
      const a = await actual.evaluate(metrics), b = await baseline.evaluate(metrics)
      for (const key of ["x", "width", "height"] as const) expect(Math.abs(a[key] - b[key]), `${state} ${key}`).toBeLessThan(.15)
      expect(a.font).toBe(b.font); expect(a.color).toBe(b.color)
      if (![390, 1440].includes(width)) return
      await page.mouse.move(0, 0); await reference.mouse.move(0, 0)
      const current = await actual.screenshot({ path: info.outputPath(`${width}-${state}.png`), animations: "disabled" })
      const original = await baseline.screenshot({ path: info.outputPath(`${width}-${state}-v10-live.png`), animations: "disabled" })
      const [ap, bp] = await Promise.all([sharp(current).removeAlpha().raw().toBuffer({ resolveWithObject: true }), sharp(original).removeAlpha().raw().toBuffer({ resolveWithObject: true })])
      expect(ap.info).toEqual(bp.info)
      let changed = 0
      for (let i = 0; i < ap.data.length; i += 3) if (Math.max(Math.abs(ap.data[i] - bp.data[i]), Math.abs(ap.data[i + 1] - bp.data[i + 1]), Math.abs(ap.data[i + 2] - bp.data[i + 2])) > 8) changed++
      const changedPixelRatio = changed / (ap.info.width * ap.info.height)
      await info.attach(`${width}-${state}-comparison`, { body: JSON.stringify({ width, state, changedPixelRatio, channelThreshold: 8, maxChangedPixelRatio: .002 }), contentType: "application/json" })
      expect(changedPixelRatio).toBeLessThan(.002)
    }

    await compare("#journey", "journey-present")
    for (const p of [page, reference]) await summaries(p).first().click()
    await compare("#journey", "journey-multiple-open")
    for (const p of [page, reference]) for (let i = 1; i < 4; i++) await summaries(p).nth(i).click()
    await compare("#journey", "journey-all-open")
    // Compare every chapter's approved copy and tags, including initially closed bodies.
    const text = (element: Element) => element.textContent?.replace(/\s+/g, " ").trim()
    const chapterText = (elements: Element[]) => elements.map(el => [...el.querySelectorAll("summary span:not(:has(span)), summary strong, p, summary + div > div:last-child > div > span")].map(item => item.textContent?.trim()))
    expect(await page.locator("#journey details").evaluateAll(chapterText)).toEqual(await reference.locator("#journey details").evaluateAll(chapterText))
    expect(await page.locator("#contact h2").evaluate(text)).toBe(await reference.locator("#contact h2").evaluate(text))
    await compare("#contact", "contact-default")
    for (const p of [page, reference]) await copy(p).click()
    await expect(copy(page)).toHaveText("Email copied")
    await compare("#contact", "contact-copied")
    for (const p of [page, reference]) { await clipboard(p, true); await copy(p).click() }
    await compare("#contact", "contact-fallback")
    await compare("footer", "footer")
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(await page.evaluate(() => document.documentElement.clientWidth))
    await reference.close()
  })
}

test("Journey opens independently with pointer and keyboard, preserving focus and native semantics", async ({ page, browserName }) => {
  await page.goto("/"); await ready(page)
  const cards = page.locator("#journey details")
  await expect(cards).toHaveCount(5)
  await expect(page.locator("#journey details[open]")).toHaveCount(1)
  await expect(cards.last()).toHaveAttribute("open", "")
  // Start keyboard traversal before pointer activation. WebKit can anchor the
  // first Tab back to a summary after a pointer click on one of its descendants.
  await summaries(page).first().focus()
  await page.keyboard.press(browserName === "webkit" ? "Alt+Tab" : "Tab")
  await expect(summaries(page).nth(1)).toBeFocused()
  await expect(summaries(page).nth(1)).toHaveCSS("outline-color", "rgb(189, 179, 255)")
  await page.keyboard.press("Enter")
  await expect(cards.nth(1)).toHaveAttribute("open", "")
  await expect(summaries(page).nth(1)).toBeFocused()
  await page.keyboard.press("Space")
  await expect(cards.nth(1)).not.toHaveAttribute("open")
  await summaries(page).first().click()
  await expect(page.locator("#journey details[open]")).toHaveCount(2)
  await expect(cards.first()).toHaveAttribute("open", "")
  await expect(cards.last()).toHaveAttribute("open", "")
  const dots = await cards.evaluateAll(elements => elements.map(el => ({ open: el.hasAttribute("open"), color: getComputedStyle(el, "::before").backgroundColor, border: getComputedStyle(el, "::before").borderColor })))
  for (const dot of dots) { expect(dot.border).toBe("rgb(118, 217, 211)"); expect(dot.color).toBe(dot.open ? "rgb(118, 217, 211)" : "rgb(9, 15, 25)") }
})

test("email copies only on request, announces success, holds width and resets after 2500ms", async ({ page }) => {
  await page.goto("/"); await ready(page); await clipboard(page)
  await page.clock.install({ time: new Date("2026-11-18T12:00:00Z") })
  await page.clock.pauseAt(new Date("2026-11-18T12:00:01Z"))
  const button = copy(page), status = page.locator("#contact [role=status]")
  const width = (await button.boundingBox())!.width
  expect(await page.evaluate(() => Reflect.get(window, "copyCalls"))).toBe(0)
  await button.dispatchEvent("click")
  await expect(button).toHaveText("Email copied")
  expect(await page.evaluate(() => Reflect.get(window, "copiedAddress"))).toBe(EMAIL)
  await expect(status).toHaveText("Email address copied to the clipboard.")
  expect((await button.boundingBox())!.width).toBe(width)
  await page.clock.fastForward(2499)
  await expect(button).toHaveText("Email copied")
  await page.clock.fastForward(1)
  await expect(button).toHaveText("Copy email")
  await expect(status).toBeEmpty()
  await button.dispatchEvent("click")
  await page.clock.fastForward(1000)
  await button.dispatchEvent("click")
  await page.clock.fastForward(1500)
  await expect(button).toHaveText("Email copied")
  await page.clock.fastForward(1000)
  await expect(button).toHaveText("Copy email")
})

test("denied or missing Clipboard exposes selectable manual copy and can recover", async ({ page }) => {
  await page.goto("/"); await ready(page)
  const fallback = page.getByText(`Copy this address manually: ${EMAIL}`), status = page.locator("#contact [role=status]")
  await expect(fallback).toBeHidden()
  for (const mode of ["denied", "missing"] as const) {
    if (mode === "denied") await clipboard(page, true)
    else await page.evaluate(() => Object.defineProperty(navigator, "clipboard", { configurable: true, value: undefined }))
    await copy(page).click()
    await expect(fallback).toBeVisible()
    await expect(status).toHaveText("Automatic copy failed. Select the email address to copy it manually.")
    expect(await fallback.locator("span").evaluate(el => getComputedStyle(el).userSelect)).not.toBe("none")
  }
  await clipboard(page); await copy(page).click()
  await expect(fallback).toBeHidden()
  await expect(copy(page)).toHaveText("Email copied")
})

test("slow clipboard avoids duplicate writes and updates after completion", async ({ page }) => {
  await page.goto("/"); await ready(page)
  await page.evaluate(() => {
    Object.assign(window, { copyCalls: 0 })
    Object.defineProperty(navigator, "clipboard", { configurable: true, value: { writeText: () => {
      Reflect.set(window, "copyCalls", Number(Reflect.get(window, "copyCalls")) + 1)
      return new Promise<void>(resolve => Reflect.set(window, "finishCopy", resolve))
    } } })
  })
  await copy(page).click(); await copy(page).click()
  expect(await page.evaluate(() => Reflect.get(window, "copyCalls"))).toBe(1)
  await expect(copy(page)).toHaveText("Copy email")
  await page.evaluate(() => Reflect.get(window, "finishCopy")())
  await expect(copy(page)).toHaveText("Email copied")
})

test("Contact links, footer anchor and reduced motion preserve v10 behavior", async ({ page, context, browserName }) => {
  await page.goto("/"); await ready(page)
  const links = page.locator("#contact a")
  await expect(links).toHaveCount(2)
  for (const [i, href] of ["https://github.com/elibattistoni", "https://www.linkedin.com/in/elisa-battistoni-21597980/"].entries()) {
    await expect(links.nth(i)).toHaveAttribute("href", href)
    await expect(links.nth(i)).toHaveAttribute("target", "_blank")
    await expect(links.nth(i)).toHaveAttribute("rel", "noopener noreferrer")
    await expect(links.nth(i)).toHaveCSS("color", "rgb(172, 185, 203)")
  }
  await copy(page).focus()
  await page.keyboard.press(browserName === "webkit" ? "Alt+Tab" : "Tab")
  await expect(links.first()).toBeFocused()
  await expect(links.first()).toHaveCSS("outline-color", "rgb(189, 179, 255)")
  await expect(links.first()).toHaveCSS("color", "rgb(240, 245, 250)")
  await expect(page.getByRole("contentinfo")).toContainText("© 2026 Elisa Battistoni · Develysverse")
  await expect(page.locator("#journey details").first()).toHaveCSS("transition-duration", "0.25s")
  await expect(page.locator("#journey details").first().locator("summary > svg")).toHaveCSS("transition-duration", "0.2s")
  await summaries(page).first().click()
  await expect(page.locator("#journey details").first().locator("summary + div")).toHaveCSS("animation-duration", "0.18s")
  await summaries(page).first().click()
  await page.emulateMedia({ reducedMotion: "reduce" })
  await summaries(page).first().click()
  await expect(page.locator("#journey details").first().locator("summary + div")).toHaveCSS("animation-name", "none")
  await expect(page.locator("#journey details").first().locator("summary > svg")).toHaveCSS("transition-duration", "0s")
  await page.getByRole("link", { name: "Back to top" }).click()
  await expect(page).toHaveURL(/#top$/)
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBeLessThan(130)
  if (browserName === "chromium") {
    await context.grantPermissions(["clipboard-read", "clipboard-write"])
    await copy(page).click()
    await expect(copy(page)).toHaveText("Email copied")
    expect(await page.evaluate(() => navigator.clipboard.readText())).toBe(EMAIL)
  }
})

test("native Journey and manual Contact work with JavaScript disabled", async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 390, height: 1000 } })
  const page = await context.newPage()
  await page.goto("http://127.0.0.1:4174/")
  await expect(page.locator("#journey details[open]")).toHaveCount(1)
  await summaries(page).first().click()
  await expect(page.locator("#journey details[open]")).toHaveCount(2)
  await expect(page.getByText(`Copy this address manually: ${EMAIL}`)).toBeVisible()
  await expect(copy(page)).toBeHidden()
  await expect(page.locator("#contact a")).toHaveCount(2)
  await context.close()
})
