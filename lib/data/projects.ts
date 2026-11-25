export interface Project {
  id: string
  title: string
  category: string
  description: string
  compact: boolean
  image: string
  mobileImage?: string
  width: number
  height: number
  alt: string
  links: readonly { label: string; href: string }[]
}

export const PROJECTS = [
  {
    id: "brenta",
    compact: false,
    links: [
      {
        label: "Visit website",
        href: "https://brentawildrace.it/",
      },
      {
        label: "GitHub",
        href: "https://github.com/elibattistoni/brenta-wild-race",
      },
    ],
    mobileImage: "/assets/images/project-brenta-mobile.webp",
    image: "/assets/images/project-brenta-desktop.webp",
    alt: "Brenta Wild Race website homepage featuring a trail runner in the mountains",
    category: "Web Design & Development · End-to-end",
    title: "Brenta Wild Race",
    description:
      "Designed and built the website for a mountain running event, including its page structure, navigation, and visual design.",
    width: 1250,
    height: 781,
  },
  {
    id: "palette",
    compact: false,
    links: [
      {
        label: "View on Raycast",
        href: "https://www.raycast.com/elibattistoni/palette-colors",
      },
      {
        label: "GitHub PR",
        href: "https://github.com/raycast/extensions/pull/32325",
      },
    ],
    image: "/assets/images/project-palette-v12.webp",
    alt: "Color Palette Manager in Raycast showing saved palettes and the selected palette’s colors",
    category: "Raycast Extension · Author",
    title: "Color Palette Manager",
    description:
      "Rebuilt an existing extension to create, manage, import and export color palettes, including AI-powered color generation.",
    width: 1200,
    height: 750,
  },
  {
    id: "picker",
    compact: true,
    links: [
      {
        label: "View on Raycast",
        href: "https://www.raycast.com/thomas/color-picker",
      },
      {
        label: "GitHub PR",
        href: "https://github.com/raycast/extensions/pull/27420",
      },
    ],
    image: "/assets/images/project-picker-v12.webp",
    alt: "Color Picker in Raycast showing saved color swatches and the multi-select mode option",
    category: "Raycast Extension · Contribution",
    title: "Color Picker",
    description:
      "Added multi-color selection and bulk export support, including JSON and CSS formats, to an existing Raycast extension.",
    width: 880,
    height: 550,
  },
] as const satisfies readonly Project[]
