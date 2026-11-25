import type { MetadataRoute } from "next"
import { assetUrl } from "@/lib/assets"

export const dynamic = "force-static"

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Elisa Battistoni — Software Developer",
    short_name: "develysverse",
    description: "Software Developer with a PhD in Cognitive Neuroscience and a background in Data Science.",
    // assetUrl() adds the optional NEXT_PUBLIC_BASE_PATH, like every other asset URL.
    start_url: assetUrl("/"),
    display: "browser",
    background_color: "#090f19",
    theme_color: "#090f19",
    icons: [
      { src: assetUrl("/icons/icon-192.png"), sizes: "192x192", type: "image/png" },
      { src: assetUrl("/icons/icon-512.png"), sizes: "512x512", type: "image/png" },
    ],
  }
}
