import { GROUPS as groups, POINTS as points, LINKS as links, type DisciplineFilter } from "@/lib/data/skills"

export interface MapView { yaw: number; pitch: number; zoom: number; active: DisciplineFilter }
export type MapAction = "rotate-left" | "rotate-right" | "rotate-up" | "rotate-down" | "zoom-out" | "zoom-in" | "reset"
export const HOME_VIEW: MapView = { yaw: -.12, pitch: .07, zoom: 1, active: "all" }
export const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(max, value))

export function rotateView(view: MapView, dx: number, dy: number): MapView {
  return { ...view, yaw: (view.yaw + dx) % (Math.PI*2), pitch: clamp(view.pitch + dy,-1,1) }
}

export function applyMapAction(view: MapView, action: MapAction): MapView {
  switch (action) {
    case "rotate-left": return rotateView(view,-.20,0)
    case "rotate-right": return rotateView(view,.20,0)
    case "rotate-up": return rotateView(view,0,-.15)
    case "rotate-down": return rotateView(view,0,.15)
    case "zoom-out": return { ...view, zoom: clamp(view.zoom-.12,.72,1.4) }
    case "zoom-in": return { ...view, zoom: clamp(view.zoom+.12,.72,1.4) }
    case "reset": return { ...view, yaw: HOME_VIEW.yaw, pitch: HOME_VIEW.pitch, zoom: HOME_VIEW.zoom }
  }
}

export type Box = [number, number, number, number]
export type Link = readonly [number, number]
export interface ProjectedNode { label: string; cluster: number; anchor?: boolean; depth: number; color: string; x: number; y: number }
interface LabelPosition { x: number; y: number; box: Box; score: number }
export interface PlacedLabel extends LabelPosition { node: ProjectedNode; font: string }
/** Width of `text` in pixels when drawn with `font`. Injected so label placement can be tested without a canvas. */
export type MeasureText = (font: string, text: string) => number

// Port the approved v10 projection and label placement without changing its data
// or arithmetic order. React owns controls; this renderer owns canvas pixels.
// The work is split into small steps; each keeps the original expressions as they were.

const COMPACT_LABELS = ['TypeScript','Python','Eye Tracking','EEG / MEG']
const LABEL_OFFSETS = (half: number) => [[0,-18],[0,18],[half+10,0],[-half-10,0],[18,-28],[-18,28]]

/** True when a node belongs to the selected discipline (or every discipline is shown). */
export const isVisible = (active: DisciplineFilter) => (node: { cluster: number }) => active === 'all' || node.cluster === active

/** Match the canvas backing store to its CSS size and pixel ratio (max 2), then clear it. */
function prepareCanvas(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D, w: number, h: number, devicePixelRatio: number) {
    const dpr = Math.min(devicePixelRatio || 1,2);
    const pixelWidth = Math.round(w*dpr), pixelHeight = Math.round(h*dpr);
    if (canvas.width !== pixelWidth || canvas.height !== pixelHeight) {
      canvas.width = pixelWidth;
      canvas.height = pixelHeight;
    }
    ctx.setTransform(dpr,0,0,dpr,0,0);
    ctx.clearRect(0,0,w,h);
}

/** Rotate every skill point by yaw and pitch, apply perspective, and map it to canvas pixels. */
export function projectNodes(w: number, h: number, view: Pick<MapView, 'yaw' | 'pitch' | 'zoom'>): ProjectedNode[] {
    const { yaw, pitch, zoom } = view
    const narrow = w < 550;
    const rotationX = Math.cos(yaw), rotationZ = Math.sin(yaw);
    const pitchY = Math.cos(pitch), pitchZ = Math.sin(pitch);
    const scaleX = Math.min(w / (narrow ? 4.5 : 9.3), h / (narrow ? 5.6 : 4.45)) * zoom;
    const scaleY = Math.min(w / (narrow ? 3.7 : 7.8), h / (narrow ? 8.3 : 5.15)) * zoom;
    return points.map(([label,cluster,x,y,z,anchor]) => {
      const group = groups[cluster];
      const center = narrow ? group.narrow : group.center;
      x += center[0];
      y += center[1];
      const px = x*rotationX + z*rotationZ;
      const z0 = z*rotationX - x*rotationZ;
      const py = y*pitchY - z0*pitchZ;
      const depth = 13 / (13 - (y*pitchZ + z0*pitchY));
      return { label, cluster, anchor, depth, color:group.color, x:w/2 + px*scaleX*depth, y:h*(narrow ? .5 : .44) + py*scaleY*depth };
    });
}

/** Lines between related skills: dashed between disciplines, faded when filtered out. */
function drawLinks(ctx: CanvasRenderingContext2D, projected: ProjectedNode[], visible: (node: ProjectedNode) => boolean) {
    for (const [a,b] of links) {
      const from = projected[a], to = projected[b];
      const bridge = from.cluster !== to.cluster;
      ctx.globalAlpha = visible(from) && visible(to) ? (bridge ? .42 : .36) : (visible(from) || visible(to) ? .23 : .075);
      ctx.strokeStyle = bridge ? '#99adc7' : from.color;
      ctx.setLineDash(bridge ? [4,5] : []);
      ctx.beginPath();
      ctx.moveTo(from.x,from.y);
      ctx.lineTo(to.x,to.y);
      ctx.stroke();
    }
    ctx.setLineDash([]);
}

/** Dots with a soft glow, drawn back to front so nearer dots cover farther ones. */
function drawNodes(ctx: CanvasRenderingContext2D, projected: ProjectedNode[], visible: (node: ProjectedNode) => boolean) {
    const nodesByDepth = [...projected].sort((a,b) => a.depth-b.depth);
    for (const node of nodesByDepth) {
      const radius = (node.anchor ? 6.9 : 4.1) * node.depth;
      ctx.globalAlpha = visible(node) ? .18 : .04;
      ctx.fillStyle = node.color;
      ctx.beginPath();
      ctx.arc(node.x,node.y,radius + 4,0,Math.PI*2);
      ctx.fill();
      ctx.globalAlpha = visible(node) ? .94 : .22;
      ctx.beginPath();
      ctx.arc(node.x,node.y,radius,0,Math.PI*2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
}

/** Which nodes get a label, most important first: anchors, then nearer nodes. Very small screens show only a few. */
export function chooseLabels(projected: ProjectedNode[], visible: (node: ProjectedNode) => boolean, w: number, active: DisciplineFilter): ProjectedNode[] {
    const narrow = w < 550;
    const compactOverview = narrow && w < 380 && active === 'all';
    const labels = projected.filter(node => visible(node) && (!compactOverview || node.anchor || COMPACT_LABELS.includes(node.label)));
    labels.sort((a,b) => Number(Boolean(b.anchor)) - Number(Boolean(a.anchor)) || b.depth-a.depth);
    return labels
}

/**
 * Add a penalty to `score` for every visible link the label box at (x, y) sits on;
 * links between disciplines cost more. Penalties are added one by one, as in v10,
 * so floating-point rounding (and therefore tie-breaking) is unchanged.
 */
export function addLinkPenalties(score: number, x: number, y: number, half: number, projected: ProjectedNode[], activeEdges: readonly Link[]): number {
    for (const [a,b] of activeEdges) {
      const from = projected[a], to = projected[b];
      const sx = (from.x-x)/half, sy = (from.y-y)/9;
      const vx = (to.x-from.x)/half, vy = (to.y-from.y)/9;
      const lengthSquared = vx*vx + vy*vy;
      const t = lengthSquared ? clamp(-(sx*vx + sy*vy)/lengthSquared, 0, 1) : 0;
      if (Math.hypot(sx+t*vx, sy+t*vy) < 1.1) {
        score += from.cluster === to.cluster ? 24 : 36;
      }
    }
    return score;
}

/**
 * Place each label at the free candidate position with the lowest score
 * (distance from its node + link penalties). Labels never overlap dots or each
 * other; a label with no free position is skipped.
 */
export function placeLabels(labels: ProjectedNode[], projected: ProjectedNode[], activeEdges: readonly Link[], w: number, h: number, measure: MeasureText): PlacedLabel[] {
    const narrow = w < 550;
    const occupied: Box[] = projected.map(({x,y,anchor}) => [x-(anchor?8:6),y-(anchor?8:6),x+(anchor?8:6),y+(anchor?8:6)]);
    const placed: PlacedLabel[] = [];
    for (const node of labels) {
      if (node.x < 3 || node.x > w-3 || node.y < 3 || node.y > h-3) continue;
      const font = `${node.anchor ? 650 : 500} ${narrow ? 13 : 14}px Inter, system-ui, sans-serif`;
      const half = measure(font, node.label)/2 + 5;
      let best: LabelPosition | undefined;
      for (const [dx,dy] of LABEL_OFFSETS(half)) {
        const x = clamp(node.x + dx,half,w-half), y = node.y + dy;
        const box: Box = [x-half,y-9,x+half,y+9];
        if (y < 10 || y > h-10 || occupied.some(([l,t,r,b]) => box[0] < r && box[2] > l && box[1] < b && box[3] > t)) continue;

        // Prefer a clear area near the node, especially for links between disciplines.
        const score = addLinkPenalties(Math.hypot(x-node.x, y-node.y), x, y, half, projected, activeEdges);
        if (!best || score < best.score) best = {x,y,box,score};
      }
      if (!best) continue;
      occupied.push(best.box);
      placed.push({ ...best, node, font });
    }
    return placed;
}

/** Labels with a cleared halo, so the map background (not a crossing line) sits behind each one. */
function drawLabels(ctx: CanvasRenderingContext2D, placed: PlacedLabel[]) {
    ctx.globalCompositeOperation = 'destination-out';
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 5;
    ctx.lineJoin = 'round';
    for (const {x,y,node,font} of placed) {
      ctx.font = font;
      ctx.strokeText(node.label,x,y);
    }
    ctx.globalCompositeOperation = 'source-over';
    for (const {x,y,node,font} of placed) {
      ctx.font = font;
      ctx.fillStyle = node.color;
      ctx.fillText(node.label,x,y);
    }
    ctx.lineWidth = 1;
    ctx.lineJoin = 'miter';
}

export function drawConstellation(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D, view: MapView, devicePixelRatio = 1) {
    const w = canvas.clientWidth, h = canvas.clientHeight;
    if (!w || !h) return;
    prepareCanvas(canvas, ctx, w, h, devicePixelRatio);
    const projected = projectNodes(w, h, view);
    const visible = isVisible(view.active);
    drawLinks(ctx, projected, visible);
    drawNodes(ctx, projected, visible);

    const labels = chooseLabels(projected, visible, w, view.active);
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    const activeEdges = links.filter(([a,b]) => visible(projected[a]) && visible(projected[b]));
    const measure: MeasureText = (font, text) => { ctx.font = font; return ctx.measureText(text).width };
    drawLabels(ctx, placeLabels(labels, projected, activeEdges, w, h, measure));
}
