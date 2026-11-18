import { PROJECTS } from "@/lib/data/projects"
import SectionHeading from "@/components/ui/SectionHeading"
import ProjectCarousel from "./ProjectCarousel"
import ProjectCard from "./ProjectCard"

export default function ProjectsSection({ className }: { className: string }) {
  return (
    <section id="projects" className={className} aria-labelledby="projects-h">
      <ProjectCarousel heading={<SectionHeading id="projects-h" kicker="01 / Selected work" title="Selected Projects" description="A selection of things I've built, designed, and contributed to." />}>
        {PROJECTS.map(project => <ProjectCard key={project.id} project={project} />)}
      </ProjectCarousel>
    </section>
  )
}
