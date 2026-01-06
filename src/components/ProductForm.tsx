"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import ImageUpload from './ImageUpload';
import type { Product } from '@/types';

interface ProductFormProps {
  product?: Product;
  onCancel: () => void;
}

export default function ProductForm({ product, onCancel }: ProductFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [title, setTitle] = useState(product?.title || '');
  const [yearLaunched, setYearLaunched] = useState(
    product?.year_launched?.toString() || ''
  );
  const [primaryImage, setPrimaryImage] = useState<File | null>(null);
  const [secondaryImage, setSecondaryImage] = useState<File | null>(null);
  const [removeSecondary, setRemoveSecondary] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validate primary image for new products
    if (!product && !primaryImage) {
      setError('Primary image is required');
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('year_launched', yearLaunched);

      if (primaryImage) {
        formData.append('primary_image', primaryImage);
      }

      if (secondaryImage) {
        formData.append('secondary_image', secondaryImage);
      }

      if (removeSecondary) {
        formData.append('remove_secondary', 'true');
      }

      const url = product
        ? `/api/products/${product.id}`
        : '/api/products';

      const method = product ? 'PATCH' : 'POST';

      const response = await fetch(url, {
        method,
        body: formData
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to save product');
      }

      router.push('/admin');
      router.refresh();
    } catch (err) {
      console.error('Error saving product:', err);
      setError(err instanceof Error ? err.message : 'Failed to save product');
      setLoading(false);
    }
  };

  const handleSecondaryRemove = () => {
    setSecondaryImage(null);
    setRemoveSecondary(true);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-neutral-700 mb-2">
          Product Title <span className="text-red-500">*</span>
        </label>
        <input
          id="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="w-full px-4 py-2 border border-neutral-300 focus:border-neutral-900 focus:outline-none transition-colors"
          placeholder="Enter product title"
        />
      </div>

      <div>
        <label htmlFor="year" className="block text-sm font-medium text-neutral-700 mb-2">
          Year Launched <span className="text-red-500">*</span>
        </label>
        <input
          id="year"
          type="number"
          value={yearLaunched}
          onChange={(e) => setYearLaunched(e.target.value)}
          required
          min="1900"
          max="2100"
          className="w-full px-4 py-2 border border-neutral-300 focus:border-neutral-900 focus:outline-none transition-colors"
          placeholder="2024"
        />
      </div>

      <ImageUpload
        label="Primary Image"
        currentImageUrl={product?.primary_image_url}
        onImageSelect={setPrimaryImage}
        required={!product}
      />

      <ImageUpload
        label="Secondary Image (for hover effect)"
        currentImageUrl={removeSecondary ? null : product?.secondary_image_url}
        onImageSelect={setSecondaryImage}
        onRemove={handleSecondaryRemove}
      />

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 text-sm">
          {error}
        </div>
      )}

      <div className="flex gap-4 pt-4">
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-3 bg-neutral-900 text-white hover:bg-neutral-800 transition-colors disabled:bg-neutral-400 disabled:cursor-not-allowed"
        >
          {loading ? 'Saving...' : product ? 'Update Product' : 'Create Product'}
        </button>

        <button
          type="button"
          onClick={onCancel}
          disabled={loading}
          className="px-6 py-3 border border-neutral-300 hover:bg-neutral-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
