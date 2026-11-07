import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "Clear it: Newport Beach ADU permits",
  description:
    "Check if your ADU qualifies for Newport Beach's fast path, and get your permit forms filled out.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="min-h-dvh font-sans antialiased">{children}</body>
    </html>
  );
}
