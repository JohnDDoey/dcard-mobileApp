'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import translations from '@/locales/translations.json';

type Language = 'en' | 'fr' | 'es';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType>({
  language: 'en',
  setLanguage: () => {},
  t: () => '',
});

export const useLanguage = () => useContext(LanguageContext);

interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>('en');
  const [isLoaded, setIsLoaded] = useState(false);

  // Charger la langue depuis localStorage au montage
  useEffect(() => {
    // Vérifier si on est côté client (pas de SSR)
    if (typeof window !== 'undefined') {
      // 1. Essayer de charger depuis localStorage
      const savedLanguage = localStorage.getItem('dcard-language') as Language;
      
      if (savedLanguage && ['en', 'fr', 'es'].includes(savedLanguage)) {
        console.log('✅ Langue chargée depuis localStorage:', savedLanguage);
        setLanguageState(savedLanguage);
      } else {
        // 2. Si pas de langue sauvegardée, détecter la langue du navigateur
        const browserLang = navigator.language.split('-')[0] as Language;
        const detectedLang = ['en', 'fr', 'es'].includes(browserLang) ? browserLang : 'en';
        
        console.log('🌍 Langue du navigateur détectée:', detectedLang);
        setLanguageState(detectedLang);
        localStorage.setItem('dcard-language', detectedLang);
      }
      
      setIsLoaded(true);
    }
  }, []);

  // Sauvegarder la langue dans localStorage
  const setLanguage = (lang: Language) => {
    console.log('🔄 Changement de langue:', language, '→', lang);
    setLanguageState(lang);
    
    if (typeof window !== 'undefined') {
      localStorage.setItem('dcard-language', lang);
      console.log('💾 Langue sauvegardée dans localStorage:', lang);
    }
  };

  // Fonction de traduction
  const t = (key: string): string => {
    const keys = key.split('.');
    let value: any = translations[language];

    for (const k of keys) {
      if (value && typeof value === 'object') {
        value = value[k];
      } else {
        return key; // Retourne la clé si pas trouvé
      }
    }

    return typeof value === 'string' ? value : key;
  };

  const value = {
    language,
    setLanguage,
    t,
  };

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
};






