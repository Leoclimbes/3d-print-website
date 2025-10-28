import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ClientProviders from '@/components/ClientProviders';
import { ErrorBoundary } from '@/components/ErrorBoundary';

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
  description: "High-quality custom 3D printed products for every need. From toys to tools, we create personalized items tailored to your specifications.",
  keywords: ["3D printing", "custom products", "3D printed toys", "personalized items", "3D print service"],
  authors: [{ name: "3D Print Shop" }],
  openGraph: {
    title: "3D Print Shop - Custom 3D Printed Products",
    description: "High-quality custom 3D printed products for every need.",
    type: "website",
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
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {/* ErrorBoundary catches any runtime errors */}
        <ErrorBoundary>
          {/* ClientProviders wraps the entire app to provide client-side context */}
          <ClientProviders>
            {children}
          </ClientProviders>
        </ErrorBoundary>
      </body>
    </html>
  );
}
