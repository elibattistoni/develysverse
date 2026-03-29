"use client"

import { useEffect, useRef, useState } from "react"
import * as THREE from "three"
import { CLUSTERS, SKILLS, BRIDGES } from "@/lib/data/skills"

function spreadOnSphere(center: [number, number, number], n: number): THREE.Vector3[] {
  if (n === 0) return []
  const c = new THREE.Vector3(...center)
  const golden = Math.PI * (1 + Math.sqrt(5))
  return Array.from({ length: n }, (_, i) => {
    const y = n === 1 ? 0 : 1 - (2 * i) / (n - 1)
    const r = Math.sqrt(Math.max(0, 1 - y * y))
    const rad = 0.78 + (i % 4) * 0.11
    return new THREE.Vector3(c.x + rad * r * Math.cos(golden * i), c.y + rad * y * 0.8, c.z + rad * r * Math.sin(golden * i))
  })
}

interface HoveredSkill { label: string; clusterName: string; hex: string }

export default function Constellation() {
  const wrapRef = useRef<HTMLDivElement>(null)
  const labelRef = useRef<HTMLCanvasElement>(null)
  const [hovered, setHovered] = useState<HoveredSkill | null>(null)

  useEffect(() => {
    const wrap = wrapRef.current, lc = labelRef.current
    if (!wrap || !lc) return

    const W = wrap.clientWidth || 700, H = 480
    const dpr = Math.min(window.devicePixelRatio || 1, 2)

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setPixelRatio(dpr); renderer.setSize(W, H)
    Object.assign(renderer.domElement.style, { position: "absolute", inset: "0", width: "100%", height: "100%", zIndex: "1" })
    wrap.appendChild(renderer.domElement)

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(58, W / H, 0.1, 100)
    camera.position.z = 9.5
    const group = new THREE.Group(); scene.add(group)

    lc.width = W * dpr; lc.height = H * dpr
    lc.style.width = `${W}px`; lc.style.height = `${H}px`
    const ctx = lc.getContext("2d")!; ctx.scale(dpr, dpr)

    // Positions
    const byCluster = CLUSTERS.map((_, ci) => SKILLS.map((s, i) => s.clusterIndex === ci ? i : -1).filter(x => x >= 0))
    const positions = new Array<THREE.Vector3>(SKILLS.length)
    byCluster.forEach((idxs, ci) => {
      spreadOnSphere(CLUSTERS[ci].center, idxs.length).forEach((p, j) => { positions[idxs[j]] = p })
    })

    // Meshes
    const mats = CLUSTERS.map(cl => new THREE.MeshBasicMaterial({ color: new THREE.Color(cl.hex) }))
    const meshes = SKILLS.map((sk, i) => {
      const m = new THREE.Mesh(new THREE.SphereGeometry(sk.size, 14, 10), mats[sk.clusterIndex])
      m.position.copy(positions[i]); m.userData.index = i; group.add(m); return m
    })

    const clusterMarkers = CLUSTERS.map(cl => {
      const o = new THREE.Object3D(); o.position.set(...cl.center); group.add(o); return o
    })

    // Intra-cluster lines
    byCluster.forEach((idxs, ci) => {
      const verts: number[] = []
      for (let a = 0; a < idxs.length; a++)
        for (let b = a + 1; b < idxs.length; b++)
          if (positions[idxs[a]].distanceTo(positions[idxs[b]]) < 2.0) {
            const [p, q] = [positions[idxs[a]], positions[idxs[b]]]
            verts.push(p.x, p.y, p.z, q.x, q.y, q.z)
          }
      if (!verts.length) return
      const g = new THREE.BufferGeometry()
      g.setAttribute("position", new THREE.Float32BufferAttribute(verts, 3))
      group.add(new THREE.LineSegments(g, new THREE.LineBasicMaterial({ color: new THREE.Color(CLUSTERS[ci].hex), transparent: true, opacity: 0.18 })))
    })

    // Bridge lines
    const bv = BRIDGES.flatMap(([a, b]) => { const [p, q] = [positions[a], positions[b]]; return [p.x, p.y, p.z, q.x, q.y, q.z] })
    const bg = new THREE.BufferGeometry(); bg.setAttribute("position", new THREE.Float32BufferAttribute(bv, 3))
    group.add(new THREE.LineSegments(bg, new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.1 })))

    // Stars
    const sv = new Float32Array(300 * 3)
    for (let i = 0; i < 300; i++) { sv[i*3]=(Math.random()-.5)*24; sv[i*3+1]=(Math.random()-.5)*24; sv[i*3+2]=(Math.random()-.5)*24 }
    const sg = new THREE.BufferGeometry(); sg.setAttribute("position", new THREE.Float32BufferAttribute(sv, 3))
    scene.add(new THREE.Points(sg, new THREE.PointsMaterial({ color: 0x6d28d9, size: 0.025, transparent: true, opacity: 0.28 })))

    // Interaction
    const ray = new THREE.Raycaster(), mouse = new THREE.Vector2(-99, -99)
    let autoY = 0, dragging = false, prevX = 0, prevY = 0, velX = 0, velY = 0, manX = 0, manY = 0, hovI = -1, t = 0
    const tmp = new THREE.Vector3()

    const onMove = (e: MouseEvent) => {
      const r = wrap.getBoundingClientRect()
      mouse.x = ((e.clientX - r.left) / W) * 2 - 1
      mouse.y = -((e.clientY - r.top) / H) * 2 + 1
      if (dragging) { velX = (e.clientY - prevY) * 0.006; velY = (e.clientX - prevX) * 0.006; manX += velX; manY += velY; prevX = e.clientX; prevY = e.clientY }
    }
    const onDown = (e: MouseEvent) => { dragging = true; prevX = e.clientX; prevY = e.clientY; wrap.style.cursor = "grabbing" }
    const onUp = () => { dragging = false; wrap.style.cursor = "grab" }
    const onLeave = () => mouse.set(-99, -99)

    wrap.addEventListener("mousemove", onMove)
    wrap.addEventListener("mousedown", onDown)
    wrap.addEventListener("mouseleave", onLeave)
    window.addEventListener("mouseup", onUp)

    let raf: number
    const animate = () => {
      raf = requestAnimationFrame(animate); t += 0.016; autoY += 0.0022
      if (!dragging) { velX *= 0.93; velY *= 0.93; manX += velX; manY += velY }
      group.rotation.y = autoY + manY
      group.rotation.x = Math.max(-0.45, Math.min(0.45, manX))

      meshes.forEach((m, i) => {
        const tgt = i === hovI ? 1 + 0.12 * Math.sin(t * 5) : 1
        m.scale.setScalar(m.scale.x + (tgt - m.scale.x) * 0.15)
      })

      ray.setFromCamera(mouse, camera)
      const hits = ray.intersectObjects(meshes)
      const ni = hits.length ? (hits[0].object.userData.index as number) : -1
      if (ni !== hovI) {
        hovI = ni
        setHovered(ni >= 0 ? { label: SKILLS[ni].label, clusterName: CLUSTERS[SKILLS[ni].clusterIndex].name, hex: CLUSTERS[SKILLS[ni].clusterIndex].hex } : null)
        if (!dragging) wrap.style.cursor = ni >= 0 ? "pointer" : "grab"
      }

      ctx.clearRect(0, 0, W, H)
      clusterMarkers.forEach((cm, ci) => {
        cm.getWorldPosition(tmp); const p = tmp.clone().project(camera); if (p.z > 1) return
        const sx = (p.x * 0.5 + 0.5) * W, sy = (-p.y * 0.5 + 0.5) * H
        ctx.font = "500 9px Inter, sans-serif"; ctx.fillStyle = CLUSTERS[ci].hex; ctx.globalAlpha = 0.42
        ctx.textAlign = "center"; ctx.shadowColor = "rgba(0,0,0,0.95)"; ctx.shadowBlur = 8
        ctx.fillText(CLUSTERS[ci].name.toUpperCase(), sx, sy - 38); ctx.shadowBlur = 0; ctx.globalAlpha = 1
      })
      meshes.forEach((m, i) => {
        const sk = SKILLS[i]; m.getWorldPosition(tmp); const p = tmp.clone().project(camera); if (p.z > 1) return
        const sx = (p.x * 0.5 + 0.5) * W, sy = (-p.y * 0.5 + 0.5) * H, isH = i === hovI
        if (!isH && sk.size < 0.095) return
        ctx.font = `${isH ? "500" : "400"} ${isH ? 13 : 11}px Inter, sans-serif`
        ctx.fillStyle = CLUSTERS[sk.clusterIndex].hex; ctx.globalAlpha = isH ? 1 : 0.62
        ctx.textAlign = "center"; ctx.shadowColor = "rgba(0,0,0,0.98)"; ctx.shadowBlur = 10
        ctx.fillText(sk.label, sx, sy - 15); ctx.shadowBlur = 0; ctx.globalAlpha = 1
      })

      renderer.render(scene, camera)
    }
    animate()

    return () => {
      cancelAnimationFrame(raf)
      wrap.removeEventListener("mousemove", onMove); wrap.removeEventListener("mousedown", onDown)
      wrap.removeEventListener("mouseleave", onLeave); window.removeEventListener("mouseup", onUp)
      renderer.dispose()
      if (wrap.contains(renderer.domElement)) wrap.removeChild(renderer.domElement)
    }
  }, [])

  return (
    <div ref={wrapRef} style={{ position: "relative", width: "100%", height: 480, cursor: "grab", overflow: "hidden" }}>
      <canvas ref={labelRef} style={{ position: "absolute", inset: 0, pointerEvents: "none", zIndex: 5 }} />
      {hovered && (
        <div style={{ position: "absolute", bottom: 16, right: 16, zIndex: 20, background: "rgba(8,0,18,0.95)", border: `1px solid ${hovered.hex}33`, borderLeft: `2px solid ${hovered.hex}`, borderRadius: "0 8px 8px 0", padding: "12px 18px", minWidth: 175 }}>
          <div style={{ color: hovered.hex, fontSize: 9, letterSpacing: "0.22em", textTransform: "uppercase", marginBottom: 6 }}>{hovered.clusterName}</div>
          <div style={{ color: "#f1f5f9", fontSize: 14, fontWeight: 500 }}>{hovered.label}</div>
        </div>
      )}
    </div>
  )
}
