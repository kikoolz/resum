import type { Metadata } from "next";
import { Bricolage_Grotesque, Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";

const bricolage = Bricolage_Grotesque({
  variable: "--font-heading",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Resum — AI-Powered Resume Builder",
    template: "%s | Resum",
  },
  description:
    "Resum is an AI-powered resume builder that helps you create ATS-friendly, recruiter-ready resumes in minutes. Upload an existing resume or start fresh. Free plan available.",
  keywords: [
    "resume builder",
    "AI resume",
    "ATS resume",
    "resume generator",
    "CV builder",
    "job application",
  ],
  openGraph: {
    title: "Resum — AI-Powered Resume Builder",
    description:
      "Resum helps you build ATS-friendly, recruiter-ready resumes in minutes with AI. Upload an existing resume or start fresh.",
    url: "https://resum-mu.vercel.app",
    siteName: "Resum",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Resum — AI-Powered Resume Builder",
    description:
      "Resum helps you build ATS-friendly, recruiter-ready resumes in minutes with AI.",
  },
  robots: {
    index: true,
    follow: true,
  },
  other: {
    "google-site-verification": "BXY1ngd9ik9FL_nIUR6tJVXDMpiU2sSTLwkii0agGwI",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml"></link>
      </head>
      <body className={`${bricolage.variable} ${inter.variable} antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
