import Icon from "@/components/ui/Icon"
import styles from "./ContactSection.module.css"

export default function Footer() {
  return (
    <footer className={`${styles.footer} site-container`}>
      <span>© {new Date().getFullYear()} Elisa Battistoni · develysverse</span>
      <a href="#top">
        Back to top <Icon name="arrow-up" className={styles.iconInline} />
      </a>
    </footer>
  )
}
