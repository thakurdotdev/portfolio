import type { Metadata } from "next";
import { Inter } from "next/font/google";

import "./globals.css";
import Navigation from "@/components/Navigation";
import Social from "@/components/Social";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Portfolio: Pankaj Kumar",
  description:
    "Pankaj Kumar is FullStack Web Developer and Currently working at Netclues India Private Limited",
  keywords: "pankajktech, pankajthakur, pankajkumar portfolio",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider attribute="class">
          <div className="relative overflow-hidden min-h-screen">
            <div className="absolute top-10 left-1/3 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-2xl opacity-70 animate-blob -z-10"></div>
            <div className="hidden md:block absolute top-0 right-4 w-96 h-96 bg-rose-200 mix-blend-multiply rounded-full filter blur-2xl opacity-50 animate-blob animation-delay-2000 -z-10"></div>
            <div className="absolute bottom-20 left-20 w-96 h-96 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000 -z-10"></div>
            <div className=" hidden md:block absolute -bottom-8 right-1/3 w-96 h-96 bg-teal-200 rounded-full mix-blend-multiply filter blur-2xl opacity-70 animate-blob animation-delay-4000 -z-10"></div>
            {children}
            <Navigation />
            <Social />
            <Toaster position="top-center" />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
