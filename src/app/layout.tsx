import type { Metadata } from "next";
import { Inter, Plus_Jakarta_Sans, Hind_Siliguri } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import 'katex/dist/katex.min.css';

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-mono",
});

const hindSiliguri = Hind_Siliguri({
  subsets: ["bengali", "latin"],
  weight: ['300', '400', '500', '600', '700'],
  variable: "--font-hind-siliguri",
});

export const metadata: Metadata = {
  title: "Next Frontend",
  description: "This is a Next.js frontend for a web application developed by Moaz",
  keywords: ["next.js", "react", "web development"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        suppressHydrationWarning
        className={`${inter.variable} ${jakarta.variable} ${hindSiliguri.variable} min-h-screen bg-background font-sans antialiased`}>
        <main className="relative flex min-h-screen flex-col">
          {children}
        </main>
        <Toaster position="top-right" />
      </body>
    </html>
  );
}
