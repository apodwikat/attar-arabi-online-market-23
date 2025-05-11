
import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';

// Define available languages
export type Language = 'ar' | 'en';

// Define translation keys and structure
export type TranslationKey = 
  | 'shopNow'
  | 'aboutUs' 
  | 'products'
  | 'specialOffers'
  | 'donation'
  | 'contactUs'
  | 'login'
  | 'register'
  | 'tagline'
  | 'description'
  | 'learnMore'
  | 'backToTop'
  | 'contactInfo'
  | 'phoneNumbers'
  | 'email'
  | 'address'
  | 'followUs'
  | 'allRightsReserved'
  | 'categories'
  | 'spicesAndNuts'
  | 'pickles'
  | 'hotSauce'
  | 'cart'
  | 'emptyCart';

// Dictionary type for translations
type TranslationsType = {
  [key in Language]: {
    [key in TranslationKey]: string;
  }
};

// Define translations
const translations: TranslationsType = {
  ar: {
    shopNow: 'تسوق الآن',
    aboutUs: 'من نحن',
    products: 'منتجاتنا',
    specialOffers: 'العروض الخاصة',
    donation: 'التبرع',
    contactUs: 'اتصل بنا',
    login: 'تسجيل الدخول',
    register: 'إنشاء حساب',
    tagline: 'العطار العربي',
    description: 'أفضل المنتجات الغذائية التقليدية الفلسطينية الأصيلة بجودة عالية وأسعار منافسة',
    learnMore: 'تعرف اكثر علينا',
    backToTop: 'العودة إلى الأعلى',
    contactInfo: 'معلومات التواصل',
    phoneNumbers: 'أرقام الهاتف',
    email: 'البريد الإلكتروني',
    address: 'العنوان',
    followUs: 'تابعنا على',
    allRightsReserved: 'جميع الحقوق محفوظة',
    categories: 'الفئات',
    spicesAndNuts: 'بهارات ومكسرات',
    pickles: 'المخللات',
    hotSauce: 'الشطة',
    cart: 'السلة',
    emptyCart: 'سلة التسوق فارغة'
  },
  en: {
    shopNow: 'Shop Now',
    aboutUs: 'About Us',
    products: 'Our Products',
    specialOffers: 'Special Offers',
    donation: 'Donation',
    contactUs: 'Contact Us',
    login: 'Login',
    register: 'Register',
    tagline: 'Al Attar Al Arabi',
    description: 'The best traditional Palestinian food products with high quality and competitive prices',
    learnMore: 'Learn More',
    backToTop: 'Back to Top',
    contactInfo: 'Contact Information',
    phoneNumbers: 'Phone Numbers',
    email: 'Email',
    address: 'Address',
    followUs: 'Follow Us',
    allRightsReserved: 'All Rights Reserved',
    categories: 'Categories',
    spicesAndNuts: 'Spices & Nuts',
    pickles: 'Pickles',
    hotSauce: 'Hot Sauce',
    cart: 'Cart',
    emptyCart: 'Cart is empty'
  }
};

// Language context type
type LanguageContextType = {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: TranslationKey) => string;
  dir: string;
};

// Create context
const LanguageContext = createContext<LanguageContextType | null>(null);

// Provider component
export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('ar');
  
  // Update document direction based on language
  useEffect(() => {
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
  }, [language]);
  
  // Translation function
  const t = (key: TranslationKey): string => {
    return translations[language][key] || key;
  };

  const value = {
    language,
    setLanguage,
    t,
    dir: language === 'ar' ? 'rtl' : 'ltr'
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

// Custom hook to use the language context
export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
