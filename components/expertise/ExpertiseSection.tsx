import { EXPERTISE, PUBLICATIONS, type Expertise } from "@/lib/data/expertise"
import SkillsSection from "@/components/skills/SkillsSection"
import Icon from "@/components/ui/Icon"
import SectionHeading from "@/components/ui/SectionHeading"
import ExpertiseCard from "./ExpertiseCard"
import ResearchPublications from "./ResearchPublications"
import styles from "./ExpertiseSection.module.css"

function Details({ groups }: { groups: Expertise["groups"] }) {
  return <dl className={styles.expertiseDetails}>{groups.map(group => <div key={group.label}><dt>{group.label}</dt><dd>{group.value}</dd></div>)}</dl>
}

export default function ExpertiseSection({ className }: { className: string }) {
  return (
    <section id="expertise" className={className} aria-labelledby="expertise-h">
      <SectionHeading
        id="expertise-h"
        kicker="02 / Skills"
        title="Expertise"
        description={"Software development is my focus, shaped by a background in data science and cognitive\u00a0neuroscience."}
        fullWidthDescription
      />
      <div className={styles.expertiseGrid} data-expertise-grid="">
        {EXPERTISE.map(expertise => (
          <ExpertiseCard key={expertise.id} expertise={expertise}>
            {expertise.id === "neuroscience" ? <ResearchPublications>
              <Details groups={[expertise.introduction]} />
              <h4>Selected publications ({PUBLICATIONS.length})</h4>
              <ul className={styles.publicationsList} role="list">
                {PUBLICATIONS.map(paper => <li key={paper.href}><a href={paper.href} target="_blank" rel="noopener noreferrer">{paper.title} <Icon name="external" className={styles.iconInline} /></a></li>)}
              </ul>
              <Details groups={expertise.groups} />
            </ResearchPublications> : <Details groups={expertise.groups} />}
          </ExpertiseCard>
        ))}
      </div>
      <SkillsSection />
    </section>
  )
}
