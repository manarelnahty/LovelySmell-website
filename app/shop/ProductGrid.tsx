import Image from 'next/image';
import { Plus, ArrowLeft } from 'lucide-react';

export function ProductGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-gutter mb-section-gap">
      {/* Row 1: Featured (2x2) */}
      <div className="md:col-span-2 md:row-span-2 bg-surface-container-lowest rounded overflow-hidden relative group shadow-sm hover:shadow-md transition-shadow">
        <div className="relative w-full h-full aspect-square md:aspect-auto">
          <Image 
            src="/images/featured_perfume.png" 
            alt="luxury perfume bottle with gold accents dramatically lit against a dark velvet background" 
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover" 
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent"></div>
        <div className="absolute top-6 right-6 bg-surface-container-lowest/90 backdrop-blur px-4 py-1.5 rounded-full text-label-sm font-label-sm text-secondary">عطر حصري</div>
        <div className="absolute bottom-6 right-6 left-6 flex justify-between items-end">
          <div>
            <h3 className="font-headline-lg text-headline-lg text-on-secondary mb-2">ليالي الشرق</h3>
            <p className="font-body-md text-body-md text-on-secondary/80">مزيج ساحر من العود والورد الطائفي</p>
          </div>
          <button aria-label="Add to cart" className="bg-primary-container text-on-primary rounded-full w-12 h-12 min-w-[48px] min-h-[48px] flex items-center justify-center hover:shadow-[0_0_15px_rgba(196,163,110,0.5)] transition-all">
            <Plus className="w-6 h-6" />
          </button>
        </div>
      </div>
      
      {/* Row 1: Standard Card 1 */}
      <div className="col-span-1 bg-surface-container-lowest rounded overflow-hidden relative group border border-outline-variant/30 flex flex-col">
        <div className="relative w-full aspect-[3/4] overflow-hidden bg-surface-variant/20 p-8 flex items-center justify-center">
          <Image 
            src="https://m.media-amazon.com/images/I/6184-db9cOL._AC_SX679_.jpg" 
            alt="minimalist crystal perfume bottle on white marble pedestal with soft natural light" 
            fill
            sizes="(max-width: 768px) 100vw, 25vw"
            className="object-contain group-hover:scale-105 transition-transform duration-700" 
          />
          <div className="absolute top-4 right-4 bg-surface-container-lowest/80 backdrop-blur border border-secondary/20 px-3 py-1 rounded-full text-label-sm font-label-sm text-secondary">صيفي</div>
        </div>
        <div className="p-4 flex justify-between items-end flex-grow bg-surface-container-lowest">
          <div>
            <h3 className="font-body-lg text-body-lg text-on-background mb-1">نسيم البحر</h3>
            <p className="font-body-md text-body-md text-on-surface-variant">٣٥٠ ج.م</p>
          </div>
          <button aria-label="Add to cart" className="border border-secondary text-secondary rounded-full w-11 h-11 min-h-[44px] min-w-[44px] flex items-center justify-center hover:bg-secondary/5 transition-colors">
            <Plus className="w-5 h-5" />
          </button>
        </div>
      </div>
      
      {/* Row 1: Editorial Cell */}
      <div className="col-span-1 bg-surface-variant rounded flex items-center justify-center p-8 text-center relative overflow-hidden group">
        <Image src="/images/cover_authentic.png" alt="authentic perfumery background" fill className="object-cover opacity-40 group-hover:scale-105 transition-transform duration-700" />
        <div className="absolute inset-0 opacity-10 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4IiBoZWlnaHQ9IjgiPgo8cmVjdCB3aWR0aD0iOCIgaGVpZ2h0PSI4IiBmaWxsPSIjZmZmIj48L3JlY3Q+CjxwYXRoIGQ9Ik0wIDBMOCA4Wk04IDBMMCA4WiIgc3Ryb2tlPSIjMDAwIiBzdHJva2Utd2lkdGg9IjEiPjwvcGF0aD4KPC9zdmc+')] bg-cover bg-center" style={{opacity: 0.2}}></div>
        <h3 className="font-headline-md text-headline-md text-secondary leading-tight relative z-10 drop-shadow-md">
            فن<br/>العطارة<br/>الأصيلة
        </h3>
      </div>
      
      {/* Row 2: Standard Card 2 */}
      <div className="col-span-1 bg-surface-container-lowest rounded overflow-hidden relative group border border-outline-variant/30 flex flex-col">
        <div className="relative w-full aspect-[3/4] overflow-hidden bg-surface-variant/20 p-8 flex items-center justify-center">
          <Image 
            src="https://m.media-amazon.com/images/I/61w18c-7qSL._AC_SX679_.jpg" 
            alt="elegant amber glass perfume bottle on dried flowers with warm evening light" 
            fill
            sizes="(max-width: 768px) 100vw, 25vw"
            className="object-contain group-hover:scale-105 transition-transform duration-700" 
          />
          <div className="absolute top-4 right-4 bg-surface-container-lowest/80 backdrop-blur border border-secondary/20 px-3 py-1 rounded-full text-label-sm font-label-sm text-secondary">شرقي</div>
        </div>
        <div className="p-4 flex justify-between items-end flex-grow bg-surface-container-lowest">
          <div>
            <h3 className="font-body-lg text-body-lg text-on-background mb-1">عود ملكي</h3>
            <p className="font-body-md text-body-md text-on-surface-variant">٥٠٠ ج.م</p>
          </div>
          <button aria-label="Add to cart" className="border border-secondary text-secondary rounded-full w-11 h-11 min-w-[44px] min-h-[44px] flex items-center justify-center hover:bg-secondary/5 transition-colors">
            <Plus className="w-5 h-5" />
          </button>
        </div>
      </div>
      
      {/* Row 2: Bento Month Perfume (Glassmorphism) */}
      <div className="col-span-1 glass-panel border border-secondary/30 rounded p-6 flex flex-col justify-between relative overflow-hidden group min-h-[300px]">
        <Image src="/images/cover_rose.png" alt="rose perfume background" fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
        <div className="absolute inset-0 bg-surface-container-lowest/85 backdrop-blur-[2px]"></div>
        <div className="absolute -right-10 -top-10 w-32 h-32 bg-secondary/10 rounded-full blur-2xl group-hover:bg-secondary/20 transition-colors duration-700"></div>
        <div className="relative z-10">
          <span className="inline-block px-3 py-1 bg-surface-container-lowest/50 backdrop-blur rounded-full font-label-sm text-label-sm text-on-surface-variant mb-4">عطر الشهر</span>
          <h3 className="font-headline-md text-headline-md text-on-background mb-2">روح الورد</h3>
          <p className="font-body-md text-body-md text-on-surface-variant/80">تجربة عطرية تنقلك إلى حقول الورد في الصباح الباكر.</p>
        </div>
        <div className="mt-8 flex justify-end relative z-10">
          <ArrowLeft className="text-secondary w-8 h-8 group-hover:-translate-x-2 transition-transform duration-300 rtl:group-hover:translate-x-2" />
        </div>
      </div>
    </div>
  );
}
