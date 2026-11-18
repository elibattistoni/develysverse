import Icon from "@/components/ui/Icon"
import styles from "./ContactSection.module.css"

export default function Footer() {
  return (
    <footer className={`${styles.footer} site-container`}>
      <span>© 2026 Elisa Battistoni · Develysverse</span>
      <a href="#top">Back to top <Icon name="arrow-up" className={styles.iconInline} /></a>
    </footer>
  )
}
