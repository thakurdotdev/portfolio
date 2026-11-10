import { ThemeProvider } from "@/components/theme-provider";
import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import Script from "next/script";

const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  axes: ["opsz", "wdth"],
  variable: "--font-bricolage",
});


const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  preload: false,
  variable: "--font-jetbrains",
});

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f2f2f2" },
    { media: "(prefers-color-scheme: dark)", color: "#050505" },
  ],
};

export const metadata: Metadata = {
  metadataBase: new URL("https://thakur.dev"),
  title: {
    default: "Pankaj Thakur - Software Engineer",
    template: "%s | Pankaj Thakur",
  },
  description:
    "Portfolio of Pankaj Thakur (thakurdotdev). Full-Stack Software Engineer building resilient, end-to-end production systems and developer platforms.",
  keywords: [
    "Pankaj Thakur",
    "thakurdotdev",
    "Software Engineer",
    "Backend Engineer",
    "Systems Engineer",
    "Next.js Developer",
    "PostgreSQL",
    "MySQL",
    "Prisma",
    "Sequelize",
    "Redis",
    "BullMQ",
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
      "Building scalable web applications, real-time communication engines, and resilient queue pipelines.",
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
    jobTitle: "Full-Stack Software Engineer",
    worksFor: {
      "@type": "Organization",
      name: "Netclues India",
    },
    knowsAbout: [
      "Docker",
      "TypeScript",
      "React",
      "Next.js",
      "Node.js",
      "System Design",
      "SaaS Architecture",
      "Real-time Systems",
      "PostgreSQL",
      "MySQL",
      "Prisma",
      "Sequelize",
      "Redis",
      "BullMQ",
    ],
  };

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* The hero portrait is drawn from this; fetch it with the page, not after hydration. */}
        <link rel="preload" as="image" href="/pankaj-cutout.webp" />
        {/* Scroll reveals hide content only when JS is there to show it again. */}
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.dataset.js=''" }} />
      </head>
      <body
        className={`antialiased ${bricolage.variable} ${jetbrainsMono.variable} font-sans`}
      >
        <Script
          id="json-ld"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <Script
          src="https://analytics.thakur.dev/script.js"
          data-website-id="e7d66733-e497-4f5a-8df4-cb31e3dee535"
          strategy="afterInteractive"
        />

        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={true}
          disableTransitionOnChange={true}
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
