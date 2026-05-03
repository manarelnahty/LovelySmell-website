'use client';

import { motion, useScroll, useTransform } from 'motion/react';
import { ArrowUp } from 'lucide-react';
import { useLenis } from 'lenis/react';

export function BackToTop() {
  const { scrollYProgress } = useScroll();
  const opacity = useTransform(scrollYProgress, [0, 0.1], [0, 1]);
  const lenis = useLenis();

  return (
    <motion.button
      style={{ opacity }}
      onClick={() => lenis?.scrollTo(0, { duration: 2 })}
      className="fixed bottom-8 left-8 z-50 bg-[#C4A36E] text-white p-3 rounded-full shadow-lg hover:bg-[#A88A58] transition-colors"
      aria-label="العودة للأعلى"
    >
      <ArrowUp className="w-5 h-5" />
    </motion.button>
  );
}
