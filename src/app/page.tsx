"use client";

import { useState, useEffect } from 'react';
import ProductGrid from '@/components/ProductGrid';
import Sidebar from '@/components/Sidebar';
import type { Product } from '@/types';

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch products on mount
  useEffect(() => {
    async function fetchProducts() {
      try {
        const response = await fetch('/api/products');
        if (response.ok) {
          const data = await response.json();
          setProducts(data);
        }
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, []);

  // Extract unique categories from products
  const categories = Array.from(
    new Set(
      products
        .map(p => p.category)
        .filter((cat): cat is string => cat !== null && cat !== '')
    )
  ).sort();

  // Filter products based on selected category
  const filteredProducts = selectedCategory
    ? products.filter(p => p.category === selectedCategory)
    : products;

  return (
    <div className="flex min-h-screen bg-neutral-50">
      <Sidebar
        categories={categories}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
      />

      <main className="ml-[200px] flex-1 p-6 md:p-12">
        {loading ? (
          <div className="text-center text-neutral-500">Loading...</div>
        ) : (
          <ProductGrid products={filteredProducts} />
        )}
      </main>
    </div>
  );
}
