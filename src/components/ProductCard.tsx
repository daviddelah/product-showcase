"use client";

import Image from 'next/image';
import { useState } from 'react';
import type { Product } from '@/types';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const hasSecondaryImage = !!product.secondary_image_url;

  return (
    <article
      className="group bg-white border border-neutral-200 transition-all duration-300 hover:border-neutral-400"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative aspect-[3/4] overflow-hidden bg-neutral-50">
        {/* Primary Image */}
        <Image
          src={product.primary_image_url}
          alt={product.title}
          fill
          className={`object-cover transition-opacity duration-500 ${
            isHovered && hasSecondaryImage ? 'opacity-0' : 'opacity-100'
          }`}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          priority={false}
        />

        {/* Secondary Image (if exists) */}
        {hasSecondaryImage && (
          <Image
            src={product.secondary_image_url!}
            alt={`${product.title} - alternate view`}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        )}
      </div>

      <div className="p-4">
        <h2 className="text-base font-medium tracking-tight text-neutral-900">
          {product.title}
        </h2>
        <p className="text-sm text-neutral-500 mt-1">
          {product.year_launched}
        </p>
      </div>
    </article>
  );
}
