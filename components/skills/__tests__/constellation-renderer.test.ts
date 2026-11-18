import { applyMapAction, HOME_VIEW, rotateView, type MapView } from "../constellation-renderer"

test("large input sequences stay bounded and reset retains the discipline",()=>{
  let view:MapView={...HOME_VIEW,active:2}
  for(let i=0;i<100;i++)view=applyMapAction(view,"zoom-in")
  expect(view.zoom).toBe(1.4)
  for(let i=0;i<100;i++)view=applyMapAction(view,"zoom-out")
  expect(view.zoom).toBe(.72)
  view=rotateView(view,100,100)
  expect(Math.abs(view.yaw)).toBeLessThan(Math.PI*2)
  expect(view.pitch).toBe(1)
  view=rotateView(view,-100,-100)
  expect(view.pitch).toBe(-1)
  expect(applyMapAction(view,"reset")).toEqual({...HOME_VIEW,active:2})
})
