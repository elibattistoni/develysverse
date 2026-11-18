import type { Metadata } from "next"
import "./globals.css"

const SITE_URL = "https://develysverse.com"
const TITLE = "Elisa Battistoni — Software Developer"
const DESCRIPTION = "Experienced Software Developer with a PhD in Cognitive Neuroscience and a background in Data Science."

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/" },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: SITE_URL,
    siteName: "develysverse",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "develysverse — Elisa Battistoni — I studied how brains see. Now I build what they look at.",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    images: ["/og-image.png"],
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
