import { expect, test, type Page } from "@playwright/test"

const EMAIL = "hello@develysverse.com"
const widths = [320, 390, 520, 800, 801, 900, 1060, 1061, 1440]
const summaries = (page: Page) => page.locator("#journey summary")
const copy = (page: Page) => page.getByRole("button", { name: `Copy email address: ${EMAIL}`, exact: true })
const status = (page: Page) => page.locator("#contact [role=status]")

async function ready(page: Page) {
  await page.evaluate(async () => {
    await document.fonts.ready
    await Promise.all(
      [...document.querySelectorAll<HTMLImageElement>("#top img, #projects img")].map(image => {
        image.loading = "eager"
        return image.decode()
      }),
    )
    await new Promise(requestAnimationFrame)
    await new Promise(requestAnimationFrame)
  })
  await expect(copy(page)).toBeVisible()
}
async function clipboard(page: Page, fails = false) {
  await page.evaluate(fails => {
    Object.assign(window, { copiedAddress: "", copyCalls: 0 })
    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: {
        writeText: async (value: string) => {
          Reflect.set(window, "copyCalls", Number(Reflect.get(window, "copyCalls")) + 1)
          if (fails) throw new Error("Simulated clipboard denial")
          Reflect.set(window, "copiedAddress", value)
        },
      },
    })
  }, fails)
}

for (const width of widths) {
  test(`Journey assets and Contact reflow at ${width}px`, async ({ page }, info) => {
    await page.setViewportSize({ width, height: 1000 })
    await page.emulateMedia({ reducedMotion: "reduce" })
    await page.goto("/")
    await ready(page)
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
      expect(
        await image.evaluate(async element => {
          const image = element as HTMLImageElement
          await image.decode()
          return [image.naturalWidth, image.naturalHeight]
        }),
      ).toEqual([440, 275])
      const visual = (await image.boundingBox())!,
        paragraph = (await chapter.locator("p").first().boundingBox())!
      expect(visual.width).toBeGreaterThanOrEqual(width <= 800 ? 180 : 200)
      expect(visual.width).toBeLessThanOrEqual(220)
      if (width <= 800) expect(visual.y).toBeGreaterThan(paragraph.y)
      else expect(visual.x).toBeGreaterThanOrEqual(paragraph.x + paragraph.width)
      if (capture && index === labels.length - 1)
        await chapter.screenshot({ path: info.outputPath(`${width}-journey-present.png`) })
    }
    await expect(page.locator("#journey details[open]")).toHaveCount(5)
    if (capture) await page.locator("#journey").screenshot({ path: info.outputPath(`${width}-journey-all.png`) })
    const heading = page.locator("#journey h2")
    await expect(heading).toContainText("A non-linear journey")
    await expect(heading.getByText("non-linear")).toHaveCSS("white-space", "nowrap")
    await expect(page.locator("#contact a[href^='mailto:']")).toHaveCount(0)
    // Contact is a row of three icon-only actions; each has a tooltip that matches its accessible name.
    const actions = page.locator("#contact a[target='_blank'], #contact button")
    await expect(actions).toHaveCount(3)
    const tips = { "View GitHub profile": 0, "View LinkedIn profile": 1, "Copy email address": 2 }
    for (const [tip, index] of Object.entries(tips)) {
      const action = actions.nth(index)
      await expect(action.locator("svg[aria-hidden]")).toHaveCount(1)
      await expect(action.locator("svg[aria-hidden]")).toBeVisible()
      await expect(action.locator("[aria-hidden=true]").last()).toHaveText(tip)
      expect(await action.getAttribute("aria-label")).toContain(tip)
      const box = (await action.boundingBox())!
      expect(box.width).toBeGreaterThanOrEqual(44)
      expect(box.height).toBeGreaterThanOrEqual(44)
    }
    const tops = await actions.evaluateAll(els => els.map(el => Math.round(el.getBoundingClientRect().top)))
    expect(new Set(tops).size).toBe(1)
    if (width > 800) {
      // Text starts under the title; the chips end level with the bottom of the illustration.
      const rows = await page.locator("#journey details[open]").evaluateAll(els =>
        els.map(el => {
          const image = el.querySelector("img")!.getBoundingClientRect()
          const chips = el.querySelector("summary + div > :last-child > :last-child")!.getBoundingClientRect()
          return Math.abs(chips.bottom - image.bottom)
        }),
      )
      for (const gap of rows) expect(gap).toBeLessThan(1)
    }
    await expect(page.getByRole("contentinfo")).toHaveCSS("flex-direction", width <= 520 ? "column" : "row")
    if (capture) await page.locator("#contact").screenshot({ path: info.outputPath(`${width}-contact.png`) })
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(
      await page.evaluate(() => document.documentElement.clientWidth),
    )
  })
}

test("Journey opens independently with pointer and keyboard, preserving focus and native semantics", async ({
  page,
  browserName,
}) => {
  await page.goto("/")
  await ready(page)
  const cards = page.locator("#journey details")
  await expect(cards).toHaveCount(5)
  await expect(page.locator("#journey details[open]")).toHaveCount(1)
  await expect(cards.last()).toHaveAttribute("open", "")
  await expect(summaries(page).last().getByText("Namecheap", { exact: true })).toBeVisible()
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
  for (const chevron of await page.locator("#journey summary > svg").all()) {
    await expect(chevron).toHaveCSS("color", "rgb(118, 217, 211)")
  }
  const dots = await cards.evaluateAll(elements =>
    elements.map(el => ({
      open: el.hasAttribute("open"),
      color: getComputedStyle(el, "::before").backgroundColor,
      border: getComputedStyle(el, "::before").borderColor,
    })),
  )
  for (const dot of dots) {
    expect(dot.border).toBe("rgb(118, 217, 211)")
    expect(dot.color).toBe(dot.open ? "rgb(118, 217, 211)" : "rgb(9, 15, 25)")
  }
})

test("email copy shows an animated toast and dismisses it after 2500ms", async ({ page }) => {
  await page.goto("/")
  await ready(page)
  await clipboard(page)
  await page.clock.install({ time: new Date("2026-11-18T12:00:00Z") })
  await page.clock.pauseAt(new Date("2026-11-18T12:00:01Z"))
  const button = copy(page),
    toast = status(page).locator("p")
  const width = (await button.boundingBox())!.width
  expect(await page.evaluate(() => Reflect.get(window, "copyCalls"))).toBe(0)
  await expect(status(page)).toBeEmpty()
  await button.dispatchEvent("click")
  expect(await page.evaluate(() => Reflect.get(window, "copiedAddress"))).toBe(EMAIL)
  await expect(toast).toHaveText("Email copied.")
  await expect(toast).toHaveCSS("position", "fixed")
  await expect(toast).toHaveCSS("background-color", "rgb(17, 27, 41)")
  await expect(toast).toHaveCSS("border-top-color", "rgb(118, 217, 211)")
  await expect(toast.locator("span")).toHaveCSS("color", "rgb(189, 179, 255)")
  await expect(toast).toHaveCSS("animation-duration", "0.2s")
  expect((await button.boundingBox())!.width).toBe(width)
  await page.clock.fastForward(2499)
  await expect(toast).toBeVisible()
  await page.clock.fastForward(1)
  await expect(status(page)).toBeEmpty()
  await button.dispatchEvent("click")
  await page.clock.fastForward(1000)
  await button.dispatchEvent("click")
  await page.clock.fastForward(1500)
  await expect(toast).toBeVisible()
  await page.clock.fastForward(1000)
  await expect(status(page)).toBeEmpty()
})

test("denied or missing Clipboard shows the address for manual copy and can recover", async ({ page }) => {
  await page.goto("/")
  await ready(page)
  const message = status(page)
  await expect(message).toBeEmpty()
  for (const mode of ["denied", "missing"] as const) {
    if (mode === "denied") await clipboard(page, true)
    else
      await page.evaluate(() => Object.defineProperty(navigator, "clipboard", { configurable: true, value: undefined }))
    await copy(page).click()
    await expect(message).toHaveText(`Automatic copy failed. The address is ${EMAIL}.`)
    await expect(message.getByText(EMAIL, { exact: true })).toHaveCSS("user-select", "text")
  }
  await clipboard(page)
  await copy(page).click()
  await expect(message).toHaveText("Email copied.")
})

test("slow clipboard avoids duplicate writes and updates after completion", async ({ page }) => {
  await page.goto("/")
  await ready(page)
  await page.evaluate(() => {
    Object.assign(window, { copyCalls: 0 })
    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: {
        writeText: () => {
          Reflect.set(window, "copyCalls", Number(Reflect.get(window, "copyCalls")) + 1)
          return new Promise<void>(resolve => Reflect.set(window, "finishCopy", resolve))
        },
      },
    })
  })
  await copy(page).click()
  await copy(page).click()
  expect(await page.evaluate(() => Reflect.get(window, "copyCalls"))).toBe(1)
  await expect(status(page)).toBeEmpty()
  await page.evaluate(() => Reflect.get(window, "finishCopy")())
  await expect(status(page)).toHaveText("Email copied.")
})

test("Contact actions, footer anchor and reduced motion preserve keyboard behavior", async ({ page, browserName }) => {
  await page.goto("/")
  await ready(page)
  await clipboard(page)
  const links = page.locator('#contact a[target="_blank"]')
  await expect(links).toHaveCount(2)
  for (const [i, href] of [
    "https://github.com/elibattistoni",
    "https://www.linkedin.com/in/elisa-battistoni-21597980/",
  ].entries()) {
    await expect(links.nth(i)).toHaveAttribute("href", href)
    await expect(links.nth(i)).toHaveAttribute("target", "_blank")
    await expect(links.nth(i)).toHaveAttribute("rel", "noopener noreferrer")
  }
  const violet = "rgb(189, 179, 255)"
  const actions = [...(await links.all()), copy(page)]
  const tip = (action: (typeof actions)[number]) => action.locator("[aria-hidden=true]").last()
  for (const action of actions) {
    await expect(action).toHaveCSS("color", violet)
    await expect(tip(action)).toHaveCSS("opacity", "0")
  }
  for (const action of actions) {
    await action.hover()
    await expect(action).toHaveCSS("border-top-color", violet)
    await expect(tip(action)).toHaveCSS("opacity", "1")
    // Centred over the icon, unless that would cross the screen edge; never cut off.
    const [icon, label] = [(await action.boundingBox())!, (await tip(action).boundingBox())!]
    const viewport = page.viewportSize()!.width
    expect(label.x).toBeGreaterThanOrEqual(0)
    expect(label.x + label.width).toBeLessThanOrEqual(viewport)
    const centred = Math.abs(label.x + label.width / 2 - (icon.x + icon.width / 2)) < 1
    const atEdge = label.x <= 9 || label.x + label.width >= viewport - 9
    expect(centred || atEdge).toBe(true)
  }
  // WCAG 1.4.13: the pointer can move from the icon up onto the tooltip and it stays open.
  const first = (await links.first().boundingBox())!
  await page.mouse.move(first.x + 10, first.y + first.height / 2)
  await expect(tip(links.first())).toHaveCSS("opacity", "1")
  const tipBox = (await tip(links.first()).boundingBox())!
  await page.mouse.move(first.x + 10, tipBox.y + tipBox.height / 2, { steps: 8 })
  await expect(tip(links.first())).toHaveCSS("opacity", "1")
  // Escape hides a hovered tooltip; it comes back on the next hover.
  await page.keyboard.press("Escape")
  await expect(tip(links.first())).toHaveCSS("opacity", "0")
  await page.mouse.move(0, 0)
  await links.first().hover()
  await expect(tip(links.first())).toHaveCSS("opacity", "1")
  await page.mouse.move(0, 0)
  await links.first().focus()
  const tab = browserName === "webkit" ? "Alt+Tab" : "Tab"
  await page.keyboard.press(tab)
  await expect(links.last()).toBeFocused()
  await page.keyboard.press(tab)
  await expect(copy(page)).toBeFocused()
  await expect(copy(page)).toHaveCSS("outline-color", violet)
  await expect(tip(copy(page))).toHaveCSS("opacity", "1")
  // Escape hides the focused tooltip without moving focus.
  await page.keyboard.press("Escape")
  await expect(tip(copy(page))).toHaveCSS("opacity", "0")
  await expect(copy(page)).toBeFocused()
  await page.emulateMedia({ reducedMotion: "reduce" })
  await page.keyboard.press("Enter")
  await expect(status(page)).toHaveText("Email copied.")
  await expect(status(page).locator("p")).toHaveCSS("animation-name", "none")
  expect(await page.evaluate(() => Reflect.get(window, "copiedAddress"))).toBe(EMAIL)
  await page.emulateMedia({ reducedMotion: "no-preference" })
  await expect(page.getByRole("contentinfo")).toContainText("© 2026 Elisa Battistoni · develysverse")
  await expect(page.locator("#journey details").first()).toHaveCSS("transition-duration", "0.25s")
  await expect(page.locator("#journey details").first().locator("summary > svg")).toHaveCSS(
    "transition-duration",
    "0.2s",
  )
  await summaries(page).first().click()
  await expect(page.locator("#journey details").first().locator("summary + div")).toHaveCSS(
    "animation-duration",
    "0.18s",
  )
  await summaries(page).first().click()
  await page.emulateMedia({ reducedMotion: "reduce" })
  await summaries(page).first().click()
  await expect(page.locator("#journey details").first().locator("summary + div")).toHaveCSS("animation-name", "none")
  await expect(page.locator("#journey details").first().locator("summary > svg")).toHaveCSS("transition-duration", "0s")
  await page.getByRole("link", { name: "Back to top" }).click()
  await expect(page).toHaveURL(/#top$/)
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBeLessThan(130)
})

test("Contact writes to the browser clipboard", async ({ page, context, browserName }) => {
  test.skip(browserName !== "chromium", "Chromium supports Playwright's clipboard permission overrides")
  await page.goto("/")
  await ready(page)
  await context.grantPermissions(["clipboard-read", "clipboard-write"])
  await copy(page).click()
  await expect(status(page)).toHaveText("Email copied.")
  expect(await page.evaluate(() => navigator.clipboard.readText())).toBe(EMAIL)
})

test("native Journey and manual Contact work with JavaScript disabled", async ({ browser, baseURL }) => {
  const context = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 390, height: 1000 } })
  const page = await context.newPage()
  await page.goto(`${baseURL}/`)
  await expect(page.locator("#journey details[open]")).toHaveCount(1)
  await summaries(page).first().click()
  await expect(page.locator("#journey details[open]")).toHaveCount(2)
  await expect(page.getByText(EMAIL, { exact: true })).toBeVisible()
  await expect(page.getByText(EMAIL, { exact: true })).toHaveCSS("user-select", "text")
  await expect(page.locator("#contact a[href^='mailto:']")).toHaveCount(0)
  await expect(copy(page)).toBeHidden()
  await expect(page.locator('#contact a[target="_blank"]')).toHaveCount(2)
  await context.close()
})
