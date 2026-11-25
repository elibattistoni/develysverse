"use client"

import { useEffect } from "react"
import styles from "./IconAction.module.css"

const DISMISSED = "data-tip-dismissed"
const MARGIN = 8

/**
 * Behaviour for the icon-action tooltips (IconAction.module.css). Mounted once per page; renders nothing.
 * - Keeps each tooltip centred over its icon, but shifts it sideways (--tip-shift) when centring would
 *   push it past the screen edge or the edge of a scrolling container such as the project rail.
 *   Open tooltips are placed again on resize, zoom and scroll.
 * - Escape hides the tooltip of the focused or hovered icon without moving focus (WCAG 1.4.13). It comes
 *   back once the pointer and focus have both left the icon.
 */
export default function IconTooltips() {
  useEffect(() => {
    const selector = `.${styles.action}`

    function place(action: Element) {
      const tip = action.querySelector<HTMLElement>(`.${styles.tip}`)
      if (!tip) return
      let left = MARGIN,
        right = document.documentElement.clientWidth - MARGIN
      for (let el = action.parentElement; el; el = el.parentElement) {
        if (getComputedStyle(el).overflowX === "visible") continue
        const box = el.getBoundingClientRect()
        left = Math.max(left, box.left + MARGIN)
        right = Math.min(right, box.right - MARGIN)
      }
      const box = action.getBoundingClientRect(),
        half = tip.offsetWidth / 2,
        centre = box.left + box.width / 2
      const shift = Math.max(left - (centre - half), 0) || Math.min(right - (centre + half), 0)
      tip.style.setProperty("--tip-shift", `${Math.round(shift)}px`)
    }

    function placeTarget(event: Event) {
      const action = (event.target as Element | null)?.closest?.(selector)
      if (action) place(action)
    }

    // A tooltip can stay open while the window is resized or zoomed, or while its scroll container
    // moves: re-place the open ones (hovered or focused) once per frame.
    let reflow = 0
    function placeOpen() {
      cancelAnimationFrame(reflow)
      reflow = requestAnimationFrame(() => {
        const focused = document.activeElement?.closest(selector)
        for (const action of new Set([
          ...document.querySelectorAll(`${selector}:hover`),
          ...(focused ? [focused] : []),
        ]))
          place(action)
      })
    }

    function onKeyDown(event: KeyboardEvent) {
      if (event.key !== "Escape") return
      const focused = document.activeElement?.closest(selector)
      const targets = [...document.querySelectorAll(`${selector}:hover`), ...(focused ? [focused] : [])]
      for (const target of targets) target.setAttribute(DISMISSED, "")
    }

    // After the pointer or focus moves, re-enable tooltips on icons that are neither hovered nor focused.
    let frame = 0
    function restore() {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => {
        for (const el of document.querySelectorAll(`[${DISMISSED}]`))
          if (!el.matches(":hover") && !el.contains(document.activeElement)) el.removeAttribute(DISMISSED)
      })
    }

    document.addEventListener("pointerover", placeTarget)
    document.addEventListener("focusin", placeTarget)
    window.addEventListener("resize", placeOpen)
    document.addEventListener("scroll", placeOpen, { capture: true, passive: true })
    document.addEventListener("keydown", onKeyDown)
    document.addEventListener("pointerout", restore)
    document.addEventListener("focusout", restore)
    return () => {
      cancelAnimationFrame(frame)
      cancelAnimationFrame(reflow)
      document.removeEventListener("pointerover", placeTarget)
      document.removeEventListener("focusin", placeTarget)
      window.removeEventListener("resize", placeOpen)
      document.removeEventListener("scroll", placeOpen, { capture: true })
      document.removeEventListener("keydown", onKeyDown)
      document.removeEventListener("pointerout", restore)
      document.removeEventListener("focusout", restore)
    }
  }, [])

  return null
}
