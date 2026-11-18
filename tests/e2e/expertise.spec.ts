import { expect, test, type Locator, type Page } from "@playwright/test"
import sharp from "sharp"

const TITLES = ["Software Engineering", "Data Science", "Cognitive Neuroscience"]
const grid = (page: Page, reference = false) => page.locator(reference ? ".expertise-grid" : "[data-expertise-grid]")
const paperBody = (page: Page, reference = false) => page.locator(reference ? ".neuroscience-content" : "[data-publications-content]")

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

async function boxes(locator: Locator) {
  return locator.evaluateAll(elements => elements.map(element => {
    const r = element.getBoundingClientRect(), css = getComputedStyle(element)
    return { x: r.x + window.scrollX, y: r.y + window.scrollY, width: r.width, height: r.height, padding: css.padding, font: css.font, gap: css.gap }
  }))
}

for (const width of [320, 390, 800, 801, 900, 1060, 1440]) {
  test(`Expertise front/back layout and copy match v10 at ${width}px`, async ({ page, context }, info) => {
    const reducedMotion = width <= 800 ? "reduce" : "no-preference"
    await page.setViewportSize({ width, height: 1000 }); await page.emulateMedia({ reducedMotion })
    await page.goto("/"); await ready(page)
    const reference = await context.newPage()
    await reference.setViewportSize({ width, height: 1000 }); await reference.emulateMedia({ reducedMotion })
    await reference.goto("/__reference/"); await ready(reference)
    async function compare() {
      await settle(page); await settle(reference)
      for (const [actual, expected] of [[grid(page), grid(reference, true)], [grid(page).locator("article"), grid(reference, true).locator("article")]] as const) {
        const a = await boxes(actual), b = await boxes(expected)
        expect(a.length).toBe(b.length)
        for (let i = 0; i < a.length; i++) {
          for (const key of ["x", "y", "width", "height"] as const) expect(Math.abs(a[i][key]-b[i][key]), key).toBeLessThan(.15)
          for (const key of ["padding", "font", "gap"] as const) expect(a[i][key], key).toBe(b[i][key])
        }
      }
    }
    async function shot(state: string) {
      if (![390, 1440].includes(width)) return
      await settle(page); await settle(reference)
      const a = await grid(page).screenshot({ path: info.outputPath(`${width}-expertise-${state}.png`) })
      const b = await grid(reference, true).screenshot({ path: info.outputPath(`${width}-expertise-${state}-v10-live.png`) })
      const [current, baseline] = await Promise.all([sharp(a).removeAlpha().raw().toBuffer({ resolveWithObject: true }), sharp(b).removeAlpha().raw().toBuffer({ resolveWithObject: true })])
      expect(current.info).toEqual(baseline.info)
      let different = 0
      for (let i=0; i<current.data.length; i+=3) if (Math.max(Math.abs(current.data[i]-baseline.data[i]), Math.abs(current.data[i+1]-baseline.data[i+1]), Math.abs(current.data[i+2]-baseline.data[i+2]))>8) different++
      const ratio = different / (current.info.width*current.info.height)
      await info.attach(`${width}-expertise-${state}-comparison`, { body: JSON.stringify({ width, state, changedPixelRatio: ratio, channelThreshold: 8, maxChangedPixelRatio: .002 }), contentType: "application/json" })
      expect(ratio).toBeLessThan(.002)
    }
    await compare(); await shot("front")
    for (const title of TITLES) {
      await page.getByRole("button", { name: `View details: ${title}`, exact: true }).click()
      await reference.getByRole("button", { name: `View details: ${title}`, exact: true }).click()
    }
    await compare(); await shot("back")
    const links = (elements: Element[]) => elements.map(element => ({ title: element.textContent!.trim(), href: element.getAttribute("href"), target: element.getAttribute("target"), rel: element.getAttribute("rel") }))
    expect(await page.locator("#expertise li a").evaluateAll(links)).toEqual(await reference.locator("#expertise li a").evaluateAll(links))
    await expect(page.locator("#expertise li a")).toHaveCount(4)
    expect((await grid(page).locator("dt, dd").allTextContents()).map(text => text.trim())).toEqual((await grid(reference, true).locator("dt, dd").allTextContents()).map(text => text.trim()))
    if (width > 800) {
      const firstHeight = (await grid(page).boundingBox())!.height
      await paperBody(page).evaluate(el => el.scrollTop = el.scrollHeight)
      await paperBody(reference, true).evaluate(el => el.scrollTop = el.scrollHeight)
      await expect.poll(() => paperBody(page).evaluate(el => el.parentElement!.hasAttribute("data-more-content"))).toBe(false)
      expect((await grid(page).boundingBox())!.height).toBe(firstHeight)
      await shot("publications-bottom")
    }
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(await page.evaluate(() => document.documentElement.clientWidth))
    await reference.close()
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
  await body.focus(); await page.keyboard.press("End")
  await expect.poll(() => body.evaluate(el => el.scrollTop)).toBeGreaterThan(0)
  await expect(page.getByRole("link", { name: /^Rapid influences/ })).toBeInViewport()
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
  await expect(page.locator("#expertise dl")).toHaveCount(3)
  await context.close()
})
