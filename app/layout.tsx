import type { Metadata } from "next"
import "./globals.css"

const SITE_URL = "https://develysverse.com"
const TITLE = "Elisa Battistoni — Software Developer"
const DESCRIPTION = "Experienced Software Developer with a PhD in Cognitive Neuroscience and a background in Data Science."

// Content Security Policy, sent as a meta tag because GitHub Pages can't set headers.
// It only allows scripts, styles, images, fonts and requests from this site itself.
// 'unsafe-inline' is needed for the inline scripts Next.js adds to static pages.
// Not possible in a meta tag: frame-ancestors, HSTS and X-Content-Type-Options.
// Production only: the dev server needs eval() for hot reloading.
const CONTENT_SECURITY_POLICY = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data:",
  "font-src 'self'",
  "connect-src 'self'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'none'",
].join("; ")

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: TITLE,
  description: DESCRIPTION,
  referrer: "strict-origin-when-cross-origin",
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
      <head>
        {process.env.NODE_ENV === "production" && (
          <meta httpEquiv="Content-Security-Policy" content={CONTENT_SECURITY_POLICY} />
        )}
      </head>
      <body>{children}</body>
    </html>
  )
}
