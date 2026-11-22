export type ClusterIndex = 0 | 1 | 2
export type DisciplineFilter = "all" | ClusterIndex

export interface SkillGroup {
  name: string
  color: string
  center: readonly [number, number]
  narrow: readonly [number, number]
}

export type SkillNode = readonly [
  label: string,
  cluster: ClusterIndex,
  x: number,
  y: number,
  z: number,
  anchor?: boolean,
]

export const GROUPS: readonly SkillGroup[] = [
  {
    name: "Software Engineering",
    color: "#76d9d3",
    center: [-2.8, -0.65],
    narrow: [-0.02, -2.65],
  },
  {
    name: "Data Science",
    color: "#aabdf7",
    center: [2.72, -0.77],
    narrow: [-0.4, 0.03],
  },
  {
    name: "Cognitive Neuroscience",
    color: "#c6b7ff",
    center: [0.32, 1.58],
    narrow: [0.03, 2.63],
  },
]

export const POINTS: readonly SkillNode[] = [
  ["React", 0, -0.35, -0.39, 0.44, true],
  ["TypeScript", 0, -1.3, 0.21, -0.31],
  ["Next.js", 0, 0.26, -1.12, -0.25],
  ["Frontend Architecture", 0, 0.96, 0.17, 0.08],
  ["Testing", 0, -0.48, 0.92, -0.54],
  ["Open Source", 0, 0.84, 0.94, 0.38],
  ["Machine Learning", 1, -0.45, 0.64, 0.43, true],
  ["Python", 1, 0.13, -0.72, 0.39],
  ["Statistical Models", 1, 0.94, -0.1, -0.55],
  ["NLP", 1, 1.25, 0.61, 0.17],
  ["Visualization", 1, -0.91, -0.11, -0.52],
  ["Predictive Modeling", 1, 0.19, 1.25, 0.08],
  ["Visual Attention", 2, -0.67, -0.24, 0.51, true],
  ["Eye Tracking", 2, -1.26, 0.58, -0.56],
  ["EEG / MEG", 2, 0.62, -0.4, 0.08],
  ["Brain Decoding", 2, 1.16, 0.45, 0.36],
  ["MATLAB", 2, -0.62, 0.92, -0.5],
  ["Experimental Research", 2, 0.33, 0.39, -0.2],
]

export const LINKS: readonly (readonly [number, number])[] = [
  [0, 1],
  [0, 2],
  [0, 3],
  [0, 5],
  [1, 3],
  [1, 4],
  [2, 3],
  [3, 4],
  [3, 5],
  [4, 5],
  [6, 7],
  [6, 8],
  [6, 9],
  [6, 10],
  [6, 11],
  [7, 8],
  [7, 9],
  [8, 11],
  [10, 11],
  [12, 13],
  [12, 14],
  [12, 17],
  [13, 17],
  [14, 15],
  [14, 16],
  [14, 17],
  [15, 16],
  [16, 17],
  [6, 15],
  [7, 15],
  [10, 3],
]
