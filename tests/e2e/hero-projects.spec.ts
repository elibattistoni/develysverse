import { expect, test, type Locator, type Page } from "@playwright/test"

async function ready(page: Page) {
  await page.evaluate(async () => {
    await document.fonts.ready
    await Promise.all(
      [...document.querySelectorAll<HTMLImageElement>("#top img, #projects img")].map(image => {
        image.loading = "eager"
        return image.decode()
      }),
    )
  })
  const controls = page.getByRole("group", { name: "Project carousel controls" })
  if (page.viewportSize()!.width <= 800) await expect(controls).toBeVisible()
  else await expect(controls).toBeHidden()
}

async function settle(page: Page) {
  await page.evaluate(async () => {
    await Promise.all(document.getAnimations().map(animation => animation.finished.catch(() => {})))
  })
}

async function geometry(locator: Locator) {
  return locator.evaluateAll(elements =>
    elements.map(element => {
      const r = element.getBoundingClientRect(),
        s = getComputedStyle(element)
      return {
        x: r.x,
        y: r.y,
        width: r.width,
        height: r.height,
        padding: s.padding,
        margin: s.margin,
        gap: s.gap,
        aspectRatio: s.aspectRatio,
      }
    }),
  )
}

async function exposedPoint(page: Page, locator: Locator) {
  await locator.scrollIntoViewIfNeeded()
  return locator.evaluate(button => {
    const r = button.getBoundingClientRect()
    for (const y of [0.1, 0.2, 0.5, 0.8, 0.9])
      for (const x of [0.1, 0.2, 0.5, 0.8, 0.9]) {
        const px = r.left + r.width * x,
          py = r.top + r.height * y
        if (button.contains(document.elementFromPoint(px, py))) return { x: px, y: py }
      }
    throw new Error("No exposed hit target for fragment")
  })
}

for (const width of [320, 390, 800, 801, 900, 1440]) {
  test(`Hero preserves v10 layout and Projects show the revised copy and links at ${width}px`, async ({
    page,
    context,
  }, info) => {
    await page.setViewportSize({ width, height: 1000 })
    await page.emulateMedia({ reducedMotion: width <= 800 ? "reduce" : "no-preference" })
    await page.goto("/")
    await ready(page)
    const reference = await context.newPage()
    await reference.setViewportSize({ width, height: 1000 })
    await reference.emulateMedia({ reducedMotion: width <= 800 ? "reduce" : "no-preference" })
    await reference.goto("/__reference/")
    await ready(reference)
    // Amendment (25 Nov 2026): the hero says "Software Engineer"; apply it to the immutable reference before comparing.
    await reference
      .locator("#top p")
      .first()
      .evaluate(el => {
        el.textContent = el.textContent!.replace("Experienced Software Developer", "Software Engineer")
      })
    for (const selector of ["#top", "#top h1", "#top p", "#top figure", "#top button[data-slot]"]) {
      const actual = await geometry(page.locator(selector)),
        expected = await geometry(reference.locator(selector))
      expect(actual.length).toBe(expected.length)
      for (let i = 0; i < actual.length; i++) {
        for (const key of ["x", "y", "width", "height"] as const)
          expect(Math.abs(actual[i][key] - expected[i][key]), `${selector} ${key}`).toBeLessThan(0.15)
        for (const key of ["padding", "margin", "gap"] as const)
          expect(actual[i][key], `${selector} ${key}`).toBe(expected[i][key])
      }
    }
    const copy = (el: Element) => (el as HTMLElement).innerText.replace(/\s+/g, " ").trim()
    expect(await page.locator("#top").evaluate(copy)).toBe(await reference.locator("#top").evaluate(copy))
    const brentaDescription =
      "Designed and built the website for a mountain running event, including its page structure, navigation, and visual design."
    const brentaCard = (container: Page) =>
      container
        .locator("#projectRail article")
        .filter({ has: container.getByRole("heading", { name: "Brenta Wild Race", exact: true }) })
    await expect(brentaCard(page).locator("p")).toHaveText(brentaDescription)
    const referenceBrenta = await brentaCard(reference).locator("p").evaluate(copy)
    // Link texts are compared separately below (amendment: icon-only links), so leave them out here.
    const copyWithoutLinks = (el: Element) => {
      const links = [...el.querySelectorAll<HTMLElement>("a")]
      links.forEach(link => (link.style.display = "none"))
      const text = (el as HTMLElement).innerText.replace(/\s+/g, " ").trim()
      links.forEach(link => (link.style.display = ""))
      return text
    }
    const referenceProjects = await reference.locator("#projectRail").evaluate(copyWithoutLinks)
    expect(await page.locator("#projectRail").evaluate(copyWithoutLinks)).toBe(
      referenceProjects.replace(referenceBrenta, brentaDescription),
    )
    // Amendment (25 Nov 2026): links are icon-only with a tooltip; destinations stay as in v10.
    const links = (els: Element[]) =>
      els.map(el => ({ href: el.getAttribute("href"), target: el.getAttribute("target"), rel: el.getAttribute("rel") }))
    expect(await page.locator("#projectRail a").evaluateAll(links)).toEqual(
      await reference.locator("#projectRail a").evaluateAll(links),
    )
    expect(
      await page.locator("#projectRail a").evaluateAll(els => els.map(el => el.getAttribute("aria-label"))),
    ).toEqual([
      "Visit website",
      "View code on GitHub",
      "View extension on Raycast",
      "View pull request on GitHub",
      "View extension on Raycast",
      "View pull request on GitHub",
    ])
    expect(await page.locator("#projectRail article").count()).toBe(3)
    expect(await page.locator("#projectRail a").count()).toBe(6)
    expect(await page.locator("#projectRail picture img").evaluate((el: HTMLImageElement) => el.currentSrc)).toContain(
      width <= 800 ? "project-brenta-mobile.webp" : "project-brenta-desktop.webp",
    )
    const previews = page.locator("#projectRail article img")
    await expect(previews.nth(1)).toHaveAttribute("src", /project-palette-v12\.webp$/)
    await expect(previews.nth(2)).toHaveAttribute("src", /project-picker-v12\.webp$/)
    for (const preview of await previews.all()) {
      const { width, height } = (await preview.boundingBox())!
      expect(width / height).toBeCloseTo(8 / 5, 1)
    }
    if ([390, 1440].includes(width)) {
      await page.mouse.move(0, 0)
      await settle(page)
      for (const [name, selector] of [
        ["hero", "#top"],
        ["projects", "#projects"],
      ] as const) {
        await page.locator(selector).screenshot({ path: info.outputPath(`${width}-${name}-initial.png`) })
      }
    }
    await reference.close()
  })
}

test("Hero swaps slots with mouse and keyboard, retaining selection and focus", async ({ page }, info) => {
  await page.setViewportSize({ width: 1440, height: 1000 })
  await page.goto("/")
  await ready(page)
  const software = page.locator("#top").getByRole("button", { name: "Software Engineering", exact: true })
  const data = page.locator("#top").getByRole("button", { name: "Data Science", exact: true })
  const neuro = page.locator("#top").getByRole("button", { name: "Neuroscience", exact: true })
  await expect(software).toHaveAttribute("data-slot", "front")
  await expect(data).toHaveAttribute("data-slot", "upper")
  await expect(neuro).toHaveAttribute("data-slot", "lower")
  const clickPoint = await exposedPoint(page, data)
  await page.mouse.click(clickPoint.x, clickPoint.y)
  await expect(data).toHaveAttribute("aria-pressed", "true")
  await expect(software).toHaveAttribute("data-slot", "upper")
  await settle(page)
  await page.mouse.move(0, 0)
  await settle(page)
  await page.locator("#top").screenshot({ path: info.outputPath("hero-data-front.png") })
  await neuro.focus()
  await page.keyboard.press("Space")
  await expect(neuro).toHaveAttribute("aria-pressed", "true")
  await expect(neuro).toBeFocused()
  await expect(data).toHaveAttribute("data-slot", "lower")
  await expect(page.locator('#top [aria-pressed="true"]')).toHaveCount(1)
  await settle(page)
  await page.locator("#top").screenshot({ path: info.outputPath("hero-neuroscience-front.png") })
  await software.focus()
  await page.keyboard.press("Enter")
  await expect(software).toHaveAttribute("aria-pressed", "true")
})

test("Hero tilt resets on leave/cancel, and respects reduced motion", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 })
  await page.goto("/")
  await ready(page)
  const front = page.locator('#top [data-slot="front"]'),
    art = front.locator("[data-fragment-art]")
  const point = await exposedPoint(page, front)
  await page.mouse.move(point.x, point.y)
  const eligible = await page.evaluate(() => matchMedia("(any-hover: hover) and (any-pointer: fine)").matches)
  if (eligible) await expect.poll(() => art.evaluate(el => el.style.getPropertyValue("--rx"))).not.toBe("")
  await page.mouse.move(0, 0)
  await expect.poll(() => art.evaluate(el => el.style.getPropertyValue("--rx"))).toBe("")
  await page.mouse.move(point.x, point.y)
  await front.dispatchEvent("pointercancel", { pointerType: "mouse" })
  await expect.poll(() => art.evaluate(el => el.style.getPropertyValue("--rx"))).toBe("")
  await page.emulateMedia({ reducedMotion: "reduce" })
  await page.mouse.move(point.x + 3, point.y + 3)
  await expect.poll(() => art.evaluate(el => el.style.getPropertyValue("--rx"))).toBe("")
  await expect(front).toHaveCSS("transition-duration", "0s")
})

test("carousel arrows, trackpad scroll, resize, focus and image hover", async ({ page }, info) => {
  await page.setViewportSize({ width: 390, height: 1000 })
  await page.emulateMedia({ reducedMotion: "reduce" })
  await page.goto("/")
  await ready(page)
  const rail = page.locator("#projectRail"),
    prev = page.getByRole("button", { name: "Scroll projects left" }),
    next = page.getByRole("button", { name: "Scroll projects right" })
  await expect(prev).toBeDisabled()
  await expect(next).toBeEnabled()
  await expect(rail).toHaveAttribute("tabindex", "0")
  const controls = page.getByRole("group", { name: "Project carousel controls" })
  const railBox = (await rail.boundingBox())!
  const controlsBox = (await controls.boundingBox())!
  expect(controlsBox.y).toBeGreaterThan(railBox.y + railBox.height)
  await next.press("Enter")
  await expect.poll(() => rail.evaluate(el => el.scrollLeft)).toBeGreaterThan(200)
  await expect(prev).toBeEnabled()
  await page.locator("#projects").screenshot({ path: info.outputPath("projects-second.png") })
  await next.click()
  await expect(next).toBeDisabled()
  await prev.click()
  await prev.click()
  await expect(prev).toBeDisabled()
  await rail.hover()
  await page.mouse.wheel(300, 0)
  await expect.poll(() => rail.evaluate(el => el.scrollLeft)).toBeGreaterThan(100)
  await page.setViewportSize({ width: 1440, height: 1000 })
  await expect(page.getByRole("group", { name: "Project carousel controls" })).toBeHidden()
  await expect(rail).toHaveAttribute("tabindex", "-1")
  const image = rail.locator("img").first(),
    before = await image.boundingBox()
  await image.hover()
  expect(await image.boundingBox()).toEqual(before)
  await expect(image).toHaveCSS("transform", "none")
  const link = rail.getByRole("link").first()
  await link.focus()
  await page.keyboard.press(info.project.name === "webkit" ? "Alt+Tab" : "Tab")
  await page.keyboard.press(info.project.name === "webkit" ? "Alt+Shift+Tab" : "Shift+Tab")
  await expect(link).toBeFocused()
  await expect(link).toHaveCSS("outline-color", "rgb(189, 179, 255)")
  await page.locator("#projects").screenshot({ path: info.outputPath("projects-link-focus.png") })
})

test("Hero CTAs and Projects remain usable without JavaScript", async ({ browser, baseURL }) => {
  const context = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 390, height: 1000 } })
  const page = await context.newPage()
  await page.goto(`${baseURL}/`)
  await expect(page.locator("#top img")).toHaveCount(3)
  await expect(page.locator("#projectRail a")).toHaveCount(6)
  await page.getByRole("link", { name: "Explore Projects" }).click()
  await expect(page).toHaveURL(/#projects$/)
  await expect(page.getByRole("heading", { name: "Brenta Wild Race", exact: true })).toBeVisible()
  await context.close()
})

test("mobile project titles and links align, with the compact layout retained on desktop", async ({ page }, info) => {
  await page.emulateMedia({ reducedMotion: "reduce" })
  await page.goto("/")
  await ready(page)
  for (const width of [320, 390, 520, 800]) {
    await page.setViewportSize({ width, height: 1000 })
    const cards = page.locator("#projectRail article")
    const heights = await cards.evaluateAll(elements => elements.map(el => el.getBoundingClientRect().height))
    expect(Math.max(...heights) - Math.min(...heights), `card heights at ${width}px`).toBeLessThan(0.15)
    const titleTops = await cards
      .getByRole("heading", { level: 3 })
      .evaluateAll(titles => titles.map(title => title.getBoundingClientRect().top))
    expect(titleTops).toHaveLength(3)
    expect(Math.max(...titleTops) - Math.min(...titleTops), `title alignment at ${width}px`).toBeLessThan(0.15)
    const bottom = await cards.evaluateAll(elements =>
      elements.map(el => el.querySelectorAll("a")[el.querySelectorAll("a").length - 1].getBoundingClientRect().bottom),
    )
    expect(Math.max(...bottom) - Math.min(...bottom), `link alignment at ${width}px`).toBeLessThan(0.15)
    for (const index of [0, 2]) {
      await cards.nth(index).scrollIntoViewIfNeeded()
      await expect(cards.nth(index).getByRole("link").last()).toBeInViewport()
      if (width === 390)
        await cards.nth(index).screenshot({ path: info.outputPath(`390-project-card-${index + 1}-equal-height.png`) })
    }
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(
      await page.evaluate(() => document.documentElement.clientWidth),
    )
  }
  await page.setViewportSize({ width: 900, height: 1000 })
  const cards = page.locator("#projectRail article")
  const heights = await cards.evaluateAll(elements => elements.map(el => el.getBoundingClientRect().height))
  expect(heights[2]).toBeLessThan(heights[0])
  for (const card of await cards.all()) {
    await expect(card).toHaveCSS("padding-top", "24px")
    await expect(card).toHaveCSS("padding-bottom", "24px")
  }
})
