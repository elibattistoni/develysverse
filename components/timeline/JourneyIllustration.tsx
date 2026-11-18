import styles from "./TimelineSection.module.css"

// Original handoff SVG geometry; scoped styles preserve the approved theme.
export default function JourneyIllustration({ chapter }: { chapter: string }) {
  return (
    <svg viewBox="0 0 220 130" fill="none">
      {chapter === "01" && <><rect className={styles.line} height="94" opacity=".58" rx="8" width="160" x="30" y="18" />
<path className={styles.line} d="M54 76 78 47 111 70 130 42 167 59" strokeDasharray="3 4" />
<g className={styles.node}><circle cx="54" cy="76" r="4" /><circle cx="78" cy="47" r="5" /><circle cx="111" cy="70" r="4" /><circle cx="130" cy="42" r="6" /><circle cx="167" cy="59" r="4" /></g>
<circle cx="130" cy="42" opacity=".65" r="12" stroke="var(--accent2)" /><path className={styles.line} d="M42 99h44m9 0h16" opacity=".42" /></>}
      {chapter === "02" && <><g className={styles.line} opacity=".68"><path d="M23 41h13l6-7 7 13 5-9 9 3h33m-73 24h15l5-8 7 14 7-12 8 6h31m-73 24h10l10-9 6 14 6-11 4 6h37" /><path d="M102 65h17l-4-4m4 4-4 4" /></g>
<g className={styles.node}><circle cx="138" cy="43" r="3" /><circle cx="148" cy="54" r="3" /><circle cx="135" cy="60" r="3" /><circle cx="174" cy="61" r="3" /><circle cx="183" cy="73" r="3" /><circle cx="170" cy="80" r="3" /><circle cx="190" cy="85" r="3" /></g>
<path className={styles.line} d="m151 99 28-61" strokeDasharray="3 4" /><rect className={styles.line} height="82" opacity=".42" rx="7" width="80" x="124" y="24" /></>}
      {chapter === "03" && <><g className={styles.line} opacity=".38"><rect height="88" rx="8" width="162" x="29" y="21" /><path d="m34 69 42-14 36 10 42-22 31 8M43 103l22-36 30-20 8-21m34 78 8-33 26-13 4-30" /></g>
<path d="M49 85 77 73l25-35 33 38 36-16" stroke="var(--accent2)" strokeWidth="2" />
<g className={styles.node}><circle cx="49" cy="85" r="4" /><circle cx="77" cy="73" r="4" /><circle cx="102" cy="38" r="5" /><circle cx="135" cy="76" r="4" /><circle cx="171" cy="60" r="4" /></g></>}
      {chapter === "04" && <><rect className={styles.line} height="84" opacity=".75" rx="8" width="158" x="31" y="23" />
<path className={styles.line} d="M31 42h158m-145 13h132" opacity=".55" /><g className={styles.node}><circle cx="43" cy="33" r="2" /><circle cx="51" cy="33" r="2" /><circle cx="59" cy="33" r="2" /></g>
<g className={styles.line} opacity=".65"><rect height="31" rx="3" width="35" x="46" y="65" /><rect height="31" rx="3" width="35" x="92" y="65" /><rect height="31" rx="3" width="35" x="138" y="65" /></g>
<path d="M51 87h13m33 0h15m31 0h17" opacity=".72" stroke="var(--accent2)" /></>}
      {chapter === "05" && <><rect className={styles.line} height="83" opacity=".67" rx="8" width="170" x="25" y="24" />
<path className={styles.line} d="M25 44h170m-126 0v63M36 57h21m-21 11h16m-16 11h19" opacity=".42" /><circle className={styles.node} cx="38" cy="34" r="2" /><circle className={styles.node} cx="45" cy="34" r="2" />
<rect fill="var(--accent)" height="39" opacity=".11" rx="5" width="69" x="80" y="55" /><path className={styles.line} d="M89 65h49M89 74h36M89 83h42" opacity=".8" />
<rect fill="var(--accent2)" height="39" opacity=".12" rx="5" width="27" x="158" y="55" />
<path d="M171.5 63l6 2.5V71c0 4-6 7.5-6 7.5s-6-3.5-6-7.5v-5.5zM168 71l2.5 2.5 4-5" stroke="var(--accent2)" /></>}
    </svg>
  )
}
