export type ExpertiseId = "software" | "data" | "neuroscience"

export interface Expertise {
  id: ExpertiseId
  title: string
  description: string
  primary?: boolean
  groups: readonly { label: string; value: string }[]
}

export const EXPERTISE = [
  {
    id: "software",
    title: "Software Engineering",
    description: "Building modern web applications and thoughtful user experiences, from architecture and implementation to production.",
    primary: true,
    groups: [
      { label: "Language & frameworks", value: "TypeScript, React, Next.js" },
      { label: "Practice", value: "Frontend architecture, UI/UX" },
    ],
  },
  {
    id: "data",
    title: "Data Science",
    description: "Analyzing complex data and developing data-driven solutions through statistical and computational methods.",
    groups: [
      { label: "Language", value: "Python" },
      { label: "Methods", value: "Data analysis, machine learning, visualization" },
    ],
  },
  {
    id: "neuroscience",
    title: "Cognitive Neuroscience",
    description: "PhD-level research studying visual perception, attention and human cognition.",
    groups: [
      { label: "Research methods", value: "Experimental research, eye tracking, EEG/MEG" },
      { label: "Tools", value: "MATLAB, R" },
    ],
  },
] as const satisfies readonly Expertise[]

export const PUBLICATIONS = [
  { title: "Searching near and far: The attentional template incorporates viewing distance", href: "https://doi.org/10.1037/xhp0001172" },
  { title: "The time course of spatial attention during naturalistic visual search", href: "https://doi.org/10.1016/j.cortex.2018.11.018" },
  { title: "Preparatory attention in visual cortex", href: "https://doi.org/10.1111/nyas.13320" },
  { title: "Rapid influences of cued visual memories on attentional guidance", href: "https://doi.org/10.1111/nyas.12574" },
] as const
