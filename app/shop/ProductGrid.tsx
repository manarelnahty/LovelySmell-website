"use client";
import Image from 'next/image';
import Link from 'next/link';
import { Plus, ArrowLeft } from 'lucide-react';
import { Product } from '@/lib/data/products';
import { ProductCard } from './ProductCard';
import { FeaturedProductCard } from './FeaturedProductCard';
import { useCart } from '@/lib/context/CartContext';
import { motion } from 'motion/react';

interface ProductGridProps {
  products: Product[];
}

export function ProductGrid({ products }: ProductGridProps) {
  const { addToCart } = useCart();

  if (products.length === 0) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center justify-center py-32 text-center border border-dashed border-outline-variant/50 rounded-2xl bg-surface-container-lowest/50"
      >
        <h2 className="font-headline-md text-headline-md text-on-background mb-4">لا توجد منتجات مطابقة</h2>
        <p className="font-body-md text-body-md text-on-surface-variant max-w-md">حاول تغيير خيارات البحث أو إزالة بعض عوامل التصفية לרؤية المزيد من العطور.</p>
      </motion.div>
    );
  }

  // Luxury "Flow Seamless Soft" variants
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { 
      opacity: 0, 
      y: 30,
      filter: 'blur(10px)',
      scale: 0.98
    },
    show: { 
      opacity: 1, 
      y: 0, 
      filter: 'blur(0px)',
      scale: 1,
      transition: { 
        duration: 0.8, 
        ease: [0.22, 1, 0.36, 1] as any // Fixed TS error for luxury easing
      } 
    }
  };

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 auto-rows-[minmax(320px,auto)] grid-flow-dense gap-4 md:gap-gutter mb-12 md:mb-section-gap"
    >
      {products.map((product, index) => {
        // Featured (2x2) Card
        if (product.isFeatured) {
          return (
            <FeaturedProductCard 
              key={product.id} 
              product={product} 
              index={index} 
              variants={itemVariants} 
              type="featured" 
            />
          );
        }

        // Editorial Card (2x1 Landscape)
        if (product.isEditorial) {
          return (
            <FeaturedProductCard 
              key={product.id} 
              product={product} 
              index={index} 
              variants={itemVariants} 
              type="editorial" 
            />
          );
        }

        // Month Perfume (1x2 Portrait)
        if (product.isMonthPerfume) {
          return (
            <FeaturedProductCard 
              key={product.id} 
              product={product} 
              index={index} 
              variants={itemVariants} 
              type="month" 
            />
          );
        }

        // Standard Card (1x1)
        return (
          <ProductCard 
            key={product.id} 
            product={product} 
            index={index} 
            variants={itemVariants} 
          />
        );
      })}
    </motion.div>
  );
}
