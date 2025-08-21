"use client";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Search, Wallet, User } from 'lucide-react';
import clsx from 'clsx';

const tabs = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/explore', label: 'Explore', icon: Search },
  { href: '/wallet', label: 'Wallet', icon: Wallet },
  { href: '/profile', label: 'Profile', icon: User },
];

export function TabBar() {
  const pathname = usePathname();
  return (
    <nav className="fixed bottom-4 left-0 right-0 mx-auto max-w-screen-sm">
      <div className="mx-4 rounded-2xl bg-white shadow-soft border border-gray-100">
        <ul className="grid grid-cols-4">
          {tabs.map(({ href, label, icon: Icon }) => {
            const isActive = pathname === href;
            return (
              <li key={href} className="text-center">
                <Link
                  href={href}
                  className={clsx(
                    'flex flex-col items-center justify-center py-3 text-sm',
                    isActive ? 'text-black' : 'text-gray-500'
                  )}
                >
                  <Icon size={22} className={clsx(isActive && 'text-[color:var(--color-accent-primary)]')} />
                  <span className="mt-1">{label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}

