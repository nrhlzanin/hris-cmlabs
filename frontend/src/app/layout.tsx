// app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../styles/globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "HRIS",
  description: "Your HR system",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        {/* Kalau kamu butuh menambahkan tag <link> lain, letakkan di app/head.tsx */}
      </head>
      <body className={`${inter.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}

<link
  href="https://cdn.jsdelivr.net/npm/remixicon@4.2.0/fonts/remixicon.css"
  rel="stylesheet"
/>

