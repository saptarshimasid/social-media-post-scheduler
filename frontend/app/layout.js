import { Montserrat, Inter } from "next/font/google";
import "./globals.css";
import LenisProvider from "@/components/LenisProvider";
import { LocationProvider } from "@/components/LocationContext";
import { ProfileProvider } from "@/components/ProfileContext";

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
  weight: ["600", "700"],
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  weight: ["400", "600"],
});

export const viewport = {
  width: "device-width",
  initialScale: 1.0,
};

export const metadata = {
  title: "Creator Hub - Scheduler Pro | Premium Content Planner",
  description: "Scheduler Pro is an AI-powered content scheduler and dashboard for professional digital creators. Optimize workflows, draft posts with LangGraph pipelines, and analyze performance.",
  keywords: ["Creator Hub", "Content Planner", "AI Scheduling", "Instagram Planner", "LinkedIn Automation", "LangGraph", "Gemini AI"],
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
    apple: "/favicon.svg",
  },
  openGraph: {
    title: "Creator Hub - Scheduler Pro",
    description: "AI-powered content planning dashboard for digital professionals.",
    type: "website",
    url: "https://creatorhub.pro",
    images: [
      {
        url: "https://lh3.googleusercontent.com/aida-public/AB6AXuCeubOjIhhIx5YdlKgojMSomPYRiPH0Kh3UJb1Sjg-_NDcrvUlbRT1g0ZoBG8MMoCT3LmABNfnmmxgqjUay8MrWFYXjwZzoCCT4qq7j5qvOA6SIZ1MlmEQy54TXjeSRdqgQRPy8Xvc7cAsZeT9y7PFbo81IcRZCDQoDjtclIEokbCeX8OEy3p3w5xkw3KPJmfU54h4YQyMNXfoDFWzaTBRET5SswuDQ572W9ardM240TEyVfHqUt33phnFUUCP727gLOiuzg243PjMn",
        width: 1200,
        height: 630,
        alt: "Creator Hub Preview",
      },
    ],
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "Scheduler Pro - Creator Hub",
  "operatingSystem": "All",
  "applicationCategory": "BusinessApplication",
  "description": "Scheduler Pro is a fully integrated, premium digital creator hub and planner that uses LangGraph and Gemini AI models to draft, optimize, and automatically schedule posts for Instagram and LinkedIn.",
  "offers": {
    "@type": "Offer",
    "price": "0.00",
    "priceCurrency": "USD"
  }
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" />
      </head>
      <body className="antialiased bg-[#0A0C10] text-white overflow-x-hidden selection:bg-[#00f0ff]/30">
        <LenisProvider>
          <ProfileProvider>
            <LocationProvider>
              {children}
            </LocationProvider>
          </ProfileProvider>
        </LenisProvider>
      </body>
    </html>
  );
}
