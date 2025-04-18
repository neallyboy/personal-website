import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import styles from './layout.module.css';
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
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <nav className={styles.nav}>
          <div className={styles.navContent}>
            {data.navLinks.map((link: NavLink) => (
              <Link key={link.href} href={link.href} className={styles.navLink}>
                {link.icon && <Image src={link.icon} alt="" width={20} height={20} className={styles.navIcon} />}
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
