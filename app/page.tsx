import ExpertiseSection from "@/components/expertise/ExpertiseSection"
import HeroSection from "@/components/hero/HeroSection"
import ProjectsSection from "@/components/projects/ProjectsSection"
import Nav from "@/components/nav/Nav"
import SectionHeading from "@/components/ui/SectionHeading"
import styles from "./page.module.css"

// Hero, Projects and Expertise are integrated; later sections follow in subsequent phases.
export default function Home() {
  return (
    <div className={styles.app}>
      <a className={styles.skipLink} href="#main">Skip to content</a>
      <Nav />
      <main id="main" tabIndex={-1}>
        <HeroSection />
        <ProjectsSection className={`${styles.section} site-container`} />
        <ExpertiseSection className={`${styles.section} site-container`} />
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
