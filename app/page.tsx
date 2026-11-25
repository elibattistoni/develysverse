import ExpertiseSection from "@/components/expertise/ExpertiseSection"
import HeroSection from "@/components/hero/HeroSection"
import ProjectsSection from "@/components/projects/ProjectsSection"
import Nav from "@/components/nav/Nav"
import TimelineSection from "@/components/timeline/TimelineSection"
import ContactSection from "@/components/contact/ContactSection"
import Footer from "@/components/contact/Footer"
import styles from "./page.module.css"

export default function Home() {
  return (
    <div className={styles.app}>
      <a className={styles.skipLink} href="#main">
        Skip to content
      </a>
      <Nav />
      <main id="main" tabIndex={-1}>
        <HeroSection />
        <ProjectsSection className={`${styles.section} site-container`} />
        <ExpertiseSection className={`${styles.section} site-container`} />
        <TimelineSection className={`${styles.section} site-container`} />
        <ContactSection className={`${styles.section} site-container`} />
      </main>
      <Footer />
    </div>
  )
}
