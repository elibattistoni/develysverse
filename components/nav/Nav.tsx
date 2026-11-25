import styles from "./Nav.module.css"

const NAV_ITEMS = [
  { label: "Projects", id: "projects" },
  { label: "Expertise", id: "expertise" },
  { label: "Journey", id: "journey" },
  { label: "Contact", id: "contact" },
] as const

export default function Nav() {
  return (
    <header className={`${styles.wrap} site-container`}>
      <nav className={styles.nav} aria-label="Main navigation">
        <a className={styles.brand} href="#top" aria-label="develysverse home">
          develysverse<span className={styles.period}>.</span>
        </a>
        <div className={styles.links}>
          {NAV_ITEMS.map(({ label, id }) => (
            <a key={id} href={`#${id}`}>
              {label}
            </a>
          ))}
        </div>
      </nav>
    </header>
  )
}
