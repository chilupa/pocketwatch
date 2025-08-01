import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "PocketWatch - Smart Expense Tracker",
  description: "PocketWatch helps you track expenses, manage budgets, and analyze spending patterns with beautiful charts and insights.",
  keywords: "expense tracker, budget app, money management, personal finance, spending tracker",
  authors: [{ name: "PocketWatch" }],
  creator: "PocketWatch",
  publisher: "PocketWatch",
  openGraph: {
    title: "PocketWatch - Smart Expense Tracker",
    description: "Track expenses, manage budgets, and analyze spending with PocketWatch",
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
        {children}
      </body>
    </html>
  );
}
