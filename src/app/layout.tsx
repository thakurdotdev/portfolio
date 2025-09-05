import { ThemeProvider } from "@/components/theme-provider";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], preload: true });

export const metadata: Metadata = {
  title: {
    default: "Pankaj Thakur | Full-Stack Developer",
    template: "%s | Pankaj Thakur"
  },
  description: "Full-stack developer specializing in React, Node.js, and modern web technologies. Building scalable applications and music platforms with real-time features.",
  keywords: [
    "Full-Stack Developer",
    "React Developer", 
    "Node.js Developer",
    "JavaScript Developer",
    "TypeScript Developer",
    "Next.js Developer",
    "Socket.IO",
    "PostgreSQL",
    "Express.js",
    "Web Development",
    "Music Platform Development",
    "Real-time Applications",
    "WebRTC",
    "Microservices",
    "Netclues India",
    "Software Engineer",
    "Frontend Developer",
    "Backend Developer"
  ],
  authors: [{ name: "Pankaj Thakur", url: "https://thakur.dev" }],
  creator: "Pankaj Thakur",
  publisher: "Pankaj Thakur",
  metadataBase: new URL("https://thakur.dev"),
  alternates: {
    canonical: "https://thakur.dev",
  },
  openGraph: {
    title: "Pankaj Thakur | Full-Stack Developer",
    description: "Full-stack developer building scalable web applications and music platforms. Specialized in React, Node.js, Socket.IO, and modern web technologies.",
    url: "https://thakur.dev",
    siteName: "Pankaj Thakur Portfolio",
    images: [
      {
        url: "/preview.png", // You'll need to create this 1200x630 image
        width: 1200,
        height: 630,
        alt: "Pankaj Thakur - Full-Stack Developer Portfolio",
        type: "image/png",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Pankaj Thakur | Full-Stack Developer",
    description: "Building scalable web applications with React, Node.js, and modern technologies. Check out my latest projects!",
    images: ["/preview.png"],
    creator: "@thakurdotdev",
    site: "@thakurdotdev",
  },
  robots: {
    index: true,
    follow: true,
    nocache: true,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    // Add these when you set up Google Search Console
    // google: "your-google-verification-code",
  },
  category: "technology",
  classification: "Portfolio Website",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Additional SEO meta tags */}
        <meta name="theme-color" content="#000000" />
        <meta name="color-scheme" content="dark light" />
        <meta name="format-detection" content="telephone=no" />
        <link rel="canonical" href="https://thakur.dev" />
        
        {/* Favicon and app icons */}
        <link rel="icon" href="/favicon.ico" sizes="any" />
      </head>
      <body className={`antialiased ${inter.className}`}>
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