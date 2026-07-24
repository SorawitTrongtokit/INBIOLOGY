import type { Metadata } from "next";
import { Noto_Sans_Thai } from "next/font/google";
import "./globals.css";

const notoSansThai = Noto_Sans_Thai({
  variable: "--font-noto-sans-thai",
  subsets: ["thai", "latin"],
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://inbiology.vercel.app"),
  title: {
    default: "inbio — เรียนชีวะ เข้าใจง่าย เก่งได้จริง",
    template: "%s | inbio",
  },
  description: "inbio เว็บไซต์เรียนชีววิทยาออนไลน์สำหรับนักเรียนมัธยม ครอบคลุม ม.4–ม.6 และ TCAS A-Level",
  openGraph: {
    type: "website",
    siteName: "inbio",
    locale: "th_TH",
    title: "inbio — เรียนชีวะ เข้าใจง่าย เก่งได้จริง",
    description: "inbio เว็บไซต์เรียนชีววิทยาออนไลน์สำหรับนักเรียนมัธยม ครอบคลุม ม.4–ม.6 และ TCAS A-Level",
  },
  twitter: {
    card: "summary_large_image",
    title: "inbio — เรียนชีวะ เข้าใจง่าย เก่งได้จริง",
    description: "inbio เว็บไซต์เรียนชีววิทยาออนไลน์สำหรับนักเรียนมัธยม",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="th"
      className={notoSansThai.variable}
      data-scroll-behavior="smooth"
      suppressHydrationWarning
    >
      <body className="font-sans antialiased" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
