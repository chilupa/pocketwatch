import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
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
        className={`${inter.variable} font-sans antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
