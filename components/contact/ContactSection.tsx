import Icon from "@/components/ui/Icon"
import CopyEmail from "./CopyEmail"
import action from "@/components/ui/IconAction.module.css"
import styles from "./ContactSection.module.css"

const EMAIL = "hello@develysverse.com"
const PROFILES = [
  { label: "View GitHub profile", icon: "github", href: "https://github.com/elibattistoni" },
  { label: "View LinkedIn profile", icon: "linkedin", href: "https://www.linkedin.com/in/elisa-battistoni-21597980/" },
] as const

export default function ContactSection({ className }: { className?: string }) {
  return (
    <section id="contact" className={`${styles.contact} ${className ?? ""}`} aria-labelledby="contact-h">
      <div className={styles.kicker}>04 / Contact</div>
      <div className={styles.contactLayout}>
        <div>
          <h2 id="contact-h">
            Let&apos;s build something together<span className={styles.period}>.</span>
          </h2>
          <p className={styles.contactLead}>
            Have a project in mind? I&apos;m open to freelance opportunities, software collaborations, and projects
            connecting technology, data, and neuroscience.
          </p>
        </div>
        <div>
          <div className={styles.contactActions}>
            {PROFILES.map(profile => (
              <a
                key={profile.href}
                href={profile.href}
                target="_blank"
                rel="noopener noreferrer"
                className={action.action}
                aria-label={profile.label}
              >
                <Icon name={profile.icon} />
                <span className={`${action.tip} ${action.tipEnd}`} aria-hidden="true">
                  {profile.label}
                </span>
              </a>
            ))}
            <CopyEmail email={EMAIL} />
          </div>
        </div>
      </div>
    </section>
  )
}
