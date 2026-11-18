import type { SVGProps } from "react"

type IconName = "arrow-right" | "external" | "chevron-left" | "chevron-right" | "details-right" | "arrow-left" | "arrow-up"
const PATHS: Record<IconName, string> = {
  "arrow-right": "M4 12h16m-7-7 7 7-7 7",
  "details-right": "M5 12h14m-6-6 6 6-6 6",
  "arrow-left": "M19 12H5m6-6-6 6 6 6",
  "arrow-up": "M12 19V5m-6 6 6-6 6 6",
  external: "M7 17 17 7M8 7h9v9",
  "chevron-left": "m15 5-7 7 7 7",
  "chevron-right": "m9 5 7 7-7 7",
}

export default function Icon({ name, ...props }: SVGProps<SVGSVGElement> & { name: IconName }) {
  return <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...(["external", "details-right", "arrow-left", "arrow-up"].includes(name) ? { strokeLinecap: "round", strokeLinejoin: "round" } as const : {})} {...props}><path d={PATHS[name]} /></svg>
}
