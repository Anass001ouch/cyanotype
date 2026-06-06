'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Header from '@/components/storefront/Header';
import Hero from '@/components/storefront/Hero';
import ProductGrid from '@/components/storefront/ProductGrid';
import Footer from '@/components/storefront/Footer';
import AdminPanel from '@/components/admin/AdminPanel';
import { motion, AnimatePresence } from 'framer-motion';

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

interface SiteSettings {
  id: string;
  heroImageUrl: string;
  heroHeadline: string;
  promoBannerText: string;
}

export default function Home() {
  const [view, setView] = useState<'storefront' | 'admin'>('storefront');
  const [products, setProducts] = useState<Product[]>([]);
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchProducts = useCallback(async () => {
    try {
      const res = await fetch('/api/products');
      const data = await res.json();
      setProducts(data);
    } catch (err) {
      console.error('Failed to fetch products:', err);
    }
  }, []);

  const fetchSettings = useCallback(async () => {
    try {
      const res = await fetch('/api/settings');
      const data = await res.json();
      setSettings(data);
    } catch (err) {
      console.error('Failed to fetch settings:', err);
    }
  }, []);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      await Promise.all([fetchProducts(), fetchSettings()]);
      setIsLoading(false);
    };
    loadData();
  }, [fetchProducts, fetchSettings]);

  const handleDataChange = useCallback(() => {
    fetchProducts();
    fetchSettings();
  }, [fetchProducts, fetchSettings]);

  return (
    <div className="min-h-screen bg-[#faf9f6]" style={{ fontFamily: 'var(--font-geist-sans)' }}>
      <AnimatePresence mode="wait">
        {view === 'storefront' ? (
          <motion.div
            key="storefront"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col min-h-screen"
          >
            <Header
              promoText={settings?.promoBannerText || ''}
              onAdminClick={() => setView('admin')}
            />

            <main className="flex-1">
              {isLoading ? (
                <div className="flex items-center justify-center py-32">
                  <div className="w-8 h-8 border-2 border-[#1a2b4c] border-t-transparent rounded-full animate-spin" />
                </div>
              ) : (
                <>
                  <Hero
                    imageUrl={settings?.heroImageUrl || ''}
                    headline={settings?.heroHeadline || 'Handcrafted Cyanotype Fashion'}
                  />
                  <ProductGrid products={products} />
                </>
              )}
            </main>

            <Footer onAdminClick={() => setView('admin')} />
          </motion.div>
        ) : (
          <motion.div
            key="admin"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <AdminPanel
              onBackToStore={() => setView('storefront')}
              onDataChange={handleDataChange}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
