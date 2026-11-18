import HeroSection from "@/components/hero/HeroSection"
import ProjectsSection from "@/components/projects/ProjectsSection"
import Nav from "@/components/nav/Nav"
import SectionHeading from "@/components/ui/SectionHeading"
import styles from "./page.module.css"

// Hero and Projects are integrated; later section bodies follow in subsequent phases.
export default function Home() {
  return (
    <div className={styles.app}>
      <a className={styles.skipLink} href="#main">Skip to content</a>
      <Nav />
      <main id="main" tabIndex={-1}>
        <HeroSection />
        <ProjectsSection className={`${styles.section} site-container`} />
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
