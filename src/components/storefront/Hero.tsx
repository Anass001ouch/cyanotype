'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

interface HeroProps {
  imageUrl: string;
  eyebrow?: string;
  headline: string;
  description?: string;
}

export default function Hero({ imageUrl, eyebrow = "HANDMADE IN MOROCCO", headline, description }: HeroProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <section className="relative w-full min-h-[75vh] md:min-h-[85vh] overflow-hidden flex items-center">
      {/* Layer 1: Background Image & Base */}
      {imageUrl ? (
        <img
          src={imageUrl}
          alt="Hero banner"
          className="absolute inset-0 w-full h-full object-cover object-[70%_center] md:object-center"
        />
      ) : (
        <div className="absolute inset-0 bg-[#061224]" />
      )}

      {/* Layer 2: Subtle gradient overlays to ensure text readability */}
      {/* 60% dark overlay on the left to support text, fading to transparent on the right */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#061224]/90 via-[#061224]/70 to-transparent w-full md:w-[70%]" />
      <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/40" />
      
      {/* Radial gradient exactly behind the text for a distinct focal point */}
      <div 
        className="absolute inset-0 z-[1]" 
        style={{ background: 'radial-gradient(circle at 30% 50%, rgba(0,0,0,0.4), transparent 60%)' }} 
      />

      {/* Layer 3: Tiny drifting particles (Subtle Motion) */}
      {mounted && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(15)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-white/40 rounded-full"
              initial={{
                x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1000),
                y: Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 800),
                opacity: Math.random() * 0.5 + 0.1,
              }}
              animate={{
                y: [null, Math.random() * -100 - 50],
                x: [null, Math.random() * 50 - 25],
                opacity: [null, Math.random() * 0.6 + 0.2, Math.random() * 0.5 + 0.1],
              }}
              transition={{
                duration: Math.random() * 10 + 15,
                repeat: Infinity,
                ease: "linear",
              }}
            />
          ))}
        </div>
      )}

      {/* Layer 4: Content */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-20">
        <motion.div
          className="max-w-xl"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          {/* Eyebrow Label */}
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="text-[11px] sm:text-xs font-semibold tracking-[0.2em] text-[#d4af37] uppercase mb-4 sm:mb-6"
          >
            {eyebrow}
          </motion.p>

          {/* Headline */}
          <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-serif text-white tracking-tight leading-[1.1] mb-6 relative z-10 drop-shadow-sm">
            {headline}
          </h2>

          {/* Description */}
          <p className="text-lg sm:text-xl text-white/80 font-light leading-relaxed max-w-lg mb-10 relative z-10">
            {description || "Each CYNA piece is created through the cyanotype process, where sunlight, chemistry, and craftsmanship combine to produce wearable works of art."}
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
            <button
              onClick={() => {
                document.getElementById('product-grid')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="group flex items-center justify-center bg-[#fdfcf0] text-[#061224] px-8 py-4 text-sm font-medium tracking-wide transition-all hover:bg-white"
            >
              SHOP COLLECTION
              <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
            </button>
            <button
              onClick={() => {
                document.getElementById('process-section')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="group flex items-center justify-center border border-white/30 text-white px-8 py-4 text-sm font-medium tracking-wide transition-all hover:bg-white/10"
            >
              LEARN THE PROCESS
              <ArrowRight className="w-4 h-4 ml-2 transition-transform opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0" />
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
