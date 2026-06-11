import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://local-competitor-tracker.vercel.app'

export const metadata: Metadata = {
  title: {
    default: "Competitor Tracker — Monitor your competitors automatically",
    template: "%s — Competitor Tracker",
  },
  description: "Automatically monitor your competitors' websites and get alerted the moment something changes — prices, offers, content, anything.",
  metadataBase: new URL(siteUrl),
  openGraph: {
    title: "Competitor Tracker",
    description: "Automatically monitor your competitors' websites and get alerted the moment something changes.",
    url: siteUrl,
    siteName: "Competitor Tracker",
    images: [{ url: "/og-image.svg", width: 1200, height: 630, alt: "Competitor Tracker" }],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Competitor Tracker",
    description: "Automatically monitor your competitors' websites and get alerted the moment something changes.",
    images: ["/og-image.svg"],
  },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full bg-[#07101f] text-[#dce8ff] font-sans">{children}</body>
    </html>
  );
}
