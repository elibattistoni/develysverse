export interface Chapter {
  num: string
  year: string
  place: string
  title: string
  role: string
  body: string
  tags: string[]
  hex: string
}

export const CHAPTERS: Chapter[] = [
  {
    num: "01",
    year: "2010–2015",
    place: "Trento · Amsterdam",
    title: "The Origin",
    role: "BSc Cognitive Science · MSc Brain & Cognitive Neuroscience",
    body: "It started with a question: how does the human brain see and decide where to look? BSc in Trento, then labs in Amsterdam — eye-trackers, EEG, behavioral experiments. Co-authoring my first paper on a scientific journal. Learning that curiosity is a methodology.",
    tags: ["Research", "EEG", "Eye-tracking", "Psychophysics", "R", "Matlab"],
    hex: "#c026d3",
  },
  {
    num: "02",
    year: "2015–2018",
    place: "Rovereto, Italy",
    title: "The Depth",
    role: "PhD · Brain & Cognitive Sciences · CIMeC, University of Trento",
    body: "Three years decoding brain activity from MEG data with machine learning algorithms. Four peer-reviewed publications. Studying visual attention in natural scenes — essentially training models to read minds. The brain was my first codebase.",
    tags: ["Brain Decoding", "Machine Learning", "MEG", "Python", "4 publications"],
    hex: "#9333ea",
  },
  {
    num: "03",
    year: "2018–2021",
    place: "Milan, Italy",
    title: "The Bridge",
    role: "Data Scientist · BTData · JAKALA",
    body: "The leap. FBK internship in AI was the signal. At BTData and JAKALA: predictive models, NLP for chatbots, geo-spatial data, user journey mapping. The scientist's rigour applied to business problems. And a quiet but strong pull toward coding and interfaces themselves.",
    tags: ["Predictive Models", "Python", "Data Visualisation", "NLP", "Chatbots", "Geo-spatial Data"],
    hex: "#7c3aed",
  },
  {
    num: "04",
    year: "2021–2023",
    place: "Trento · Vienna",
    title: "The Crossing",
    role: "Frontend Developer & Data Scientist · BlueTensor · bestbytes",
    body: "Two worlds in one role, then a full pivot. Building interfaces and training models side by side — and realising which one lit me up. Vienna. International teams. Production-grade e-commerce frontends. The moment the decision was made.",
    tags: ["React", "Next.js", "Redux", "TypeScript", "GSAP", "Accessibility"],
    hex: "#6366f1",
  },
  {
    num: "05",
    year: "2024–now",
    place: "Remote",
    title: "The Craft",
    role: "Software Developer · Namecheap, Inc.",
    body: "The scientist's precision, fully applied to software. At Namecheap on the EasyWP team — building the managed-WordPress customer dashboard, owning end-to-end features from billing flows to security UI. Open-source Raycast extensions on the side. AI-assisted development — the tools of the trade, wielded with the curiosity of a researcher.",
    tags: ["Next.js", "React", "TypeScript", "Testing", "Open Source"],
    hex: "#818cf8",
  },
]
