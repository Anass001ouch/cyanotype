'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import CheckoutDialog from './CheckoutDialog';
import { Button } from '@/components/ui/button';

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
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
      <div className="mb-8">
        <h3 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
          Our Collection
        </h3>
        <p className="mt-1 text-sm text-muted-foreground">
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
            <div className="group flex flex-col h-full bg-card border border-border rounded-lg overflow-hidden hover:shadow-lg transition-all duration-300">
              {/* Image Container */}
              <div className="relative aspect-square overflow-hidden bg-muted">
                {product.imageUrl ? (
                  <img
                    src={product.imageUrl}
                    alt={product.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-muted-foreground text-xs">
                    No Image
                  </div>
                )}

                {/* Sold Out Badge */}
                {product.stockStatus === 'Sold Out' && (
                  <div className="absolute top-2 left-2 bg-destructive text-destructive-foreground text-[10px] sm:text-xs font-semibold tracking-wider uppercase px-2.5 py-1 rounded">
                    Sold Out
                  </div>
                )}
              </div>

              {/* Product Info */}
              <div className="p-4 flex flex-col flex-grow space-y-2">
                <h4 className="text-sm sm:text-base font-medium text-foreground line-clamp-1">
                  {product.title}
                </h4>
                <p className="text-sm font-semibold text-primary">
                  {Math.round(product.price)} DH
                </p>
                <div className="flex-grow" />
                <Button 
                  className="w-full mt-2"
                  disabled={product.stockStatus === 'Sold Out'}
                  onClick={() => setSelectedProduct(product)}
                >
                  Buy Now
                </Button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {products.length === 0 && (
        <div className="text-center py-16">
          <p className="text-muted-foreground text-lg">The vault is empty. Every 1-of-1 piece has been claimed.</p>
          <p className="text-muted-foreground text-sm mt-2">Stay tuned for the next drop.</p>
        </div>
      )}

      <CheckoutDialog 
        product={selectedProduct} 
        isOpen={!!selectedProduct} 
        onClose={() => setSelectedProduct(null)} 
      />
    </section>
  );
}
