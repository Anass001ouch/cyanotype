'use client';

import React, { useState } from 'react';
import { Search, User, ShoppingBag, Menu, X, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface HeaderProps {
  promoText: string;
  onAdminClick: () => void;
}

const navItems = [
  {
    label: 'Apparel',
    children: ['Tops', 'T-shirts'],
  },
  {
    label: 'Accessories',
    children: ['Bags', 'Bandanas'],
  },
  {
    label: 'Art & Craft',
    children: [],
  },
  {
    label: 'By Technique',
    children: ['Cyanotype', 'Reactive Dye', 'Discharge'],
  },
];

export default function Header({ promoText, onAdminClick }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  return (
    <header className="sticky top-0 z-50">
      {/* Promo Bar */}
      <div className="bg-[#1a2b4c] text-white text-center py-2 px-4">
        <p className="text-[11px] tracking-[0.15em] uppercase font-medium">{promoText}</p>
      </div>

      {/* Main Navbar */}
      <nav className="bg-white border-b border-[#e5e5e5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Left - Brand */}
            <div className="flex-shrink-0">
              <h1 className="text-xl sm:text-2xl font-bold tracking-[0.25em] text-[#1a2b4c]">
                CYANOTYPE
              </h1>
            </div>

            {/* Center - Navigation (desktop) */}
            <div className="hidden md:flex items-center gap-1">
              {navItems.map((item) => (
                <div
                  key={item.label}
                  className="relative"
                  onMouseEnter={() => item.children.length > 0 && setActiveDropdown(item.label)}
                  onMouseLeave={() => setActiveDropdown(null)}
                >
                  <button className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-[#1a2b4c] hover:text-[#2d5a7b] transition-colors">
                    {item.label}
                    {item.children.length > 0 && (
                      <ChevronDown className="w-3.5 h-3.5 opacity-60" />
                    )}
                  </button>

                  <AnimatePresence>
                    {activeDropdown === item.label && item.children.length > 0 && (
                      <motion.div
                        initial={{ opacity: 0, y: -4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -4 }}
                        transition={{ duration: 0.15 }}
                        className="absolute top-full left-0 bg-white border border-[#e5e5e5] rounded-md shadow-lg py-2 min-w-[180px]"
                      >
                        {item.children.map((child) => (
                          <a
                            key={child}
                            href="#"
                            className="block px-4 py-2 text-sm text-[#1a2b4c] hover:bg-[#faf9f6] hover:text-[#2d5a7b] transition-colors"
                          >
                            {child}
                          </a>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>

            {/* Right - Icons */}
            <div className="flex items-center gap-2">
              <button className="p-2 text-[#1a2b4c] hover:text-[#2d5a7b] transition-colors" aria-label="Search">
                <Search className="w-5 h-5" />
              </button>
              <button className="p-2 text-[#1a2b4c] hover:text-[#2d5a7b] transition-colors hidden sm:block" aria-label="Account">
                <User className="w-5 h-5" />
              </button>
              <button className="p-2 text-[#1a2b4c] hover:text-[#2d5a7b] transition-colors relative" aria-label="Shopping bag">
                <ShoppingBag className="w-5 h-5" />
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-[#2d5a7b] text-white text-[9px] rounded-full flex items-center justify-center font-medium">
                  0
                </span>
              </button>
              <button
                className="p-2 text-[#1a2b4c] hover:text-[#2d5a7b] transition-colors md:hidden"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="md:hidden overflow-hidden border-t border-[#e5e5e5]"
            >
              <div className="px-4 py-4 space-y-1">
                {navItems.map((item) => (
                  <div key={item.label}>
                    <button
                      className="flex items-center justify-between w-full px-3 py-2.5 text-sm font-medium text-[#1a2b4c] hover:text-[#2d5a7b]"
                      onClick={() =>
                        setActiveDropdown(activeDropdown === item.label ? null : item.label)
                      }
                    >
                      {item.label}
                      {item.children.length > 0 && (
                        <ChevronDown
                          className={`w-4 h-4 transition-transform ${
                            activeDropdown === item.label ? 'rotate-180' : ''
                          }`}
                        />
                      )}
                    </button>
                    <AnimatePresence>
                      {activeDropdown === item.label && item.children.length > 0 && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.15 }}
                          className="overflow-hidden"
                        >
                          <div className="pl-6 py-1">
                            {item.children.map((child) => (
                              <a
                                key={child}
                                href="#"
                                className="block px-3 py-2 text-sm text-[#6b7280] hover:text-[#2d5a7b]"
                              >
                                {child}
                              </a>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
                <div className="pt-2 border-t border-[#e5e5e5]">
                  <button className="flex items-center gap-2 px-3 py-2.5 text-sm text-[#1a2b4c]">
                    <User className="w-4 h-4" />
                    Account
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </header>
  );
}
