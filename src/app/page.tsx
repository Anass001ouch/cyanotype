'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Header from '@/components/storefront/Header';
import Hero from '@/components/storefront/Hero';
import ProcessSection from '@/components/storefront/ProcessSection';
import ProductGrid from '@/components/storefront/ProductGrid';
import Footer from '@/components/storefront/Footer';
import AdminPanel from '@/components/admin/AdminPanel';
import FloatingWhatsApp from '@/components/storefront/FloatingWhatsApp';
import AboutPage from '@/components/storefront/AboutPage';
import HelpPage from '@/components/storefront/HelpPage';
import ComingSoonPage from '@/components/storefront/ComingSoonPage';
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
  heroEyebrow: string;
  heroHeadline: string;
  heroDescription: string;
  promoBannerText: string;
  whatsappNumber: string;
  storeMode: string;
  comingSoonImageUrl: string;
}

export default function Home() {
  const [view, setView] = useState<'storefront' | 'admin' | 'about' | 'help'>('storefront');
  const [products, setProducts] = useState<Product[]>([]);
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

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

  const displayedProducts = activeCategory 
    ? products.filter(p => (p.category === activeCategory || p.technique === activeCategory) && p.stockStatus === 'In Stock')
    : products.filter(p => p.stockStatus === 'In Stock');

  return (
    <div className="min-h-screen bg-background text-foreground" style={{ fontFamily: 'var(--font-geist-sans)' }}>
      <AnimatePresence mode="wait">
        {isLoading ? (
          <div className="flex items-center justify-center min-h-screen">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : settings?.storeMode === 'COMING_SOON' && view !== 'admin' ? (
          <motion.div
            key="coming-soon"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col min-h-screen"
          >
            <ComingSoonPage 
              onAdminClick={() => setView('admin')} 
              backgroundImageUrl={settings?.comingSoonImageUrl}
            />
          </motion.div>
        ) : view === 'storefront' ? (
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
              onCategorySelect={(category) => {
                setActiveCategory(category);
                setView('storefront');
              }}
            />

            <main className="flex-1">
              {!activeCategory && (
                <>
                  <Hero
                    imageUrl={settings?.heroImageUrl || ''}
                    eyebrow={settings?.heroEyebrow}
                    headline={settings?.heroHeadline || 'Where Sunlight Becomes Art'}
                    description={settings?.heroDescription}
                  />
                  <ProcessSection />
                </>
              )}
              {activeCategory && (
                <div id="product-grid" className="py-8 text-center bg-muted/20">
                  <h2 className="text-3xl font-bold tracking-tight text-foreground">{activeCategory}</h2>
                  <p className="text-muted-foreground mt-2">Showing all available products for {activeCategory}</p>
                </div>
              )}
              <div id="product-grid">
                <ProductGrid products={displayedProducts} />
              </div>
            </main>

            <Footer 
              onAdminClick={() => setView('admin')} 
              onNavigate={(page) => setView(page as any)}
              onCategorySelect={(category) => {
                setActiveCategory(category);
                setView('storefront');
              }}
            />
            <FloatingWhatsApp whatsappNumber={settings?.whatsappNumber} />
          </motion.div>
        ) : view === 'about' ? (
          <motion.div
            key="about"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col min-h-screen"
          >
            <Header
              promoText={settings?.promoBannerText || ''}
              onAdminClick={() => setView('admin')}
              onCategorySelect={(category) => {
                setActiveCategory(category);
                setView('storefront');
              }}
            />
            <main className="flex-1"><AboutPage /></main>
            <Footer 
              onAdminClick={() => setView('admin')} 
              onNavigate={(page) => setView(page as any)}
              onCategorySelect={(category) => {
                setActiveCategory(category);
                setView('storefront');
              }}
            />
            <FloatingWhatsApp whatsappNumber={settings?.whatsappNumber} />
          </motion.div>
        ) : view === 'help' ? (
          <motion.div
            key="help"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col min-h-screen"
          >
            <Header
              promoText={settings?.promoBannerText || ''}
              onAdminClick={() => setView('admin')}
              onCategorySelect={(category) => {
                setActiveCategory(category);
                setView('storefront');
              }}
            />
            <main className="flex-1"><HelpPage /></main>
            <Footer 
              onAdminClick={() => setView('admin')} 
              onNavigate={(page) => setView(page as any)}
              onCategorySelect={(category) => {
                setActiveCategory(category);
                setView('storefront');
              }}
            />
            <FloatingWhatsApp whatsappNumber={settings?.whatsappNumber} />
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
