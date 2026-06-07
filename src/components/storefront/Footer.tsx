'use client';

import React, { useState } from 'react';
import { Send, Loader2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface FooterProps {
  onAdminClick: () => void;
  onNavigate?: (page: string) => void;
  onCategorySelect?: (category: string | null) => void;
}

export default function Footer({ onAdminClick, onNavigate, onCategorySelect }: FooterProps) {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      if (!res.ok) throw new Error('Failed to subscribe');

      setEmail('');
      toast({
        title: 'Subscribed Successfully!',
        description: 'You will be the first to know about new drops.',
      });
    } catch (err) {
      console.error(err);
      toast({
        title: 'Subscription Failed',
        description: 'There was an error saving your email. Please try again later.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <footer className="bg-card text-card-foreground border-t border-border">
      {/* Newsletter */}
      <div className="border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 text-center">
          <h3 className="text-xl sm:text-2xl font-bold tracking-wide mb-2">
            Subscribe to our emails
          </h3>
          <p className="text-muted-foreground text-sm mb-6">
            Be the first to know about new collections and exclusive offers.
          </p>
          <form
            className="flex flex-col sm:flex-row items-center justify-center gap-3 max-w-md mx-auto"
            onSubmit={handleSubscribe}
          >
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="w-full sm:flex-1 px-4 py-3 bg-background border border-input rounded-md text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:border-primary transition-colors"
            />
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-md text-sm font-semibold hover:bg-primary/90 transition-colors shrink-0 disabled:opacity-70"
            >
              {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              {isSubmitting ? 'Subscribing...' : 'Subscribe'}
            </button>
          </form>
        </div>
      </div>

      {/* Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-8">
          {/* Shop */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider mb-4">Shop</h4>
            <ul className="space-y-2.5">
              <li><button onClick={() => { onCategorySelect?.(null); onNavigate?.('storefront'); }} className="text-muted-foreground hover:text-foreground text-sm transition-colors bg-transparent border-none p-0 cursor-pointer">All</button></li>
              <li><button onClick={() => { onCategorySelect?.('Tops'); onNavigate?.('storefront'); }} className="text-muted-foreground hover:text-foreground text-sm transition-colors bg-transparent border-none p-0 cursor-pointer">Tops</button></li>
              <li><button onClick={() => { onCategorySelect?.('Bags'); onNavigate?.('storefront'); }} className="text-muted-foreground hover:text-foreground text-sm transition-colors bg-transparent border-none p-0 cursor-pointer">Bags</button></li>
            </ul>
          </div>

          {/* Help */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider mb-4">Help</h4>
            <ul className="space-y-2.5">
              <li><button onClick={() => onNavigate?.('help')} className="text-muted-foreground hover:text-foreground text-sm transition-colors bg-transparent border-none p-0 cursor-pointer">Shipping</button></li>
              <li><button onClick={() => onNavigate?.('help')} className="text-muted-foreground hover:text-foreground text-sm transition-colors bg-transparent border-none p-0 cursor-pointer">Cyanotype Care Guide</button></li>
              <li><button onClick={() => onNavigate?.('help')} className="text-muted-foreground hover:text-foreground text-sm transition-colors bg-transparent border-none p-0 cursor-pointer">FAQ</button></li>
            </ul>
          </div>

          {/* About */}
          <div className="col-span-2 sm:col-span-1">
            <h4 className="text-sm font-semibold uppercase tracking-wider mb-4">About</h4>
            <ul className="space-y-2.5">
              <li><button onClick={() => onNavigate?.('about')} className="text-muted-foreground hover:text-foreground text-sm transition-colors bg-transparent border-none p-0 cursor-pointer">Our Story</button></li>
              <li><button onClick={() => onNavigate?.('about')} className="text-muted-foreground hover:text-foreground text-sm transition-colors bg-transparent border-none p-0 cursor-pointer">The Process</button></li>
              <li><button onClick={() => onNavigate?.('about')} className="text-muted-foreground hover:text-foreground text-sm transition-colors bg-transparent border-none p-0 cursor-pointer">Contact</button></li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 text-muted-foreground text-xs tracking-wider">
            <span>COD ONLY</span>
            <span>|</span>
            <span>MOROCCO</span>
          </div>
          <p className="text-muted-foreground text-xs">
            &copy; {new Date().getFullYear()} CYNA. All rights reserved.
          </p>
          {/* Discreet Admin Access */}
          <button
            onClick={onAdminClick}
            className="text-muted-foreground hover:text-foreground transition-colors text-xs cursor-pointer"
            aria-label="Admin panel"
          >
            ⚙
          </button>
        </div>
      </div>
    </footer>
  );
}
