import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Clear It",
  description:
    "Get your Newport Beach ADU permit application right the first time.",
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
