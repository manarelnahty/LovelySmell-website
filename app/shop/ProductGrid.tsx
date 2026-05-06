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
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-gutter mb-section-gap">
      {products.map((product) => {
        // Featured (2x2) Card
        if (product.isFeatured) {
          return (
            <Link key={product.id} href={`/shop/${product.id}`} className="md:col-span-2 md:row-span-2 bg-surface-container-lowest rounded overflow-hidden relative group shadow-sm hover:shadow-md transition-shadow block">
              <div className="relative w-full h-full aspect-square md:aspect-auto">
                <Image 
                  src={product.image} 
                  alt={product.name} 
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover" 
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent"></div>
              <div className="absolute top-6 right-6 bg-surface-container-lowest/90 backdrop-blur px-4 py-1.5 rounded-full text-label-sm font-label-sm text-secondary">عطر حصري</div>
              <div className="absolute bottom-6 right-6 left-6 flex justify-between items-end">
                <div>
                  <h3 className="font-headline-lg text-headline-lg text-on-secondary mb-2">{product.name}</h3>
                  <p className="font-body-md text-body-md text-on-secondary/80 max-w-sm line-clamp-2">{product.description}</p>
                </div>
                <button 
                  aria-label="Add to cart" 
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    addToCart(product);
                  }}
                  className="bg-primary-container text-on-primary rounded-full w-12 h-12 min-w-[48px] min-h-[48px] flex items-center justify-center hover:shadow-[0_0_15px_rgba(196,163,110,0.5)] transition-all flex-shrink-0"
                >
                  <Plus className="w-6 h-6" />
                </button>
              </div>
            </Link>
          );
        }

        // Editorial Card
        if (product.isEditorial) {
           return (
              <Link key={product.id} href={`/shop/${product.id}`} className="col-span-1 md:col-span-2 lg:col-span-1 bg-surface-variant rounded flex items-center justify-center p-8 text-center relative overflow-hidden group hover:shadow-lg transition-shadow">
                <Image src={product.image} alt="authentic perfumery background" fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover opacity-40 group-hover:scale-105 transition-transform duration-700" />
                <div className="absolute inset-0 opacity-10 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4IiBoZWlnaHQ9IjgiPgo8cmVjdCB3aWR0aD0iOCIgaGVpZ2h0PSI4IiBmaWxsPSIjZmZmIj48L3JlY3Q+CjxwYXRoIGQ9Ik0wIDBMOCA4Wk04IDBMMCA4WiIgc3Ryb2tlPSIjMDAwIiBzdHJva2Utd2lkdGg9IjEiPjwvcGF0aD4KPC9zdmc+')] bg-cover bg-center" style={{opacity: 0.2}}></div>
                <h3 className="font-headline-md text-headline-md text-secondary leading-tight relative z-10 drop-shadow-md">
                    {product.name.split(' ').map((word, i) => <span key={i}>{word}<br/></span>)}
                </h3>
              </Link>
           );
        }

        // Bento Month Perfume
        if (product.isMonthPerfume) {
           return (
              <Link key={product.id} href={`/shop/${product.id}`} className="col-span-1 sm:col-span-2 md:col-span-3 lg:col-span-1 glass-panel border border-secondary/30 rounded p-6 flex flex-col justify-between relative overflow-hidden group min-h-[300px] hover:shadow-lg transition-shadow">
                <Image src="/images/cover_rose.png" alt={product.name} fill sizes="(max-width: 768px) 100vw, 25vw" className="object-cover group-hover:scale-105 transition-transform duration-700" />
                <div className="absolute inset-0 bg-surface-container-lowest/85 backdrop-blur-[2px]"></div>
                <div className="absolute -right-10 -top-10 w-32 h-32 bg-secondary/10 rounded-full blur-2xl group-hover:bg-secondary/20 transition-colors duration-700"></div>
                <div className="relative z-10">
                  <span className="inline-block px-3 py-1 bg-surface-container-lowest/50 backdrop-blur rounded-full font-label-sm text-label-sm text-on-surface-variant mb-4">عطر الشهر</span>
                  <h3 className="font-headline-md text-headline-md text-on-background mb-2">{product.name}</h3>
                  <p className="font-body-md text-body-md text-on-surface-variant/80 line-clamp-2">{product.description}</p>
                </div>
                <div className="mt-8 flex justify-end relative z-10">
                  <ArrowLeft className="text-secondary w-8 h-8 group-hover:-translate-x-2 transition-transform duration-300 rtl:group-hover:translate-x-2" />
                </div>
              </Link>
           );
        }

        // Standard Card
        return (
          <Link key={product.id} href={`/shop/${product.id}`} className="col-span-1 bg-surface-container-lowest rounded overflow-hidden relative group border border-outline-variant/30 flex flex-col hover:shadow-md transition-shadow">
            <div className="relative w-full aspect-[3/4] overflow-hidden bg-surface-variant/20 p-8 flex items-center justify-center">
              <Image 
                src={product.image} 
                alt={product.name} 
                fill
                sizes="(max-width: 768px) 100vw, 25vw"
                className="object-contain group-hover:scale-105 transition-transform duration-700" 
              />
              <div className="absolute top-4 right-4 bg-surface-container-lowest/80 backdrop-blur border border-secondary/20 px-3 py-1 rounded-full text-label-sm font-label-sm text-secondary">
                {product.category[0]}
              </div>
            </div>
            <div className="p-4 flex justify-between items-end flex-grow bg-surface-container-lowest">
              <div>
                <h3 className="font-body-lg text-body-lg text-on-background mb-1">{product.name}</h3>
                <p className="font-body-md text-body-md text-on-surface-variant font-sans">{product.price} ج.م</p>
              </div>
              <button 
                aria-label="Add to cart" 
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  addToCart(product);
                }}
                className="border border-secondary text-secondary rounded-full w-11 h-11 min-h-[44px] min-w-[44px] flex items-center justify-center hover:bg-secondary/5 transition-colors"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
