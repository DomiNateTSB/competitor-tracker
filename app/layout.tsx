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
    default: "Rivalkollen — Övervaka dina konkurrenter automatiskt",
    template: "%s — Rivalkollen",
  },
  description: "Rivalkollen övervakar automatiskt dina konkurrenters webbplatser och varnar dig direkt när något förändras — priser, erbjudanden, innehåll, allt möjligt.",
  metadataBase: new URL(siteUrl),
  openGraph: {
    title: "Rivalkollen",
    description: "Övervaka dina konkurrenters webbplatser automatiskt och bli varnad när något förändras.",
    url: siteUrl,
    siteName: "Rivalkollen",
    images: [{ url: "/og-image.svg", width: 1200, height: 630, alt: "Rivalkollen" }],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Rivalkollen",
    description: "Övervaka dina konkurrenters webbplatser automatiskt och bli varnad när något förändras.",
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
