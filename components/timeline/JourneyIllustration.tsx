/* The local WebP derivatives already contain the full composition at 2×. */
/* eslint-disable @next/next/no-img-element */
import { assetUrl } from "@/lib/assets"
import styles from "./TimelineSection.module.css"

export default function JourneyIllustration({ chapter }: { chapter: string }) {
  return (
    <img
      className={styles.journeyVisual}
      src={assetUrl(`/assets/images/journey/chapter-${Number(chapter)}.webp`)}
      width={440}
      height={275}
      alt=""
      loading="lazy"
      decoding="async"
    />
  )
}
