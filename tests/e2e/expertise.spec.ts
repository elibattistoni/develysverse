import { expect, test, type Page } from "@playwright/test"

const TITLES = ["Software Engineering", "Data Science", "Cognitive Neuroscience"]
const DESCRIPTIONS = [
  "I build billing and security features for EasyWP.",
  "My work included predictive modeling and geospatial analysis.",
  "I studied how people direct their attention in natural scenes.",
]
const grid = (page: Page) => page.locator("[data-expertise-grid]")
const paperBody = (page: Page) => page.locator("[data-publications-content]")

async function ready(page: Page) {
  await page.evaluate(async () => {
    await document.fonts.ready
    await Promise.all([...document.querySelectorAll<HTMLImageElement>("#top img, #projects img")].map(image => { image.loading = "eager"; return image.decode() }))
  })
  await expect(page.getByRole("button", { name: "View details: Software Engineering", exact: true })).toBeVisible()
}

async function settle(page: Page) {
  await page.mouse.move(0, 0)
  await page.evaluate(() => Promise.all(document.getAnimations().map(animation => animation.finished.catch(() => {}))))
}

for (const width of [320, 390, 800, 801, 900, 1060, 1440]) {
  test(`Expertise essentials, compact layout and unchanged DOI links at ${width}px`, async ({ page, context }, info) => {
    await page.setViewportSize({ width, height: 1000 })
    await page.emulateMedia({ reducedMotion: "reduce" })
    await page.goto("/"); await ready(page)
    const cards = grid(page).locator("article")
    const essentials = [/TypeScript.*React/, /Python.*machine learning/, /eye tracking.*EEG/i]
    const heights = () => cards.evaluateAll(elements => elements.map(element => element.getBoundingClientRect().height))
    const overviewHeights = await heights()
    const capture = [390, 1440].includes(width)
    const controls = await cards.evaluateAll(elements => elements.map(card => {
      const [description, skills] = card.querySelectorAll("p")
      const button = card.querySelector("button")!.getBoundingClientRect()
      const skillsBox = skills.getBoundingClientRect()
      return {
        buttonBottom: button.bottom,
        skillsGap: button.top - skillsBox.bottom,
        groupGap: skillsBox.top - description.getBoundingClientRect().bottom,
      }
    }))
    for (const control of controls) {
      expect(control.skillsGap).toBeCloseTo(16, 1)
      if (width > 800) expect(control.groupGap).toBeGreaterThan(3.9)
      else expect(control.groupGap).toBeCloseTo(24, 1)
    }
    if (width > 800) {
      expect(new Set(overviewHeights).size).toBe(1)
      const bottoms = controls.map(control => control.buttonBottom)
      expect(Math.max(...bottoms) - Math.min(...bottoms)).toBeLessThan(.15)
      expect(overviewHeights[0]).toBeGreaterThanOrEqual(300)
      expect(overviewHeights[0]).toBeLessThanOrEqual(320)
    }
    if (capture) await grid(page).screenshot({ path: info.outputPath(`${width}-expertise-front.png`) })
    for (const [index, title] of TITLES.entries()) {
      await expect(cards.nth(index).locator("p").first()).toHaveText(DESCRIPTIONS[index])
      await expect(cards.nth(index).locator("p").nth(1)).toHaveText(essentials[index])
      await page.getByRole("button", { name: `View details: ${title}`, exact: true }).click()
      await expect(cards.nth(index).getByRole("definition").first()).toBeVisible()
    }
    if (width > 800) {
      expect(await heights()).toEqual(overviewHeights)
      const firstPaperVisible = await paperBody(page).evaluate(body => {
        const frameBottom = body.getBoundingClientRect().bottom
        const headingBottom = body.querySelector("h4")!.getBoundingClientRect().bottom
        const firstPaperTop = body.querySelector("a")!.getBoundingClientRect().top
        return headingBottom <= frameBottom && frameBottom - firstPaperTop >= 14
      })
      expect(firstPaperVisible).toBe(true)
    } else {
      expect((await heights())[2]).toBeGreaterThan(overviewHeights[2])
    }
    const reference = await context.newPage()
    await reference.goto("/__reference/")
    const links = (elements: Element[]) => elements.map(element => ({ title: element.textContent!.trim(), href: element.getAttribute("href"), target: element.getAttribute("target"), rel: element.getAttribute("rel") }))
    const publications = page.locator("#expertise li a")
    await expect(publications).toHaveCount(4)
    expect(await publications.evaluateAll(links)).toEqual(await reference.locator("#expertise li a").evaluateAll(links))
    await reference.close()
    if (capture) {
      await settle(page)
      await grid(page).screenshot({ path: info.outputPath(`${width}-expertise-back.png`) })
      if (width > 800) {
        await paperBody(page).evaluate(element => element.scrollTop = element.scrollHeight)
        await expect(paperBody(page).locator("..")).not.toHaveAttribute("data-more-content")
        await grid(page).screenshot({ path: info.outputPath(`${width}-expertise-publications-bottom.png`) })
      }
    }
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(await page.evaluate(() => document.documentElement.clientWidth))
  })
}

test("independent flips manage focus, inert faces and desktop height", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 }); await page.goto("/"); await ready(page)
  const cards = grid(page).locator("article")
  const before = await cards.evaluateAll(elements => elements.map(el => el.getBoundingClientRect().height))
  for (const title of TITLES) {
    const trigger = page.locator(`button[aria-label="View details: ${title}"]`)
    await trigger.focus(); await page.keyboard.press("Enter")
    const card = page.locator(`article[aria-labelledby="${title === TITLES[0] ? 'software' : title === TITLES[1] ? 'data' : 'neuroscience'}-expertise-title"]`)
    await expect(card.locator('h3[tabindex="-1"]')).toBeFocused()
    await expect(trigger).toHaveAttribute("aria-expanded", "true")
    expect(await card.locator("[inert]").count()).toBe(1)
    await expect(page.locator("#expertise article[data-flipped]")).toHaveCount(1)
    expect(await cards.evaluateAll(elements => elements.map(el => el.getBoundingClientRect().height))).toEqual(before)
    await card.getByRole("button", { name: `Back to overview: ${title}`, exact: true }).press("Enter")
    await expect(trigger).toBeFocused()
  }
  for (const title of TITLES) {
    await page.getByRole("button", { name: `View details: ${title}`, exact: true }).click()
  }
  await expect(page.locator("#expertise article[data-flipped]")).toHaveCount(3)
  expect(await cards.evaluateAll(elements => elements.map(el => el.getBoundingClientRect().height))).toEqual(before)
  for (const title of TITLES) {
    await page.getByRole("button", { name: `Back to overview: ${title}`, exact: true }).click()
    await expect(page.getByRole("button", { name: `View details: ${title}`, exact: true })).toBeFocused()
  }
  await expect(page.locator("#expertise article[data-flipped]")).toHaveCount(0)
})

test("publications scroll only their body, reach all papers and reset on reopen", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 }); await page.goto("/"); await ready(page)
  const open = page.getByRole("button", { name: "View details: Cognitive Neuroscience", exact: true })
  await open.click(); await settle(page)
  const body = paperBody(page), back = page.locator("#neuroscience-expertise-details")
  const heading = back.locator("h3"), close = page.getByRole("button", { name: "Back to overview: Cognitive Neuroscience", exact: true })
  const before = { heading: await heading.boundingBox(), close: await close.boundingBox() }
  await expect(body).toHaveAttribute("tabindex", "0"); await expect(body).toHaveAttribute("role", "region")
  await expect(body.getByRole("heading", { name: "Selected publications (4)", exact: true })).toBeInViewport()
  await expect(body.getByRole("link").first()).toBeInViewport()
  await expect(body.locator("..")).toHaveAttribute("data-more-content", "")
  for (const paper of await body.getByRole("link").all()) {
    await paper.focus()
    await expect(paper).toBeFocused()
    await expect(paper).toBeInViewport()
  }
  await body.focus(); await page.keyboard.press("End")
  await expect.poll(() => body.evaluate(el => el.scrollTop)).toBeGreaterThan(0)
  await expect(body.getByText("Experiments and analysis", { exact: true })).toBeInViewport()
  await expect(body.locator("..")).not.toHaveAttribute("data-more-content")
  expect(await heading.boundingBox()).toEqual(before.heading)
  expect(await close.boundingBox()).toEqual(before.close)
  await close.click(); await open.click()
  await expect.poll(() => body.evaluate(el => el.scrollTop)).toBe(0)
  await expect(body.locator("..")).toHaveAttribute("data-more-content", "")
})

test("mobile details grow naturally and stay accessible with reduced motion", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 1000 }); await page.emulateMedia({ reducedMotion: "reduce" }); await page.goto("/"); await ready(page)
  await page.getByRole("button", { name: "View details: Cognitive Neuroscience", exact: true }).click()
  const body = paperBody(page)
  expect(await body.evaluate(el => el.scrollHeight-el.clientHeight)).toBeLessThanOrEqual(1)
  await expect(body).not.toHaveAttribute("tabindex", "0"); await expect(body).not.toHaveAttribute("role", "region")
  const face = page.locator("#neuroscience-expertise-details")
  await expect(face).toHaveCSS("transform", "none"); await expect(face).toHaveCSS("transition-duration", "0s")
  const paper = page.getByRole("link", { name: /^Rapid influences/ })
  await paper.scrollIntoViewIfNeeded(); await expect(paper).toBeInViewport()
  await page.getByRole("button", { name: "Back to overview: Cognitive Neuroscience", exact: true }).click()
  await expect(page.getByRole("button", { name: "View details: Cognitive Neuroscience", exact: true })).toBeFocused()
})

test("no-JavaScript fallback exposes both faces and all four publications", async ({ browser, baseURL }) => {
  const context = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 1440, height: 1000 } })
  const page = await context.newPage(); await page.goto(`${baseURL}/`)
  await expect(page.locator("#expertise article")).toHaveCount(3)
  await expect(page.locator("#expertise [inert]")).toHaveCount(0)
  await expect(page.getByRole("button", { name: /^View details:/ })).toHaveCount(0)
  for (const paper of await page.locator("#expertise li a").all()) await expect(paper).toBeVisible()
  await expect(page.locator("#expertise dl")).toHaveCount(4)
  await expect(page.getByRole("heading", { name: "Selected publications (4)", exact: true })).toBeVisible()
  await context.close()
})
