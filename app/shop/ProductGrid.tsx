"use client";
import Image from 'next/image';
import Link from 'next/link';
import { Plus, ArrowLeft } from 'lucide-react';
import { Product } from '@/lib/data/products';
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
            <motion.div key={product.id} variants={itemVariants} className="sm:col-span-2 sm:row-span-2 group">
              <Link href={`/shop/${product.id}`} className="block h-full bg-surface-container-lowest rounded-2xl overflow-hidden relative shadow-sm hover:shadow-xl transition-all duration-500 border border-outline-variant/20">
                <div className="relative w-full h-full min-h-[400px]">
                  <Image 
                    src={product.image} 
                    alt={product.name} 
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-1000" 
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                  <div className="absolute top-6 right-6 bg-secondary/90 backdrop-blur px-4 py-1.5 rounded-full text-label-sm font-label-sm text-on-secondary shadow-lg">إصدار مميز</div>
                  
                  <div className="absolute bottom-0 left-0 right-0 p-8 flex justify-between items-end">
                    <div className="max-w-[70%]">
                      <h3 className="font-headline-lg text-headline-lg text-white mb-2 leading-tight">{product.name}</h3>
                      <p className="font-body-md text-body-md text-white/80 line-clamp-2 mb-2">{product.description}</p>
                      <span className="font-body-lg text-secondary-fixed text-xl font-sans">{product.price} ج.م</span>
                    </div>
                    <button 
                      aria-label="Add to cart" 
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        addToCart(product);
                      }}
                      className="bg-secondary text-on-secondary rounded-full w-14 h-14 flex items-center justify-center hover:scale-110 active:scale-95 transition-all shadow-lg"
                    >
                      <Plus className="w-7 h-7" />
                    </button>
                  </div>
                </div>
              </Link>
            </motion.div>
          );
        }

        // Editorial Card (2x1 Landscape)
        if (product.isEditorial) {
          return (
            <motion.div key={product.id} variants={itemVariants} className="sm:col-span-2 sm:row-span-1 group">
              <Link href={`/shop/${product.id}`} className="block h-full bg-surface-variant rounded-2xl flex items-center justify-center p-8 text-center relative overflow-hidden hover:shadow-lg transition-all duration-500 border border-secondary/10">
                <Image 
                  src={product.image} 
                  alt={product.name} 
                  fill 
                  sizes="(max-width: 768px) 100vw, 50vw" 
                  className="object-cover opacity-60 group-hover:scale-110 transition-transform duration-1000" 
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors"></div>
                <div className="relative z-10 p-6 glass-panel border border-white/20 rounded-xl">
                  <h3 className="font-headline-md text-headline-md text-on-surface leading-tight drop-shadow-sm mb-2">
                    {product.name}
                  </h3>
                  <div className="flex items-center justify-center gap-2 text-secondary font-medium">
                    <span>اكتشف التفاصيل</span>
                    <ArrowLeft className="w-4 h-4 rtl:rotate-180" />
                  </div>
                </div>
              </Link>
            </motion.div>
          );
        }

        // Month Perfume (1x2 Portrait)
        if (product.isMonthPerfume) {
          return (
            <motion.div key={product.id} variants={itemVariants} className="sm:col-span-1 sm:row-span-2 group">
              <Link href={`/shop/${product.id}`} className="block h-full glass-panel border border-secondary/30 rounded-2xl p-8 flex flex-col justify-between relative overflow-hidden hover:shadow-xl transition-all duration-500 min-h-[500px]">
                <Image 
                  src={product.image} 
                  alt={product.name} 
                  fill 
                  sizes="(max-width: 768px) 100vw, 25vw" 
                  className="object-cover opacity-90 group-hover:scale-110 transition-transform duration-1000" 
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-white/90"></div>
                
                <div className="relative z-10">
                  <span className="inline-block px-4 py-1.5 bg-secondary text-on-secondary rounded-full font-label-sm text-label-sm mb-6 shadow-md">عطر الشهر</span>
                  <h3 className="font-headline-md text-headline-md text-on-background mb-4 leading-tight">{product.name}</h3>
                  <p className="font-body-md text-body-md text-on-surface-variant/90 line-clamp-4">{product.description}</p>
                </div>
                
                <div className="relative z-10 mt-auto pt-8 flex justify-between items-center border-t border-secondary/10">
                  <span className="font-body-lg text-secondary font-bold font-sans">{product.price} ج.م</span>
                  <div className="bg-surface-container-lowest p-3 rounded-full shadow-sm group-hover:translate-x-[-8px] transition-transform duration-300">
                    <ArrowLeft className="text-secondary w-6 h-6 rtl:rotate-180" />
                  </div>
                </div>
              </Link>
            </motion.div>
          );
        }

        // Standard Card (1x1)
        return (
          <motion.div key={product.id} variants={itemVariants} className="col-span-1 group">
            <Link href={`/shop/${product.id}`} className="block h-full bg-surface-container-lowest rounded-2xl overflow-hidden relative border border-outline-variant/30 flex flex-col hover:shadow-lg transition-all duration-500">
              <div className="relative w-full aspect-square overflow-hidden bg-surface-variant/10 p-6 flex items-center justify-center">
                <Image 
                  src={product.image} 
                  alt={product.name} 
                  fill
                  sizes="(max-width: 768px) 100vw, 25vw"
                  className="object-contain p-4 group-hover:scale-110 transition-transform duration-700" 
                  priority={index < 4}
                />
                {product.category && product.category.length > 0 && (
                  <div className="absolute top-4 right-4 bg-white/80 backdrop-blur border border-outline-variant/20 px-3 py-1 rounded-full text-label-sm font-label-sm text-secondary shadow-sm">
                    {product.category[0]}
                  </div>
                )}
              </div>
              <div className="p-6 flex flex-col justify-between flex-grow bg-white">
                <div>
                  <h3 className="font-body-lg text-body-lg text-on-background mb-2 font-medium group-hover:text-secondary transition-colors">{product.name}</h3>
                  <p className="font-body-md text-body-md text-secondary font-sans font-bold">{product.price} ج.م</p>
                </div>
                <div className="mt-4 flex justify-end">
                  <button 
                    aria-label="Add to cart" 
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      addToCart(product);
                    }}
                    className="border-2 border-secondary text-secondary rounded-full w-10 h-10 flex items-center justify-center hover:bg-secondary hover:text-white transition-all active:scale-90"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </Link>
          </motion.div>
        );
      })}
    </motion.div>
  );
}
