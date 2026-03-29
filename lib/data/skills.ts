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
  { name: "The Brain",    hex: "#e879f9", desc: "Cognitive neuroscience & research",  center: [-2.5,  1.3,  0.5] },
  { name: "Data Science", hex: "#a855f7", desc: "ML, NLP & statistical analysis",     center: [-0.8, -2.1,  1.1] },
  { name: "Frontend",     hex: "#818cf8", desc: "React · Next.js · modern web",       center: [ 2.7,  0.5, -0.4] },
  { name: "Tooling",      hex: "#67e8f9", desc: "Testing, architecture & DX",          center: [ 0.5,  0.6, -2.7] },
]

export const SKILLS: Skill[] = [
  { label: "Cognitive Neuroscience", clusterIndex: 0, size: 0.130 },
  { label: "MEG / EEG",              clusterIndex: 0, size: 0.090 },
  { label: "Visual Attention",       clusterIndex: 0, size: 0.100 },
  { label: "Brain Decoding",         clusterIndex: 0, size: 0.095 },
  { label: "Psychophysics",          clusterIndex: 0, size: 0.075 },
  { label: "Python · R · Matlab",    clusterIndex: 0, size: 0.085 },
  { label: "Machine Learning",       clusterIndex: 1, size: 0.120 },
  { label: "Data Science",           clusterIndex: 1, size: 0.110 },
  { label: "NLP",                    clusterIndex: 1, size: 0.095 },
  { label: "Deep Learning",          clusterIndex: 1, size: 0.085 },
  { label: "Statistical Models",     clusterIndex: 1, size: 0.080 },
  { label: "React",                  clusterIndex: 2, size: 0.130 },
  { label: "Next.js",                clusterIndex: 2, size: 0.120 },
  { label: "TypeScript",             clusterIndex: 2, size: 0.115 },
  { label: "JavaScript",             clusterIndex: 2, size: 0.100 },
  { label: "CSS · Tailwind",         clusterIndex: 2, size: 0.085 },
  { label: "GSAP · Framer Motion",   clusterIndex: 2, size: 0.085 },
  { label: "Three.js",               clusterIndex: 2, size: 0.075 },
  { label: "Redux Toolkit",          clusterIndex: 3, size: 0.085 },
  { label: "GraphQL",                clusterIndex: 3, size: 0.085 },
  { label: "Testing (Jest/RTL)",     clusterIndex: 3, size: 0.075 },
  { label: "Git",                    clusterIndex: 3, size: 0.070 },
  { label: "Accessibility",          clusterIndex: 3, size: 0.080 },
  { label: "Performance",            clusterIndex: 3, size: 0.080 },
]

// Career pivot bridge connections across clusters
export const BRIDGES: [number, number][] = [
  [3,  6],  // Brain Decoding  → Machine Learning
  [0,  6],  // Cognitive Neuro → Machine Learning
  [7, 11],  // Data Science    → React  (the pivot)
  [6, 14],  // Machine Learning → JavaScript
  [14, 18], // JavaScript      → Redux Toolkit
]
