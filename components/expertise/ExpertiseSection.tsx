import { EXPERTISE, PUBLICATIONS } from "@/lib/data/expertise"
import SkillsSection from "@/components/skills/SkillsSection"
import Icon from "@/components/ui/Icon"
import SectionHeading from "@/components/ui/SectionHeading"
import ExpertiseCard from "./ExpertiseCard"
import styles from "./ExpertiseSection.module.css"

export default function ExpertiseSection({ className }: { className: string }) {
  return (
    <section id="expertise" className={className} aria-labelledby="expertise-h">
      <SectionHeading
        id="expertise-h"
        kicker="02 / Skills"
        title="Expertise"
        description={
          "Software engineering is my focus, shaped by a background in data science and cognitive\u00a0neuroscience."
        }
        fullWidthDescription
      />
      <div className={styles.expertiseGrid} data-expertise-grid="">
        {EXPERTISE.map(expertise => {
          const description = (
            <p>
              {expertise.backDescription.map((part, index) =>
                typeof part === "string" ? part : <strong key={index}>{part.strong}</strong>,
              )}
            </p>
          )

          return (
            <ExpertiseCard key={expertise.id} expertise={expertise}>
              {expertise.id === "neuroscience" ? (
                <>
                  <section aria-labelledby="neuroscience-publications">
                    <h3 id="neuroscience-publications">Selected Publications</h3>
                    <ol className={styles.publicationsList}>
                      {PUBLICATIONS.map(paper => {
                        const lastWord = paper.title.lastIndexOf(" ") + 1
                        return (
                          <li key={paper.href}>
                            <a href={paper.href} target="_blank" rel="noopener noreferrer">
                              {paper.title.slice(0, lastWord)}
                              <span className={styles.publicationEnd}>
                                {paper.title.slice(lastWord)} <Icon name="external" className={styles.iconInline} />
                              </span>
                            </a>
                          </li>
                        )
                      })}
                    </ol>
                  </section>
                  <section aria-labelledby="neuroscience-research">
                    <h3 id="neuroscience-research">Studies &amp; Research</h3>
                    {description}
                  </section>
                </>
              ) : (
                description
              )}
            </ExpertiseCard>
          )
        })}
      </div>
      <SkillsSection />
    </section>
  )
}
