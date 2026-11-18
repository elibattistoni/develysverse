import { expect, test } from "@playwright/test"

test("touch Hero selection and native horizontal carousel swipe", async ({ page, context }) => {
  await page.goto("/")
  await page.evaluate(() => document.fonts.ready)
  const data = page.getByRole("button", { name: "Data Science", exact: true })
  await data.scrollIntoViewIfNeeded()
  const point = await data.evaluate(element => {
    const rect = element.getBoundingClientRect()
    for (const fy of [.1, .2, .4, .6, .8]) for (const fx of [.2, .4, .6, .8]) {
      const x = rect.left + rect.width * fx, y = rect.top + rect.height * fy
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
  expect(await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth)).toBe(false)
})
