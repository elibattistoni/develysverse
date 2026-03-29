"use client"

import { useState, useEffect } from "react"

export function useTypewriter(text: string, speed = 36, startDelay = 700) {
  const [display, setDisplay] = useState("")
  const [done, setDone] = useState(false)

  useEffect(() => {
    setDisplay("")
    setDone(false)
    let i = 0
    let interval: ReturnType<typeof setInterval>
    const timeout = setTimeout(() => {
      interval = setInterval(() => {
        i++
        setDisplay(text.slice(0, i))
        if (i >= text.length) { clearInterval(interval); setDone(true) }
      }, speed)
    }, startDelay)
    return () => { clearTimeout(timeout); clearInterval(interval) }
  }, [text, speed, startDelay])

  return { display, done }
}
