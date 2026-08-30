import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "react-hot-toast";
import Providers from "@/components/providers";
import Chatbot from "@/components/chatbot/chatbot";
import VoiceCommand from "@/components/voice-command/voice-command";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SmartLMS - AI-Powered Learning Management System",
  description:
    "The most advanced LMS combining the best features of Tutor LMS, LearnDash, and MasterStudy. Create courses, build quizzes, issue certificates, and track learner progress with AI-powered tools.",
  keywords: [
    "LMS",
    "learning management system",
    "online courses",
    "elearning",
    "WordPress LMS alternative",
    "course builder",
    "quiz maker",
    "certificate builder",
    "AI learning",
  ],
  openGraph: {
    title: "SmartLMS - AI-Powered Learning Management System",
    description:
      "Create, manage, and sell online courses with the most powerful LMS platform.",
    url: process.env.NEXT_PUBLIC_APP_URL || "https://smartlms-bay.vercel.app",
    siteName: "SmartLMS",
    locale: "en_US",
    type: "website",
  },
   twitter: {
     card: "summary_large_image",
     title: "SmartLMS - AI-Powered Learning Management System",
     description:
       "Create, manage, and sell online courses with the most powerful LMS platform.",
   },
   icons: {
     icon: [
       { url: "/favicon.svg", type: "image/svg+xml" },
       { url: "/favicon.ico", sizes: "32x32" },
     ],
     apple: [
       { url: "/favicon.svg", type: "image/svg+xml" },
     ],
   },
 };

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full">
        <Providers>{children}</Providers>
        <Chatbot />
        <VoiceCommand />
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: "#1e293b",
              color: "#f8fafc",
              borderRadius: "12px",
            },
            success: {
              iconTheme: {
                primary: "#10b981",
                secondary: "#f8fafc",
              },
            },
            error: {
              iconTheme: {
                primary: "#ef4444",
                secondary: "#f8fafc",
              },
            },
          }}
        />
      </body>
    </html>
  );
}
