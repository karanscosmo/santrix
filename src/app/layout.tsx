import type { Metadata } from "next";
import { Inter, Geist, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { SecurityProvider } from "@/context/SecurityContext";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Sanktrix - Autonomous Computational OS",
  description: "Autonomous Computational Intelligence Platform for Enterprise Decision-Making",
  icons: {
    icon: "/Santrix_logo.jpeg",
    apple: "/Santrix_logo.jpeg",
  },
  openGraph: {
    title: "Sanktrix - Autonomous Computational OS",
    description: "Autonomous Computational Intelligence Platform for Enterprise Decision-Making",
    images: [{ url: "/Santrix_logo.jpeg", width: 800, height: 800, alt: "Sanktrix Logo" }],
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${geist.variable} ${jetbrainsMono.variable} h-full antialiased dark`}
    >
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-full flex flex-col bg-background text-on-surface antialiased overflow-hidden">
        <SecurityProvider>{children}</SecurityProvider>
      </body>
    </html>
  );
}
