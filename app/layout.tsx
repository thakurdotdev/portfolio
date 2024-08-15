import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import Head from "next/head";

const poppins = Poppins({
  weight: ["400", "500", "600", "700"],
  display: "swap",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Portfolio: Pankaj Thakur | Software Developer",
  description:
    "Pankaj Thakur is a software developer based in India. He specializes in building web applications and websites using modern technologies.",
  keywords:
    "thakurdotdev, thakur.dev, pankajthakur, software developer, web developer, India",
  authors: [{ name: "Pankaj Thakur" }],
  creator: "Pankaj Thakur",
  publisher: "Pankaj Thakur",
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://thakur.dev",
    title: "Pankaj Thakur | Software Developer",
    description:
      "Pankaj Thakur is a software developer based in India. He specializes in building web applications and websites using modern technologies.",
    siteName: "Pankaj Thakur's Portfolio",
    images: [
      {
        url: "https://thakur.dev/pk.webp",
        width: 1200,
        height: 630,
        alt: "Pankaj Thakur - Software Developer",
      },
    ],
  },
  twitter: {
    site: "@thakurdotdev",
    creator: "@thakurdotdev",
    card: "summary_large_image",
    images: [
      {
        url: "https://thakur.dev/pk.webp",
        width: 1200,
        height: 630,
        alt: "Pankaj Thakur - Software Developer",
      },
    ],
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
  alternates: {
    canonical: "https://thatkur.dev",
    languages: {
      "en-US": "https://thakur.dev",
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <Head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="./icons/apple-touch-icon.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <link rel="me" href="https://twitter.com/thakurdotdev" />
        <link rel="me" href="https://github.com/thakurdotdev" />
        <link rel="me" href="https://linkedin.com/in/thakurdotdev" />
        <meta name="theme-color" content="#ffffff" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <body className={poppins.className}>
        <ThemeProvider attribute="class">
          <div className="relative overflow-hidden min-h-screen">
            {children}
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
