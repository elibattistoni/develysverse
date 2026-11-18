import styles from "./SectionHeading.module.css"

interface Props {
  id: string
  kicker: string
  title: string
  description?: string
}

export default function SectionHeading({ id, kicker, title, description }: Props) {
  return (
    <>
      <div className={styles.kicker}>{kicker}</div>
      <h2 className={styles.title} id={id}>{title}<span className={styles.period}>.</span></h2>
      {description && <p className={styles.lead}>{description}</p>}
    </>
  )
}
