import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";

const inter = Inter({ subsets: ["latin"], preload: true });

export const metadata: Metadata = {
  title: "Pankaj Thakur | Portfolio",
  description:
    "Pankaj Thakur is a Front-End Developer specializing in React, Next.js, and Tailwind CSS. Explore my portfolio to see my latest projects and skills.",
  keywords: [
    "Front-End Developer",
    "Web Developer",
    "React Developer",
    "Next.js Portfolio",
    "JavaScript Developer",
    "Responsive Web Design",
    "Tailwind CSS",
    "Web Development Projects",
    "Modern Web Technologies",
  ],
  authors: [{ name: "Pankaj Thakur", url: "https://thakur.dev" }],
  openGraph: {
    title: "Pankaj Thakur | Software Developer Portfolio",
    description:
      "Explore Pankaj's cutting-edge software development projects, utilizing modern frameworks like React, Next.js, and Tailwind CSS.",
    url: "https://thakur.dev",
    siteName: "Pankaj Thakur Portfolio",
    images: [
      {
        url: "https://thakur.dev/preview.png",
        width: 1200,
        height: 630,
        alt: "Pankaj Thakur Portfolio Preview",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Pankaj Thakur | Software Developer Portfolio",
    description:
      "Showcasing innovative software projects using React, Next.js, and modern UI/UX practices.",
    images: ["https://thakur.dev/preview.png"],
  },
  robots: "index, follow",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`antialiased ${inter.className}`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
          disableTransitionOnChange={false}
        >
          {children}
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  );
}
