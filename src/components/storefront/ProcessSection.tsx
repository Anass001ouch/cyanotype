'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Sun, Leaf, Camera, PaintBucket, Shirt } from 'lucide-react';

const steps = [
  { icon: Sun, label: "Light Becomes Image" },
  { icon: Camera, label: "Image Becomes Print" },
  { icon: PaintBucket, label: "Print Becomes Craft" },
  { icon: Shirt, label: "Craft Becomes Fashion" }
];

export default function ProcessSection() {
  return (
    <section id="process-section" className="py-24 bg-[#0a111a] text-white overflow-hidden relative">
      {/* Subtle Background Pattern */}
      <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '40px 40px' }} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <p className="text-[11px] font-semibold tracking-[0.2em] text-[#d4af37] uppercase mb-4">The Ancient Craft</p>
          <h2 className="text-3xl md:text-5xl font-serif tracking-tight">Painted by the Sun</h2>
        </motion.div>

        <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-4 lg:gap-8">
          {steps.map((step, index) => (
            <React.Fragment key={step.label}>
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.15 }}
                className="flex flex-col items-center group"
              >
                <div className="w-20 h-20 rounded-full border border-white/20 flex items-center justify-center bg-white/5 transition-colors group-hover:bg-white/10 group-hover:border-[#d4af37]/50 mb-4">
                  <step.icon className="w-8 h-8 text-white/80 group-hover:text-[#d4af37] transition-colors" />
                </div>
                <span className="text-sm font-medium tracking-wide text-white/70 group-hover:text-white transition-colors">
                  {step.label}
                </span>
              </motion.div>

              {/* Connecting Line (hidden on mobile, visible on md+) */}
              {index < steps.length - 1 && (
                <motion.div 
                  initial={{ opacity: 0, width: 0 }}
                  whileInView={{ opacity: 0.3, width: "3rem" }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.15 + 0.1 }}
                  className="hidden md:block h-[1px] bg-white/50"
                />
              )}
              
              {/* Down Arrow (visible on mobile, hidden on md+) */}
              {index < steps.length - 1 && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  whileInView={{ opacity: 0.3, height: "1.5rem" }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.15 + 0.1 }}
                  className="md:hidden w-[1px] bg-white/50 my-2"
                />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    </section>
  );
}
