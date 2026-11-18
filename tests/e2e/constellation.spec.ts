import { expect, test, type Page } from "@playwright/test"
import sharp from "sharp"

const map = (page: Page, reference = false) => page.locator(reference ? ".skills-map" : "[data-skills-map]")
const canvas = (page: Page, reference = false) => map(page, reference).locator("canvas")

async function ready(page: Page) {
  await page.evaluate(async () => {
    await document.fonts.ready
    await Promise.all([document.fonts.load("500 14px Inter"), document.fonts.load("650 14px Inter")])
    await Promise.all([...document.querySelectorAll<HTMLImageElement>("#top img, #projects img")].map(image => { image.loading = "eager"; return image.decode() }))
    await new Promise(requestAnimationFrame); await new Promise(requestAnimationFrame)
  })
  // Resize once after explicit font loading: the historical prototype only
  // redraws on font-ready/resize, so do not compare a stale fallback-font frame.
  const viewport=page.viewportSize()!
  await page.setViewportSize({...viewport,width:viewport.width+1})
  await page.evaluate(async()=>{await new Promise(requestAnimationFrame);await new Promise(requestAnimationFrame)})
  await page.setViewportSize(viewport)
  await page.evaluate(async()=>{await new Promise(requestAnimationFrame);await new Promise(requestAnimationFrame)})
}
async function redraw(page: Page) { await page.evaluate(async () => { await new Promise(requestAnimationFrame); await new Promise(requestAnimationFrame) }) }
async function pixels(page: Page, reference = false) {
  return canvas(page, reference).evaluate(async (element: HTMLCanvasElement) => {
    const bytes = element.getContext("2d")!.getImageData(0, 0, element.width, element.height).data
    const digest = await crypto.subtle.digest("SHA-256", bytes)
    return [...new Uint8Array(digest)].map(byte => byte.toString(16).padStart(2,"0")).join("")
  })
}

for (const width of [320, 390, 415, 416, 585, 586, 800, 801, 900, 1440]) {
  test(`constellation matches v10 projection/filter/zoom at ${width}px`, async ({ page, context }, info) => {
    await page.setViewportSize({ width, height: 1000 }); await page.emulateMedia({ reducedMotion: width <= 800 ? "reduce" : "no-preference" })
    await page.goto("/"); await ready(page)
    const reference = await context.newPage()
    await reference.setViewportSize({ width, height: 1000 }); await reference.emulateMedia({ reducedMotion: width <= 800 ? "reduce" : "no-preference" })
    await reference.goto("/__reference/"); await ready(reference)
    async function compare(state: string) {
      await redraw(page); await redraw(reference)
      const shape = (el: Element) => {
        const r = el.getBoundingClientRect(), css = getComputedStyle(el)
        return { x: r.x+scrollX, y: r.y+scrollY, width: r.width, height: r.height, gap: css.gap, font: css.font }
      }
      const a = await canvas(page).evaluate(shape), b = await canvas(reference,true).evaluate(shape)
      for (const key of ["x","y","width","height"] as const) expect(Math.abs(a[key]-b[key]), key).toBeLessThan(.15)
      expect(a.font).toBe(b.font)
      // Compare the actual canvas output, not just its presence or state labels.
      expect(await pixels(page)).toBe(await pixels(reference,true))
      if (![390,1440].includes(width)) return
      await page.mouse.move(0,0); await reference.mouse.move(0,0)
      const actual = await map(page).screenshot({ path: info.outputPath(`${width}-constellation-${state}.png`) })
      const baseline = await map(reference,true).screenshot({ path: info.outputPath(`${width}-constellation-${state}-v10-live.png`) })
      const [current, source] = await Promise.all([sharp(actual).removeAlpha().raw().toBuffer({resolveWithObject:true}),sharp(baseline).removeAlpha().raw().toBuffer({resolveWithObject:true})])
      expect(current.info).toEqual(source.info)
      let changed=0
      for(let i=0;i<current.data.length;i+=3) if(Math.max(Math.abs(current.data[i]-source.data[i]),Math.abs(current.data[i+1]-source.data[i+1]),Math.abs(current.data[i+2]-source.data[i+2]))>8)changed++
      const ratio=changed/(current.info.width*current.info.height)
      await info.attach(`${width}-constellation-${state}-comparison`,{body:JSON.stringify({width,state,changedPixelRatio:ratio,channelThreshold:8,maxChangedPixelRatio:.002}),contentType:"application/json"})
      expect(ratio).toBeLessThan(.002)
    }
    await compare("all")
    for (const p of [page,reference]) await map(p,p===reference).getByRole("button",{name:"Cognitive Neuroscience",exact:true}).click()
    await compare("neuroscience")
    for (const p of [page,reference]) {
      const region=map(p,p===reference)
      await region.getByRole("button",{name:"Rotate right",exact:true}).click()
      await region.getByRole("button",{name:"Zoom in",exact:true}).click()
    }
    await compare("rotated")
    await reference.close()
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

test("keyboard rotation/zoom equals buttons, clamps zoom and resets the view only",async({page,context,browserName})=>{
  await page.goto("/");await ready(page)
  const reference=await context.newPage();await reference.goto("/__reference/");await ready(reference)
  const view=canvas(page),refView=canvas(reference,true)
  for(const p of [page,reference])await map(p,p===reference).getByRole("button",{name:"Data Science",exact:true}).click()
  await view.focus();await page.keyboard.press("ArrowRight")
  await map(reference,true).getByRole("button",{name:"Rotate right",exact:true}).click()
  await redraw(page);await redraw(reference);expect(await pixels(page)).toBe(await pixels(reference,true))
  for(const key of ["ArrowUp","ArrowDown","ArrowLeft","+","-"]){
    await view.focus();await page.keyboard.press(key)
    await refView.focus();await reference.keyboard.press(key)
  }
  await redraw(page);await redraw(reference);expect(await pixels(page)).toBe(await pixels(reference,true))
  for(const name of ["Zoom in","Zoom out"]){
    for(let i=0;i<20;i++)await map(page).getByRole("button",{name,exact:true}).click()
    await redraw(page);const limit=await pixels(page)
    await map(page).getByRole("button",{name,exact:true}).click();await redraw(page)
    expect(await pixels(page)).toBe(limit)
  }
  await view.focus();await page.keyboard.press("Home")
  await refView.focus();await reference.keyboard.press("Home")
  await redraw(page);await redraw(reference);expect(await pixels(page)).toBe(await pixels(reference,true))
  await expect(map(page).getByRole("button",{name:"Data Science",exact:true})).toHaveAttribute("aria-pressed","true")
  await map(page).getByRole("button",{name:"Reset map view",exact:true}).focus()
  await page.keyboard.press(browserName === "webkit" ? "Alt+Tab" : "Tab")
  await expect(view).toBeFocused()
  await expect(view).toHaveCSS("outline-color","rgb(189, 179, 255)")
  await reference.close()
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
  expect(await canvas(page).evaluate((el:HTMLCanvasElement)=>el.width)).toBe(await canvas(page).evaluate(el=>Math.round(el.clientWidth*2)))
  await page.setViewportSize({width:1440,height:1000});await redraw(page)
  expect(await canvas(page).evaluate((el:HTMLCanvasElement)=>el.width)).toBe(await canvas(page).evaluate(el=>Math.round(el.clientWidth*2)))
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
