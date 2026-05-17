'use client';

import Image from 'next/image';
import { Plus, ArrowDown, Check } from 'lucide-react';
import { useState } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { FadeUp, StaggerContainer, StaggerItem, AnimatedCounter } from '@/components/animated';
import { SectionDivider } from '@/components/section-divider';
import { Marquee } from '@/components/marquee';
import { TopNavBar } from '@/components/TopNavBar';
import { BackToTop } from '@/components/back-to-top';
import { SiteFooter } from '@/components/SiteFooter';
import { useCart } from '@/lib/context/CartContext';
import { Product } from '@/lib/data/products';
import { HomeProductCard } from './HomeProductCard';
import { ShoppingBag } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function HomeClient({ bestSellers }: { bestSellers: Product[] }) {
  const { scrollY } = useScroll();
  const { addToCart } = useCart();
  // Tracks which product id was just added (for brief feedback animation)
  const [addedId, setAddedId] = useState<string | null>(null);
  const router = useRouter();
  const heroParallaxY = useTransform(scrollY, [0, 600], [0, 150]);

  function handleAddToCart(product: Product, variation?: any) {
    const cartProduct = {
      ...product,
      id: variation ? `${product.id}-${variation.id}` : product.id,
      price: variation ? variation.price : product.price,
      selectedVolume: variation?.volume,
      variationId: variation?.id
    };
    addToCart(cartProduct as any);
    setAddedId(product.id);
    setTimeout(() => setAddedId(null), 1200);
  }

  function handleBuyNow(product: Product, variation?: any) {
    const cartProduct = {
      ...product,
      id: variation ? `${product.id}-${variation.id}` : product.id,
      price: variation ? variation.price : product.price,
      selectedVolume: variation?.volume,
      variationId: variation?.id
    };
    addToCart(cartProduct as any);
    router.push('/checkout');
  }

  // Find a specific featured product if needed, e.g. "oud-malaki"
  const oudMalaki = bestSellers.find(p => p.name.includes('عود ملكي')) || bestSellers[0];

  return (
    <main className="min-h-screen">
      <TopNavBar />

      {/* Hero Section */}
      <section className="relative h-[650px] md:h-[800px] w-full overflow-hidden">
        <motion.div className="absolute inset-0" style={{ y: heroParallaxY }}>
          <Image
            src="/hero-perfume.png"
            alt="Hero Perfume"
            fill
            sizes="100vw"
            className="object-cover object-center scale-105"
            priority
          />
          {/* Deep luxury vignettes to isolate central card and give perfect visual contrast */}
          <div className="absolute inset-0 bg-black/45 z-10" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/20 to-black/50 z-10" />
        </motion.div>

        <div className="absolute inset-0 shimmer-overlay pointer-events-none z-15" />

        <div className="absolute inset-0 flex items-center justify-center z-20">
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 1.2, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="bg-white/[0.12] backdrop-blur-[18px] border border-white/30 p-8 md:p-16 rounded-2xl max-w-xl text-center mx-4 shadow-[0_24px_50px_-12px_rgba(0,0,0,0.45)] relative overflow-hidden"
          >
            {/* Ambient luxury glow accents */}
            <div className="absolute -top-24 -left-24 w-48 h-48 bg-[#C4A36E]/10 rounded-full blur-[60px]" />
            <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-[#C4A36E]/10 rounded-full blur-[60px]" />
            
            <h1 className="text-3xl md:text-5xl font-bold text-white mb-6 leading-[1.3] font-tajawal tracking-wide drop-shadow-md">
              اكتشف عطرك
              <br />
              المثالي
            </h1>
            <p className="text-white/90 text-base md:text-lg mb-8 leading-[1.85] font-light max-w-md mx-auto">
              رحلة عطرية تأخذك إلى عوالم من الفخامة والجمال. حيث تلتقي الأصالة بالحداثة.
            </p>
            <button 
              onClick={() => router.push('/shop')}
              className="bg-[#C4A36E] text-white border border-[#C4A36E] px-12 py-3.5 rounded-none hover:bg-transparent hover:text-[#C4A36E] font-tajawal transition-all duration-300 font-bold tracking-wider hover:scale-105 active:scale-95 shadow-[0_12px_24px_-8px_rgba(196,163,110,0.5)] text-lg"
            >
              تسوق الآن
            </button>
          </motion.div>
        </div>

        {/* Premium animated vertical line scroll indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 text-white z-20 cursor-pointer"
          onClick={() => {
            window.scrollTo({
              top: window.innerHeight - 100,
              behavior: 'smooth'
            });
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          <span className="text-[10px] tracking-[0.2em] uppercase font-light text-white/95">اكتشف المزيد</span>
          <div className="w-[1px] h-12 bg-white/25 relative overflow-hidden">
            <motion.div 
              className="absolute top-0 left-0 right-0 bg-[#C4A36E] w-full"
              animate={{ 
                y: ['-100%', '100%'],
              }}
              transition={{ 
                duration: 2.2, 
                repeat: Infinity, 
                ease: 'easeInOut' 
              }}
              style={{ height: '40%' }}
            />
          </div>
        </motion.div>
      </section>

      {/* Quote & Featured Image */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-8 items-center">
          <div className="flex flex-col gap-4 md:gap-8 order-2 lg:order-1">
            <FadeUp>
              <div className="bg-[#F5F1EA] rounded-3xl p-6 md:p-10 flex flex-col justify-center min-h-[250px] md:min-h-[300px]">
                <span className="text-[#C4A36E] text-5xl md:text-6xl font-playfair leading-none mb-2">&ldquo;</span>
                <h2 className="text-3xl lg:text-4xl leading-snug font-medium text-[#2C2C2C]">
                  العطر هو المفتاح السري الذي يفتح أبواب الذاكرة&rdquo;
                </h2>
              </div>
            </FadeUp>

            <FadeUp delay={0.2}>
              <div className="bg-[#2C2C2C] rounded-3xl p-6 md:p-10 flex flex-col justify-center items-center text-center min-h-[150px] md:min-h-[200px]">
                <AnimatedCounter target={2000} suffix="+" className="text-[#C4A36E] text-4xl md:text-5xl font-bold mb-2" />
                <p className="text-gray-300">عميل سعيد</p>
              </div>
            </FadeUp>
          </div>

          <FadeUp delay={0.1} className="order-1 lg:order-2">
            <div className="relative h-[550px] rounded-3xl overflow-hidden group">
              <Image
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBSi_9ewOj7qniDE3p9JOp2jqNR-4gc1mjSzImdMwFxo4vToIusOZnzDB8OzWC_aJ5xoANdisqLzduRxcRJuYomKks7hCNuFdbypDtl_iaANZc9tXuRqz3MaFYE2FdqfQuPNFJspsxUcW6P8tM7oZQHP3nc7-WkGwHsZBYfCVM-HAuNSV7DxAqdr-y_VVZh2fle4tzTL9WsDZqaevZdmo2K6eI0dEtQSmdsujLvBcrSxGdZppc-CZU_rBTPDjYSTnURCLtT84t8"
                alt="Rare Ingredients"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/80 to-transparent" />
              <div className="absolute bottom-8 right-8">
                <h3 className="text-white text-3xl font-bold">مكونات نادرة</h3>
              </div>
            </div>
          </FadeUp>
        </div>
      </section>

      <SectionDivider />

      {/* Best Sellers Section */}
      <section className="bg-[#FDF9F3] py-12 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeUp>
            <div className="flex justify-between items-end mb-8 md:mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-[#2C2C2C]">الأكثر مبيعاً</h2>
              <a href="/shop" className="text-[#C4A36E] hover:text-[#A88A58] transition-colors relative after:content-[''] after:absolute after:bottom-[-2px] after:right-0 after:w-full after:h-[1px] after:bg-current">
                عرض الكل
              </a>
            </div>
          </FadeUp>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <StaggerContainer className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6 order-2 lg:order-1" staggerDelay={0.12}>
              {bestSellers.slice(0, 4).map((product) => {
                return (
                  <StaggerItem key={product.id}>
                    <HomeProductCard product={product} />
                  </StaggerItem>
                );
              })}
            </StaggerContainer>

            <FadeUp className="order-1 lg:order-2">
              <div className="relative bg-[#2C2C2C] rounded-3xl overflow-hidden group h-[600px] lg:h-full">
                {oudMalaki && (
                  <>
                    <Image
                      src={oudMalaki.image}
                      alt={oudMalaki.name}
                      fill
                      sizes="(max-width: 1024px) 100vw, 33vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-105 opacity-90"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
                    <div className="absolute inset-x-0 bottom-0 p-8 flex justify-between items-end text-white">
                      <div>
                        <h3 className="text-3xl font-bold mb-2">{oudMalaki.name}</h3>
                        <p className="text-gray-300 mb-4">{oudMalaki.description.slice(0, 50)}...</p>
                        
                        {/* Featured Variations */}
                        {oudMalaki.variations && oudMalaki.variations.length > 1 && (
                          <div className="flex gap-2 mb-4">
                            {oudMalaki.variations.map((v) => (
                              <button
                                key={v.id}
                                className="text-[10px] bg-white/10 hover:bg-white/30 border border-white/20 px-2 py-1 rounded"
                                onClick={() => handleAddToCart(oudMalaki, v)}
                              >
                                {v.volume}ml
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                      <div className="flex gap-3">
                        <button
                          onClick={() => handleBuyNow(oudMalaki, oudMalaki.variations?.[0])}
                          className="bg-[#C4A36E] text-white p-4 rounded-full shadow-lg hover:scale-105 transition-all"
                        >
                          <ShoppingBag className="w-6 h-6" />
                        </button>
                        <button
                          onClick={() => handleAddToCart(oudMalaki)}
                          aria-label={`أضف ${oudMalaki.name} إلى السلة`}
                          className={`backdrop-blur-md rounded-full p-4 transition-all duration-300 active:scale-90 ${
                            addedId === oudMalaki.id
                              ? 'bg-green-500 text-white scale-110'
                              : 'bg-white/20 hover:bg-white text-white hover:text-black'
                          }`}
                        >
                          {addedId === oudMalaki.id ? <Check className="w-6 h-6" /> : <Plus className="w-6 h-6" />}
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </FadeUp>
          </div>
        </div>
      </section>

      <Marquee text="LOVELY SMELL EG  ·  LUXURY FRAGRANCES  ·  SINCE 2024" />

      {/* Instagram / Gallery Section */}
      <section className="py-12 md:py-24 text-center">
        <FadeUp>
          <h2 className="text-3xl font-bold text-[#2C2C2C] mb-2 font-playfair tracking-wide">LovelySmellEG@</h2>
          <p className="text-[#6B6058] mb-10">شاركنا لحظاتك العطرية</p>
        </FadeUp>

        <StaggerContainer className="max-w-7xl mx-auto px-4 flex gap-4 overflow-x-auto pb-4 hide-scrollbar snap-x snap-mandatory" staggerDelay={0.08}>
          {[
            "https://lh3.googleusercontent.com/aida-public/AB6AXuCro8Rf7nKMNr1i6JzMF9ac2Yy9J47OuhFhSMy7PfOC93JlJjGT7FAagiZwSkzklAMuSIWvHDgwK8KdaXlV_TaOpUWpLJIR9DCGHennq2UtuaTUA4RjYINerXyk-j9aWOsH9afP29dOLysUYnWWBs_NFGs9djwR2ErTFoHKfMEibYNsObtP321PFMvzYqfnWiW3eAETmRf6yYfbtUHMV6TRYAPSF4Iq6FaQbHoaHKdagXzfLhhv59kMQgE0QKErkCBjstOrCb2_",
            "https://lh3.googleusercontent.com/aida-public/AB6AXuCueUgWfPx1GzHOn-CB0pqdb83o8b9-cNKLn0tVA8q5j0bIdnMyagHQpEEENOW9vvJNfiSb8i9aNnRLcIRC1YUd1tHPaqvYKHaiVAQYiZ0ZUnDB-wnF0l_an-W4Mh8LdvEpjAHxioHSMew91zjUaOaAWIaUrGxjgZY__O-oQerylsjxxQMtVP9OjZT6x3jKh1MPZsx_FYRJQIvDmaGCwA-N1bcQBrGHDsJn_cTFPjQVDm9mu77hyWQqbACNixTjg9ajuHIs5u_r",
            "https://lh3.googleusercontent.com/aida-public/AB6AXuB2NQSzW7ygOEbYU9WxzYwRyXJIqJLuR4Qt6cWfZEIe-IaANOlJKFjM8Ns6XAlcmPd-u6SZkQWqhYZFrR2hPaM9VOYsOUFrwrFtlKL4GPCmjua8LJGoMNBjekzDYbMM_OZchW3KJxX1DTqfkRaq6a3qZZUwH4NwJtUU0ZvU_TFJ8ZwCPBdniAnBfUccX0BF-LlGpfVsThaMaYBCD0ErQsEeA7CLVrOmbIcJCcbBywL1kWBaq9-6l-MRqZ56DvgIOIBsQ2dGke-f",
            "https://lh3.googleusercontent.com/aida-public/AB6AXuDBWkcAwU_Bnmnw14WUO0kjIQGzhDV1V2E2Z1Chwc2KU39y1Qm043s78ByF2xjvtCE0dVJf1nf0wBVpRTs4wAA25kggdhQk60n6wGtRP6UUaV7mLpEMPAVrBF4XMTlY_FWD0nh3958FtaFsWIbt-qlFlb5opqkZYiIBsRWFD9i6eCrcSqUfrsMxa50tZYjdLgiKXzCux0BX0o4Kguorj-jOXfiUkZsFYEfZuWqzVH-4FyQ4-Q4eJYBfB2XzzGJqkQCGFTCxc3HG",
            "https://lh3.googleusercontent.com/aida-public/AB6AXuCGO1FyocqkBHUF3gqsQnSjVTcHu0AGBKEX9XL-Fs7x9zdbNwi3wHwuE9kZ-uGgte6YQnbQx_Dm6ZGMmFgNGI5c4TO2wiaKur6rwxapIp4hxOTB84BCk3NRXdPerTNAF6EMHZxjcpgkTZj_3SPhOKOHGA7u3VThdbxRBe6l0hRGpyXBxwJedKhQX68D_tze7ow4P5FDDSRJVP7uDX6eSRwUzNrduA2UI8xRX-bTR7oICz-Q8j26JKRoXG65fwSSXkW5G0yvogQq"
          ].map((src, i) => (
            <StaggerItem key={i} className="min-w-[200px] md:min-w-[240px] flex-shrink-0 snap-center">
              <div className="relative aspect-square rounded-2xl overflow-hidden group">
                <Image
                  src={src}
                  alt={`Instagram highlight ${i + 1}`}
                  fill
                  sizes="(max-width: 768px) 240px, 200px"
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                  referrerPolicy="no-referrer"
                />
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </section>

      <SiteFooter />

      <BackToTop />
    </main>
  );
}
