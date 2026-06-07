'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Package, Palette, Lock, Eye, EyeOff, ShoppingCart } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const ADMIN_PASSWORD_HASH = '6586bfcf940a660fdc9e2d6b01cbf028bf2714183f6c543c0006b02290d87b31'; // "anas@ouch.com2005"

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
import OrdersTable from './OrdersTable';

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
  heroEyebrow: string;
  heroDescription: string;
  promoBannerText: string;
  whatsappNumber: string;
  storeMode: string;
  comingSoonImageUrl: string;
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
  const [activeTab, setActiveTab] = useState<'inventory' | 'design' | 'orders'>('orders');
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
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <div className="w-full max-w-sm">
          <div className="bg-card rounded-xl border border-border shadow-sm p-8">
            <div className="flex flex-col items-center mb-8">
              <div className="w-14 h-14 bg-primary rounded-full flex items-center justify-center mb-4">
                <Lock className="w-6 h-6 text-primary-foreground" />
              </div>
              <h2 className="text-xl font-bold text-foreground">Admin Access</h2>
              <p className="text-sm text-muted-foreground mt-1">Enter password to continue</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={passwordInput}
                  onChange={(e) => { setPasswordInput(e.target.value); setPasswordError(false); }}
                  placeholder="Password"
                  className={`w-full px-4 py-3 border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors bg-background ${
                    passwordError ? 'border-destructive bg-destructive/10' : 'border-border'
                  }`}
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {passwordError && (
                <p className="text-destructive text-xs font-medium">Incorrect password. Try again.</p>
              )}

              <Button
                type="submit"
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-3"
                disabled={!passwordInput || isLoggingIn}
              >
                {isLoggingIn ? 'Verifying...' : 'Unlock'}
              </Button>
            </form>
          </div>

          <button
            onClick={onBackToStore}
            className="w-full text-center text-sm text-muted-foreground hover:text-foreground mt-4 transition-colors"
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
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside className="w-56 bg-card border-r border-border flex flex-col shrink-0 hidden sm:flex">
        <div className="p-5 border-b border-border">
          <h2 className="text-lg font-bold text-foreground tracking-wide">Admin</h2>
          <p className="text-xs text-muted-foreground mt-0.5">Dashboard</p>
        </div>

        <nav className="flex-1 p-3 space-y-1">
          <button
            onClick={() => setActiveTab('orders')}
            className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'orders'
                ? 'bg-primary text-primary-foreground'
                : 'text-foreground hover:bg-muted'
            }`}
          >
            <ShoppingCart className="w-4 h-4" />
            Manage Orders
          </button>
          <button
            onClick={() => setActiveTab('inventory')}
            className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'inventory'
                ? 'bg-primary text-primary-foreground'
                : 'text-foreground hover:bg-muted'
            }`}
          >
            <Package className="w-4 h-4" />
            Manage Inventory
          </button>
          <button
            onClick={() => setActiveTab('design')}
            className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'design'
                ? 'bg-primary text-primary-foreground'
                : 'text-foreground hover:bg-muted'
            }`}
          >
            <Palette className="w-4 h-4" />
            Website Design
          </button>
        </nav>

        <div className="p-3 border-t border-border">
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
      <div className="sm:hidden fixed top-0 left-0 right-0 z-40 bg-card border-b border-border px-4 py-3 flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold text-foreground">Admin</h2>
        </div>
        <Button variant="outline" size="sm" onClick={onBackToStore} className="gap-1">
          <ArrowLeft className="w-3 h-3" />
          Store
        </Button>
      </div>

      {/* Mobile tab bar */}
      <div className="sm:hidden fixed top-[49px] left-0 right-0 z-40 bg-card border-b border-border flex">
        <button
            onClick={() => setActiveTab('orders')}
            className={`flex-1 py-3 text-center text-xs font-medium transition-colors ${
              activeTab === 'orders'
                ? 'text-primary border-b-2 border-primary'
                : 'text-muted-foreground'
            }`}
          >
            <ShoppingCart className="w-4 h-4 mx-auto mb-1" />
            Orders
          </button>
        <button
            onClick={() => setActiveTab('inventory')}
            className={`flex-1 py-3 text-center text-xs font-medium transition-colors ${
              activeTab === 'inventory'
                ? 'text-primary border-b-2 border-primary'
                : 'text-muted-foreground'
            }`}
          >
            <Package className="w-4 h-4 mx-auto mb-1" />
            Inventory
          </button>
          <button
            onClick={() => setActiveTab('design')}
            className={`flex-1 py-3 text-center text-xs font-medium transition-colors ${
              activeTab === 'design'
                ? 'text-primary border-b-2 border-primary'
                : 'text-muted-foreground'
            }`}
          >
            <Palette className="w-4 h-4 mx-auto mb-1" />
            Design
          </button>
      </div>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <div className="sm:hidden h-[104px]" /> {/* Spacer for mobile fixed headers */}
        <div className="max-w-5xl mx-auto p-4 sm:p-8 space-y-6">
          {activeTab === 'orders' && (
            <div className="bg-card rounded-lg border border-border p-5 sm:p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-foreground mb-5">
                Manage Orders
              </h3>
              <OrdersTable />
            </div>
          )}

          {activeTab === 'inventory' && (
            <div className="space-y-8">
              {/* Product Form */}
              <div className="bg-card rounded-lg border border-border p-5 sm:p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-foreground mb-5">
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
              <div className="bg-card rounded-lg border border-border p-5 sm:p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-foreground mb-5">
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
            <div className="bg-card rounded-lg border border-border p-5 sm:p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-foreground mb-6">
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
