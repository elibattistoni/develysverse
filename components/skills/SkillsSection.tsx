import { GROUPS, POINTS } from "@/lib/data/skills"
import Constellation from "./Constellation"
import styles from "./SkillsSection.module.css"

export default function SkillsSection() {
  return (
    <section className={styles.skillsMap} aria-labelledby="skills-map-title" data-skills-map="">
      <Constellation>
        <div className={styles.accessibleSkills} aria-label="Skills by discipline" role="region">
          {GROUPS.map((group, index) => (
            <ul key={group.name} aria-label={`${group.name} skills`}>
              {POINTS.filter(point => point[1] === index).map(point => (
                <li key={point[0]}>{point[0]}</li>
              ))}
            </ul>
          ))}
        </div>
      </Constellation>
      <noscript>
        <style>{`.${styles.exploration} { display: none !important; } .${styles.accessibleSkills} { position: static; width: auto; height: auto; overflow: visible; clip-path: none; }`}</style>
      </noscript>
    </section>
  )
}
