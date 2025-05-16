import type { Metadata } from "next";
import { Tenor_Sans } from "next/font/google";
import { Barlow } from "next/font/google";
import "./globals.css";

const tenorSans = Tenor_Sans({
  variable: "--font-tenor-sans",
  subsets: ["latin"],
  weight: ["400"],
});

const barlow = Barlow({
  subsets: ["latin"],
  variable: "--font-barlow",
  weight: ["400", "500", "600"]
});

export const metadata: Metadata = {
  title: "Gyroscope",
  description: "Find authentic gyros near you.",
  viewport: "width=device-width, initial-scale=1, maximum-scale=1",
  themeColor: "#f2eee6",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Gyroscope"
  },
  formatDetection: {
    telephone: false
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${tenorSans.variable} ${barlow.variable}`}>
      <body>{children}</body>
    </html>
  );
}
