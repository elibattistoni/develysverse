import { act, renderHook } from "@testing-library/react"
import { useIsMobile } from "../useMediaQuery"

test("tracks viewport changes and releases its media subscription", () => {
  const listeners = new Set<() => void>()
  const media = {
    matches: false,
    addEventListener: jest.fn((_event: string, listener: () => void) => listeners.add(listener)),
    removeEventListener: jest.fn((_event: string, listener: () => void) => listeners.delete(listener)),
  }
  Object.defineProperty(window, "matchMedia", { configurable: true, value: jest.fn(() => media) })
  const { result, unmount } = renderHook(() => useIsMobile(800))
  expect(result.current).toBe(false)
  expect(window.matchMedia).toHaveBeenCalledWith("(max-width: 800px)")
  act(() => {
    media.matches = true
    listeners.forEach(notify => notify())
  })
  expect(result.current).toBe(true)
  unmount()
  expect(listeners.size).toBe(0)
})
