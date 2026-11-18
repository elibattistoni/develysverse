"use client"

import { useSyncExternalStore } from "react"

const subscribe = () => () => {}
const getClientSnapshot = () => true
const getServerSnapshot = () => false

// Keep SSR and the hydration render identical; enable progressive enhancements
// only in the browser. Without JavaScript, the complete static content remains.
export function useHydrated() {
  return useSyncExternalStore(subscribe, getClientSnapshot, getServerSnapshot)
}
