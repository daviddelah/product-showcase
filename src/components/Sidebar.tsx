"use client";

import Link from 'next/link';

interface SidebarProps {
  categories: string[];
  selectedCategory: string | null;
  onSelectCategory: (category: string | null) => void;
}

export default function Sidebar({ categories, selectedCategory, onSelectCategory }: SidebarProps) {
  return (
    <aside className="fixed left-0 top-0 w-[200px] min-h-screen bg-white border-r border-neutral-200 p-8">
      {/* Logo / Brand */}
      <div className="mb-8">
        <Link href="/" className="block">
          <h1 className="text-lg font-normal text-neutral-900 mb-2">
            davids ideas
          </h1>
        </Link>
        <Link
          href="/admin/login"
          className="text-sm text-neutral-600 hover:text-neutral-900 transition-colors"
        >
          Admin Login
        </Link>
      </div>

      {/* Divider */}
      <div className="border-t border-neutral-200 mb-6"></div>

      {/* Category Filters */}
      <nav className="space-y-2">
        <button
          onClick={() => onSelectCategory(null)}
          className={`
            block w-full text-left text-sm py-2 transition-opacity
            ${selectedCategory === null
              ? 'font-medium text-neutral-900'
              : 'font-normal text-neutral-600 hover:opacity-60'
            }
          `}
        >
          All Products
        </button>

        {categories.map((category) => (
          <button
            key={category}
            onClick={() => onSelectCategory(category)}
            className={`
              block w-full text-left text-sm py-2 transition-opacity
              ${selectedCategory === category
                ? 'font-medium text-neutral-900'
                : 'font-normal text-neutral-600 hover:opacity-60'
              }
            `}
          >
            {category}
          </button>
        ))}
      </nav>
    </aside>
  );
}
