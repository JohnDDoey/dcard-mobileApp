'use client';

import InteractiveGlobe from '@/components/InteractiveGlobe';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import StaggeredMenu from '@/components/StaggeredMenu';

const menuItems = [
  { label: 'History', ariaLabel: 'View transaction history', link: '/history', icon: 'history' },
  { label: 'Home', ariaLabel: 'Go to home page', link: '/' },
  { label: 'Nos boutiques', ariaLabel: 'Find our physical stores and pickup locations', link: '/stores' },
  { label: 'Verify', ariaLabel: 'Verify cashback coupons', link: '/verify' },
  { label: 'Settings', ariaLabel: 'Account settings', link: '/settings' },
  { label: 'Help', ariaLabel: 'Help and support', link: 'https://dcard.gitbook.io/dcard-docs/' }
];

const socialItems = [
  { label: 'X', link: 'https://x.com/Dcard_world' },
  { label: 'Facebook', link: 'https://www.facebook.com/profile.php?id=61580771969007' },
  { label: 'Discord', link: 'https://discord.gg/dcard' },
  { label: 'TikTok', link: 'https://www.tiktok.com/' },
  { label: 'Instagram', link: 'https://www.instagram.com/dcard_world/' }
];

export default function Home() {
  const { t } = useLanguage();
  const { user, logout } = useAuth();
  
  // Debug de la session
  console.log('🏠 Home page - User status:', { user });

  const handleLogout = () => {
    logout();
  };
  
  return (
    <div className="min-h-screen text-white">
      {/* Header fixe avec menu */}
      <div className="fixed top-0 left-0 right-0 z-[100] bg-black/20 backdrop-blur-sm">
        <div className="flex items-center justify-between px-4 py-4">
          {/* Logo/Titre */}
          <h1 className="text-xl font-bold text-white">DCARD</h1>
          
          {/* Menu hamburger */}
          <div className="w-8">
            <StaggeredMenu
              position="right"
              items={menuItems}
              socialItems={socialItems}
              displaySocials={true}
              displayItemNumbering={true}
              menuButtonColor="#fff"
              openMenuButtonColor="#fff"
              changeMenuColorOnOpen={true}
              colors={['#6B73FF', '#9B59B6']}
              accentColor="#9B59B6"
              logoUrl=""
              onMenuOpen={() => console.log('Menu opened')}
              onMenuClose={() => console.log('Menu closed')}
              userSession={user ? { user } : null}
              onLogout={handleLogout}
            />
          </div>
        </div>
      </div>

      {/* Espacement pour header fixe */}
      <div className="h-16"></div>

      {/* Interactive Globe Background - seulement sur page d'accueil */}
      <InteractiveGlobe />
      
      {/* Section Welcome avec plus d'espace en haut */}
      <section className="flex items-center justify-center pt-8 pb-1 relative z-20">
        <h1 className="text-4xl md:text-6xl font-bold text-white text-center">
          {t('home.welcome')}
        </h1>
      </section>
      
      {/* Section boutons encore plus bas */}
      <section className="flex flex-col items-center justify-center relative z-20" style={{ marginTop: '65vh' }}>
        <div className="flex flex-col gap-3 w-full max-w-sm">
          {/* Bouton Send Money avec gradient */}
          <button 
            onClick={() => window.location.href = '/send-money'}
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
