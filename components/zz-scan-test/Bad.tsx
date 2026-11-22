export function Bad() {
  const key = process.env.NEXT_PUBLIC_STRIPE_SECRET_KEY
  const ok = process.env.NEXT_PUBLIC_BASE_PATH
  fetch("https://example.com/track")
  return (
    <div>
      <a href="https://x.test" target="_blank">bad</a>
      <a href="https://y.test" target="_blank" rel="noopener noreferrer">good</a>
    </div>
  )
}
