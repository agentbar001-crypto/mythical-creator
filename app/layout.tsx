import type { Metadata, Viewport } from "next";
import Link from "next/link";
import "./globals.css";
import { CREATOR, SITE_DESCRIPTION, SITE_NAME, SITE_TAGLINE, SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: `${SITE_NAME}: Turn Real Family Stories into Songs, Stories & Legacy Books`, template: `%s | ${SITE_NAME}` },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  authors: [{ name: CREATOR }],
  creator: CREATOR,
  icons: { icon: "/icon.svg" },
  openGraph: { type: "website", siteName: SITE_NAME, url: SITE_URL, title: `${SITE_NAME} • ${SITE_TAGLINE}`, description: SITE_DESCRIPTION, locale: "en_US" },
  twitter: { card: "summary_large_image", title: `${SITE_NAME} • ${SITE_TAGLINE}`, description: SITE_DESCRIPTION },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = { themeColor: "#14213d", width: "device-width", initialScale: 1 };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=Libre+Caslon+Text:ital,wght@0,400;0,700;1,400&family=Inter:wght@400;600&display=swap" rel="stylesheet" />
      </head>
      <body>
        <header className="site-header">
          <div className="wrap">
            <Link href="/" className="brand">The Mythical Creator</Link>
            <nav className="nav" aria-label="Main">
              <Link href="/#how-it-works">How it works</Link>
              <Link href="/#faq">FAQ</Link>
              <a href="/studio">Open the Studio</a>
            </nav>
          </div>
        </header>
        {children}
        <footer className="site-footer">
          <div className="wrap">
            <span>© {new Date().getFullYear()} The Mythical Creator • Legacy Builder™ • Architecture by {CREATOR}</span>
            <span><Link href="/privacy">Privacy</Link> • <Link href="/terms">Terms</Link></span>
          </div>
        </footer>
      </body>
    </html>
  );
}
