// app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import 'font-awesome/css/font-awesome.min.css';
import '../../styles/globals.css';

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
        <link
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css"
          rel="stylesheet"
        />
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

