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

export const metadata: Metadata = {
  title: "Soul Portraits | Fotografia portretowa",
  description: "Profesjonalna fotografia portretowa. Uwieczniamy wyjątkowe momenty i emocje w artystyczny sposób.",
  keywords: ["fotografia", "portrety", "sesje zdjęciowe", "fotografia artystyczna", "soul portraits"],
  authors: [{ name: "Soul Portraits" }],
  openGraph: {
    title: "Soul Portraits | Fotografia portretowa",
    description: "Profesjonalna fotografia portretowa. Uwieczniamy wyjątkowe momenty i emocje w artystyczny sposób.",
    type: "website",
    locale: "pl_PL",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background`}
      >
        {children}
        <div className="layout-background z-[-1] fixed inset-0 top-0 left-0 right-0 bottom-0"></div>
      </body>
    </html>
  );
}
