'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  imageUrl: string;
  category: string;
  technique: string;
  stockStatus: string;
}

interface ProductGridProps {
  products: Product[];
}

export default function ProductGrid({ products }: ProductGridProps) {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
      <div className="mb-8">
        <h3 className="text-2xl sm:text-3xl font-bold text-[#1a2b4c] tracking-tight">
          Our Collection
        </h3>
        <p className="mt-1 text-sm text-[#6b7280]">
          Each piece is a unique work of art, crafted by hand
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
        {products.map((product, index) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.05 }}
          >
            <div className="group cursor-pointer">
              {/* Image Container */}
              <div className="relative aspect-square overflow-hidden bg-[#f0efec] rounded-sm">
                {product.imageUrl ? (
                  <img
                    src={product.imageUrl}
                    alt={product.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-[#6b7280] text-xs">
                    No Image
                  </div>
                )}

                {/* Sold Out Badge */}
                {product.stockStatus === 'Sold Out' && (
                  <div className="absolute top-2 left-2 bg-[#1a2b4c] text-white text-[10px] sm:text-xs font-semibold tracking-wider uppercase px-2.5 py-1">
                    Sold Out
                  </div>
                )}

                {/* Hover overlay */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300" />
              </div>

              {/* Product Info */}
              <div className="mt-3 space-y-1">
                <h4 className="text-sm sm:text-base font-medium text-[#1a2b4c] group-hover:text-[#2d5a7b] transition-colors line-clamp-1">
                  {product.title}
                </h4>
                <p className="text-sm font-semibold text-[#1a2b4c]">
                  {Math.round(product.price)} DH
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {products.length === 0 && (
        <div className="text-center py-16">
          <p className="text-[#6b7280] text-lg">No products yet. Check back soon!</p>
        </div>
      )}
    </section>
  );
}
