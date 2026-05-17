'use client';

import { motion, useScroll, useTransform } from 'motion/react';

export function ShopHero() {
  const { scrollY } = useScroll();
  // Create a smooth parallax scrolling effect, mapping page scroll to subtle translation
  const heroParallaxY = useTransform(scrollY, [0, 500], [0, 100]);

  return (
    <div className="relative w-full h-[400px] md:h-[500px] overflow-hidden flex items-center justify-center">
      {/* Background Image with high-end parallax scrolling and extra buffer height */}
      <motion.div 
        className="absolute -top-16 -bottom-16 left-0 right-0 h-[calc(100%+128px)] bg-[#131110] z-0"
        style={{ y: heroParallaxY }}
      >
        <img
          src="https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?q=80&w=1800&auto=format&fit=crop" 
          alt="Editorial Perfume Banner" 
          className="w-full h-full object-cover opacity-50 mix-blend-luminosity scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#FAF9F6] via-black/15 to-black/45" />
      </motion.div>

      {/* Symmetrical Scent Editorial Content */}
      <div className="relative z-10 flex flex-col items-center justify-center text-center px-4 pt-16 space-y-4">
        <span className="text-[10px] md:text-xs uppercase tracking-[0.3em] text-white/80 font-bold">LOVELY SMELL CO.</span>
        <h1 className="font-light tracking-[0.05em] text-4xl md:text-6xl text-white font-tajawal drop-shadow-sm leading-tight">جميع العطور</h1>
        <div className="w-12 h-[1.5px] bg-white/40 my-2"></div>
        <p className="text-xs md:text-sm font-light text-white/90 max-w-lg leading-relaxed tracking-wide">
          اكتشف مجموعتنا الكاملة من العطور الفاخرة، المصممة بشغف لتعكس شخصيتك الفريدة.
        </p>
      </div>
    </div>
  );
}
