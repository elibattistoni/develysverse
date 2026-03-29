import Nav from "@/components/nav/Nav"
import HeroSection from "@/components/hero/HeroSection"
import TimelineSection from "@/components/timeline/TimelineSection"
import SkillsSection from "@/components/skills/SkillsSection"
import ContactSection from "@/components/contact/ContactSection"

export default function Home() {
  return (
    <main style={{ height: "100vh", overflowY: "auto", scrollSnapType: "y proximity" }}>
      <Nav />
      <section id="hero" style={{ scrollSnapAlign: "start" }}><HeroSection /></section>
      <section id="story" style={{ scrollSnapAlign: "start" }}><TimelineSection /></section>
      <section id="skills" style={{ scrollSnapAlign: "start" }}><SkillsSection /></section>
      <section id="contact" style={{ scrollSnapAlign: "start" }}><ContactSection /></section>
    </main>
  )
}
