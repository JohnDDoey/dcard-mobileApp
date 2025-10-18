'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';
import { useRouter } from 'next/navigation';
import StaggeredMenu from './StaggeredMenu';

const menuItems = [
  { label: 'Home', ariaLabel: 'Go to home page', link: '/' },
  { label: 'History', ariaLabel: 'View transaction history', link: '/history', icon: 'history' },
  { label: 'Market', ariaLabel: 'Buy and send products', link: '/marketplace', icon: 'shop' },
  { label: 'Coupon', ariaLabel: 'Send money and get cashback', link: '/send-money', icon: 'ticket' },
  { label: 'Boutiques', ariaLabel: 'Find our physical stores and pickup locations', link: '/stores', icon: 'store' },
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

interface MainLayoutProps {
  children: React.ReactNode;
  showHeader?: boolean;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children, showHeader = true }) => {
  const { user, logout } = useAuth();
  const { getTotalItems } = useCart();
  const router = useRouter();

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="min-h-screen text-white">
      {/* Header fixe avec menu - seulement si showHeader est true */}
      {showHeader && (
        <div className="fixed top-0 left-0 right-0 z-[100] bg-black/20 backdrop-blur-sm">
          <div className="flex items-center justify-between px-4 py-1">
            {/* Logo/Titre */}
            <a href="/" className="text-xl font-bold text-white hover:text-gray-300 transition-colors cursor-pointer">
              DCARD
            </a>
            
            {/* Panier et Menu hamburger */}
            <div className="flex items-center gap-3">
              {/* Icône panier avec compteur */}
              <button
                onClick={() => router.push('/buy-material')}
                className="relative p-2 text-white hover:text-gray-300 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01" />
                </svg>
                {getTotalItems() > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
                    {getTotalItems()}
                  </span>
                )}
              </button>

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
        </div>
      )}

      {/* Espacement pour header fixe - seulement si showHeader est true */}
      {showHeader && <div className="h-10"></div>}

      {/* Contenu principal */}
      {children}
    </div>
  );
};

export default MainLayout;

