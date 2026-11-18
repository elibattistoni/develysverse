import Icon from "@/components/ui/Icon"
import CopyEmail from "./CopyEmail"
import styles from "./ContactSection.module.css"

export default function ContactSection({ className }: { className?: string }) {
  return (
    <section id="contact" className={`${styles.contact} ${className ?? ""}`} aria-labelledby="contact-h">
      <div className={styles.kicker}>04 / Contact</div>
      <div className={styles.contactLayout}>
        <div>
          <h2 id="contact-h">Let&apos;s build something together<span className={styles.period}>.</span></h2>
          <p className={styles.contactLead}>Have a project in mind? I&apos;m open to freelance opportunities, software collaborations, and projects connecting technology, data, and neuroscience.</p>
        </div>
        <div className={styles.contactContent}>
          <CopyEmail />
          <div className={styles.contactProfiles}>
            <a href="https://github.com/elibattistoni" target="_blank" rel="noopener noreferrer">GitHub <Icon name="external" className={styles.iconInline} /></a>
            <a href="https://www.linkedin.com/in/elisa-battistoni-21597980/" target="_blank" rel="noopener noreferrer">LinkedIn <Icon name="external" className={styles.iconInline} /></a>
          </div>
        </div>
      </div>
    </section>
  )
}
