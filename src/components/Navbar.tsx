import Link from 'next/link';
import Image from 'next/image';
import data from '../data/data.json';
import { NavLink } from '../types/data';

export default function Navbar() {
  return (
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
  );
}