import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/header";
import { geistSans, geistMono } from "@/components/ui/font";
import { Footer } from "@/components/footer";

export const metadata: Metadata = {
  title: {
    template: '%s | Vercel Daily News',
    default: 'News for Web Developers',
  },
  description: 'Vercel Daily News is a daily newsletter for web developers. It is a collection of the latest news and insights for web developers.',
  metadataBase: new URL('https://vercel-daily-news.vercel.app/'),
  openGraph: {
    title: 'Vercel Daily News',
    description: 'Vercel Daily News is a daily newsletter for web developers. It is a collection of the latest news and insights for web developers.',
    url: 'https://vercel-daily-news.vercel.app/',
    siteName: 'Vercel Daily News',
    images: [
      { url: 'https://vercel-daily-news.vercel.app/vercel-black.svg' },
    ],
    locale: 'en_US',
    type: 'website',
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.className} ${geistMono.className} antialiased bg-white/95`}
      >
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
