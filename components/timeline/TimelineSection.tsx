import { CHAPTERS } from "@/lib/data/chapters"
import SectionHeading from "@/components/ui/SectionHeading"
import ChapterCard from "./ChapterCard"
import styles from "./TimelineSection.module.css"

export default function TimelineSection({ className }: { className?: string }) {
  return (
    <section id="journey" className={className} aria-labelledby="journey-h">
      <SectionHeading
        id="journey-h"
        kicker="03 / The journey"
        title={
          <>
            A <span className={styles.unbroken}>non-linear</span> journey
          </>
        }
        description="From cognitive neuroscience to data science and software development, each chapter has shaped how I approach technical problems."
        fullWidthDescription
      />
      <div className={styles.journeyArea}>
        {CHAPTERS.map(chapter => (
          <ChapterCard key={chapter.num} chapter={chapter} />
        ))}
      </div>
    </section>
  )
}
