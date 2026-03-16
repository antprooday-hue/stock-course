import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Stock Course",
  description: "A stock-learning project being rebuilt from Figma.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
