import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ImageBulk - Bulk Image Downloader SaaS",
  description: "Download images in bulk using AI-powered search. Perfect for designers, developers, and AI training datasets.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Navbar />
        <main className="min-h-screen bg-dark-bg relative overflow-x-hidden">
          {/* Subtle neon gradient overlay */}
          <div className="fixed inset-0 bg-gradient-to-br from-neon-green/5 via-transparent to-neon-cyan/5 pointer-events-none"></div>
          <div className="relative z-10">
            {children}
          </div>
        </main>
      </body>
    </html>
  );
}
