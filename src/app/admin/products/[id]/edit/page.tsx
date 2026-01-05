"use client";

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import ProductForm from '@/components/ProductForm';
import type { Product } from '@/types';

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`/api/products/${params.id}`);
        if (response.ok) {
          const data = await response.json();
          setProduct(data);
        } else {
          alert('Product not found');
          router.push('/admin');
        }
      } catch (error) {
        console.error('Error fetching product:', error);
        alert('Failed to load product');
        router.push('/admin');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [params.id, router]);

  const handleCancel = () => {
    router.push('/admin');
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <p className="text-neutral-500">Loading product...</p>
      </div>
    );
  }

  if (!product) {
    return null;
  }

  return (
    <div>
      <h1 className="text-3xl font-light tracking-tight mb-8">Edit Product</h1>
      <ProductForm product={product} onCancel={handleCancel} />
    </div>
  );
}
