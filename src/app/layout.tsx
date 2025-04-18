import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Link from 'next/link';
import Image from 'next/image';
import data from '../data/data.json';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Neal Miran",
  description: "Personal website of Neal Miran",
};

type NavLink = {
  href: string;
  text: string;
  icon?: string;
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased`}>
        <nav className="sticky top-0 z-40 bg-white border-b border-black/[0.08]">
          <div className="max-w-3xl mx-auto px-6 py-4 flex gap-6">
            {data.navLinks.map((link: NavLink) => (
              <Link 
                key={link.href} 
                href={link.href} 
                className="flex items-center gap-2 text-text-secondary hover:text-text-primary font-medium no-underline"
              >
                {link.icon && (
                  <Image 
                    src={link.icon} 
                    alt="" 
                    width={20} 
                    height={20} 
                    className="w-5 h-5"
                  />
                )}
                {link.text}
              </Link>
            ))}
          </div>
        </nav>
        {children}
      </body>
    </html>
  );
}
