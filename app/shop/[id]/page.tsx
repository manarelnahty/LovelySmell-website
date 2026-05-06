import Image from 'next/image';
import Link from 'next/link';
import { ShoppingCart, Images, Sun, Heart, TreePine, MessageCircle } from 'lucide-react';
import { TopNavBar } from '@/components/TopNavBar';
import { Logo } from '@/components/logo';
import { AddToCartButton } from '@/components/AddToCartButton';
import { mockProducts } from '@/lib/data/products';
import { notFound } from 'next/navigation';

export default async function ProductDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const productId = resolvedParams.id;
  
  const product = mockProducts.find(p => p.id === productId);

  if (!product) {
    notFound();
  }
  
  return (
    <div className="font-body-md text-on-surface antialiased overflow-x-hidden min-h-screen flex flex-col bg-background dir-rtl">
      <TopNavBar />
      
      <main className="flex-grow pt-[120px] pb-section-gap px-4 md:px-margin w-full max-w-container-max mx-auto space-y-section-gap">
        {/* Breadcrumbs */}
        <nav className="flex text-on-tertiary-container font-label-sm text-label-sm gap-2 mt-8 flex-wrap items-center">
          <Link className="hover:text-secondary transition-colors" href="/">الرئيسية</Link>
          <span className="text-xs">/</span>
          <Link className="hover:text-secondary transition-colors" href="/shop">تسوق</Link>
          <span className="text-xs">/</span>
          <span className="hover:text-secondary transition-colors cursor-pointer">{product.category[0]}</span>
          <span className="text-xs">/</span>
          <span className="text-secondary font-medium">{product.name}</span>
        </nav>

        {/* Product Hero */}
        <section className="grid grid-cols-1 md:grid-cols-12 gap-gutter mt-stack-lg items-start">
          {/* Image */}
          <div className="col-span-1 md:col-span-7 relative rounded-lg overflow-hidden h-[400px] md:h-[600px] bg-surface-container group">
            <Image 
              src={product.image} 
              alt={product.name} 
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105" 
              priority
            />
            <button className="absolute bottom-6 right-6 glass-panel px-6 py-3 rounded-full flex items-center gap-2 text-on-surface font-label-sm text-label-sm hover:bg-white/40 transition-colors z-10 backdrop-blur-md">
              <Images className="w-5 h-5 text-secondary" strokeWidth={1.5} />
              عرض الصور
            </button>
          </div>
          
          {/* Details */}
          <div className="col-span-1 md:col-span-5 flex flex-col pt-stack-md">
            <div className="inline-flex items-center px-4 py-1 rounded-full border border-secondary/40 text-on-surface-variant font-label-sm text-label-sm w-max mb-stack-md">
                {product.category[0]}
            </div>
            <h1 className="font-headline-lg text-headline-lg text-on-surface mb-stack-sm">{product.name}</h1>
            <p className="font-headline-md text-headline-md text-secondary mb-stack-lg">{product.price} ج.م</p>
            <p className="font-body-md text-body-md text-on-surface-variant mb-stack-lg leading-relaxed">
                {product.description}
            </p>
            
            {/* Size Selector */}
            <div className="mb-stack-lg">
              <span className="block font-label-sm text-label-sm text-on-surface-variant mb-stack-sm">الحجم</span>
              <div className="flex gap-4">
                <button className="px-8 py-3 rounded-full bg-primary-container text-[#C4A36E] font-label-sm text-label-sm shadow-[0_0_15px_rgba(196,163,110,0.1)] transition-all hover:scale-105">
                    50ml
                </button>
                <button className="px-8 py-3 rounded-full bg-transparent border-[1.5px] border-[#C4A36E] text-on-surface font-label-sm text-label-sm hover:bg-[#C4A36E]/5 transition-colors">
                    100ml
                </button>
              </div>
            </div>
            
            {/* Add to Cart */}
            <AddToCartButton product={product} />
          </div>
        </section>

        {/* Scent Pyramid Bento Grid */}
        <section className="mt-section-gap">
          <h2 className="font-headline-md text-headline-md text-on-surface text-center mb-stack-lg">الهرم العطري</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
            {/* Top Notes */}
            <div className="glass-panel p-8 rounded-lg flex flex-col items-center text-center shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 border border-secondary/20">
              <Sun className="text-secondary w-10 h-10 mb-stack-md" strokeWidth={1.5} />
              <h3 className="font-body-lg text-body-lg text-on-surface mb-stack-sm font-bold">القمة</h3>
              <p className="font-body-md text-body-md text-on-surface-variant">برغموت، زعفران، هيل</p>
            </div>
            
            {/* Heart Notes */}
            <div className="glass-panel p-8 rounded-lg flex flex-col items-center text-center shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 border border-secondary/20">
              <Heart className="text-secondary w-10 h-10 mb-stack-md" strokeWidth={1.5} />
              <h3 className="font-body-lg text-body-lg text-on-surface mb-stack-sm font-bold">القلب</h3>
              <p className="font-body-md text-body-md text-on-surface-variant">ورد طائفي، ياسمين، باتشولي</p>
            </div>
            
            {/* Base Notes */}
            <div className="glass-panel p-8 rounded-lg flex flex-col items-center text-center shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 border border-secondary/20">
              <TreePine className="text-secondary w-10 h-10 mb-stack-md" strokeWidth={1.5} />
              <h3 className="font-body-lg text-body-lg text-on-surface mb-stack-sm font-bold">القاعدة</h3>
              <p className="font-body-md text-body-md text-on-surface-variant">عود، عنبر، مسك أصيل</p>
            </div>
          </div>
        </section>

        {/* Editorial Break */}
        <section className="mt-section-gap relative rounded-xl overflow-hidden h-[500px]">
          <Image 
            src="/images/editorial_scent_story.png" 
            alt="High-end editorial background for luxury perfume brand" 
            fill
            className="object-cover" 
          />
          <div className="absolute inset-0 bg-gradient-to-l from-black/70 via-black/40 to-transparent"></div>
          <div className="absolute inset-y-0 right-0 w-full md:w-[60%] lg:w-1/2 p-8 md:p-margin flex items-center">
            <div className="glass-panel p-8 md:p-12 rounded-lg shadow-lg w-full backdrop-blur-md bg-white/10 border border-white/20">
              <h3 className="font-headline-md text-headline-md text-white mb-stack-md">قصة العطر</h3>
              <p className="font-body-md text-body-md text-white/90 leading-relaxed text-lg md:text-xl">
                  استلهمنا هذا العطر من ليالي الصحراء الدافئة، حيث يمتزج سكون الليل مع عبق التاريخ. صُنع بعناية فائقة ليكون توقيعك الشخصي الذي لا يُنسى، يحمل في طياته أسرار العطارة الشرقية العريقة.
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-[#F5F1EA] dark:bg-stone-950 w-full mt-auto pb-12 pt-20 border-t border-[#C4A36E]/20">
        <div className="flex flex-col items-center justify-center space-y-8 px-16 max-w-container-max mx-auto dir-rtl opacity-80 hover:opacity-100 transition-opacity">
          <div className="mb-2">
            <Logo />
          </div>
          <ul className="flex flex-wrap justify-center gap-8 font-sans text-xs tracking-wide leading-loose">
            <li><a className="text-[#6B6058] dark:text-stone-400 hover:text-[#2C2C2C] dark:hover:text-white underline-offset-4 underline transition-colors min-h-[44px] flex items-center" href="#">الخصوصية</a></li>
            <li><a className="text-[#6B6058] dark:text-stone-400 hover:text-[#2C2C2C] dark:hover:text-white underline-offset-4 underline transition-colors min-h-[44px] flex items-center" href="#">الشروط والأحكام</a></li>
            <li><a className="text-[#6B6058] dark:text-stone-400 hover:text-[#2C2C2C] dark:hover:text-white underline-offset-4 underline transition-colors min-h-[44px] flex items-center" href="#">سياسة الاسترجاع</a></li>
            <li><a className="text-[#6B6058] dark:text-stone-400 hover:text-[#2C2C2C] dark:hover:text-white underline-offset-4 underline transition-colors min-h-[44px] flex items-center" href="#">تواصل معنا</a></li>
          </ul>
          <p className="text-xs text-[#A09890] font-sans tracking-widest mt-8">
            © 2024 LOVELY SMELL EG. ARTISANAL FRAGRANCE HOUSE.
          </p>
        </div>
      </footer>

      {/* Floating WhatsApp Button */}
      <a
        aria-label="تواصل معنا عبر واتساب"
        className="fixed bottom-8 left-8 bg-[#25D366] text-white p-4 rounded-full shadow-[0_4px_20px_rgba(37,211,102,0.4)] z-50 hover:scale-110 hover:shadow-[0_8px_30px_rgba(37,211,102,0.5)] active:scale-95 transition-all duration-300 flex items-center justify-center min-w-[56px] min-h-[56px]"
        href="https://wa.me/201018580523"
        target="_blank"
        rel="noopener noreferrer"
      >
        <svg fill="currentColor" height="26" viewBox="0 0 16 16" width="26" xmlns="http://www.w3.org/2000/svg">
          <path d="M13.601 2.326A7.854 7.854 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.933 7.933 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.898 7.898 0 0 0 13.6 2.326zM7.994 14.521a6.573 6.573 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.557 6.557 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592zm3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.729.729 0 0 0-.529.247c-.182.198-.691.677-.691 1.654 0 .977.71 1.916.81 2.049.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232z"/>
        </svg>
      </a>
    </div>
  );
}
