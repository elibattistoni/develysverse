import type { ReactNode } from "react"
import styles from "./SectionHeading.module.css"

interface Props {
  id: string
  kicker: string
  title: ReactNode
  description?: string
  fullWidthDescription?: boolean
}

export default function SectionHeading({ id, kicker, title, description, fullWidthDescription }: Props) {
  return (
    <>
      <div className={styles.kicker}>{kicker}</div>
      <h2 className={styles.title} id={id}>
        {title}
        <span className={styles.period}>.</span>
      </h2>
      {description && (
        <p className={fullWidthDescription ? `${styles.lead} ${styles.fullWidthLead}` : styles.lead}>{description}</p>
      )}
    </>
  )
}
