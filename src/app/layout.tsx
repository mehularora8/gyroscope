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
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${tenorSans.variable} ${barlow.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
