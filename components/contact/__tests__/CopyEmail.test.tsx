import { act, fireEvent, render, screen } from "@testing-library/react"
import CopyEmail from "../CopyEmail"

const EMAIL = "hello@example.com"

function mockClipboard(writeText: (text: string) => Promise<void>) {
  const spy = jest.fn(writeText)
  Object.defineProperty(navigator, "clipboard", { configurable: true, value: { writeText: spy } })
  return spy
}

afterEach(() => jest.useRealTimers())

test("copies the address, confirms it, and hides the confirmation after 2.5 s", async () => {
  jest.useFakeTimers()
  const writeText = mockClipboard(() => Promise.resolve())
  render(<CopyEmail email={EMAIL} />)

  await act(async () => { fireEvent.click(screen.getByRole("button", { name: `Copy email address: ${EMAIL}` })) })

  expect(writeText).toHaveBeenCalledWith(EMAIL)
  expect(screen.getByRole("status")).toHaveTextContent("Email copied.")
  act(() => { jest.advanceTimersByTime(2500) })
  expect(screen.getByRole("status")).toBeEmptyDOMElement()
})

test("explains how to copy manually when the clipboard is unavailable", async () => {
  mockClipboard(() => Promise.reject(new Error("denied")))
  render(<CopyEmail email={EMAIL} />)

  await act(async () => { fireEvent.click(screen.getByRole("button")) })

  expect(screen.getByRole("status")).toHaveTextContent("Automatic copy failed. Select the email address to copy it manually.")
})

test("ignores a second click while the first copy is still running", async () => {
  let finish = () => {}
  const writeText = mockClipboard(() => new Promise<void>(resolve => { finish = resolve }))
  render(<CopyEmail email={EMAIL} />)
  const button = screen.getByRole("button")

  fireEvent.click(button)
  fireEvent.click(button)
  await act(async () => { finish() })

  expect(writeText).toHaveBeenCalledTimes(1)
  expect(screen.getByRole("status")).toHaveTextContent("Email copied.")
})
