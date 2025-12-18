import type { Metadata, Viewport } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { CommandPalette } from "@/components/ui/command-palette";
import { CommandMenuTrigger } from "@/components/ui/command-menu-trigger";
import { AuthProvider } from "@/lib/auth-context";
import { Analytics } from "@vercel/analytics/react"; 
import { ChatWidget } from "@/components/ai/chat-widget";

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
export const metadata: Metadata = {
  title: {
    default: "Dicky Galuh Kurniawan | Full Stack Developer",
    template: "%s | Iky Portfolio",
  },
  description: "Portofolio resmi Dicky Galuh Kurniawan (Iky). Full Stack Developer yang fokus membangun aplikasi web modern, cepat, dan user-friendly.",
  keywords: ["Dicky Galuh Kurniawan", "Iky", "Full Stack Developer", "Next.js", "React", "Web Developer Indonesia", "Portfolio"],
  authors: [{ name: "Dicky Galuh Kurniawan", url: "https://dickygaluh.com" }],
  creator: "Dicky Galuh Kurniawan",
  manifest: "/manifest.json", // Link ke manifest
  openGraph: {
    type: "website",
    locale: "id_ID",
    url: "https://dickygaluh.com",
    title: "Dicky Galuh Kurniawan | Building Digital Masterpieces",
    description: "Lihat karya terbaik Iky dalam pengembangan web modern.",
    siteName: "Iky Portfolio",
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
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/logo-app.svg", // Menggunakan logo baru untuk sementara
  },
  // Konfigurasi khusus Apple Device agar terasa seperti Native App
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Iky Portfolio",
  },
};

export const viewport: Viewport = {
  themeColor: "#0a0a0a", // Warna bar browser di HP menyatu dengan background
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false, // Mencegah zoom in/out yang tidak sengaja (App-like feel)
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
        <AuthProvider>
          <CommandPalette />
          {children}
          <Analytics />
          <CommandMenuTrigger />
          <ChatWidget />
        </AuthProvider>
      </body>
    </html>
  );
}