import Nav from "@/components/nav/Nav"
import SectionHeading from "@/components/ui/SectionHeading"
import styles from "./page.module.css"

// Phase 1 mounts the approved semantic shell. Section bodies and interactive
// components are integrated in subsequent phases; no prototype script is loaded.
export default function Home() {
  return (
    <div className={styles.app}>
      <a className={styles.skipLink} href="#main">Skip to content</a>
      <Nav />
      <main id="main" tabIndex={-1}>
        <section id="top" className={`${styles.hero} site-container`} aria-labelledby="hero-headline">
          <div className={styles.heroText}>
            <div className={styles.eyebrow}>Elisa Battistoni</div>
            <h1 id="hero-headline"><span>Building software</span>{" "}<span className={styles.secondLine}>with a scientist&apos;s mindset<span className={styles.period}>.</span></span></h1>
            <p className={styles.heroDescription}>Experienced Software Developer with a PhD in Cognitive Neuroscience and a background in Data Science.</p>
          </div>
        </section>
        <section id="projects" className={`${styles.section} site-container`} aria-labelledby="projects-h">
          <SectionHeading id="projects-h" kicker="01 / Selected work" title="Selected Projects" description="A selection of things I've built, designed, and contributed to." />
        </section>
        <section id="expertise" className={`${styles.section} site-container`} aria-labelledby="expertise-h">
          <SectionHeading id="expertise-h" kicker="02 / Capabilities" title="Expertise" description="Software development is my focus, shaped by a background in data science and cognitive neuroscience." />
        </section>
        <section id="journey" className={`${styles.section} site-container`} aria-labelledby="journey-h">
          <SectionHeading id="journey-h" kicker="03 / The journey" title="A non-linear journey" description="From cognitive neuroscience to data science and software development, each chapter has shaped how I approach technical problems." />
        </section>
        <section id="contact" className={`${styles.section} site-container`} aria-labelledby="contact-h">
          <SectionHeading id="contact-h" kicker="04 / Contact" title="Let's build something together" />
        </section>
      </main>
    </div>
  )
}
