'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface HeroProps {
  imageUrl: string;
  headline: string;
}

export default function Hero({ imageUrl, headline }: HeroProps) {
  return (
    <section className="relative w-full h-[50vh] sm:h-[60vh] md:h-[70vh] overflow-hidden">
      {/* Background Image */}
      {imageUrl ? (
        <img
          src={imageUrl}
          alt="Hero banner"
          className="absolute inset-0 w-full h-full object-cover"
        />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-[#1a2b4c] to-[#2d5a7b]" />
      )}

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

      {/* Content */}
      <div className="relative z-10 flex items-end h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 sm:pb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white tracking-tight leading-tight">
            {headline}
          </h2>
          <p className="mt-3 text-white/70 text-sm sm:text-base max-w-lg">
            Handcrafted using the ancient cyanotype process — where UV light, chemistry, and nature create wearable art.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
