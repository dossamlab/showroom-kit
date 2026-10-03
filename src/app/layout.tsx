import type { Metadata } from "next";
import { Fraunces, Noto_Sans_KR } from "next/font/google";
import "./globals.css";
import { profile } from "@/config/site";
import { theme } from "@/config/theme";
import { visuals } from "@/config/visuals";

const display = Fraunces({ subsets: ["latin"], variable: "--font-display", display: "swap" });
const body = Noto_Sans_KR({ subsets: ["latin"], variable: "--font-body", display: "swap" });

// Share previews need an absolute address: an explicit one, else the one Vercel gives the build.
const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : "http://localhost:3000");
// The hero object doubles as the share-preview picture; without it the preview shows text only.
const shareImages = visuals.heroObject ? ["/visuals/hero-object-720.webp"] : [];

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: profile.kicker,
  description: profile.description,
  openGraph: { title: profile.kicker, description: profile.description, images: shareImages }
};

// Theme colors become CSS variables on <html>: bgGlow -> --bg-glow.
const themeVars = Object.fromEntries(
  Object.entries(theme.colors).map(([key, value]) => [`--${key.replace(/[A-Z]/g, (c) => `-${c.toLowerCase()}`)}`, value])
) as React.CSSProperties;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko" className={`${display.variable} ${body.variable}`} style={{ ...themeVars, colorScheme: theme.scheme }}>
      <body>{children}</body>
    </html>
  );
}
