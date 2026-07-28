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
    default: "AI Resume Builder — Build ATS-Friendly Resumes with AI",
    template: "%s | AI Resume Builder",
  },
  description:
    "Build ATS-friendly, recruiter-ready resumes in minutes with AI. Upload an existing resume or start fresh. Free plan available.",
  keywords: ["resume builder", "AI resume", "ATS resume", "resume generator", "CV builder", "job application"],
  openGraph: {
    title: "AI Resume Builder — Build ATS-Friendly Resumes with AI",
    description: "Build ATS-friendly, recruiter-ready resumes in minutes with AI. Upload an existing resume or start fresh.",
    url: "https://airesume.dev",
    siteName: "AI Resume Builder",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Resume Builder",
    description: "Build ATS-friendly, recruiter-ready resumes in minutes with AI.",
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
