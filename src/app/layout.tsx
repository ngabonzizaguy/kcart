import './globals.css';
import type { ReactNode } from 'react';
import { TabBar } from '../components/TabBar';

export const metadata = {
  title: 'kcart',
  description: 'Multi-vendor e-commerce & food delivery',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-white text-black antialiased">
        <main className="pb-20 max-w-screen-sm mx-auto">{children}</main>
        <TabBar />
      </body>
    </html>
  );
}

