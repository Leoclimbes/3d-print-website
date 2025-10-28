import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ClientProviders from '@/components/ClientProviders';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "3D Print Shop - Custom 3D Printed Products",
  description: "High-quality custom 3D printed products for home, office, and hobbies. Fast shipping and competitive prices.",
  keywords: "3D printing, custom products, PLA, ABS, figurines, accessories, home decor",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {/* ClientProviders wraps the entire app to provide client-side context */}
        <ClientProviders>
          {children}
        </ClientProviders>
      </body>
    </html>
  );
}
