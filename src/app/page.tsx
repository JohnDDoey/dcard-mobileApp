'use client';

import InteractiveGlobe from '@/components/InteractiveGlobe';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';

export default function Home() {
  const { t } = useLanguage();
  const { user } = useAuth();
  
  // Debug de la session
  console.log('🏠 Home page - User status:', { user });
  
  return (
    <div>

      {/* Interactive Globe Background - seulement sur page d'accueil */}
      <InteractiveGlobe />
      
      {/* Section Welcome avec plus d'espace en haut */}
      <section className="flex items-center justify-center pt-8 pb-1 relative z-20">
        <h1 className="text-4xl md:text-6xl font-bold text-white text-center">
          {t('home.welcome')}
        </h1>
      </section>
      
      {/* Section boutons encore plus bas */}
      <section className="flex flex-col items-center justify-center relative z-20" style={{ marginTop: '59vh' }}>
        <div className="flex flex-col gap-3 w-full max-w-xs">
          {/* Bouton Send Money avec gradient */}
          <button 
            onClick={() => window.location.href = '/choose-action'}
            className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold py-3 px-6 rounded-xl transition-all transform hover:scale-105 shadow-lg text-base"
          >
            {t('home.sendMoneyButton')}
          </button>
          
          {/* Bouton Log In / Sign Up avec bordure - Cacher si connecté */}
          {!user && (
            <button 
              onClick={() => window.location.href = '/login'}
              className="border-2 border-white text-white hover:bg-white hover:text-black font-bold py-3 px-6 rounded-xl transition-all transform hover:scale-105 text-base"
            >
              {t('home.loginButton')}
            </button>
          )}
        </div>
      </section>
    </div>
  );
}
