"use client";
import Image from 'next/image';
import Link from 'next/link';
import { Plus, ArrowLeft } from 'lucide-react';
import { Product } from '@/lib/data/products';
import { useCart } from '@/lib/context/CartContext';

interface ProductGridProps {
  products: Product[];
}

export function ProductGrid({ products }: ProductGridProps) {
  const { addToCart } = useCart();

  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-32 text-center border border-dashed border-outline-variant/50 rounded-2xl bg-surface-container-lowest/50">
        <h2 className="font-headline-md text-headline-md text-on-background mb-4">لا توجد منتجات مطابقة</h2>
        <p className="font-body-md text-body-md text-on-surface-variant max-w-md">حاول تغيير خيارات البحث أو إزالة بعض عوامل التصفية لرؤية المزيد من العطور.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 mb-24 font-alexandria">
      {products.map((product) => {
        // Featured (2x2) Card
        if (product.isFeatured) {
          return (
            <Link key={product.id} href={`/shop/${product.id}`} className="md:col-span-2 md:row-span-2 bg-white rounded-3xl overflow-hidden relative group shadow-sm hover:shadow-2xl transition-all duration-500 block border border-secondary/5">
              <div className="relative w-full h-full aspect-square md:aspect-auto min-h-[400px]">
                <Image 
                  src={product.image} 
                  alt={product.name} 
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-105" 
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-[#2C2C2C]/80 via-[#2C2C2C]/20 to-transparent"></div>
              <div className="absolute top-6 right-6 bg-white/90 backdrop-blur px-5 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest text-[#C4A36E]">عطر حصري</div>
              <div className="absolute bottom-8 right-8 left-8 flex justify-between items-end">
                <div className="text-right">
                  <h3 className="text-3xl md:text-5xl font-bold text-white mb-3">{product.name}</h3>
                  <p className="text-sm md:text-base text-white/80 max-w-sm line-clamp-2 font-light leading-relaxed">{product.description}</p>
                </div>
                <button 
                  aria-label="Add to cart" 
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    addToCart(product);
                  }}
                  className="bg-white text-[#2C2C2C] rounded-full w-14 h-14 flex items-center justify-center hover:bg-[#C4A36E] hover:text-white transition-all shadow-xl active:scale-90"
                >
                  <Plus className="w-7 h-7" />
                </button>
              </div>
            </Link>
          );
        }

        // Editorial Card
        if (product.isEditorial) {
           return (
              <Link key={product.id} href={`/shop/${product.id}`} className="col-span-1 md:col-span-2 lg:col-span-1 bg-[#FDF9F3] rounded-3xl flex items-center justify-center p-10 text-center relative overflow-hidden group hover:shadow-2xl transition-all duration-500 border border-secondary/10">
                <Image src={product.image} alt="authentic perfumery background" fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover opacity-20 group-hover:scale-110 transition-transform duration-1000" />
                <div className="absolute inset-0 opacity-5 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4IiBoZWlnaHQ9IjgiPgo8cmVjdCB3aWR0aD0iOCIgaGVpZ2h0PSI4IiBmaWxsPSIjZmZmIj48L3JlY3Q+CjxwYXRoIGQ9Ik0wIDBMOCA4Wk04IDBMMCA4WiIgc3Ryb2tlPSIjMDAwIiBzdHJva2Utd2lkdGg9IjEiPjwvcGF0aD4KPC9zdmc+')] bg-cover bg-center"></div>
                <h3 className="text-2xl md:text-3xl font-bold text-[#C4A36E] leading-tight relative z-10 tracking-tight">
                    {product.name.split(' ').map((word, i) => <span key={i}>{word}<br/></span>)}
                </h3>
              </Link>
           );
        }

        // Bento Month Perfume
        if (product.isMonthPerfume) {
           return (
              <Link key={product.id} href={`/shop/${product.id}`} className="col-span-1 sm:col-span-2 lg:col-span-1 bg-white rounded-3xl p-8 flex flex-col justify-between relative overflow-hidden group min-h-[350px] hover:shadow-2xl transition-all duration-500 border border-secondary/10">
                <Image src="/images/cover_rose.png" alt={product.name} fill sizes="(max-width: 768px) 100vw, 25vw" className="object-cover group-hover:scale-110 transition-transform duration-1000" />
                <div className="absolute inset-0 bg-white/90 backdrop-blur-[2px]"></div>
                <div className="relative z-10 text-right">
                  <span className="inline-block px-4 py-1.5 bg-[#C4A36E]/10 rounded-full text-[10px] font-bold tracking-widest text-[#C4A36E] mb-6 uppercase">عطر الشهر</span>
                  <h3 className="text-2xl font-bold text-[#2C2C2C] mb-3">{product.name}</h3>
                  <p className="text-sm text-on-surface-variant/80 line-clamp-3 font-light leading-relaxed">{product.description}</p>
                </div>
                <div className="mt-8 flex justify-end relative z-10">
                  <div className="w-12 h-12 rounded-full border border-secondary/20 flex items-center justify-center group-hover:bg-secondary group-hover:text-white transition-all duration-300">
                    <ArrowLeft className="w-6 h-6 group-hover:-translate-x-1 transition-transform duration-300 rtl:group-hover:translate-x-1" />
                  </div>
                </div>
              </Link>
           );
        }

        // Standard Card
        return (
          <Link key={product.id} href={`/shop/${product.id}`} className="col-span-1 bg-white rounded-3xl overflow-hidden relative group border border-secondary/5 flex flex-col hover:shadow-2xl transition-all duration-500 h-full">
            <div className="relative w-full aspect-[4/5] overflow-hidden bg-[#FDF9F3] p-10 flex items-center justify-center">
              <Image 
                src={product.image} 
                alt={product.name} 
                fill 
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                className="object-contain transition-transform duration-700 group-hover:scale-110" 
              />
              <div className="absolute top-4 right-4 bg-white/80 backdrop-blur px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-wider text-[#C4A36E]">
                {product.category[0]}
              </div>
            </div>
            <div className="p-6 flex justify-between items-end flex-grow bg-white">
              <div className="text-right">
                <h3 className="text-lg font-bold text-[#2C2C2C] mb-1">{product.name}</h3>
                <p className="text-sm text-[#C4A36E] font-medium tracking-tight" dir="ltr">{product.price} <span className="text-[10px] font-light">EGP</span></p>
              </div>
              <button 
                aria-label="Add to cart" 
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  addToCart(product);
                }}
                className="border border-secondary/20 text-[#2C2C2C] rounded-full w-12 h-12 flex items-center justify-center hover:bg-[#C4A36E] hover:text-white hover:border-[#C4A36E] transition-all active:scale-90 shadow-sm"
              >
                <Plus className="w-6 h-6" />
              </button>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
