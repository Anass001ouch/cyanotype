'use client';

import React from 'react';
import { Send } from 'lucide-react';

interface FooterProps {
  onAdminClick: () => void;
}

export default function Footer({ onAdminClick }: FooterProps) {
  return (
    <footer className="bg-[#1a2b4c] text-white">
      {/* Newsletter */}
      <div className="border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 text-center">
          <h3 className="text-xl sm:text-2xl font-bold tracking-wide mb-2">
            Subscribe to our emails
          </h3>
          <p className="text-white/60 text-sm mb-6">
            Be the first to know about new collections and exclusive offers.
          </p>
          <form
            className="flex flex-col sm:flex-row items-center justify-center gap-3 max-w-md mx-auto"
            onSubmit={(e) => e.preventDefault()}
          >
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full sm:flex-1 px-4 py-3 bg-white/10 border border-white/20 rounded-md text-white placeholder:text-white/40 text-sm focus:outline-none focus:border-white/40 transition-colors"
            />
            <button
              type="submit"
              className="flex items-center justify-center gap-2 px-6 py-3 bg-white text-[#1a2b4c] rounded-md text-sm font-semibold hover:bg-white/90 transition-colors shrink-0"
            >
              <Send className="w-4 h-4" />
              Subscribe
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
              <li><a href="#" className="text-white/60 hover:text-white text-sm transition-colors">All</a></li>
              <li><a href="#" className="text-white/60 hover:text-white text-sm transition-colors">Tops</a></li>
              <li><a href="#" className="text-white/60 hover:text-white text-sm transition-colors">Bags</a></li>
            </ul>
          </div>

          {/* Help */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider mb-4">Help</h4>
            <ul className="space-y-2.5">
              <li><a href="#" className="text-white/60 hover:text-white text-sm transition-colors">Shipping</a></li>
              <li><a href="#" className="text-white/60 hover:text-white text-sm transition-colors">Cyanotype Care Guide</a></li>
              <li><a href="#" className="text-white/60 hover:text-white text-sm transition-colors">FAQ</a></li>
            </ul>
          </div>

          {/* About */}
          <div className="col-span-2 sm:col-span-1">
            <h4 className="text-sm font-semibold uppercase tracking-wider mb-4">About</h4>
            <ul className="space-y-2.5">
              <li><a href="#" className="text-white/60 hover:text-white text-sm transition-colors">Our Story</a></li>
              <li><a href="#" className="text-white/60 hover:text-white text-sm transition-colors">The Process</a></li>
              <li><a href="#" className="text-white/60 hover:text-white text-sm transition-colors">Contact</a></li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 text-white/40 text-xs tracking-wider">
            <span>VISA</span>
            <span>|</span>
            <span>MC</span>
            <span>|</span>
            <span>PAYPAL</span>
          </div>
          <p className="text-white/40 text-xs">
            &copy; {new Date().getFullYear()} CYNA. All rights reserved.
          </p>
          {/* Discreet Admin Access */}
          <button
            onClick={onAdminClick}
            className="text-white/20 hover:text-white/60 transition-colors text-xs cursor-pointer"
            aria-label="Admin panel"
          >
            ⚙
          </button>
        </div>
      </div>
    </footer>
  );
}
