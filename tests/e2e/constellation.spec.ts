import { expect, test, type Locator, type Page } from "@playwright/test"

const map = (page: Page) => page.locator("[data-skills-map]")
const canvas = (page: Page) => map(page).locator("canvas")

async function ready(page: Page) {
  await page.evaluate(async () => {
    await document.fonts.ready
    await Promise.all([document.fonts.load("500 14px Inter"), document.fonts.load("650 14px Inter")])
    await Promise.all([...document.querySelectorAll<HTMLImageElement>("#top img, #projects img")].map(image => { image.loading = "eager"; return image.decode() }))
    await new Promise(requestAnimationFrame); await new Promise(requestAnimationFrame)
  })
}
async function redraw(page: Page) { await page.evaluate(async () => { await new Promise(requestAnimationFrame); await new Promise(requestAnimationFrame) }) }
async function pixels(page: Page) {
  return canvas(page).evaluate(async (element: HTMLCanvasElement) => {
    const bytes = element.getContext("2d")!.getImageData(0, 0, element.width, element.height).data
    const digest = await crypto.subtle.digest("SHA-256", bytes)
    return [...new Uint8Array(digest)].map(byte => byte.toString(16).padStart(2,"0")).join("")
  })
}

function buttonAppearance(button: Locator) {
  return button.evaluate(element => {
    const style = getComputedStyle(element)
    const properties = ["background-color", "border-color", "border-radius", "color", "column-gap", "font-size", "font-weight", "min-height", "padding-inline-start"]
    return properties.map(property => style.getPropertyValue(property))
  })
}

for (const width of [320, 390, 415, 416, 585, 586, 800, 801, 900, 1440]) {
  test(`constellation is compact or horizontal and interactive at ${width}px`, async ({ page }, info) => {
    await page.setViewportSize({ width, height: 1000 })
    await page.emulateMedia({ reducedMotion: "reduce" })
    await page.goto("/"); await ready(page)
    const region = map(page), view = canvas(page)
    const toggle = region.getByRole("button", { name: "Explore" })
    const capture = [320, 390, 900, 1440].includes(width)
    const secondary = width === 390 ? await buttonAppearance(page.getByRole("link", { name: "Get in Touch", exact: true })) : null
    if (width <= 800) {
      await expect(view).toBeHidden()
      await expect(region.getByRole("group", { name: "Map view" })).toHaveCount(0)
      await expect(toggle).toHaveAttribute("aria-expanded", "false")
      if (secondary) expect(await buttonAppearance(toggle)).toEqual(secondary)
      const overview = region.locator("div[aria-hidden=true]").filter({ has: page.locator("circle") })
      await expect(overview).toBeVisible()
      const overviewBox = (await overview.boundingBox())!
      expect(overviewBox.height).toBeLessThan(160)
      expect((await toggle.boundingBox())!.y - (overviewBox.y + overviewBox.height)).toBeCloseTo(20, 1)
      for (const title of ["Software Engineering", "Data Science", "Cognitive Neuroscience"]) {
        await expect(overview.getByText(title, { exact: true })).toBeVisible()
      }
      if (capture) await region.screenshot({ path: info.outputPath(`${width}-constellation-overview.png`) })
      await toggle.focus()
      await page.keyboard.press("Enter")
      const close = region.getByRole("button", { name: "Close", exact: true })
      await expect(close).toBeFocused()
      if (secondary) expect(await buttonAppearance(close)).toEqual(secondary)
      await expect(overview).toBeHidden()
      const titleBox = (await region.getByRole("heading", { name: "Skills Constellation" }).boundingBox())!
      const buttonBox = (await close.boundingBox())!
      const explorationBox = (await region.locator("#skills-exploration").boundingBox())!
      const gapAbove = buttonBox.y - (titleBox.y + titleBox.height)
      const gapBelow = explorationBox.y - (buttonBox.y + buttonBox.height)
      expect(gapAbove).toBeCloseTo(20, 1)
      expect(gapBelow).toBeCloseTo(gapAbove, 1)
    } else {
      await expect(toggle).toBeHidden()
    }
    await expect(view).toBeVisible()
    await redraw(page)
    const scene = (await view.boundingBox())!
    if (width > 800) {
      const fullWidth = (await region.boundingBox())!.width
      const originalHeight = Math.min(455, Math.max(345, width * .36))
      expect(scene.width / fullWidth).toBeCloseTo(.88, 2)
      expect(scene.height / originalHeight).toBeCloseTo(.88, 2)
    }
    const initial = await pixels(page)
    if (capture) await region.screenshot({ path: info.outputPath(`${width}-constellation-exploration.png`) })
    await region.getByRole("button", { name: "Cognitive Neuroscience", exact: true }).click()
    await expect.poll(() => pixels(page)).not.toBe(initial)
    const filtered = await pixels(page)
    await region.getByRole("button", { name: "Rotate right" }).click()
    await expect.poll(() => pixels(page)).not.toBe(filtered)
    if (width <= 800) {
      await view.focus()
      await page.keyboard.press("Escape")
      await expect(toggle).toBeFocused()
      await expect(view).toBeHidden()
      await toggle.click()
      await region.getByRole("button", { name: "Close", exact: true }).click()
      await expect(view).toBeHidden()
      await expect(toggle).toBeFocused()
    }
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(await page.evaluate(() => document.documentElement.clientWidth))
  })
}

test("filters omit descriptive notes and preserve aria state and accessible skill labels",async({page})=>{
  await page.goto("/");await ready(page)
  const region=map(page)
  for(const name of ["Software Engineering","Data Science","Cognitive Neuroscience","All disciplines"]){
    await region.getByRole("button",{name,exact:true}).click()
    await expect(region.getByRole("button",{name,exact:true})).toHaveAttribute("aria-pressed","true")
    await expect(region.locator('[aria-pressed="true"]')).toHaveCount(1)
    await expect(region.getByText("React and TypeScript for frontend architecture, with open-source work on Raycast extensions.",{exact:true})).toHaveCount(0)
    await expect(region.getByText("Python, statistical modeling and machine learning for analytics, NLP and data visualization.",{exact:true})).toHaveCount(0)
    await expect(region.locator("canvas + p")).toHaveCount(0)
  }
  await expect(region.getByRole("region",{name:"Skills by discipline"}).locator("li")).toHaveCount(18)
  await region.getByRole("button",{name:"All disciplines",exact:true}).click()
})

test("keyboard rotation and zoom match buttons, clamp zoom and reset the view only", async ({ page, browserName }) => {
  await page.goto("/"); await ready(page)
  const region = map(page), view = canvas(page)
  const control = (name: string) => region.getByRole("button", { name, exact: true })
  await control("Data Science").click(); await redraw(page)
  const initial = await pixels(page)
  for (const [key, name] of [["ArrowRight", "Rotate right"], ["+", "Zoom in"]] as const) {
    await view.press(key); await redraw(page)
    const changed = await pixels(page)
    expect(changed).not.toBe(initial)
    await control("Reset map view").click()
    await control(name).click(); await redraw(page)
    expect(await pixels(page)).toBe(changed)
    await view.press("Home"); await redraw(page)
    expect(await pixels(page)).toBe(initial)
  }
  for (const name of ["Zoom in", "Zoom out"]) {
    for (let i = 0; i < 20; i++) await control(name).click()
    await redraw(page)
    const limit = await pixels(page)
    await control(name).click(); await redraw(page)
    expect(await pixels(page)).toBe(limit)
  }
  await view.press("Home"); await redraw(page)
  expect(await pixels(page)).toBe(initial)
  await expect(control("Data Science")).toHaveAttribute("aria-pressed", "true")
  await control("Reset map view").focus()
  await page.keyboard.press(browserName === "webkit" ? "Alt+Tab" : "Tab")
  await expect(view).toBeFocused()
  await expect(view).toHaveCSS("outline-color", "rgb(189, 179, 255)")
})

test("mouse drag rotates, pointer release stops dragging and idle does not repaint",async({page})=>{
  await page.addInitScript(()=>{
    const original=CanvasRenderingContext2D.prototype.clearRect
    Object.assign(window,{mapDrawCount:0})
    CanvasRenderingContext2D.prototype.clearRect=function(...args:Parameters<typeof original>){
      Reflect.set(window,"mapDrawCount",Number(Reflect.get(window,"mapDrawCount"))+1)
      return original.apply(this,args)
    }
  })
  await page.goto("/");await ready(page);const view=canvas(page)
  await view.scrollIntoViewIfNeeded();const box=(await view.boundingBox())!,before=await pixels(page)
  await page.mouse.move(box.x+box.width*.4,box.y+box.height*.4);await page.mouse.down()
  await page.mouse.move(box.x+box.width*.6,box.y+box.height*.55,{steps:5});await page.mouse.up();await redraw(page)
  const rotated=await pixels(page);expect(rotated).not.toBe(before)
  await page.mouse.move(box.x+box.width*.7,box.y+box.height*.6);await redraw(page);expect(await pixels(page)).toBe(rotated)
  const count=await page.evaluate(()=>Number(Reflect.get(window,"mapDrawCount")))
  await page.waitForTimeout(200)
  expect(await page.evaluate(()=>Number(Reflect.get(window,"mapDrawCount")))).toBe(count)
})

test("DPR is capped at two; resizing redraws the canvas without overflow",async({browser,baseURL})=>{
  const context=await browser.newContext({deviceScaleFactor:3,viewport:{width:390,height:1000}})
  const page=await context.newPage();await page.goto(`${baseURL}/`);await ready(page)
  await page.getByRole("button", { name: "Explore" }).click()
  await expect.poll(() => canvas(page).evaluate(el => (el as HTMLCanvasElement).width - Math.round(el.clientWidth * 2))).toBe(0)
  await page.setViewportSize({width:1440,height:1000});await redraw(page)
  await expect.poll(() => canvas(page).evaluate(el => (el as HTMLCanvasElement).width - Math.round(el.clientWidth * 2))).toBe(0)
  expect(await page.evaluate(()=>document.documentElement.scrollWidth)).toBe(await page.evaluate(()=>document.documentElement.clientWidth))
  await context.close()
})

test("no Canvas and no JavaScript provide the complete text alternative",async({browser,baseURL})=>{
  for(const mode of ["null","throw","no-js"] as const){
    const context=await browser.newContext({javaScriptEnabled:mode!=="no-js"})
    if(mode!=="no-js")await context.addInitScript(failure=>{HTMLCanvasElement.prototype.getContext=(()=>{if(failure==="throw")throw new DOMException("Canvas blocked","SecurityError");return null}) as typeof HTMLCanvasElement.prototype.getContext},mode)
    const page=await context.newPage();await page.goto(`${baseURL}/`)
    await expect(map(page).locator("canvas")).toBeHidden()
    await expect(map(page).getByRole("group",{name:"Discipline"})).toBeHidden()
    await expect(map(page).getByRole("region",{name:"Skills by discipline"})).toBeVisible()
    for(const item of await map(page).getByRole("region",{name:"Skills by discipline"}).locator("li").all())await expect(item).toBeVisible()
    await context.close()
  }
})
