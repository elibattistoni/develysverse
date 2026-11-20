"use client"

import { useEffect, useRef, useState } from "react"
import { useHydrated } from "@/hooks/useHydrated"
import styles from "./ContactSection.module.css"

export default function CopyEmail({ email }: { email: string }) {
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
    setFailed(false)
    setStatus("")
    try {
      await navigator.clipboard.writeText(email)
      if (!mounted.current) return
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
      <button type="button" className={styles.contactCopy} hidden={!hydrated} onClick={copy}>{copied ? "Copied" : "Copy email"}</button>
      <p className={styles.contactStatus} data-error={failed || undefined} role="status">{status}</p>
    </>
  )
}
