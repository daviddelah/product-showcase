"use client";

import { useRouter } from 'next/navigation';
import ProductForm from '@/components/ProductForm';

export default function NewProductPage() {
  const router = useRouter();

  const handleCancel = () => {
    router.push('/admin');
  };

  return (
    <div>
      <h1 className="text-3xl font-light tracking-tight mb-8">Create New Product</h1>
      <ProductForm onCancel={handleCancel} />
    </div>
  );
}
