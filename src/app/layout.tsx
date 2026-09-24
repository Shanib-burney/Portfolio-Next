import type { Metadata, Viewport } from "next";
import "@fontsource-variable/inter";
import "@fontsource-variable/jetbrains-mono";
import "./globals.css";
import { Providers } from "@/components/providers";
import { themeInitScript } from "@/components/theme-script";
import { profile } from "@/content/profile";
import { siteIndexable, siteUrl } from "@/lib/site";

const description =
  "Shanib Burney, Senior Software Engineer. I build scalable web products end to end: APIs, microservices, front ends, and the cloud infrastructure they run on.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: `${profile.name} · ${profile.title}`,
  description,
  applicationName: profile.name,
  authors: [{ name: profile.legalName, url: siteUrl }],
  creator: profile.legalName,
  openGraph: {
    type: "profile",
    siteName: profile.name,
    title: `${profile.name} · ${profile.title}`,
    description,
    url: "/",
    locale: "en_US",
  },
  twitter: { card: "summary" },
  robots: siteIndexable ? { index: true, follow: true } : { index: false, follow: false },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f6f7fb" },
    { media: "(prefers-color-scheme: dark)", color: "#07080c" },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning data-theme="dark">
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body>
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[100] focus:rounded-lg focus:bg-accent focus:px-4 focus:py-2 focus:text-white"
        >
          Skip to content
        </a>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
