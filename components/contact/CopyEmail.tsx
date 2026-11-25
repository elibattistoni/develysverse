"use client"

import { useEffect, useRef, useState } from "react"
import { useHydrated } from "@/hooks/useHydrated"
import Icon from "@/components/ui/Icon"
import action from "@/components/ui/IconAction.module.css"
import styles from "./ContactSection.module.css"

export default function CopyEmail({ email }: { email: string }) {
  const hydrated = useHydrated()
  const [status, setStatus] = useState<"copied" | "failed" | null>(null)
  const copying = useRef(false)
  const dismissToast = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
  const mounted = useRef(false)

  useEffect(() => {
    mounted.current = true
    return () => {
      mounted.current = false
      clearTimeout(dismissToast.current)
    }
  }, [])

  async function copy() {
    if (copying.current) return
    copying.current = true
    clearTimeout(dismissToast.current)
    setStatus(null)
    try {
      await navigator.clipboard.writeText(email)
      if (!mounted.current) return
      setStatus("copied")
      dismissToast.current = setTimeout(() => setStatus(null), 2500)
    } catch {
      if (mounted.current) setStatus("failed")
    } finally {
      copying.current = false
    }
  }

  return (
    <>
      {hydrated ? (
        <button type="button" className={action.action} aria-label={`Copy email address: ${email}`} onClick={copy}>
          <Icon name="mail" />
          <span className={`${action.tip} ${action.tipEnd}`} aria-hidden="true">
            Copy email address
          </span>
        </button>
      ) : (
        <span className={styles.contactAddressFallback}>
          <Icon name="mail" className={styles.iconBrand} />
          <span className={styles.contactAddress}>{email}</span>
        </span>
      )}
      <div role="status" className={styles.contactStatus}>
        {status === "copied" && (
          <p className={styles.contactToast}>
            Email copied<span className={styles.period}>.</span>
          </p>
        )}
        {status === "failed" && (
          <p className={styles.contactError}>
            Automatic copy failed. The address is <span className={styles.contactAddress}>{email}</span>.
          </p>
        )}
      </div>
    </>
  )
}
