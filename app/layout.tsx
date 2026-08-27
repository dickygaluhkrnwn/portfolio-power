import type { Metadata, Viewport } from "next";
import { Inter, Space_Grotesk } from "next/font/google";

// @ts-ignore: CSS module type declarations may be missing in some environments
import "./globals.css";

import { cn } from "@/lib/utils";
import { CommandMenuTrigger } from "@/components/ui/command-menu-trigger"; 
import { CommandPalette } from "@/components/ui/command-palette";
import { AuthProvider } from "@/lib/auth-context";
import { Analytics } from "@vercel/analytics/react"; 
import { ChatWidget } from "@/components/ai/chat-widget";
import { FooterWrapper } from "@/components/layout/footer-wrapper";
import { NavbarWrapper } from "@/components/layout/navbar-wrapper";

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

// --- SEO & PWA CONFIGURATION ---
// Kita paksakan menggunakan versi www agar sesuai dengan preferensi Google Search Console
const siteUrl = "https://www.dickygaluhkrnwn.my.id";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Dicky Galuh Kurniawan | Full Stack Developer",
    template: "%s | IKY Dev.",
  },
  description: "Portofolio resmi Dicky Galuh Kurniawan (Iky). Full Stack Developer yang fokus membangun aplikasi web modern, cepat, dan user-friendly.",
  keywords: ["Dicky Galuh Kurniawan", "Iky", "Full Stack Developer", "Next.js", "React", "Web Developer Indonesia", "Portfolio"],
  authors: [{ name: "Dicky Galuh Kurniawan", url: siteUrl }],
  creator: "Dicky Galuh Kurniawan",
  manifest: "/manifest.json", 
  openGraph: {
    type: "website",
    locale: "id_ID",
    url: siteUrl,
    title: "Dicky Galuh Kurniawan | Building Digital Masterpieces",
    description: "Lihat karya terbaik Iky dalam pengembangan web modern.",
    siteName: "IKY Dev.",
    images: [
      {
        url: "/og-image.jpg", 
        width: 1200,
        height: 630,
        alt: "Dicky Galuh Kurniawan Portfolio",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Dicky Galuh Kurniawan | Full Stack Developer",
    description: "Membangun solusi web modern dengan teknologi terkini.",
    images: ["/og-image.jpg"], 
    creator: "@iky_username",
  },
  icons: {
    icon: [
      { url: '/icon.png', type: 'image/png' },
      { url: '/icon-192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
    shortcut: "/icon.png",
    apple: [
      { url: '/logo-app.svg' }
    ], 
    other: [
      {
        rel: 'mask-icon',
        url: '/logo-app.svg',
      },
    ],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "IKY Dev.",
  },
};

export const viewport: Viewport = {
  themeColor: "#0a0a0a",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className="scroll-smooth">
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased selection:bg-primary selection:text-white",
          inter.variable,
          spaceGrotesk.variable
        )}
      >
        <AuthProvider>
          <CommandPalette />
          
          <NavbarWrapper />
          
          {children}
          
          <FooterWrapper />
          
          <Analytics />
          <CommandMenuTrigger />
          <ChatWidget />
        </AuthProvider>
      </body>
    </html>
  );
}