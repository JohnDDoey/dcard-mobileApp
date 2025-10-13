'use client';

import { useLanguage } from '@/contexts/LanguageContext';

export default function LanguageSelector() {
  const { language, setLanguage } = useLanguage();

  const languages = [
    { code: 'en', label: 'US English', flag: '🇺🇸' },
    { code: 'es', label: 'ES Español', flag: '🇪🇸' },
    { code: 'fr', label: 'FR Français', flag: '🇫🇷' }
  ];

  return (
    <div className="sm-language-section">
      <h3 className="sm-language-title">Language / Langue / Idioma</h3>
      <div className="sm-language-options">
        {languages.map((lang) => (
          <button
            key={lang.code}
            onClick={() => setLanguage(lang.code as 'en' | 'fr' | 'es')}
            className={`sm-language-option ${
              language === lang.code ? 'sm-language-option-active' : ''
            }`}
          >
            <span className="mr-2">{lang.flag}</span>
            {lang.label}
          </button>
        ))}
      </div>
    </div>
  );
}



