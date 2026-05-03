"use client";
import { motion } from 'motion/react';

export function Logo({ className = '', dark = false }: { className?: string, dark?: boolean }) {
  const primaryColor = dark ? 'text-white' : 'text-[#2C2C2C]';
  const accentColor = 'text-[#C4A36E]';

  return (
    <div className={`flex items-center gap-4 group cursor-pointer ${className}`}>
      <div className="relative flex items-center justify-center w-12 h-12">
        <motion.svg
          width="48"
          height="48"
          viewBox="0 0 40 40"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={accentColor}
          initial={{ rotate: 0 }}
          whileHover={{ rotate: 90 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
        >
          {/* Outer elegant diamond shape */}
          <path d="M20 2L38 20L20 38L2 20L20 2Z" stroke="currentColor" strokeWidth="1.5" />
          {/* Inner filled diamond */}
          <path d="M20 10L30 20L20 30L10 20L20 10Z" fill="currentColor" fillOpacity="0.15" stroke="currentColor" strokeWidth="1" />
          {/* Center minimal droplet / spark */}
          <circle cx="20" cy="20" r="3" fill="currentColor" />
        </motion.svg>
      </div>
      <div className="flex flex-col justify-center mt-1">
        <span className={`font-playfair text-2xl tracking-[0.25em] font-bold ${primaryColor} leading-none mb-1`}>
          LOVELY
        </span>
        <span className={`font-tajawal text-xs tracking-[0.35em] ${accentColor} leading-none uppercase font-bold`}>
          SMELL EG
        </span>
      </div>
    </div>
  );
}
