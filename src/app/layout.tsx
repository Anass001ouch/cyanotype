import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CYANOTYPE — Handcrafted Cyanotype Fashion",
  description: "Where chemistry meets fashion. Discover handcrafted cyanotype clothing, accessories, and wearable art. Each piece is unique, created using UV-sensitive chemical processes.",
  keywords: ["Cyanotype", "Handcrafted Fashion", "Chemical Printing", "Sustainable Fashion", "Artisanal Clothing", "Morocco"],
  icons: {
    icon: "/logo.svg",
  },
  openGraph: {
    title: "CYANOTYPE — Handcrafted Cyanotype Fashion",
    description: "Where chemistry meets fashion. Discover handcrafted cyanotype clothing and wearable art.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
