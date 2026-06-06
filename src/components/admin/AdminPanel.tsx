'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Package, Palette, Lock, Eye, EyeOff } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const ADMIN_PASSWORD_HASH = '66d5d469c8a15199236964177d27ca364bbe8f4ca431da6cbd1b144eb80d8004';

async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}
import InventoryForm from './InventoryForm';
import InventoryTable from './InventoryTable';
import DesignForm from './DesignForm';

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

interface AdminPanelProps {
  onBackToStore: () => void;
  onDataChange: () => void;
}

export default function AdminPanel({ onBackToStore, onDataChange }: AdminPanelProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [activeTab, setActiveTab] = useState<'inventory' | 'design'>('inventory');
  const [products, setProducts] = useState<Product[]>([]);
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [isSavingSettings, setIsSavingSettings] = useState(false);

  // Check session storage for existing auth
  useEffect(() => {
    const auth = sessionStorage.getItem('cyna-admin-auth');
    if (auth === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggingIn(true);
    setPasswordError(false);

    const hash = await hashPassword(passwordInput);
    if (hash === ADMIN_PASSWORD_HASH) {
      setIsAuthenticated(true);
      sessionStorage.setItem('cyna-admin-auth', 'true');
      setPasswordInput('');
    } else {
      setPasswordError(true);
    }
    setIsLoggingIn(false);
  };

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
    fetchProducts();
    fetchSettings();
  }, [fetchProducts, fetchSettings]);

  // Login screen — shown after all hooks
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#faf9f6] flex items-center justify-center px-4">
        <div className="w-full max-w-sm">
          <div className="bg-white rounded-xl border border-[#e5e5e5] shadow-sm p-8">
            <div className="flex flex-col items-center mb-8">
              <div className="w-14 h-14 bg-[#1a2b4c] rounded-full flex items-center justify-center mb-4">
                <Lock className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-xl font-bold text-[#1a2b4c]">Admin Access</h2>
              <p className="text-sm text-[#6b7280] mt-1">Enter password to continue</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={passwordInput}
                  onChange={(e) => { setPasswordInput(e.target.value); setPasswordError(false); }}
                  placeholder="Password"
                  className={`w-full px-4 py-3 border rounded-lg text-sm text-[#1a2b4c] placeholder:text-[#9ca3af] focus:outline-none focus:ring-2 focus:ring-[#1a2b4c]/20 focus:border-[#1a2b4c] transition-colors ${
                    passwordError ? 'border-red-400 bg-red-50' : 'border-[#e5e5e5]'
                  }`}
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9ca3af] hover:text-[#1a2b4c] transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {passwordError && (
                <p className="text-red-500 text-xs font-medium">Incorrect password. Try again.</p>
              )}

              <Button
                type="submit"
                className="w-full bg-[#1a2b4c] hover:bg-[#2d5a7b] text-white py-3"
                disabled={!passwordInput || isLoggingIn}
              >
                {isLoggingIn ? 'Verifying...' : 'Unlock'}
              </Button>
            </form>
          </div>

          <button
            onClick={onBackToStore}
            className="w-full text-center text-sm text-[#6b7280] hover:text-[#1a2b4c] mt-4 transition-colors"
          >
            ← Back to store
          </button>
        </div>
      </div>
    );
  }

  const handleProductSubmit = async (formData: FormData) => {
    setIsSubmitting(true);
    try {
      const isEditing = !!formData.get('id');
      const url = '/api/products';
      const method = isEditing ? 'PUT' : 'POST';

      const res = await fetch(url, { method, body: formData });

      if (!res.ok) {
        throw new Error('Failed to save product');
      }

      toast({
        title: isEditing ? 'Product Updated' : 'Product Created',
        description: isEditing
          ? 'The product has been updated successfully.'
          : 'A new product has been added to the inventory.',
      });

      setEditingProduct(null);
      fetchProducts();
      onDataChange();
    } catch (err) {
      console.error('Product save error:', err);
      toast({
        title: 'Error',
        description: 'Failed to save product. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;

    setIsDeleting(id);
    try {
      const res = await fetch(`/api/products?id=${id}`, { method: 'DELETE' });

      if (!res.ok) {
        throw new Error('Failed to delete product');
      }

      toast({
        title: 'Product Deleted',
        description: 'The product has been removed from the inventory.',
      });

      fetchProducts();
      onDataChange();
    } catch (err) {
      console.error('Delete error:', err);
      toast({
        title: 'Error',
        description: 'Failed to delete product. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsDeleting(null);
    }
  };

  const handleSettingsSave = async (formData: FormData) => {
    setIsSavingSettings(true);
    try {
      const res = await fetch('/api/settings', { method: 'PUT', body: formData });

      if (!res.ok) {
        throw new Error('Failed to save settings');
      }

      const updatedSettings = await res.json();
      setSettings(updatedSettings);

      toast({
        title: 'Settings Saved',
        description: 'Website design settings have been updated successfully.',
      });

      onDataChange();
    } catch (err) {
      console.error('Settings save error:', err);
      toast({
        title: 'Error',
        description: 'Failed to save settings. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSavingSettings(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f9fa] flex">
      {/* Sidebar */}
      <aside className="w-56 bg-white border-r border-[#e5e5e5] flex flex-col shrink-0 hidden sm:flex">
        <div className="p-5 border-b border-[#e5e5e5]">
          <h2 className="text-lg font-bold text-[#1a2b4c] tracking-wide">Admin</h2>
          <p className="text-xs text-[#6b7280] mt-0.5">Dashboard</p>
        </div>

        <nav className="flex-1 p-3 space-y-1">
          <button
            onClick={() => setActiveTab('inventory')}
            className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'inventory'
                ? 'bg-[#1a2b4c] text-white'
                : 'text-[#1a2b4c] hover:bg-[#f0efec]'
            }`}
          >
            <Package className="w-4 h-4" />
            Manage Inventory
          </button>
          <button
            onClick={() => setActiveTab('design')}
            className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'design'
                ? 'bg-[#1a2b4c] text-white'
                : 'text-[#1a2b4c] hover:bg-[#f0efec]'
            }`}
          >
            <Palette className="w-4 h-4" />
            Website Design
          </button>
        </nav>

        <div className="p-3 border-t border-[#e5e5e5]">
          <Button
            variant="outline"
            className="w-full justify-start gap-2"
            onClick={onBackToStore}
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Store
          </Button>
        </div>
      </aside>

      {/* Mobile header */}
      <div className="sm:hidden fixed top-0 left-0 right-0 z-40 bg-white border-b border-[#e5e5e5] px-4 py-3 flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold text-[#1a2b4c]">Admin</h2>
        </div>
        <Button variant="outline" size="sm" onClick={onBackToStore} className="gap-1">
          <ArrowLeft className="w-3 h-3" />
          Store
        </Button>
      </div>

      {/* Mobile tab bar */}
      <div className="sm:hidden fixed top-[49px] left-0 right-0 z-40 bg-white border-b border-[#e5e5e5] flex">
        <button
          onClick={() => setActiveTab('inventory')}
          className={`flex-1 py-3 text-center text-xs font-medium transition-colors ${
            activeTab === 'inventory'
              ? 'text-[#1a2b4c] border-b-2 border-[#1a2b4c]'
              : 'text-[#6b7280]'
          }`}
        >
          <Package className="w-4 h-4 mx-auto mb-1" />
          Inventory
        </button>
        <button
          onClick={() => setActiveTab('design')}
          className={`flex-1 py-3 text-center text-xs font-medium transition-colors ${
            activeTab === 'design'
              ? 'text-[#1a2b4c] border-b-2 border-[#1a2b4c]'
              : 'text-[#6b7280]'
          }`}
        >
          <Palette className="w-4 h-4 mx-auto mb-1" />
          Design
        </button>
      </div>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <div className="sm:hidden h-[104px]" /> {/* Spacer for mobile fixed headers */}
        <div className="max-w-5xl mx-auto p-4 sm:p-8">
          {activeTab === 'inventory' && (
            <div className="space-y-8">
              {/* Product Form */}
              <div className="bg-white rounded-lg border border-[#e5e5e5] p-5 sm:p-6">
                <h3 className="text-lg font-semibold text-[#1a2b4c] mb-5">
                  {editingProduct ? 'Edit Product' : 'Add New Product'}
                </h3>
                <InventoryForm
                  product={editingProduct}
                  onSubmit={handleProductSubmit}
                  onCancel={() => setEditingProduct(null)}
                  isSubmitting={isSubmitting}
                />
              </div>

              {/* Products Table */}
              <div className="bg-white rounded-lg border border-[#e5e5e5] p-5 sm:p-6">
                <h3 className="text-lg font-semibold text-[#1a2b4c] mb-5">
                  Inventory ({products.length})
                </h3>
                <InventoryTable
                  products={products}
                  onEdit={(product) => setEditingProduct(product)}
                  onDelete={handleDeleteProduct}
                  isDeleting={isDeleting}
                />
              </div>
            </div>
          )}

          {activeTab === 'design' && (
            <div className="bg-white rounded-lg border border-[#e5e5e5] p-5 sm:p-6">
              <h3 className="text-lg font-semibold text-[#1a2b4c] mb-6">
                Website Design Settings
              </h3>
              <DesignForm
                settings={settings}
                onSave={handleSettingsSave}
                isSaving={isSavingSettings}
              />
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
