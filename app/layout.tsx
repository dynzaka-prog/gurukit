import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import FBAds from "@/components/FBAds";
import { Suspense } from "react";

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-display",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-body",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "GuruKit — Asisten AI Guru Indonesia",
  description: "Bikin soal & modul ajar dalam 3 menit. Lisensi seumur hidup hanya Rp 99.000. Solusi cerdas untuk guru Indonesia.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body
        className={`${plusJakartaSans.variable} ${inter.variable} ${jetbrainsMono.variable} antialiased`}
      >
        <Suspense fallback={null}>
          <FBAds />
        </Suspense>
        {children}
      </body>
    </html>
  );
}
