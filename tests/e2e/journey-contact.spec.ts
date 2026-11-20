import { expect, test, type Page } from "@playwright/test"

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
  test(`Journey assets and Contact reflow at ${width}px`, async ({ page }, info) => {
    await page.setViewportSize({ width, height: 1000 })
    await page.emulateMedia({ reducedMotion: "reduce" })
    await page.goto("/"); await ready(page)
    if (width === 1440) {
      const introduction = page.locator("#journey > p")
      const lines = await introduction.evaluate(element => {
        const range = document.createRange()
        range.selectNodeContents(element)
        return range.getClientRects().length
      })
      expect(lines).toBe(1)
    }
    const chapters = page.locator("#journey details")
    const labels = ["The Origin", "The Depth", "The Bridge", "The Crossing", "The Present"]
    const capture = [320, 390, 900, 1440].includes(width)
    await expect(chapters).toHaveCount(labels.length)
    await expect(page.locator("#journey details[open]")).toHaveCount(1)
    for (const [index, label] of labels.entries()) {
      const chapter = chapters.nth(index)
      await expect(summaries(page).nth(index)).toContainText(label)
      if (index < labels.length - 1) await summaries(page).nth(index).click()
      const image = chapter.locator("img")
      await image.scrollIntoViewIfNeeded()
      await expect(image).toHaveAttribute("src", new RegExp(`/journey/chapter-${index + 1}\\.webp$`))
      await expect(image).toHaveAttribute("alt", "")
      expect(await image.evaluate(async element => {
        const image = element as HTMLImageElement
        await image.decode()
        return [image.naturalWidth, image.naturalHeight]
      })).toEqual([440, 275])
      const visual = (await image.boundingBox())!, paragraph = (await chapter.locator("p").first().boundingBox())!
      expect(visual.width).toBeGreaterThanOrEqual(width <= 800 ? 180 : 200)
      expect(visual.width).toBeLessThanOrEqual(220)
      if (width <= 800) expect(visual.y).toBeGreaterThan(paragraph.y)
      else expect(visual.x).toBeGreaterThanOrEqual(paragraph.x + paragraph.width)
      if (capture && index === labels.length - 1) await chapter.screenshot({ path: info.outputPath(`${width}-journey-present.png`) })
    }
    await expect(page.locator("#journey details[open]")).toHaveCount(5)
    if (capture) await page.locator("#journey").screenshot({ path: info.outputPath(`${width}-journey-all.png`) })
    const heading = page.locator("#journey h2")
    await expect(heading).toContainText("A non-linear journey")
    await expect(heading.getByText("non-linear")).toHaveCSS("white-space", "nowrap")
    await expect(page.getByRole("link", { name: "Email me" })).toHaveAttribute("href", `mailto:${EMAIL}`)
    await expect(page.getByText(EMAIL, { exact: true })).toHaveCSS("user-select", "text")
    await expect(page.getByRole("contentinfo")).toHaveCSS("flex-direction", width <= 520 ? "column" : "row")
    if (capture) await page.locator("#contact").screenshot({ path: info.outputPath(`${width}-contact.png`) })
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(await page.evaluate(() => document.documentElement.clientWidth))
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
  await expect(button).toHaveText("Copied")
  expect(await page.evaluate(() => Reflect.get(window, "copiedAddress"))).toBe(EMAIL)
  await expect(status).toHaveText("Email address copied to the clipboard.")
  expect((await button.boundingBox())!.width).toBe(width)
  await page.clock.fastForward(2499)
  await expect(button).toHaveText("Copied")
  await page.clock.fastForward(1)
  await expect(button).toHaveText("Copy email")
  await expect(status).toBeEmpty()
  await button.dispatchEvent("click")
  await page.clock.fastForward(1000)
  await button.dispatchEvent("click")
  await page.clock.fastForward(1500)
  await expect(button).toHaveText("Copied")
  await page.clock.fastForward(1000)
  await expect(button).toHaveText("Copy email")
})

test("denied or missing Clipboard exposes selectable manual copy and can recover", async ({ page }) => {
  await page.goto("/"); await ready(page)
  const address = page.getByText(EMAIL, { exact: true }), status = page.locator("#contact [role=status]")
  await expect(address).toBeVisible()
  await expect(status).toBeEmpty()
  for (const mode of ["denied", "missing"] as const) {
    if (mode === "denied") await clipboard(page, true)
    else await page.evaluate(() => Object.defineProperty(navigator, "clipboard", { configurable: true, value: undefined }))
    await copy(page).click()
    await expect(status).toHaveAttribute("data-error", "true")
    await expect(status).toHaveText("Automatic copy failed. Select the email address to copy it manually.")
    await expect(address).toHaveCSS("user-select", "text")
    await expect(copy(page)).toHaveText("Copy email")
  }
  await clipboard(page); await copy(page).click()
  await expect(address).toBeVisible()
  await expect(status).not.toHaveAttribute("data-error")
  await expect(copy(page)).toHaveText("Copied")
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
  await expect(copy(page)).toHaveText("Copied")
})

test("Contact actions, footer anchor and reduced motion preserve keyboard behavior", async ({ page, context, browserName }) => {
  await page.goto("/"); await ready(page)
  const emailLink = page.getByRole("link", { name: "Email me" })
  await expect(emailLink).toHaveAttribute("href", `mailto:${EMAIL}`)
  const links = page.locator('#contact a[target="_blank"]')
  await expect(links).toHaveCount(2)
  for (const [i, href] of ["https://github.com/elibattistoni", "https://www.linkedin.com/in/elisa-battistoni-21597980/"].entries()) {
    await expect(links.nth(i)).toHaveAttribute("href", href)
    await expect(links.nth(i)).toHaveAttribute("target", "_blank")
    await expect(links.nth(i)).toHaveAttribute("rel", "noopener noreferrer")
    await expect(links.nth(i)).toHaveCSS("color", "rgb(172, 185, 203)")
  }
  await emailLink.focus()
  await page.keyboard.press(browserName === "webkit" ? "Alt+Tab" : "Tab")
  await expect(copy(page)).toBeFocused()
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
    await expect(copy(page)).toHaveText("Copied")
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
  await expect(page.getByText(EMAIL, { exact: true })).toBeVisible()
  await expect(page.getByRole("link", { name: "Email me" })).toHaveAttribute("href", `mailto:${EMAIL}`)
  await expect(copy(page)).toBeHidden()
  await expect(page.locator('#contact a[target="_blank"]')).toHaveCount(2)
  await context.close()
})
