"use client"

import { useEffect, useRef, useState } from "react"
import { useHydrated } from "@/hooks/useHydrated"
import styles from "./ContactSection.module.css"

const EMAIL = "elisa.battistoni.dev@gmail.com"

export default function CopyEmail() {
  const hydrated = useHydrated()
  const [copied, setCopied] = useState(false)
  const [failed, setFailed] = useState(false)
  const [status, setStatus] = useState("")
  const copying = useRef(false)
  const resetLabel = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
  const mounted = useRef(false)

  useEffect(() => {
    mounted.current = true
    return () => { mounted.current = false; clearTimeout(resetLabel.current) }
  }, [])

  async function copy() {
    if (copying.current) return
    copying.current = true
    clearTimeout(resetLabel.current)
    setCopied(false)
    setStatus("")
    try {
      await navigator.clipboard.writeText(EMAIL)
      if (!mounted.current) return
      setFailed(false)
      setCopied(true)
      setStatus("Email address copied to the clipboard.")
      resetLabel.current = setTimeout(() => { setCopied(false); setStatus("") }, 2500)
    } catch {
      if (!mounted.current) return
      setFailed(true)
      setStatus("Automatic copy failed. Select the email address to copy it manually.")
    } finally {
      copying.current = false
    }
  }

  return (
    <>
      <button type="button" className={styles.contactCopy} hidden={!hydrated} onClick={copy}>{copied ? "Email copied" : "Copy email"}</button>
      <p className={styles.contactStatus} role="status">{status}</p>
      <p className={styles.contactFallback} hidden={hydrated && !failed}>Copy this address manually: <span>{EMAIL}</span></p>
    </>
  )
}
