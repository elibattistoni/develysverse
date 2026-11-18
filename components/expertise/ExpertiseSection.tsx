import { EXPERTISE, PUBLICATIONS, type Expertise } from "@/lib/data/expertise"
import Icon from "@/components/ui/Icon"
import SectionHeading from "@/components/ui/SectionHeading"
import ExpertiseCard from "./ExpertiseCard"
import ResearchPublications from "./ResearchPublications"
import styles from "./ExpertiseSection.module.css"

function Details({ expertise }: { expertise: Expertise }) {
  return <dl className={styles.expertiseDetails}>{expertise.groups.map(group => <div key={group.label}><dt>{group.label}</dt><dd>{group.value}</dd></div>)}</dl>
}

export default function ExpertiseSection({ className }: { className: string }) {
  return (
    <section id="expertise" className={className} aria-labelledby="expertise-h">
      <SectionHeading id="expertise-h" kicker="02 / Capabilities" title="Expertise" description="Software development is my focus, shaped by a background in data science and cognitive neuroscience." />
      <div className={styles.expertiseGrid} data-expertise-grid="">
        {EXPERTISE.map(expertise => (
          <ExpertiseCard key={expertise.id} expertise={expertise}>
            {expertise.id === "neuroscience" ? <ResearchPublications>
              <Details expertise={expertise} />
              <h4>Publications</h4>
              <ul className={styles.publicationsList} role="list">
                {PUBLICATIONS.map(paper => <li key={paper.href}><a href={paper.href} target="_blank" rel="noopener noreferrer">{paper.title} <Icon name="external" className={styles.iconInline} /></a></li>)}
              </ul>
            </ResearchPublications> : <Details expertise={expertise} />}
          </ExpertiseCard>
        ))}
      </div>
    </section>
  )
}
