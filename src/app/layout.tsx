import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import styles from './layout.module.css';
import Link from 'next/link';
import Image from 'next/image';

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
        <nav className={styles.nav}>
          <div className={styles.navContent}>
            <Link href="/" className={styles.navLink}>
              <Image 
                src="/home.svg" 
                alt="" 
                width={20} 
                height={20} 
                className={styles.navIcon}
              />
              Home
            </Link>
            <Link href="/projects" className={styles.navLink}>
              <Image 
                src="/projects.svg" 
                alt="" 
                width={20} 
                height={20} 
                className={styles.navIcon}
              />
              Projects
            </Link>
          </div>
        </nav>
        {children}
      </body>
    </html>
  );
}
