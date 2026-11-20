import Icon from "@/components/ui/Icon"
import buttonStyles from "@/components/ui/ActionButton.module.css"
import HeroArt from "./HeroArt"
import styles from "./HeroSection.module.css"

export default function HeroSection() {
  return (
    <section id="top" className={`${styles.hero} site-container`} aria-labelledby="hero-headline">
      <div className={styles.heroText}>
        <div className={styles.eyebrow}>Elisa Battistoni</div>
        <h1 id="hero-headline"><span>Building software</span>{" "}<span className={styles.heroSecondLine}>with a scientist&apos;s mindset<span className={styles.heroPeriod}>.</span></span></h1>
        <p className={styles.heroDesc}>Experienced Software Developer with a PhD in Cognitive Neuroscience and a background in Data Science.</p>
        <div className={styles.heroActions}>
          <a className={`${buttonStyles.button} ${buttonStyles.primary}`} href="#projects">Explore Projects <Icon name="arrow-right" /></a>
          <a className={`${buttonStyles.button} ${buttonStyles.secondary}`} href="#contact">Get in Touch <Icon name="arrow-right" /></a>
        </div>
      </div>
      <HeroArt />
    </section>
  )
}
