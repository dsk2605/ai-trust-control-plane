import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import { TrustProvider } from "@/context/TrustContext"; // <--- IMPORT THIS

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono" });

export const metadata: Metadata = {
  title: "AI Trust Control Plane",
  description: "Real-time Governance for AI",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${mono.variable} bg-black text-white font-sans antialiased`}>
        <TrustProvider>  {/* <--- WRAP EVERYTHING HERE */}
          <Navbar />
          <main className="max-w-7xl mx-auto px-6 py-8">
            {children}
          </main>
        </TrustProvider>
      </body>
    </html>
  );
}