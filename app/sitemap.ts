import type { MetadataRoute } from "next"

export const dynamic = "force-static"

// One page. lastModified is the build date: every deploy rebuilds the site.
export default function sitemap(): MetadataRoute.Sitemap {
  return [{ url: "https://develysverse.com/", lastModified: new Date(), changeFrequency: "monthly", priority: 1 }]
}
