import Nav from "@/components/nav/Nav"
import HeroSection from "@/components/hero/HeroSection"
import TimelineSection from "@/components/timeline/TimelineSection"
import SkillsSection from "@/components/skills/SkillsSection"
import ContactSection from "@/components/contact/ContactSection"

export default function Home() {
  return (
    <main>
      <Nav />
      <section id="hero" style={{ position: "relative" }}><HeroSection /></section>
      <section id="story" style={{ position: "relative" }}><TimelineSection /></section>
      <section id="skills" style={{ position: "relative" }}><SkillsSection /></section>
      <section id="contact" style={{ position: "relative" }}><ContactSection /></section>
    </main>
  )
}
