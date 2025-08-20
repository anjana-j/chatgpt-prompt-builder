import { SpeedInsights } from '@vercel/speed-insights/next';
import { Analytics } from '@vercel/analytics/next';
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

const title = "ChatGPT 5 Prompt Builder — Workspaces & Presets for Better AI Prompts";
const description =
  "A local-first workspace-based Prompt Builder for ChatGPT 5 — craft, organize, and reuse high-quality AI prompts with ease.";
const ogImage = "https://chatgpt-prompt-builder.vercel.app/chatgpt-prompt-builder.jpg";

export const metadata: Metadata = {
  title,
  description,
  openGraph: {
    title,
    description,
    url: "https://chatgpt-prompt-builder.vercel.app/",
    siteName: "ChatGPT 5 Prompt Builder",
    images: [
      {
        url: ogImage,
        width: 1200,
        height: 630,
        alt: "ChatGPT 5 Prompt Builder Preview",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: [ogImage],
  },
  authors: [{ name: "Anjana Jayaweera", url: "https://github.com/anjana-j" }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        <SpeedInsights />
        <Analytics />
      </body>
    </html>
  );
}
