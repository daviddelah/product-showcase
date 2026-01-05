import { supabaseAdmin } from '@/lib/supabase/server';
import ProductGrid from '@/components/ProductGrid';
import type { Product } from '@/types';

// Revalidate every 60 seconds (ISR)
export const revalidate = 60;

async function getProducts(): Promise<Product[]> {
  try {
    const { data, error } = await supabaseAdmin
      .from('products')
      .select('*')
      .order('display_order', { ascending: false })
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching products:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Unexpected error fetching products:', error);
    return [];
  }
}

export default async function HomePage() {
  const products = await getProducts();

  return (
    <main className="min-h-screen bg-white px-6 py-12 md:px-12 lg:px-24">
      <header className="mb-16 text-center">
        <h1 className="text-4xl md:text-5xl font-light tracking-tight text-neutral-900">
          Products
        </h1>
      </header>

      <ProductGrid products={products} />
    </main>
  );
}
