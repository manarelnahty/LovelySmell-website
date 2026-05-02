'use client';

import Image from 'next/image';
import { Search, User, ShoppingBag, Plus } from 'lucide-react';
import { useState } from 'react';

export default function Page() {
  const [isSignedIn, setIsSignedIn] = useState(false);

  return (
    <main className="min-h-screen">
      {/* Navbar */}
      <header className="sticky top-0 z-50 bg-[#FDF9F3]/80 backdrop-blur-md border-b border-[#F5F1EA]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Desktop Navigation */}
            <nav className="hidden md:flex gap-8 items-center">
              <a href="#" className="flex-shrink-0 text-[#C4A36E] font-medium transition-colors hover:text-[#2C2C2C]">الرئيسية</a>
              <a href="#" className="text-[#6B6058] font-medium transition-colors hover:text-[#2C2C2C]">المتجر</a>
              <a href="#" className="text-[#6B6058] font-medium transition-colors hover:text-[#2C2C2C]">المجموعات</a>
              <a href="#" className="text-[#6B6058] font-medium transition-colors hover:text-[#2C2C2C]">قصتنا</a>
              <a href="#" className="text-[#6B6058] font-medium transition-colors hover:text-[#2C2C2C]">تواصل معنا</a>
            </nav>

            {/* Logo */}
            <div className="flex-shrink-0 flex items-center justify-center">
              <span className="font-playfair text-2xl tracking-[0.2em] font-semibold text-[#2C2C2C]">
                LOVELY SMELL EG
              </span>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-4">
              <button className="text-[#6B6058] hover:text-[#C4A36E] transition-colors p-2">
                <Search className="w-5 h-5" />
              </button>
              <button 
                className="text-[#6B6058] font-medium hover:text-[#C4A36E] transition-colors p-2 flex items-center"
                onClick={() => setIsSignedIn(!isSignedIn)}
              >
                {isSignedIn ? <User className="w-5 h-5" /> : "تسجيل الدخول"}
              </button>
              <button className="text-[#C4A36E] hover:text-[#A88A58] transition-colors p-2 relative">
                <ShoppingBag className="w-5 h-5" />
                <span className="absolute top-0 right-0 bg-[#C4A36E] text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full">
                  0
                </span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative h-[600px] w-full overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <Image
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDJgmIwBlWzHtLh36o1_4nCGhUOHnke5lFbEXf9E_5CQgQF8hpbm4WM-YXLawkXiw4Z7qhtNYkC6vTacefwluK76EQGIyTd3SjxjI8us3IwvSSWONBhwBp76-xz3XHu7Qu3KA843PXUA8dmhYu2A4uiMNRf995NsqIylZibyLQAYX34PvVqO7fSfmGk99RSNbja19_aB7oNuD9wBml4tHcCRi0wuCeD1gmzZwi0dQXZOAOeXyWKAawJ9RhxayY_ndBtNBzOIq01"
            alt="Hero Perfume"
            fill
            className="object-cover object-center"
            priority
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
        </div>

        {/* Hero Content */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="bg-white/40 backdrop-blur-xl border border-white/20 p-10 md:p-14 rounded-3xl max-w-xl text-center mx-4 shadow-2xl">
            <h1 className="text-4xl md:text-5xl font-bold text-[#1E1E1E] mb-4 leading-tight">
              اكتشف عطرك
              <br />
              المثالي
            </h1>
            <p className="text-[#6B6058] text-lg md:text-xl mb-8 leading-relaxed">
              رحلة عطرية تأخذك إلى عوالم من الفخامة والجمال. حيث تلتقي الأصالة بالحداثة.
            </p>
            <button className="bg-[#2C2C2C] text-white px-8 py-3 rounded-full hover:bg-black transition-all hover:scale-105 active:scale-95 shadow-lg">
              تسوق الآن
            </button>
          </div>
        </div>
      </section>

      {/* Quote & Featured Image */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          {/* Quote side */}
          <div className="flex flex-col gap-8 order-2 lg:order-1">
            <div className="bg-[#F5F1EA] rounded-3xl p-10 flex flex-col justify-center min-h-[300px]">
              <span className="text-[#C4A36E] text-6xl font-playfair leading-none mb-2">"</span>
              <h2 className="text-3xl lg:text-4xl leading-snug font-medium text-[#2C2C2C]">
                العطر هو المفتاح السري الذي يفتح أبواب الذاكرة"
              </h2>
            </div>
            
            <div className="bg-[#2C2C2C] rounded-3xl p-10 flex flex-col justify-center items-center text-center min-h-[200px]">
              <h3 className="text-[#C4A36E] text-5xl font-bold mb-2">+2000</h3>
              <p className="text-gray-300">عميل سعيد</p>
            </div>
          </div>

          {/* Image side */}
          <div className="relative h-[550px] rounded-3xl overflow-hidden order-1 lg:order-2 group">
            <Image
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBSi_9ewOj7qniDE3p9JOp2jqNR-4gc1mjSzImdMwFxo4vToIusOZnzDB8OzWC_aJ5xoANdisqLzduRxcRJuYomKks7hCNuFdbypDtl_iaANZc9tXuRqz3MaFYE2FdqfQuPNFJspsxUcW6P8tM7oZQHP3nc7-WkGwHsZBYfCVM-HAuNSV7DxAqdr-y_VVZh2fle4tzTL9WsDZqaevZdmo2K6eI0dEtQSmdsujLvBcrSxGdZppc-CZU_rBTPDjYSTnURCLtT84t8"
              alt="Rare Ingredients"
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
              referrerPolicy="no-referrer"
            />
            {/* Gradient overlay to make text pop */}
            <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/80 to-transparent" />
            <div className="absolute bottom-8 right-8">
              <h3 className="text-white text-3xl font-bold">مكونات نادرة</h3>
            </div>
          </div>
        </div>
      </section>

      {/* Best Sellers Section */}
      <section className="bg-[#FDF9F3] py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-10">
            <h2 className="text-4xl font-bold text-[#2C2C2C]">الأكثر مبيعاً</h2>
            <a href="#" className="text-[#C4A36E] hover:text-[#A88A58] transition-colors relative after:content-[''] after:absolute after:bottom-[-2px] after:right-0 after:w-full after:h-[1px] after:bg-current">
              عرض الكل
            </a>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Small Cards Grid (Occupies 2 columns on large screens) */}
            <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6 order-2 lg:order-1">
              {[
                { name: "ورد جوري", price: "EGP 150", img: "https://picsum.photos/seed/perfume_a/400/400", id: 1 },
                { name: "مسك الليل", price: "EGP 180", img: "https://picsum.photos/seed/perfume1/400/400", id: 2 },
                { name: "عنبر صافي", price: "EGP 200", img: "https://picsum.photos/seed/perfume_b/400/400", id: 3 },
                { name: "ياسمين الشام", price: "EGP 160", img: "https://picsum.photos/seed/perfume2/400/400", id: 4 },
              ].map((item) => (
                <div key={item.id} className="bg-white rounded-3xl p-6 group transition-all hover:shadow-xl border border-gray-100 flex flex-col justify-between">
                  <div className="relative h-48 w-full mb-6">
                    <Image
                      src={item.img}
                      alt={item.name}
                      fill
                      className="object-contain transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-3"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div className="flex justify-between items-end mt-auto">
                    <button className="text-[#C4A36E] border border-[#C4A36E] rounded-full p-2 hover:bg-[#C4A36E] hover:text-white transition-colors">
                      <Plus className="w-4 h-4" />
                    </button>
                    <div className="text-left font-serif" dir="ltr">
                      <h4 className="text-lg font-bold text-[#2C2C2C] mb-1 font-tajawal text-right" dir="rtl">{item.name}</h4>
                      <span className="text-[#C4A36E] text-sm">{item.price}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Large Hero Card (Occupies 1 column) */}
            <div className="relative bg-[#2C2C2C] rounded-3xl overflow-hidden group h-[600px] lg:h-auto order-1 lg:order-2">
              <Image
                src="https://picsum.photos/seed/perfume3/600/800"
                alt="عود ملكي"
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105 opacity-80"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
              
              <div className="absolute inset-x-0 bottom-0 p-8 flex justify-between items-end text-white">
                <div>
                  <h3 className="text-3xl font-bold mb-2">عود ملكي</h3>
                  <p className="text-gray-300">نفحات شرقية دافئة</p>
                </div>
                <button className="bg-white/20 hover:bg-white text-white hover:text-black backdrop-blur-md rounded-full p-4 transition-all">
                  <Plus className="w-6 h-6" />
                </button>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Instagram / Gallery Section */}
      <section className="py-20 text-center">
        <h2 className="text-3xl font-bold text-[#2C2C2C] mb-2 font-playfair tracking-wide">LovelySmellEG@</h2>
        <p className="text-[#6B6058] mb-10">شاركنا لحظاتك العطرية</p>
        
        <div className="max-w-7xl mx-auto px-4 flex gap-4 overflow-x-auto pb-4 hide-scrollbar snap-x snap-mandatory">
          {[
            "https://lh3.googleusercontent.com/aida-public/AB6AXuCro8Rf7nKMNr1i6JzMF9ac2Yy9J47OuhFhSMy7PfOC93JlJjGT7FAagiZwSkzklAMuSIWvHDgwK8KdaXlV_TaOpUWpLJIR9DCGHennq2UtuaTUA4RjYINerXyk-j9aWOsH9afP29dOLysUYnWWBs_NFGs9djwR2ErTFoHKfMEibYNsObtP321PFMvzYqfnWiW3eAETmRf6yYfbtUHMV6TRYAPSF4Iq6FaQbHoaHKdagXzfLhhv59kMQgE0QKErkCBjstOrCb2_",
            "https://lh3.googleusercontent.com/aida-public/AB6AXuCueUgWfPx1GzHOn-CB0pqdb83o8b9-cNKLn0tVA8q5j0bIdnMyagHQpEEENOW9vvJNfiSb8i9aNnRLcIRC1YUd1tHPaqvYKHaiVAQYiZ0ZUnDB-wnF0l_an-W4Mh8LdvEpjAHxioHSMew91zjUaOaAWIaUrGxjgZY__O-oQerylsjxxQMtVP9OjZT6x3jKh1MPZsx_FYRJQIvDmaGCwA-N1bcQBrGHDsJn_cTFPjQVDm9mu77hyWQqbACNixTjg9ajuHIs5u_r",
            "https://lh3.googleusercontent.com/aida-public/AB6AXuB2NQSzW7ygOEbYU9WxzYwRyXJIqJLuR4Qt6cWfZEIe-IaANOlJKFjM8Ns6XAlcmPd-u6SZkQWqhYZFrR2hPaM9VOYsOUFrwrFtlKL4GPCmjua8LJGoMNBjekzDYbMM_OZchW3KJxX1DTqfkRaq6a3qZZUwH4NwJtUU0ZvU_TFJ8ZwCPBdniAnBfUccX0BF-LlGpfVsThaMaYBCD0ErQsEeA7CLVrOmbIcJCcbBywL1kWBaq9-6l-MRqZ56DvgIOIBsQ2dGke-f",
            "https://lh3.googleusercontent.com/aida-public/AB6AXuDBWkcAwU_Bnmnw14WUO0kjIQGzhDV1V2E2Z1Chwc2KU39y1Qm043s78ByF2xjvtCE0dVJf1nf0wBVpRTs4wAA25kggdhQk60n6wGtRP6UUaV7mLpEMPAVrBF4XMTlY_FWD0nh3958FtaFsWIbt-qlFlb5opqkZYiIBsRWFD9i6eCrcSqUfrsMxa50tZYjdLgiKXzCux0BX0o4Kguorj-jOXfiUkZsFYEfZuWqzVH-4FyQ4-Q4eJYBfB2XzzGJqkQCGFTCxc3HG",
            "https://lh3.googleusercontent.com/aida-public/AB6AXuCGO1FyocqkBHUF3gqsQnSjVTcHu0AGBKEX9XL-Fs7x9zdbNwi3wHwuE9kZ-uGgte6YQnbQx_Dm6ZGMmFgNGI5c4TO2wiaKur6rwxapIp4hxOTB84BCk3NRXdPerTNAF6EMHZxjcpgkTZj_3SPhOKOHGA7u3VThdbxRBe6l0hRGpyXBxwJedKhQX68D_tze7ow4P5FDDSRJVP7uDX6eSRwUzNrduA2UI8xRX-bTR7oICz-Q8j26JKRoXG65fwSSXkW5G0yvogQq"
          ].map((src, i) => (
            <div key={i} className="relative min-w-[200px] md:min-w-[240px] aspect-square rounded-2xl overflow-hidden flex-shrink-0 snap-center group">
              <Image
                src={src}
                alt={`Instagram highlight ${i+1}`}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110"
                referrerPolicy="no-referrer"
              />
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#F5F1EA] py-12 text-center">
        <div className="max-w-7xl mx-auto px-4 flex flex-col items-center">
          <div className="mb-8">
            <span className="font-playfair text-2xl tracking-[0.2em] font-semibold text-[#C4A36E]">
              LOVELY SMELL EG
            </span>
          </div>
          
          <div className="flex gap-6 mb-8 text-sm font-medium text-[#6B6058]">
            <a href="#" className="hover:text-[#C4A36E] transition-colors">الخصوصية</a>
            <a href="#" className="hover:text-[#C4A36E] transition-colors">الشروط</a>
            <a href="#" className="hover:text-[#C4A36E] transition-colors">الشحن</a>
            <a href="#" className="hover:text-[#C4A36E] transition-colors">الاسترجاع</a>
          </div>
          
          <p className="text-gray-400 text-xs">
            © 2024 لوفلي سميل إي جي. صممت بكل حب.
          </p>
        </div>
      </footer>
    </main>
  );
}
