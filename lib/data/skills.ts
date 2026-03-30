export interface Cluster {
  name: string
  hex: string
  desc: string
  center: [number, number, number]
}

export interface Skill {
  label: string
  clusterIndex: number
  size: number
}

export const CLUSTERS: Cluster[] = [
  { name: "The Brain",    hex: "#e879f9", desc: "Neuroscience & research",    center: [-3.2,  1.8,  0.6] },
  { name: "Data Science", hex: "#a855f7", desc: "ML, NLP & statistics",       center: [-1.0, -2.8,  1.4] },
  { name: "Frontend",     hex: "#67e8f9", desc: "React · Next.js · web",      center: [ 3.4,  0.7, -0.5] },
  { name: "Tooling",      hex: "#818cf8", desc: "Testing, architecture & DX", center: [ 0.6,  0.8, -3.4] },
]

export const SKILLS: Skill[] = [
  { label: "Cognitive Neuroscience", clusterIndex: 0, size: 0.16 },
  { label: "MEG / EEG",              clusterIndex: 0, size: 0.09 },
  { label: "Visual Attention",       clusterIndex: 0, size: 0.11 },
  { label: "Brain Decoding",         clusterIndex: 0, size: 0.10 },
  { label: "Psychophysics",          clusterIndex: 0, size: 0.06 },
  { label: "Python · R · Matlab",    clusterIndex: 0, size: 0.08 },
  { label: "Machine Learning",       clusterIndex: 1, size: 0.15 },
  { label: "Data Science",           clusterIndex: 1, size: 0.13 },
  { label: "NLP",                    clusterIndex: 1, size: 0.09 },
  { label: "Deep Learning",          clusterIndex: 1, size: 0.08 },
  { label: "Statistical Models",     clusterIndex: 1, size: 0.06 },
  { label: "React",                  clusterIndex: 2, size: 0.22 },
  { label: "Next.js",                clusterIndex: 2, size: 0.19 },
  { label: "TypeScript",             clusterIndex: 2, size: 0.17 },
  { label: "JavaScript",             clusterIndex: 2, size: 0.14 },
  { label: "CSS · Tailwind",         clusterIndex: 2, size: 0.10 },
  { label: "GSAP · Framer Motion",   clusterIndex: 2, size: 0.10 },
  { label: "Three.js",               clusterIndex: 2, size: 0.08 },
  { label: "Redux Toolkit",          clusterIndex: 3, size: 0.09 },
  { label: "GraphQL",                clusterIndex: 3, size: 0.09 },
  { label: "Testing (Jest/RTL)",     clusterIndex: 3, size: 0.07 },
  { label: "Git",                    clusterIndex: 3, size: 0.05 },
  { label: "Accessibility",          clusterIndex: 3, size: 0.07 },
  { label: "Performance",           clusterIndex: 3, size: 0.07 },
]

// Career pivot bridge connections across clusters
export const BRIDGES: [number, number][] = [
  [3,  6],  // Brain Decoding  → Machine Learning
  [0,  6],  // Cognitive Neuro → Machine Learning
  [7, 11],  // Data Science    → React  (the pivot)
  [6, 14],  // Machine Learning → JavaScript
  [14, 18], // JavaScript      → Redux Toolkit
]
