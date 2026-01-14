import { ThemeProvider } from "@/components/theme-provider";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import Script from "next/script";

const inter = Inter({
  subsets: ["latin"],
  preload: true,
  variable: "--font-inter",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  preload: true,
  variable: "--font-jetbrains",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://thakur.dev"),
  title: {
    default: "Pankaj Thakur - Software Engineer",
    template: "%s | Pankaj Thakur",
  },
  description:
    "Portfolio of Pankaj Thakur (thakurdotdev). Senior Software Engineer specializing in React, Node.js, SaaS architecture, and scalable web applications.",
  keywords: [
    "Pankaj Thakur",
    "thakurdotdev",
    "Software Engineer India",
    "React Native Developer",
    "Next.js Expert",
    "Software Engineer",
  ],
  authors: [{ name: "Pankaj Thakur", url: "https://thakur.dev" }],
  creator: "Pankaj Thakur",
  publisher: "Pankaj Thakur",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Pankaj Thakur - Software Engineer",
    description:
      "Building scalable web applications with React, Node.js, and modern technologies.",
    url: "https://thakur.dev",
    siteName: "Pankaj Thakur Portfolio",
    images: [
      {
        url: "/preview.png",
        width: 1200,
        height: 630,
        alt: "Pankaj Thakur - Software Engineer",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Pankaj Thakur | Software Engineer",
    creator: "@thakurdotdev",
    site: "@thakurdotdev",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Pankaj Thakur",
    alternateName: "thakurdotdev",
    url: "https://thakur.dev",
    sameAs: [
      "https://github.com/thakurdotdev",
      "https://x.com/thakurdotdev",
      "https://linkedin.com/in/thakurdotdev",
    ],
    jobTitle: "Software Engineer",
    worksFor: {
      "@type": "Organization",
      name: "Netclues India",
    },
    knowsAbout: [
      "React",
      "Next.js",
      "Node.js",
      "System Design",
      "SaaS",
      "Typescript",
      "Server",
    ],
  };

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="theme-color" content="#0a0a0a" />
      </head>
      <body
        className={`antialiased ${inter.variable} ${jetbrainsMono.variable} font-sans`}
      >
        <Script
          id="json-ld"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />

        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={true}
          disableTransitionOnChange={true}
        >
          {children}
        </ThemeProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
