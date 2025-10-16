'use client';

import { useAuth } from '@/contexts/AuthContext';
import StaggeredMenu from './StaggeredMenu';

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

interface MainLayoutProps {
  children: React.ReactNode;
  showHeader?: boolean;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children, showHeader = true }) => {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="min-h-screen text-white">
      {/* Header fixe avec menu - seulement si showHeader est true */}
      {showHeader && (
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
      )}

      {/* Espacement pour header fixe - seulement si showHeader est true */}
      {showHeader && <div className="h-16"></div>}

      {/* Contenu principal */}
      {children}
    </div>
  );
};

export default MainLayout;
