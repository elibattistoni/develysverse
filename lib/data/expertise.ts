export type ExpertiseId = "software" | "data" | "neuroscience"

interface ExpertiseDetail { label: string; value: string }

export interface Expertise {
  id: ExpertiseId
  title: string
  description: string
  essentials: string
  primary?: boolean
  introduction?: ExpertiseDetail
  groups: readonly ExpertiseDetail[]
}

export const EXPERTISE = [
  {
    id: "software",
    title: "Software Engineering",
    description: "I build billing and security features for EasyWP.",
    essentials: "TypeScript, React, Next.js",
    primary: true,
    groups: [
      { label: "Production work", value: "I review code and help resolve production issues." },
    ],
  },
  {
    id: "data",
    title: "Data Science",
    essentials: "Python, data analysis, machine learning, NLP",
    description: "My work included predictive modeling and geospatial analysis.",
    groups: [
      { label: "Language and behavior", value: "I used NLP for chatbots and helped map user journeys." },
    ],
  },
  {
    id: "neuroscience",
    title: "Cognitive Neuroscience",
    essentials: "Eye tracking, EEG/MEG, experimental methods",
    description: "I studied how people direct their attention in natural scenes.",
    introduction: {
      label: "Visual attention",
      value: "During my PhD, I studied how people search for targets in natural scenes.",
    },
    groups: [
      { label: "MEG and machine learning", value: "I used machine learning to decode patterns of brain activity from MEG data." },
      { label: "Experiments and analysis", value: "I used eye tracking, EEG and behavioral experiments, with MATLAB and R for analysis." },
    ],
  },
] as const satisfies readonly Expertise[]

export const PUBLICATIONS = [
  { title: "Searching near and far: The attentional template incorporates viewing distance", href: "https://doi.org/10.1037/xhp0001172" },
  { title: "The time course of spatial attention during naturalistic visual search", href: "https://doi.org/10.1016/j.cortex.2018.11.018" },
  { title: "Preparatory attention in visual cortex", href: "https://doi.org/10.1111/nyas.13320" },
  { title: "Rapid influences of cued visual memories on attentional guidance", href: "https://doi.org/10.1111/nyas.12574" },
] as const
