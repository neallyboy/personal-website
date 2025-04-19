'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { navLinks } from '@/data/navigation/data';

export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white border-b border-black/[0.08] px-8 py-4 sm:py-2 z-10">
      <div className="max-w-3xl mx-auto">
        <ul className="flex justify-between sm:justify-start sm:gap-12">
          {navLinks.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className={`flex flex-col sm:flex-row items-center gap-1 sm:gap-2 text-sm ${
                  pathname === link.href ? 'text-text-primary' : 'text-text-secondary'
                }`}
              >
                <Image src={link.icon} alt={link.text} width={20} height={20} className="opacity-80" />
                <span>{link.text}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}