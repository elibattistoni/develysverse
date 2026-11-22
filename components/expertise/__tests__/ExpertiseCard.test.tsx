import { act, fireEvent, render, screen } from "@testing-library/react"
import { EXPERTISE } from "@/lib/data/expertise"
import ExpertiseCard from "../ExpertiseCard"

const expertise = EXPERTISE[0]

beforeAll(() => {
  // Browser APIs that jsdom doesn't implement, used by the card's back face.
  global.ResizeObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
  } as unknown as typeof ResizeObserver
  Object.defineProperty(window, "matchMedia", {
    configurable: true,
    value: () => ({ matches: true, addEventListener() {}, removeEventListener() {} }),
  })
  Object.defineProperty(document, "fonts", { configurable: true, value: { ready: Promise.resolve() } })
  Element.prototype.scrollTo = () => {}
})

function renderCard() {
  render(
    <ExpertiseCard expertise={expertise}>
      <p>Details</p>
    </ExpertiseCard>,
  )
  const open = screen.getByRole("button", { name: `View details: ${expertise.title}` })
  const back = screen.getByRole("group", { name: expertise.title, hidden: true })
  return { open, back, front: open.parentElement! }
}

test("starts on the front face, with the back face out of the keyboard order", () => {
  const { open, back, front } = renderCard()
  expect(open).toHaveAttribute("aria-expanded", "false")
  expect(front).not.toHaveAttribute("inert")
  expect(back).toHaveAttribute("inert")
})

test("flipping moves focus to the back face and makes the front inert", async () => {
  const { open, back, front } = renderCard()

  await act(async () => {
    fireEvent.click(open)
  })

  expect(open).toHaveAttribute("aria-expanded", "true")
  expect(back).toHaveFocus()
  expect(back).not.toHaveAttribute("inert")
  expect(front).toHaveAttribute("inert")
})

test("flipping back returns focus to the details button", async () => {
  const { open, back } = renderCard()
  await act(async () => {
    fireEvent.click(open)
  })

  await act(async () => {
    fireEvent.click(screen.getByRole("button", { name: `Back to overview: ${expertise.title}` }))
  })

  expect(open).toHaveFocus()
  expect(open).toHaveAttribute("aria-expanded", "false")
  expect(back).toHaveAttribute("inert")
})
