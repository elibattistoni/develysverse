import { expect, test, type Page } from "@playwright/test"

const TITLES = ["Software Engineering", "Data Science", "Cognitive Neuroscience, PhD"]
const TAGS = ["TypeScript · React · Next.js", "Python · Data Analysis · ML · NLP", "MEG/EEG · Eye Tracking · MATLAB · R"]
const BACK_COPY = [
  "I build and maintain web applications at Namecheap, with a focus on the interfaces our customers use every day. I also take on full-stack freelance projects, build software of my own, and contribute to open source.",
  "I used Python to explore datasets and build predictive models. My work ranged from analyzing geospatial data and mapping user journeys to applying natural language processing to chatbots.",
  "I studied how people direct their attention when searching for something in a complex visual scene. I combined behavioral measures with neuroimaging and used machine learning to decode patterns of brain activity.",
]
const EMPHASIS = [
  ["web applications", "Namecheap", "full-stack", "open source"],
  ["Python", "predictive models", "geospatial data", "natural language processing"],
  ["attention", "visual scene", "behavioral measures", "neuroimaging", "machine learning", "decode", "brain activity"],
]
const grid = (page: Page) => page.locator("[data-expertise-grid]")
const paperBody = (page: Page) => page.locator("#neuroscience-expertise-details [data-expertise-back-content]")

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
    const heights = () => cards.evaluateAll(elements => elements.map(element => element.getBoundingClientRect().height))
    const overviewHeights = await heights()
    const capture = [390, 1440].includes(width)
    const controls = await cards.evaluateAll(elements => elements.map(card => {
      const title = card.querySelector("h3")!
      const icon = title.previousElementSibling!.getBoundingClientRect()
      const skills = card.querySelector("p")!
      const button = card.querySelector("button")!.getBoundingClientRect()
      const skillsBox = skills.getBoundingClientRect()
      return {
        buttonBottom: button.bottom,
        iconGap: title.getBoundingClientRect().top - icon.bottom,
        titleGap: skillsBox.top - title.getBoundingClientRect().bottom,
        buttonGap: button.top - skillsBox.bottom,
        iconSize: [icon.width, icon.height],
      }
    }))
    for (const control of controls) {
      expect(control.titleGap).toBeCloseTo(control.iconGap, 1)
      expect(control.iconSize).toEqual([40, 40])
      if (width > 800) expect(control.buttonGap).toBeGreaterThanOrEqual(4)
      else expect(control.buttonGap).toBeCloseTo(24, 1)
    }
    if (width > 800) {
      expect(new Set(overviewHeights).size).toBe(1)
      const bottoms = controls.map(control => control.buttonBottom)
      expect(Math.max(...bottoms) - Math.min(...bottoms)).toBeLessThan(.15)
      expect(overviewHeights[0]).toBeCloseTo(265, 1)
    }
    if (capture) await grid(page).screenshot({ path: info.outputPath(`${width}-expertise-front.png`) })
    for (const [index, title] of TITLES.entries()) {
      const card = cards.nth(index)
      const back = card.locator("[data-expertise-back-content]")
      const backCopy = back.locator("p")
      await expect(card.locator("h3").first()).toHaveText(title)
      const front = card.locator("[class*='expertiseFront']").first()
      await expect(front.locator("p")).toHaveCount(1)
      await expect(front.locator("p")).toHaveText(TAGS[index])
      await page.getByRole("button", { name: `View details: ${title}`, exact: true }).click()
      await expect(backCopy).toHaveCount(1)
      await expect(backCopy).toBeVisible()
      await expect(backCopy).toHaveText(BACK_COPY[index])
      await expect(backCopy.locator("strong")).toHaveText(EMPHASIS[index])
      const details = card.getByRole("group", { name: title, exact: true })
      await expect(details.getByRole("heading", { name: title, exact: true })).toHaveCount(0)
      await expect(details.locator(":scope > :first-child")).toHaveClass(/expertiseBackScroll/)
      const backIcon = details.getByRole("button").locator("span[aria-hidden] svg")
      await expect(backIcon).toHaveCSS("width", "28px")
      expect(await backIcon.innerHTML()).toBe(await front.locator("svg").first().innerHTML())
      if (width === 1440 && index < 2) {
        const gaps = await back.evaluate(element => {
          const frame = element.getBoundingClientRect()
          const paragraph = element.querySelector("p")!.getBoundingClientRect()
          return {
            top: paragraph.top - frame.top,
            bottom: frame.bottom - paragraph.bottom - parseFloat(getComputedStyle(element).paddingBottom),
          }
        })
        expect(gaps.top).toBeGreaterThan(0)
        expect(gaps.top).toBeCloseTo(gaps.bottom, 1)
      }
      if (width <= 800) {
        await expect(back).toHaveCSS("overflow-y", "visible")
        expect(await back.evaluate(element => element.scrollHeight - element.clientHeight)).toBeLessThanOrEqual(1)
      }
    }
    if (width > 800) {
      expect(await heights()).toEqual(overviewHeights)
      const body = paperBody(page)
      expect(await body.evaluate(element => element.scrollTop)).toBe(0)
      if (width === 1440) {
        const clearance = await body.evaluate(element => {
          const frameBottom = element.getBoundingClientRect().bottom
          const firstPaperBottom = element.querySelector("a")!.getBoundingClientRect().bottom
          return frameBottom - firstPaperBottom
        })
        expect(clearance).toBeGreaterThanOrEqual(8)
        const firstSectionOffset = await body.evaluate(element =>
          element.firstElementChild!.getBoundingClientRect().top - element.getBoundingClientRect().top
        )
        expect(firstSectionOffset).toBeCloseTo(0, 1)
      }
    } else {
      expect((await heights())[2]).toBeGreaterThan(overviewHeights[2])
    }
    const reference = await context.newPage()
    await reference.goto("/__reference/")
    const links = (elements: Element[]) => elements.map(element => ({ title: element.textContent!.trim(), href: element.getAttribute("href"), target: element.getAttribute("target"), rel: element.getAttribute("rel") }))
    const publications = page.locator("#expertise li a")
    await expect(publications).toHaveCount(4)
    const headings = paperBody(page).getByRole("heading")
    await expect(headings).toHaveText(["Selected Publications", "Studies & Research"])
    const paragraphColor = await paperBody(page).locator("p").evaluate(element => getComputedStyle(element).color)
    for (const heading of await headings.all()) {
      await expect(heading).toHaveCSS("font-size", "16px")
      await expect(heading).toHaveCSS("font-weight", "700")
      await expect(heading).toHaveCSS("color", paragraphColor)
    }
    await expect(headings.last().locator("..")).toHaveCSS("margin-top", "20px")
    await expect(publications.first()).toHaveCSS("font-size", "16px")
    await expect(paperBody(page).locator("ol > li")).toHaveCount(4)
    await expect(paperBody(page).locator("ol")).toHaveCSS("list-style-type", "decimal")
    await expect(publications.first()).toHaveCSS("text-decoration-line", "none")
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
    for (const paper of await publications.all()) {
      await paper.focus()
      await expect(paper).toBeFocused()
      await expect(paper).toBeInViewport()
    }
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(await page.evaluate(() => document.documentElement.clientWidth))
  })
}

for (const width of [390, 1440]) {
  test(`only the bottom row flips either Expertise face at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 1000 })
    await page.emulateMedia({ reducedMotion: "reduce" })
    await page.goto("/"); await ready(page)

    const card = grid(page).locator("article").first()
    const open = card.getByRole("button", { name: "View details: Software Engineering", exact: true })
    const close = card.getByRole("button", { name: "Back to overview: Software Engineering", exact: true })
    const cardWidth = (await card.boundingBox())!.width
    await card.getByRole("heading", { name: "Software Engineering", exact: true }).click()
    await expect(open).toHaveAttribute("aria-expanded", "false")
    await expect(open).toHaveText("")
    const openBox = (await open.boundingBox())!
    expect(openBox.width).toBeCloseTo(cardWidth - 2, 1)
    const openArrow = (await open.locator("svg").boundingBox())!
    expect(openArrow.x).toBeGreaterThan(openBox.x + openBox.width / 2)
    await open.click({ position: { x: 32, y: openBox.height - 8 } })

    await expect(card).toHaveAttribute("data-flipped", "")
    await card.locator("[data-expertise-back-content] p").click()
    await expect(card).toHaveAttribute("data-flipped", "")
    await expect(close).toHaveText("")
    const closeBox = (await close.boundingBox())!
    expect(closeBox.width).toBeCloseTo(cardWidth - 2, 1)
    const closeArrow = (await close.locator("svg").first().boundingBox())!
    expect(closeArrow.x + closeArrow.width).toBeLessThan(closeBox.x + closeBox.width / 2)
    const backIcon = (await close.locator("span[aria-hidden] svg").boundingBox())!
    expect(backIcon.x).toBeGreaterThan(closeBox.x + closeBox.width / 2)
    await close.click({ position: { x: closeBox.width - 32, y: closeBox.height - 8 } })
    await expect(open).toHaveAttribute("aria-expanded", "false")
    await expect(open).toBeFocused()
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
    await expect(card.getByRole("group", { name: title, exact: true })).toBeFocused()
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
  const open = page.getByRole("button", { name: "View details: Cognitive Neuroscience, PhD", exact: true })
  await open.click(); await settle(page)
  const body = paperBody(page)
  const close = page.getByRole("button", { name: "Back to overview: Cognitive Neuroscience, PhD", exact: true })
  const closeBefore = await close.boundingBox()
  await expect(body).toHaveAttribute("tabindex", "0"); await expect(body).toHaveAttribute("role", "region")
  await expect(body.getByRole("heading", { name: "Selected Publications", exact: true })).toBeInViewport()
  const firstPaper = body.getByRole("link").first()
  await expect(firstPaper).toBeInViewport()
  const linkColor = await firstPaper.evaluate(element => getComputedStyle(element).color)
  await firstPaper.hover()
  await expect(firstPaper).toHaveCSS("text-decoration-line", "underline")
  await expect(firstPaper).toHaveCSS("color", linkColor)
  await page.mouse.move(0, 0)
  await expect(firstPaper).toHaveCSS("text-decoration-line", "none")
  await body.focus()
  await page.keyboard.press("Tab")
  // WebKit can skip links in the default tab order on macOS.
  await firstPaper.focus()
  await expect(firstPaper).toBeFocused()
  await expect(firstPaper).toHaveCSS("text-decoration-line", "underline")
  await expect(firstPaper).toHaveCSS("color", linkColor)
  await expect(body.locator("..")).toHaveAttribute("data-more-content", "")
  for (const paper of await body.getByRole("link").all()) {
    await paper.focus()
    await expect(paper).toBeFocused()
    await expect(paper).toBeInViewport()
  }
  await body.focus(); await page.keyboard.press("End")
  await expect.poll(() => body.evaluate(el => el.scrollTop)).toBeGreaterThan(0)
  await expect.poll(() => body.evaluate(el => el.scrollHeight - el.clientHeight - el.scrollTop)).toBeLessThanOrEqual(2)
  await expect(body.locator("..")).not.toHaveAttribute("data-more-content")
  expect(await close.boundingBox()).toEqual(closeBefore)
  await close.click(); await open.click()
  await expect.poll(() => body.evaluate(el => el.scrollTop)).toBe(0)
  await expect(body.locator("..")).toHaveAttribute("data-more-content", "")
})

test("long Software Engineering back scrolls without moving its return button", async ({ page }) => {
  await page.setViewportSize({ width: 801, height: 1000 })
  await page.emulateMedia({ reducedMotion: "reduce" })
  await page.goto("/"); await ready(page)
  await page.getByRole("button", { name: "View details: Software Engineering", exact: true }).click()
  const back = page.locator("#software-expertise-details")
  const body = back.getByRole("region", { name: "Software Engineering details" })
  const close = back.getByRole("button", { name: "Back to overview: Software Engineering" })
  const closeTop = (await close.boundingBox())!.y
  await expect(body).toHaveAttribute("tabindex", "0")
  await expect(body.locator("..")).toHaveAttribute("data-more-content", "")
  await body.press("End")
  await expect.poll(() => body.evaluate(el => el.scrollTop)).toBeGreaterThan(0)
  await expect(body.locator("..")).not.toHaveAttribute("data-more-content")
  expect((await close.boundingBox())!.y).toBeCloseTo(closeTop, 1)
  await close.press("Enter")
  await expect(page.getByRole("button", { name: "View details: Software Engineering", exact: true })).toBeFocused()
})

test("mobile details grow naturally and stay accessible with reduced motion", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 1000 }); await page.emulateMedia({ reducedMotion: "reduce" }); await page.goto("/"); await ready(page)
  await page.getByRole("button", { name: "View details: Cognitive Neuroscience, PhD", exact: true }).click()
  const body = paperBody(page)
  expect(await body.evaluate(el => el.scrollHeight-el.clientHeight)).toBeLessThanOrEqual(1)
  await expect(body).not.toHaveAttribute("tabindex", "0"); await expect(body).not.toHaveAttribute("role", "region")
  const face = page.locator("#neuroscience-expertise-details")
  await expect(face).toHaveCSS("transform", "none"); await expect(face).toHaveCSS("transition-duration", "0s")
  for (const paper of await body.getByRole("link").all()) {
    await paper.scrollIntoViewIfNeeded()
    await expect(paper).toBeInViewport()
  }
  await page.getByRole("button", { name: "Back to overview: Cognitive Neuroscience, PhD", exact: true }).click()
  await expect(page.getByRole("button", { name: "View details: Cognitive Neuroscience, PhD", exact: true })).toBeFocused()
})

test("no-JavaScript fallback exposes both faces and all four publications", async ({ browser, baseURL }) => {
  const context = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 1440, height: 1000 } })
  const page = await context.newPage(); await page.goto(`${baseURL}/`)
  await expect(page.locator("#expertise article")).toHaveCount(3)
  await expect(page.locator("#expertise [inert]")).toHaveCount(0)
  await expect(page.getByRole("button", { name: /^View details:/ })).toHaveCount(0)
  for (const paper of await page.locator("#expertise li a").all()) await expect(paper).toBeVisible()
  await expect(page.locator("#expertise [data-expertise-back-content] p")).toHaveCount(3)
  await expect(page.getByRole("heading", { name: "Selected Publications", exact: true })).toBeVisible()
  await context.close()
})
