export interface Product {
  id: string;
  name: string;
  price: number;
  category: string[]; // e.g. ["رجالي", "صيفي"]
  image: string;
  description: string;
  isFeatured?: boolean;
  isEditorial?: boolean;
  isMonthPerfume?: boolean;
}

export const mockProducts: Product[] = [
  {
    id: "authentic-perfume",
    name: "فن العطارة الأصيلة",
    price: 1850,
    category: ["شرقي", "رجالي", "نسائي"],
    image: "/images/product_authentic_perfume.png",
    description: "عطر يعانق الروح، يمزج بين عبق الشرق القديم ولمسة العصر الحديث. تركيبة فريدة تأخذك في رحلة حسية عبر الزمن.",
    isEditorial: true
  },
  {
    id: "layali-al-sharq",
    name: "ليالي الشرق",
    price: 1200,
    category: ["شرقي", "نسائي"],
    image: "/images/featured_perfume.png",
    description: "مزيج ساحر من العود والورد الطائفي يعكس جمال ليالي الشرق.",
    isFeatured: true
  },
  {
    id: "naseem-al-bahr",
    name: "نسيم البحر",
    price: 350,
    category: ["صيفي", "رجالي"],
    image: "https://m.media-amazon.com/images/I/6184-db9cOL._AC_SX679_.jpg",
    description: "عطر منعش يذكرك بنسيم البحر العليل في أيام الصيف الحارة."
  },
  {
    id: "oud-malaki",
    name: "عود ملكي",
    price: 500,
    category: ["شرقي", "رجالي"],
    image: "https://m.media-amazon.com/images/I/61w18c-7qSL._AC_SX679_.jpg",
    description: "عود ملكي فاخر برائحة قوية تدوم طويلاً، مثالي للمناسبات الخاصة."
  },
  {
    id: "rooh-al-ward",
    name: "روح الورد",
    price: 650,
    category: ["نسائي", "صيفي"],
    image: "/images/perfume_womens_pink.png",
    description: "تجربة عطرية تنقلك إلى حقول الورد في الصباح الباكر.",
    isMonthPerfume: true
  },
  {
    id: "blue-ocean",
    name: "المحيط الأزرق",
    price: 450,
    category: ["رجالي", "صيفي", "غربي"],
    image: "/images/perfume_mens_blue.png",
    description: "عطر ذكوري منعش وجذاب، يجسد قوة وحيوية المحيط."
  },
  {
    id: "pure-musk",
    name: "مسك خالص",
    price: 550,
    category: ["شرقي", "نسائي", "رجالي"],
    image: "/images/perfume_unisex_minimal.png",
    description: "رائحة المسك الصافية والنقية، عطر هادئ ومريح يناسب جميع الأوقات."
  },
  {
    id: "desert-night",
    name: "ليل الصحراء",
    price: 850,
    category: ["شرقي", "رجالي"],
    image: "/images/featured_perfume.png",
    description: "عطر يجمع بين دفء الصحراء وغموض الليل مع نفحات من التوابل."
  },
  {
    id: "spring-blossom",
    name: "زهر الربيع",
    price: 320,
    category: ["نسائي", "صيفي"],
    image: "/images/perfume_womens_pink.png",
    description: "باقة من أزهار الربيع المتفتحة في زجاجة عطر، أنوثة طاغية ورقة."
  },
  {
    id: "classic-wood",
    name: "خشب كلاسيكي",
    price: 400,
    category: ["رجالي", "غربي"],
    image: "/images/perfume_mens_blue.png",
    description: "عطر خشبي كلاسيكي يضفي لمسة من الأناقة والوقار."
  },
  {
    id: "golden-amber",
    name: "عنبر ذهبي",
    price: 900,
    category: ["شرقي", "نسائي"],
    image: "https://m.media-amazon.com/images/I/61w18c-7qSL._AC_SX679_.jpg",
    description: "عطر غني وفاخر برائحة العنبر الدافئة، لمسة من الفخامة."
  },
  {
    id: "white-jasmine",
    name: "ياسمين أبيض",
    price: 380,
    category: ["نسائي", "غربي"],
    image: "/images/product_authentic_perfume.png",
    description: "رائحة الياسمين الأبيض النقية، عطر زاهي ومفعم بالحياة."
  },
  {
    id: "black-leather",
    name: "جلد أسود",
    price: 600,
    category: ["رجالي", "غربي"],
    image: "/images/perfume_mens_blue.png",
    description: "عطر جرئ يمزج بين رائحة الجلد الفاخرة والتوابل الدافئة."
  },
  {
    id: "vanilla-sky",
    name: "سماء الفانيليا",
    price: 420,
    category: ["نسائي", "صيفي", "غربي"],
    image: "/images/perfume_unisex_minimal.png",
    description: "حلاوة الفانيليا مع لمسات خفيفة من الفواكه الاستوائية."
  },
  {
    id: "royal-saffron",
    name: "زعفران ملكي",
    price: 1500,
    category: ["شرقي", "رجالي", "نسائي"],
    image: "/images/product_authentic_perfume.png",
    description: "عطر استثنائي يرتكز على الزعفران النادر، الملقب بالذهب الأحمر."
  }
];
