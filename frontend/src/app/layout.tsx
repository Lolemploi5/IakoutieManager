import type { Metadata } from "next";
import { JetBrains_Mono, Plus_Jakarta_Sans, Space_Grotesk } from "next/font/google";
import { TooltipProvider } from "@/components/ui/tooltip";
import "./globals.css";

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-heading",
  subsets: ["latin"],
});

const jetBrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Iakoutie Manager",
  description: "Portail Discord pour accéder au dashboard Iakoutie Manager.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="fr"
      className={`${plusJakartaSans.variable} ${spaceGrotesk.variable} ${jetBrainsMono.variable} dark h-full antialiased`}
    >
      <body className="min-h-screen flex flex-col bg-background text-foreground font-sans">
        <TooltipProvider>{children}</TooltipProvider>
      </body>
    </html>
  );
}
