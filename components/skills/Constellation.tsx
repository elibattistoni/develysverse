"use client"

import { useEffect, useRef } from "react"
import * as THREE from "three"
import { CLUSTERS, SKILLS } from "@/lib/data/skills"

function spreadOnSphere(center: [number, number, number], n: number, spread = 1.0): THREE.Vector3[] {
  if (n === 0) return []
  const c = new THREE.Vector3(...center)
  const golden = Math.PI * (1 + Math.sqrt(5))
  return Array.from({ length: n }, (_, i) => {
    const y = n === 1 ? 0 : 1 - (2 * i) / (n - 1)
    const r = Math.sqrt(Math.max(0, 1 - y * y))
    const rad = (1.2 + (i % 4) * 0.18) * spread
    return new THREE.Vector3(c.x + rad * r * Math.cos(golden * i), c.y + rad * y * 0.8 * spread, c.z + rad * r * Math.sin(golden * i))
  })
}

export default function Constellation({ paused = false }: { paused?: boolean }) {
  const wrapRef = useRef<HTMLDivElement>(null)
  const labelRef = useRef<HTMLCanvasElement>(null)
  const pausedRef = useRef(paused)

  useEffect(() => { pausedRef.current = paused }, [paused])

  useEffect(() => {
    const wrap = wrapRef.current, lc = labelRef.current
    if (!wrap || !lc) return

    const isMobile = window.innerWidth < 768
    const W = wrap.clientWidth || 700, H = isMobile ? 420 : 600
    wrap.style.height = `${H}px`
    const dpr = Math.min(window.devicePixelRatio || 1, 2)

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setPixelRatio(dpr); renderer.setSize(W, H)
    Object.assign(renderer.domElement.style, { position: "absolute", inset: "0", width: "100%", height: "100%", zIndex: "1" })
    wrap.appendChild(renderer.domElement)

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(58, W / H, 0.1, 100)
    camera.position.z = 8.5
    const group = new THREE.Group(); scene.add(group)

    lc.width = W * dpr; lc.height = H * dpr
    lc.style.width = `${W}px`; lc.style.height = `${H}px`
    const ctx = lc.getContext("2d")!; ctx.scale(dpr, dpr)

    // Positions
    const byCluster = CLUSTERS.map((_, ci) => SKILLS.map((s, i) => s.clusterIndex === ci ? i : -1).filter(x => x >= 0))
    const positions = new Array<THREE.Vector3>(SKILLS.length)
    byCluster.forEach((idxs, ci) => {
      const spread = CLUSTERS[ci].emphasized ? 1.6 : 1.1
      spreadOnSphere(CLUSTERS[ci].center, idxs.length, spread).forEach((p, j) => { positions[idxs[j]] = p })
    })

    // Lighting
    scene.add(new THREE.AmbientLight(0xffffff, 0.4))
    const dirLight = new THREE.DirectionalLight(0xffffff, 0.8)
    dirLight.position.set(5, 5, 10)
    scene.add(dirLight)
    const fillLight = new THREE.DirectionalLight(0x8b5cf6, 0.3)
    fillLight.position.set(-5, -3, -5)
    scene.add(fillLight)

    // Meshes
    const mats = CLUSTERS.map(cl => new THREE.MeshStandardMaterial({ color: new THREE.Color(cl.hex), roughness: 0.4, metalness: 0.1 }))
    const meshes = SKILLS.map((sk, i) => {
      const m = new THREE.Mesh(new THREE.SphereGeometry(sk.size, 24, 24), mats[sk.clusterIndex])
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
          if (positions[idxs[a]].distanceTo(positions[idxs[b]]) < (CLUSTERS[ci].emphasized ? 6.5 : 4.5)) {
            const [p, q] = [positions[idxs[a]], positions[idxs[b]]]
            verts.push(p.x, p.y, p.z, q.x, q.y, q.z)
          }
      if (!verts.length) return
      const g = new THREE.BufferGeometry()
      g.setAttribute("position", new THREE.Float32BufferAttribute(verts, 3))
      group.add(new THREE.LineSegments(g, new THREE.LineBasicMaterial({ color: new THREE.Color(CLUSTERS[ci].hex), transparent: true, opacity: 0.35 })))
    })

    // Stars (circular sprite via radial-gradient canvas texture so points render round, not as GL squares)
    const starCanvas = document.createElement("canvas")
    starCanvas.width = 32; starCanvas.height = 32
    const sctx = starCanvas.getContext("2d")!
    const grad = sctx.createRadialGradient(16, 16, 0, 16, 16, 16)
    grad.addColorStop(0, "rgba(255,255,255,1)")
    grad.addColorStop(0.5, "rgba(255,255,255,0.6)")
    grad.addColorStop(1, "rgba(255,255,255,0)")
    sctx.fillStyle = grad
    sctx.fillRect(0, 0, 32, 32)
    const starTex = new THREE.CanvasTexture(starCanvas)

    const sv = new Float32Array(300 * 3)
    for (let i = 0; i < 300; i++) { sv[i*3]=(Math.random()-.5)*24; sv[i*3+1]=(Math.random()-.5)*24; sv[i*3+2]=(Math.random()-.5)*24 }
    const sg = new THREE.BufferGeometry(); sg.setAttribute("position", new THREE.Float32BufferAttribute(sv, 3))
    scene.add(new THREE.Points(sg, new THREE.PointsMaterial({ color: 0x8b5cf6, size: 0.04, transparent: true, opacity: 0.45, map: starTex, alphaTest: 0.01, depthWrite: false })))

    // Interaction
    const mouse = new THREE.Vector2(-99, -99)
    let autoY = 0, dragging = false, prevX = 0, prevY = 0, velX = 0, velY = 0, manX = 0, manY = 0, t = 0
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

    const onWheel = (e: WheelEvent) => {
      if (!pausedRef.current) return
      e.preventDefault()
      camera.position.z = Math.max(4, Math.min(14, camera.position.z + e.deltaY * 0.008))
    }

    // Touch handlers — mirror mouse drag with single finger; pinch zoom with two fingers (paused only)
    let pinchStartDist = 0
    let pinchStartZ = 8.5
    const touchDist = (a: Touch, b: Touch) => Math.hypot(a.clientX - b.clientX, a.clientY - b.clientY)
    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        dragging = true
        prevX = e.touches[0].clientX
        prevY = e.touches[0].clientY
      } else if (e.touches.length === 2 && pausedRef.current) {
        pinchStartDist = touchDist(e.touches[0], e.touches[1])
        pinchStartZ = camera.position.z
        e.preventDefault()
      }
    }
    const onTouchMove = (e: TouchEvent) => {
      if (e.touches.length === 1 && dragging) {
        const t = e.touches[0]
        velX = (t.clientY - prevY) * 0.006
        velY = (t.clientX - prevX) * 0.006
        manX += velX; manY += velY
        prevX = t.clientX; prevY = t.clientY
      } else if (e.touches.length === 2 && pausedRef.current) {
        e.preventDefault()
        const d = touchDist(e.touches[0], e.touches[1])
        if (pinchStartDist > 0) {
          const scale = pinchStartDist / d
          camera.position.z = Math.max(4, Math.min(14, pinchStartZ * scale))
        }
      }
    }
    const onTouchEnd = (e: TouchEvent) => {
      if (e.touches.length === 0) dragging = false
      if (e.touches.length < 2) pinchStartDist = 0
    }

    wrap.addEventListener("mousemove", onMove)
    wrap.addEventListener("mousedown", onDown)
    wrap.addEventListener("mouseleave", onLeave)
    wrap.addEventListener("wheel", onWheel, { passive: false })
    wrap.addEventListener("touchstart", onTouchStart, { passive: false })
    wrap.addEventListener("touchmove", onTouchMove, { passive: false })
    wrap.addEventListener("touchend", onTouchEnd)
    wrap.addEventListener("touchcancel", onTouchEnd)
    window.addEventListener("mouseup", onUp)

    let raf: number
    const animate = () => {
      raf = requestAnimationFrame(animate); t += 0.016
      if (!pausedRef.current) {
        autoY += 0.001
        // Smoothly reset zoom when playing
        camera.position.z += (8.5 - camera.position.z) * 0.05
      }
      if (!dragging) { velX *= 0.93; velY *= 0.93; manX += velX; manY += velY }
      group.rotation.y = autoY + manY
      group.rotation.x = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, manX))

      ctx.clearRect(0, 0, W, H)
      meshes.forEach((m, i) => {
        const sk = SKILLS[i]; m.getWorldPosition(tmp); const p = tmp.clone().project(camera); if (p.z > 1.2) return
        const sx = (p.x * 0.5 + 0.5) * W, sy = (-p.y * 0.5 + 0.5) * H
        ctx.font = "400 10px Inter, sans-serif"
        ctx.fillStyle = CLUSTERS[sk.clusterIndex].hex; ctx.globalAlpha = 0.62
        ctx.textAlign = "center"; ctx.shadowColor = "rgba(0,0,0,0.98)"; ctx.shadowBlur = 10
        ctx.fillText(sk.label, sx, sy - 15); ctx.shadowBlur = 0; ctx.globalAlpha = 1
      })

      renderer.render(scene, camera)
    }
    animate()

    return () => {
      cancelAnimationFrame(raf)
      wrap.removeEventListener("mousemove", onMove); wrap.removeEventListener("mousedown", onDown)
      wrap.removeEventListener("mouseleave", onLeave); wrap.removeEventListener("wheel", onWheel)
      wrap.removeEventListener("touchstart", onTouchStart); wrap.removeEventListener("touchmove", onTouchMove)
      wrap.removeEventListener("touchend", onTouchEnd); wrap.removeEventListener("touchcancel", onTouchEnd)
      window.removeEventListener("mouseup", onUp)
      renderer.dispose()
      if (wrap.contains(renderer.domElement)) wrap.removeChild(renderer.domElement)
    }
  }, [])

  return (
    <div ref={wrapRef} style={{ position: "relative", width: "100%", height: 600, cursor: "grab", overflow: "hidden", touchAction: "pan-y" }}>
      <canvas ref={labelRef} style={{ position: "absolute", inset: 0, pointerEvents: "none", zIndex: 5 }} />
    </div>
  )
}
