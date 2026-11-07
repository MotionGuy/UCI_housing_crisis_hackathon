import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Home Within Reach",
  description:
    "Find homes a family can afford, jobs that close the gap, and commutes that work.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
