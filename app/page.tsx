import Nav from "@/components/nav/Nav"
import HeroSection from "@/components/hero/HeroSection"
import TimelineSection from "@/components/timeline/TimelineSection"
import SkillsSection from "@/components/skills/SkillsSection"
import ContactSection from "@/components/contact/ContactSection"

export default function Home() {
  return (
    <main>
      <Nav />
      <section id="hero"><HeroSection /></section>
      <section id="story"><TimelineSection /></section>
      <section id="skills"><SkillsSection /></section>
      <section id="contact"><ContactSection /></section>
    </main>
  )
}
