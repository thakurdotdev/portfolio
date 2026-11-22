import { ThemeColor } from "@/components/theme-color";
import { ThemeProvider } from "@/components/theme-provider";
import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque, JetBrains_Mono } from "next/font/google";
import Script from "next/script";
import { preload } from "react-dom";
import "./globals.css";

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
    default: "Pankaj Thakur — Full-Stack Engineer (Node.js, TypeScript)",
    template: "%s | Pankaj Thakur",
  },
  description:
    "Full-stack engineer building fintech platforms and developer tooling.",
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
    title: "Pankaj Thakur — Full-Stack Engineer (Node.js, TypeScript)",
    description:
      "Full-stack engineer building fintech platforms and developer tooling.",
    url: "https://thakur.dev",
    siteName: "Pankaj Thakur Portfolio",
    images: [
      {
        url: "/preview.png",
        width: 1200,
        height: 630,
        alt: "Pankaj Thakur — Full-Stack Engineer (Node.js, TypeScript)",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Pankaj Thakur — Full-Stack Engineer (Node.js, TypeScript)",
    description:
      "Full-stack engineer building fintech platforms and developer tooling.",
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

  // The hero portrait is drawn from this; fetch it with the page, not after hydration.
  preload("/pankaj-cutout.webp", { as: "image" });

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/*
          Scroll reveals hide content only when JS is there to show it again. The boot sequence
          (pm0 start portfolio) plays once per tab on the home page, and not for section links or
          reduced motion.
          WebGL ends it, and any scroll, key or tap skips it. The watchdog only makes sure the
          page never stays covered: it counts visible time only, gives WebGL 2.5s to draw its
          first frame and 5s in all, and marks the boot as seen once it has ended, so a reload
          mid-boot plays it again.
          `data-cfasync="false"` keeps Cloudflare's Rocket Loader from deferring it: deferred, the
          page paints first and the boot cover then drops over a hero that was already showing.
        */}
        <script
          data-cfasync="false"
          dangerouslySetInnerHTML={{
            __html:
              "var d=document.documentElement;d.dataset.js='';try{if(sessionStorage.getItem('boot')||location.hash||!/\\/(index\\.html)?$/.test(location.pathname)||matchMedia('(prefers-reduced-motion: reduce)').matches){d.dataset.intro='skip'}else{d.dataset.intro='play';var k=function(){if(d.dataset.intro==='play')d.dataset.intro='done'};['wheel','keydown','pointerdown','touchstart'].forEach(function(e){addEventListener(e,k,{once:true,passive:true})});var w=0,i=setInterval(function(){if(d.dataset.intro!=='play'){sessionStorage.setItem('boot','1');clearInterval(i)}else if(!document.hidden&&(w+=200)>=(d.dataset.webgl?5000:2500)){k()}},200)}}catch(e){d.dataset.intro='skip'}",
          }}
        />
      </head>
      <body
        className={`antialiased ${bricolage.variable} ${jetbrainsMono.variable} font-sans`}
      >
        {/* In the HTML itself, so crawlers that do not run JavaScript still read it. */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
        />
        <Script
          src="https://analytics.thakur.dev/script.js"
          data-website-id="e7d66733-e497-4f5a-8df4-cb31e3dee535"
          strategy="afterInteractive"
        />

        <a
          href="#main"
          className="fixed top-3 left-3 z-50 -translate-y-20 rounded-full bg-fg px-4 py-2 text-body text-bg focus-visible:translate-y-0"
        >
          Skip to content
        </a>
        <ThemeProvider
          attribute="class"
          // Follow the visitor's system setting until they pick one with the toggle.
          defaultTheme="system"
          enableSystem={true}
          disableTransitionOnChange={true}
          // Same as the boot script: run before paint, or dark-theme visitors see a light flash.
          scriptProps={{ "data-cfasync": "false" }}
        >
          <ThemeColor />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
