import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { SystemProvider } from "@/lib/system-context";
import SystemBar from "@/components/shared/SystemBar";
import SystemFooter from "@/components/shared/SystemFooter";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Adduckivity - Duck OS | Life Architecture for Neurodivergent Creators",
  description: "Systems over willpower. Build your life operating system with Duck OS protocols for ADHD/MDD/Burnout creators who need more than motivation.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans bg-zinc-950">
        <SystemProvider>
          <SystemBar />
          <main className="flex-1 flex flex-col relative">
            {children}
          </main>
          <SystemFooter />
        </SystemProvider>
      </body>
    </html>
  );
}
