import { POINTS } from "@/lib/data/skills"
import { addLinkPenalties, applyMapAction, chooseLabels, HOME_VIEW, isVisible, placeLabels, projectNodes, rotateView, type MapView, type ProjectedNode } from "../constellation-renderer"

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


const node = (label: string, x: number, y: number, extra: Partial<ProjectedNode> = {}): ProjectedNode =>
  ({ label, cluster: 0, depth: 1, color: "#fff", x, y, ...extra })
// Every character is 7 px wide: enough to test placement without a real canvas.
const measure = (_font: string, text: string) => text.length * 7

test("projectNodes maps every skill inside a desktop canvas at the home view", () => {
  const projected = projectNodes(900, 520, HOME_VIEW)
  expect(projected).toHaveLength(POINTS.length)
  for (const n of projected) {
    expect(n.x).toBeGreaterThan(0); expect(n.x).toBeLessThan(900)
    expect(n.y).toBeGreaterThan(0); expect(n.y).toBeLessThan(520)
    expect(n.depth).toBeGreaterThan(0)
  }
})

test("isVisible keeps every node for 'all' and only one discipline otherwise", () => {
  expect(isVisible("all")({ cluster: 2 })).toBe(true)
  expect(isVisible(1)({ cluster: 1 })).toBe(true)
  expect(isVisible(1)({ cluster: 2 })).toBe(false)
})

test("chooseLabels shows only anchors and 4 key skills on very small screens", () => {
  const projected = projectNodes(360, 420, HOME_VIEW)
  const labels = chooseLabels(projected, isVisible("all"), 360, "all")
  expect(labels.length).toBeLessThan(projected.length)
  for (const l of labels) expect(l.anchor || ["TypeScript", "Python", "Eye Tracking", "EEG / MEG"].includes(l.label)).toBe(true)
  expect(labels[0].anchor).toBe(true)
  expect(chooseLabels(projected, isVisible(0), 360, 0).every(l => l.cluster === 0)).toBe(true)
})

test("addLinkPenalties adds 24 for a link inside a discipline and 36 for one between disciplines", () => {
  const projected = [node("a", 0, 100), node("b", 200, 100), node("c", 200, 100, { cluster: 1 })]
  expect(addLinkPenalties(5, 100, 100, 20, projected, [[0, 1]])).toBe(29)
  expect(addLinkPenalties(5, 100, 100, 20, projected, [[0, 2]])).toBe(41)
  expect(addLinkPenalties(5, 100, 150, 20, projected, [[0, 1]])).toBe(5)
})

test("placeLabels puts a label above its node when that spot is free", () => {
  const n = node("React", 200, 200)
  const [placed] = placeLabels([n], [n], [], 400, 400, measure)
  expect(placed).toMatchObject({ x: 200, y: 182 })
})

test("placeLabels never overlaps two labels and skips nodes outside the canvas", () => {
  const nodes = [node("Machine Learning", 200, 200), node("Deep Learning", 205, 200), node("Outside", 1, 200)]
  const placed = placeLabels(nodes, nodes, [], 400, 400, measure)
  expect(placed.map(p => p.node.label)).toEqual(["Machine Learning", "Deep Learning"])
  const [a, b] = placed.map(p => p.box)
  const overlap = a[0] < b[2] && a[2] > b[0] && a[1] < b[3] && a[3] > b[1]
  expect(overlap).toBe(false)
})
