import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "@/components/ui/sonner";

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL!;

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
  ),
  title: {
    default: "CMS Platform - Online Courses",
    template: "%s | CMS Platform",
  },
  description:
    "A modern Course Management System built with Next.js, MongoDB, and Clerk. Explore online courses and boost your skills.",
  keywords: [
    "online courses",
    "course management system",
    "Next.js CMS",
    "learning platform",
    "LMS",
  ],
  authors: [{ name: "Preetham Poojari" }],
  creator: "Preetham Poojari",

  openGraph: {
    title: "CMS Platform - Online Courses",
    description: "Explore online courses built with Next.js and MongoDB.",
    url: BASE_URL,
    siteName: "CMS Platform",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "CMS Platform",
      },
    ],
    type: "website",
  },

  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          {children}
          <Toaster />
        </body>
      </html>
    </ClerkProvider>
  );
}
