export interface Chapter {
  num: string
  year: string
  chapter: string
  role: string
  organization: string
  paragraphs: readonly string[]
  tags: readonly string[]
}

// Approved v10 copy, in chronological order. Present is initially expanded.
export const CHAPTERS: readonly Chapter[] = [
  {
    num: "01",
    year: "2010–2015",
    chapter: "The Origin",
    role: "Cognitive Science",
    organization: "Trento & Amsterdam",
    paragraphs: [
      "I studied cognitive science and began researching visual perception and attention through eye tracking, EEG and behavioral experiments. During this period, I co-authored my first peer-reviewed publication."
    ],
    tags: [
      "Eye tracking",
      "EEG",
      "MATLAB",
      "R"
    ]
  },
  {
    num: "02",
    year: "2015–2018",
    chapter: "The Depth",
    role: "PhD in Cognitive Neuroscience",
    organization: "CIMeC · University of Trento",
    paragraphs: [
      "My PhD focused on visual attention in natural scenes, using MEG data and machine learning to decode patterns of brain activity."
    ],
    tags: [
      "MEG",
      "Brain decoding",
      "Machine Learning"
    ]
  },
  {
    num: "03",
    year: "2018–2021",
    chapter: "The Bridge",
    role: "Data Scientist",
    organization: "BTData · JAKALA",
    paragraphs: [
      "I applied data science to real-world problems, working on predictive modeling, natural language processing, chatbots, geospatial analysis and user journey mapping."
    ],
    tags: [
      "Python",
      "NLP",
      "Predictive Models"
    ]
  },
  {
    num: "04",
    year: "2021–2023",
    chapter: "The Crossing",
    role: "Frontend Developer & Data Scientist",
    organization: "BlueTensor · bestbytes",
    paragraphs: [
      "I worked across data science and frontend development before focusing on software engineering, contributing to production e-commerce applications with React, Next.js and TypeScript."
    ],
    tags: [
      "React",
      "Next.js",
      "TypeScript"
    ]
  },
  {
    num: "05",
    year: "2024–Present",
    chapter: "The Present",
    role: "Software Developer",
    organization: "Namecheap · EasyWP",
    paragraphs: [
      "I develop customer-facing features for EasyWP, Namecheap's managed WordPress platform. My work includes feature delivery, billing and security-related interfaces, code reviews and production issue resolution.",
      "Outside work, I build and contribute to open-source Raycast extensions."
    ],
    tags: [
      "Next.js",
      "React",
      "TypeScript",
      "Open Source"
    ]
  }
]
