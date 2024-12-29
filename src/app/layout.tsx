import type { Metadata } from "next";
import localFont from "next/font/local";
import {NextIntlClientProvider} from 'next-intl';
import {getMessages} from 'next-intl/server';
import "./globals.css";
import { Providers } from './providers'
import Layout from "./components/Layout";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Neo Republic",
  description: "A platform for collaborative program proposals and civic engagement",
  icons: {
    icon: [
      {
        url: '/images/icon.svg',
        type: 'image/svg+xml',
      }
    ],
    apple: '/images/icon.svg',
  },
  manifest: '/manifest.json'
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const messages = await getMessages();
  
  return (
    <html lang="en" className="w-full h-full">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased w-full h-full overflow-x-hidden`}>
        <Providers>
          <NextIntlClientProvider messages={messages}>
            <Layout>
              {children}
            </Layout>
          </NextIntlClientProvider>
        </Providers>
      </body>
    </html>
  );
}
