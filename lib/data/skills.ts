export interface Cluster {
  name: string
  hex: string
  center: [number, number, number]
  emphasized?: boolean // wider spread + longer connection distance
}

export interface Skill {
  label: string
  clusterIndex: number
  size: number
}

export const CLUSTERS: Cluster[] = [
  { name: "Cognitive Neuroscience", hex: "#e879f9", center: [-2.6,  1.3,  0.3] },
  { name: "Data Science",         hex: "#818cf8", center: [ 0,   -2.9,  0.5] },
  { name: "Software Development", hex: "#67e8f9", center: [ 2.6,  1.0, -0.3], emphasized: true },
]

export const SKILLS: Skill[] = [
  // Cognitive Neuroscience (clusterIndex 0)
  { label: "Neuroscience",                clusterIndex: 0, size: 0.14 },
  { label: "Vision",                      clusterIndex: 0, size: 0.09 },
  { label: "Attention",                   clusterIndex: 0, size: 0.09 },
  { label: "MEG",                         clusterIndex: 0, size: 0.08 },
  { label: "EEG",                         clusterIndex: 0, size: 0.08 },
  { label: "Psychophysics",               clusterIndex: 0, size: 0.06 },
  { label: "Matlab",                      clusterIndex: 0, size: 0.06 },
  { label: "R",                           clusterIndex: 0, size: 0.06 },
  { label: "Brain Decoding",              clusterIndex: 0, size: 0.11 },
  // Data Science (clusterIndex 1)
  { label: "Machine Learning",            clusterIndex: 1, size: 0.14 },
  { label: "Deep Learning",               clusterIndex: 1, size: 0.09 },
  { label: "Statistical Models",          clusterIndex: 1, size: 0.07 },
  { label: "Natural Language Processing", clusterIndex: 1, size: 0.09 },
  { label: "Results Display",             clusterIndex: 1, size: 0.08 },
  { label: "Python",                      clusterIndex: 1, size: 0.09 },
  // Software Development (clusterIndex 2)
  { label: "JavaScript",                  clusterIndex: 2, size: 0.11 },
  { label: "TypeScript",                  clusterIndex: 2, size: 0.14 },
  { label: "React",                       clusterIndex: 2, size: 0.17 },
  { label: "Next.js",                     clusterIndex: 2, size: 0.15 },
  { label: "CSS",                         clusterIndex: 2, size: 0.09 },
  { label: "Mantine",                     clusterIndex: 2, size: 0.08 },
  { label: "Testing",                     clusterIndex: 2, size: 0.09 },
  { label: "Optimization",                clusterIndex: 2, size: 0.08 },
  { label: "Open Source",                 clusterIndex: 2, size: 0.09 },
]
