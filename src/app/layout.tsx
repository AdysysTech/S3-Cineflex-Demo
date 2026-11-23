import type { Metadata } from "next";
import { Manrope, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AIAssistantWidget from "@/components/AIAssistantWidget";
import WhatsAppFloatingButton from "@/components/WhatsAppFloatingButton";

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "S3 Cineplex Manendragarh | 4K Laser & In-Seat Dining Experience",
  description:
    "Experience cinema like never before at S3 Cineplex, Manendragarh (Chhattisgarh). 4K Laser Projection, Dolby Atmos sound, luxury recliners, and direct in-seat QR food delivery.",
  keywords: [
    "S3 Cineplex",
    "S3 Cineplex Manendragarh",
    "Manendragarh cinema",
    "Movie tickets Manendragarh",
    "In-seat cinema dining",
    "Chhattisgarh cinema",
    "Dolby Atmos",
    "4K Laser",
  ],
  authors: [{ name: "S3 Cineplex & Adysys Tech" }],
  openGraph: {
    title: "S3 Cineplex Manendragarh | Digital Experience",
    description:
      "4K Laser visuals, Dolby Atmos sound, and instant in-seat QR food ordering at S3 Cineplex, Manendragarh.",
    type: "website",
    locale: "en_IN",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${manrope.variable} ${jetbrainsMono.variable}`}>
      <body className="font-sans bg-[#09090C] text-[#F7F5F5] selection:bg-[#E1252C]/30 selection:text-white antialiased min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 pt-20 w-full flex flex-col">{children}</main>
        <Footer />
        <AIAssistantWidget />
        <WhatsAppFloatingButton />
      </body>
    </html>
  );
}
