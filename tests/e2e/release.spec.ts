import { expect, test, type Page } from "@playwright/test"
import type { AxeResults } from "axe-core"
import { readFile } from "node:fs/promises"

const disciplines = ["Software Engineering", "Data Science", "Cognitive Neuroscience, PhD"]
async function ready(page: Page) {
  await page.evaluate(async () => {
    await document.fonts.ready
    await Promise.all(
      [...document.querySelectorAll<HTMLImageElement>("img")].map(image => {
        image.loading = "eager"
        return image.decode()
      }),
    )
    await new Promise(requestAnimationFrame)
    await new Promise(requestAnimationFrame)
  })
}
async function allDetails(page: Page) {
  for (const title of disciplines)
    await page.getByRole("button", { name: `View details: ${title}`, exact: true }).click()
  for (let index = 0; index < 4; index++) await page.locator("#journey details").nth(index).locator("summary").click()
}
async function audit(page: Page): Promise<AxeResults> {
  await page.addScriptTag({ path: require.resolve("axe-core/axe.min.js") })
  return page.evaluate(async () => {
    const engine = (window as typeof window & { axe: typeof import("axe-core") }).axe
    return engine.run(document, {
      runOnly: { type: "tag", values: ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa", "best-practice"] },
    })
  })
}

for (const width of [320, 390, 900, 1440]) {
  test(`accessibility audit covers overview, expanded content and copy fallback at ${width}px`, async ({
    page,
  }, info) => {
    test.setTimeout(60000)
    await page.setViewportSize({ width, height: 1000 })
    await page.emulateMedia({ reducedMotion: "reduce" })
    await page.goto("/")
    await ready(page)
    for (const state of ["initial", "expanded", "copy-fallback"] as const) {
      if (state === "expanded") {
        await allDetails(page)
        if (width <= 800) await page.getByRole("button", { name: "Skills Constellation", exact: true }).click()
      }
      if (state === "copy-fallback") {
        await page.evaluate(() =>
          Object.defineProperty(navigator, "clipboard", { value: undefined, configurable: true }),
        )
        await page.locator("#contact button").click()
      }
      const result = await audit(page)
      await info.attach(`axe-${width}-${state}`, {
        body: JSON.stringify({
          width,
          state,
          axeVersion: result.testEngine.version,
          violations: result.violations,
          incomplete: result.incomplete,
          passes: result.passes.map(rule => rule.id),
        }),
        contentType: "application/json",
      })
      expect(
        result.violations.map(rule => ({
          id: rule.id,
          impact: rule.impact,
          nodes: rule.nodes.map(node => ({ target: node.target, summary: node.failureSummary })),
        })),
      ).toEqual([])
    }
  })
}

for (const width of [320, 640, 720]) {
  test(`reflow and enlarged text keep complete content usable at ${width}px`, async ({ page }, info) => {
    await page.setViewportSize({ width, height: 1000 })
    await page.emulateMedia({ reducedMotion: "reduce" })
    await page.goto("/")
    await ready(page)
    await allDetails(page)
    const measure = () =>
      page.evaluate(() => ({
        width: document.documentElement.clientWidth,
        scroll: document.documentElement.scrollWidth,
      }))
    let dimensions = await measure()
    expect(dimensions.scroll).toBe(dimensions.width)
    await expect(page.locator("#expertise a[href^='https://doi.org/']")).toHaveCount(4)
    for (const link of await page.locator("#expertise a[href^='https://doi.org/']").all()) {
      await link.scrollIntoViewIfNeeded()
      await expect(link).toBeInViewport()
    }
    // Browser text-only enlargement analogue: double every computed font size,
    // keeping the CSS viewport fixed, then check expanded faces and disclosures.
    // Actual browser zoom / real-device testing remains separately recorded.
    if (width === 720) {
      await page.evaluate(() => {
        const elements = [...document.querySelectorAll<HTMLElement>("body, body *:not(svg):not(svg *)")]
        const sizes = elements.map(element => parseFloat(getComputedStyle(element).fontSize))
        elements.forEach((element, index) => (element.style.fontSize = `${sizes[index] * 2}px`))
      })
      dimensions = await measure()
      expect(dimensions.scroll).toBe(dimensions.width)
    }
    await page.locator("#contact button").scrollIntoViewIfNeeded()
    await page.screenshot({
      path: info.outputPath(`${width}-expanded-reflow${width === 720 ? "-text-200" : ""}.png`),
      fullPage: true,
    })
    await expect(page.getByRole("link", { name: "Back to top" })).toBeVisible()
    for (const selector of ["#journey", "#contact"]) {
      const clipped = await page
        .locator(selector)
        .evaluate(root =>
          [...root.querySelectorAll<HTMLElement>("p, strong, a, button")]
            .filter(
              element =>
                element.scrollWidth > element.clientWidth + 1 && getComputedStyle(element).overflowX === "hidden",
            )
            .map(element => element.textContent),
        )
      expect(clipped).toEqual([])
    }
  })
}

test("production metadata, original branding and static delivery are internally consistent", async ({
  page,
  request,
}) => {
  await page.goto("/")
  await expect(page).toHaveTitle("Elisa Battistoni — Software Developer")
  await expect(page.locator("html")).toHaveAttribute("lang", "en")
  const description =
    "Experienced Software Developer with a PhD in Cognitive Neuroscience and a background in Data Science."
  for (const selector of [
    'meta[name="description"]',
    'meta[property="og:description"]',
    'meta[name="twitter:description"]',
  ])
    await expect(page.locator(selector)).toHaveAttribute("content", description)
  await expect(page.locator('meta[property="og:url"]')).toHaveAttribute("content", "https://develysverse.com")
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", "https://develysverse.com")
  await expect(page.locator('meta[name="viewport"]')).toHaveAttribute("content", /width=device-width/)
  expect(await page.locator('meta[name="viewport"]').getAttribute("content")).not.toMatch(
    /user-scalable=no|maximum-scale=1(?:,|$)/,
  )
  await expect(page.locator('meta[name="robots"][content*="noindex"]')).toHaveCount(0)
  const image = await request.get("/og-image.png")
  expect(image.ok()).toBeTruthy()
  expect(image.headers()["content-type"]).toBe("image/png")
  const icon = await request.get("/icon.svg")
  expect(icon.ok()).toBeTruthy()
  expect(icon.headers()["content-type"]).toBe("image/svg+xml")
  expect((await readFile("out/CNAME", "utf8")).trim()).toBe("develysverse.com")
  for (const selector of ["main", "nav", "footer", "h1"]) await expect(page.locator(selector)).toHaveCount(1)
})

test("screen-reader structure exposes the active face and complete skills alternative", async ({
  page,
  context,
  browserName,
}) => {
  await page.goto("/")
  await ready(page)
  const accessibility = browserName === "chromium" ? await context.newCDPSession(page) : null
  for (const title of disciplines) {
    const button = page.getByRole("button", { name: `View details: ${title}`, exact: true })
    await button.click()
    const back = page.getByRole("button", { name: `Back to overview: ${title}`, exact: true })
    await expect(back).toBeVisible()
    const card = page.locator("#expertise article").filter({ has: back })
    await expect(card.locator("[inert]")).toHaveCount(1)
    await expect(card.locator("[inert] h3")).toHaveText(title)
    const details = card.getByRole("group", { name: title, exact: true })
    await expect(details).toBeFocused()
    await expect(card.locator("[inert] button")).toHaveCount(1)
    if (accessibility) {
      const tree = await accessibility.send("Accessibility.getFullAXTree")
      expect(
        tree.nodes.filter(node => !node.ignored && node.role?.value === "heading" && node.name?.value === title),
      ).toHaveLength(0)
      expect(
        tree.nodes.filter(node => !node.ignored && node.role?.value === "group" && node.name?.value === title),
      ).toHaveLength(1)
    }
    await back.click()
    await expect(button).toBeFocused()
  }
  const skills = page.getByRole("region", { name: "Skills by discipline" })
  await expect(skills.getByRole("list")).toHaveCount(3)
  await expect(skills.getByRole("listitem")).toHaveCount(18)
  const snapshot = await skills.ariaSnapshot()
  expect(snapshot).toContain("Frontend Architecture")
  expect(snapshot).toContain("Eye Tracking")
  await expect(page.getByRole("status")).toHaveCount(1)
})
