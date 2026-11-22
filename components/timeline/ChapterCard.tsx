import type { Chapter } from "@/lib/data/chapters"
import JourneyIllustration from "./JourneyIllustration"
import styles from "./TimelineSection.module.css"

export default function ChapterCard({ chapter }: { chapter: Chapter }) {
  return (
    <details className={styles.journeyItem} open={chapter.current}>
      <summary>
        <span className={styles.journeyYear}>{chapter.year}</span>
        <span className={styles.journeyHeading}>
          <span className={styles.chapter}>{`Chapter ${chapter.num} · ${chapter.chapter}`}</span>
          <strong>{chapter.role}</strong>
        </span>
        <span className={styles.journeyRole}>{chapter.organization}</span>
        <svg className={styles.chevron} aria-hidden="true" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="m3.5 6 4.5 4.5L12.5 6" /></svg>
      </summary>
      <div className={styles.journeyBody}>
        <JourneyIllustration chapter={chapter.num} />
        <div>
          {chapter.paragraphs.map(text => <p key={text}>{text}</p>)}
          <div className={styles.journeyMeta}>{chapter.tags.map(tag => <span key={tag}>{tag}</span>)}</div>
        </div>
      </div>
    </details>
  )
}
