/* Exact approved images are served unchanged by the static export. */
/* eslint-disable @next/next/no-img-element */
import { assetUrl } from "@/lib/assets"
import type { Project } from "@/lib/data/projects"
import Icon from "@/components/ui/Icon"
import styles from "./ProjectsSection.module.css"

export default function ProjectCard({ project }: { project: Project }) {
  const visualClass = project.id === "brenta" ? styles.brentaVisual : project.id === "palette" ? styles.paletteVisual : ""
  const image = <img src={assetUrl(project.image)} width={project.width} height={project.height} alt={project.alt} loading="lazy" decoding="async" />

  return (
    <article className={`${styles.projectCard} ${project.compact ? styles.compact : ""}`}>
      <div className={`${styles.projectVisual} ${visualClass}`}>
        {project.mobileImage ? <picture><source media="(max-width: 800px)" srcSet={assetUrl(project.mobileImage)} />{image}</picture> : image}
      </div>
      <div className={styles.projectInfo}>
        <div className={styles.projectType}>{project.category}</div>
        <h3 className={styles.projectTitle}>{project.title}</h3>
        <p className={styles.projectDescription}>{project.description}</p>
        <div className={styles.projectLinks}>
          {project.links.map(link => <a key={link.href} href={link.href} target="_blank" rel="noopener noreferrer">{link.label} <Icon name="external" className={styles.iconInline} /></a>)}
        </div>
      </div>
    </article>
  )
}
