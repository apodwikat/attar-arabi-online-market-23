
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import ar from '../locales/ar';
import en from '../locales/en';

type Language = 'ar' | 'en';
type Translations = typeof ar;

interface TranslationContextType {
  language: Language;
  t: (key: string) => string;
  changeLanguage: (lang: Language) => void;
  dir: 'rtl' | 'ltr';
}

const TranslationContext = createContext<TranslationContextType | null>(null);

export const TranslationProvider = ({ children }: { children: ReactNode }) => {
  // Get saved language from localStorage or default to Arabic
  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem('language') as Language;
    return saved || 'ar';
  });
  
  const translations: Record<Language, Translations> = {
    ar,
    en
  };

  // Save language preference to localStorage when changed
  useEffect(() => {
    localStorage.setItem('language', language);
    // Set direction attribute on document
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
  }, [language]);

  // Translate function
  const t = (key: string): string => {
    const keys = key.split('.');
    let result: any = translations[language];
    
    for (const k of keys) {
      if (result && k in result) {
        result = result[k];
      } else {
        return key; // Return key if translation not found
      }
    }
    
    return result || key;
  };

  const changeLanguage = (lang: Language) => {
    setLanguage(lang);
  };

  return (
    <TranslationContext.Provider
      value={{
        language,
        t,
        changeLanguage,
        dir: language === 'ar' ? 'rtl' : 'ltr'
      }}
    >
      {children}
    </TranslationContext.Provider>
  );
};

export const useTranslation = (): TranslationContextType => {
  const context = useContext(TranslationContext);
  if (!context) {
    throw new Error('useTranslation must be used within a TranslationProvider');
  }
  return context;
};
