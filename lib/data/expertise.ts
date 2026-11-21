export type ExpertiseId = "software" | "data" | "neuroscience"

export interface Expertise {
  id: ExpertiseId
  title: string
  essentials: string
  primary?: boolean
  backDescription: readonly (string | { strong: string })[]
}

export const EXPERTISE = [
  {
    id: "software",
    title: "Software Engineering",
    essentials: "TypeScript · React · Next.js",
    primary: true,
    backDescription: [
      "I build and maintain ", { strong: "web applications" }, " at ", { strong: "Namecheap" },
      ", with a focus on the interfaces our customers use every day. I also take on ", { strong: "full-stack" },
      " freelance projects, build software of my own, and contribute to ", { strong: "open source" }, ".",
    ],
  },
  {
    id: "data",
    title: "Data Science",
    essentials: "Python · Data Analysis · ML · NLP",
    backDescription: [
      "I used ", { strong: "Python" }, " to explore datasets and build ", { strong: "predictive models" },
      ". My work ranged from analyzing ", { strong: "geospatial data" },
      " and mapping user journeys to applying ", { strong: "natural language processing" }, " to chatbots.",
    ],
  },
  {
    id: "neuroscience",
    title: "Cognitive Neuroscience, PhD",
    essentials: "MEG/EEG · Eye Tracking · MATLAB · R",
    backDescription: [
      "I studied how people direct their ", { strong: "attention" },
      " when searching for something in a complex ", { strong: "visual scene" },
      ". I combined ", { strong: "behavioral measures" }, " with ", { strong: "neuroimaging" },
      " and used ", { strong: "machine learning" }, " to ", { strong: "decode" },
      " patterns of ", { strong: "brain activity" }, ".",
    ],
  },
] as const satisfies readonly Expertise[]

export const PUBLICATIONS = [
  { title: "Searching near and far: The attentional template incorporates viewing distance", href: "https://doi.org/10.1037/xhp0001172" },
  { title: "The time course of spatial attention during naturalistic visual search", href: "https://doi.org/10.1016/j.cortex.2018.11.018" },
  { title: "Preparatory attention in visual cortex", href: "https://doi.org/10.1111/nyas.13320" },
  { title: "Rapid influences of cued visual memories on attentional guidance", href: "https://doi.org/10.1111/nyas.12574" },
] as const
