"use client";

import Link from 'next/link';
import { signOut } from 'next-auth/react';
import { usePathname } from 'next/navigation';

export default function AdminNav() {
  const pathname = usePathname();

  const handleSignOut = async () => {
    await signOut({ callbackUrl: '/admin/login' });
  };

  return (
    <nav className="border-b border-neutral-200 bg-white">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/admin" className="text-lg font-light tracking-tight">
              Admin Panel
            </Link>

            <div className="flex gap-4 text-sm">
              <Link
                href="/admin"
                className={`hover:text-neutral-600 transition-colors ${
                  pathname === '/admin' ? 'text-neutral-900 font-medium' : 'text-neutral-500'
                }`}
              >
                Products
              </Link>

              <Link
                href="/admin/products/new"
                className={`hover:text-neutral-600 transition-colors ${
                  pathname === '/admin/products/new' ? 'text-neutral-900 font-medium' : 'text-neutral-500'
                }`}
              >
                New Product
              </Link>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Link
              href="/"
              target="_blank"
              className="text-sm text-neutral-500 hover:text-neutral-700 transition-colors"
            >
              View Site
            </Link>

            <button
              onClick={handleSignOut}
              className="text-sm px-4 py-2 border border-neutral-300 hover:bg-neutral-50 transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
