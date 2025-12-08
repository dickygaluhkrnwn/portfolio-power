import type { Metadata, Viewport } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { CommandPalette } from "@/components/ui/command-palette";
import { CommandMenuTrigger } from "@/components/ui/command-menu-trigger";

// Font Setup
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space",
  display: "swap",
});

// --- SEO CONFIGURATION ---
export const metadata: Metadata = {
  title: {
    default: "Your Name | Full Stack Developer",
    template: "%s | Your Name Portfolio",
  },
  description: "Portofolio Full Stack Developer yang berfokus pada membangun pengalaman digital yang cepat, skalabel, dan estetik.",
  keywords: ["Full Stack Developer", "Next.js", "React", "Tailwind CSS", "Web Developer Indonesia"],
  authors: [{ name: "Your Name", url: "https://yourwebsite.com" }],
  creator: "Your Name",
  openGraph: {
    type: "website",
    locale: "id_ID",
    url: "https://yourwebsite.com",
    title: "Your Name | Building Digital Masterpieces",
    description: "Lihat karya terbaik saya dalam pengembangan web modern.",
    siteName: "Your Name Portfolio",
    images: [
      {
        url: "/og-image.jpg", // Pastikan buat gambar ini nanti (1200x630px)
        width: 1200,
        height: 630,
        alt: "Portfolio Preview",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Your Name | Full Stack Developer",
    description: "Membangun solusi web modern dengan teknologi terkini.",
    images: ["/og-image.jpg"],
    creator: "@yourtwitterhandle",
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
};

export const viewport: Viewport = {
  themeColor: "#0a0a0a",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased selection:bg-primary selection:text-white",
          inter.variable,
          spaceGrotesk.variable
        )}
      >
        <CommandPalette />
        {children}
        <CommandMenuTrigger />
      </body>
    </html>
  );
}