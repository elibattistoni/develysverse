import { expect, test } from "@playwright/test"

test("touch Hero selection and native horizontal carousel swipe", async ({ page, context }) => {
  await page.goto("/")
  await page.evaluate(() => document.fonts.ready)
  const data = page.locator("#top").getByRole("button", { name: "Data Science", exact: true })
  await data.scrollIntoViewIfNeeded()
  const point = await data.evaluate(element => {
    const rect = element.getBoundingClientRect()
    for (const fy of [0.1, 0.2, 0.4, 0.6, 0.8])
      for (const fx of [0.2, 0.4, 0.6, 0.8]) {
        const x = rect.left + rect.width * fx,
          y = rect.top + rect.height * fy
        if (document.elementFromPoint(x, y)?.closest("button") === element) return { x, y }
      }
    throw new Error("No exposed touch target")
  })
  await page.touchscreen.tap(point.x, point.y)
  await expect(data).toHaveAttribute("aria-pressed", "true")
  await expect(data.locator("[data-fragment-art]")).not.toHaveAttribute("style", /--rx/)
  const rail = page.locator("#projectRail")
  await rail.scrollIntoViewIfNeeded()
  await expect(page.getByRole("button", { name: "Scroll projects right" })).toBeVisible()
  const box = (await rail.boundingBox())!
  const client = await context.newCDPSession(page)
  const y = box.y + Math.min(box.height / 2, 160)
  const x = Math.min(box.x + box.width - 30, page.viewportSize()!.width - 30)
  await client.send("Input.dispatchTouchEvent", { type: "touchStart", touchPoints: [{ x, y }] })
  for (let step = 1; step <= 8; step++) {
    await client.send("Input.dispatchTouchEvent", { type: "touchMove", touchPoints: [{ x: x - step * 30, y }] })
    await page.evaluate(() => new Promise(requestAnimationFrame))
  }
  await client.send("Input.dispatchTouchEvent", { type: "touchEnd", touchPoints: [] })
  await expect.poll(() => rail.evaluate(element => element.scrollLeft)).toBeGreaterThan(100)
  expect(await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth)).toBe(
    false,
  )
})

test("constellation touch rotates horizontally while vertical gestures scroll the page", async ({ page, context }) => {
  await page.goto("/")
  await page.evaluate(() => document.fonts.ready)
  const toggle = page.getByRole("button", { name: "Skills Constellation", exact: true })
  await expect(toggle).toHaveAttribute("aria-expanded", "false")
  const { width, height } = (await toggle.boundingBox())!
  await toggle.tap({ position: { x: width * 0.8, y: height / 2 } })
  await expect(toggle).toHaveAttribute("aria-expanded", "true")
  const canvas = page.locator("[data-skills-map] canvas")
  await canvas.scrollIntoViewIfNeeded()
  const digest = () =>
    canvas.evaluate(async (element: HTMLCanvasElement) => {
      const data = element.getContext("2d")!.getImageData(0, 0, element.width, element.height).data
      return [...new Uint8Array(await crypto.subtle.digest("SHA-256", data))].join(",")
    })
  const client = await context.newCDPSession(page)
  async function swipe(horizontal: boolean) {
    const r = (await canvas.boundingBox())!
    const x = horizontal ? r.x + r.width * 0.8 : r.x + r.width * 0.5,
      y = r.y + Math.min(r.height * 0.65, 260)
    await client.send("Input.dispatchTouchEvent", { type: "touchStart", touchPoints: [{ x, y }] })
    for (let i = 1; i <= 8; i++) {
      await client.send("Input.dispatchTouchEvent", {
        type: "touchMove",
        touchPoints: [{ x: x - (horizontal ? i * 22 : 0), y: y - (horizontal ? 0 : i * 22) }],
      })
      await page.evaluate(() => new Promise(requestAnimationFrame))
    }
    await client.send("Input.dispatchTouchEvent", { type: "touchEnd", touchPoints: [] })
  }
  const original = await digest(),
    scrollY = await page.evaluate(() => window.scrollY)
  await swipe(false)
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBeGreaterThan(scrollY + 50)
  expect(await digest()).toBe(original)
  await canvas.scrollIntoViewIfNeeded()
  await swipe(true)
  await expect.poll(digest).not.toBe(original)
  await toggle.tap()
  await expect(toggle).toHaveAttribute("aria-expanded", "false")
  await expect(canvas).toBeHidden()
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(
    await page.evaluate(() => document.documentElement.clientWidth),
  )
})

test("Journey touch disclosures retain multiple chapters and Contact copy is tappable", async ({ page }) => {
  await page.goto("/")
  await page.evaluate(() => document.fonts.ready)
  const summaries = page.locator("#journey summary")
  await summaries.first().tap()
  await summaries.nth(2).tap()
  await expect(page.locator("#journey details[open]")).toHaveCount(3)
  await summaries.first().tap()
  await expect(page.locator("#journey details[open]")).toHaveCount(2)
  await page.evaluate(() =>
    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: { writeText: async (address: string) => Reflect.set(window, "touchCopiedEmail", address) },
    }),
  )
  const button = page.locator("#contact button")
  await button.tap()
  await expect(button).toHaveText("hello@develysverse.com")
  expect(await page.evaluate(() => Reflect.get(window, "touchCopiedEmail"))).toBe("hello@develysverse.com")
  await expect(page.locator("#contact [role=status]")).toHaveText("Email copied.")
  await page.getByRole("link", { name: "Back to top" }).tap()
  await expect(page).toHaveURL(/#top$/)
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(
    await page.evaluate(() => document.documentElement.clientWidth),
  )
})
