'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import ProtectedRoute from '@/components/ProtectedRoute';
import LayoutNoHeader from '@/components/LayoutNoHeader';
import StaggeredMenu from '@/components/StaggeredMenu';
import TransactionAccordion from '@/components/TransactionAccordion';
import TicketAccordion from '@/components/TicketAccordion';
import { getCouponsByUser, getMarketTicketsByUser } from '@/contracts/cashbackService';
import { setGlobeZoom } from '@/components/PersistentGlobe';
import { useToastContext } from '@/components/ToastProvider';

const menuItems = [
  { label: 'Home', ariaLabel: 'Go to home page', link: '/' },
  { label: 'History', ariaLabel: 'View transaction history', link: '/history', icon: 'history' },
  { label: 'Market', ariaLabel: 'Buy and send products', link: '/marketplace', icon: 'shop' },
  { label: 'Coupon', ariaLabel: 'Send money and get cashback', link: '/send-money', icon: 'ticket' },
  { label: 'Boutiques', ariaLabel: 'Find our physical stores', link: '/stores', icon: 'store' },
  { label: 'Verify', ariaLabel: 'Verify cashback coupons', link: '/verify' },
  { label: 'Verify ticket', ariaLabel: 'Verify marketplace tickets', link: '/verifyTicket' },
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

export default function HistoryPage() {
  const { user, logout } = useAuth();
  const { t } = useLanguage();
  const [coupons, setCoupons] = useState<any[]>([]);
  const [tickets, setTickets] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'coupons' | 'tickets'>('coupons');
  const [loading, setLoading] = useState(true);
  const { showConfirm, showSuccess } = useToastContext();

  useEffect(() => {
    if (user) {
      loadCoupons();
      loadTickets();
    }
  }, [user]);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const scrollPercentage = scrollY / (documentHeight - windowHeight);

      if (scrollPercentage < 0.25) setGlobeZoom(1);
      else if (scrollPercentage < 0.5) setGlobeZoom(2);
      else if (scrollPercentage < 0.75) setGlobeZoom(3);
      else setGlobeZoom(4);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    setGlobeZoom(1);

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  /* ================= LOAD COUPONS ================= */

  const loadCoupons = async () => {
    console.log('🔍 Chargement des coupons...');
    setLoading(true);

    try {
      const { success, coupons: userCoupons } =
        await getCouponsByUser(parseInt(user?.id || '1'));

      if (success && userCoupons) {
        setCoupons(userCoupons);
      } else {
        setCoupons([]);
      }

    } catch (error) {
      console.error('❌ Erreur chargement coupons:', error);
      setCoupons([]);
    } finally {
      setLoading(false);
    }
  }; // ✅ ACCOLADE MANQUANTE ÉTAIT ICI

  /* ================= LOAD TICKETS ================= */

  const loadTickets = async () => {
    console.log('🛒 Chargement des tickets...');
    try {
      const { success, tickets: userTickets } =
        await getMarketTicketsByUser(parseInt(user?.id || '1'));

      if (success && userTickets) {
        setTickets(userTickets);
      } else {
        setTickets([]);
      }
    } catch (error) {
      console.error('❌ Erreur chargement tickets:', error);
      setTickets([]);
    }
  };

  const handleLogout = () => {
    showConfirm('Êtes-vous sûr de vouloir vous déconnecter ?', logout);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    showSuccess(t('transaction.codeCopied'));
  };

  return (
    <ProtectedRoute redirectMessage="Connexion requise">
      <LayoutNoHeader>
        <div className="min-h-screen text-white">
          {/* Header fixe avec menu */}
          <div className="fixed top-0 left-0 right-0 z-[100] bg-black/20 backdrop-blur-sm">
            <div className="flex items-center justify-between px-4 py-4">
              {/* Bouton retour */}
              <button 
                onClick={() => window.history.back()}
                className="text-white hover:text-gray-300"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>

              {/* Titre */}
              <h1 className="text-xl font-bold">History</h1>

              {/* Menu */}
              <div className="w-8">
                <StaggeredMenu
                  position="right"
                  items={menuItems}
                  socialItems={socialItems}
                  displaySocials
                  displayItemNumbering
                  menuButtonColor="#fff"
                  openMenuButtonColor="#fff"
                  changeMenuColorOnOpen
                  colors={['#6B73FF', '#9B59B6']}
                  accentColor="#9B59B6"
                  logoUrl=""
                  userSession={user ? { user } : null}
                  onLogout={handleLogout}
                />
              </div>
            </div>
          </div>

          {/* Spacer header */}
          <div className="h-16"></div>

          {/* Tabs */}
          <div className="px-4 pb-8">
            <div className="flex bg-gray-800/30 border border-gray-600/40 rounded-xl p-1 mt-4 mb-4">
              <button
                onClick={() => setActiveTab('coupons')}
                className={`flex-1 py-3 rounded-lg ${
                  activeTab === 'coupons'
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white'
                    : 'text-gray-400'
                }`}
              >
                🎫 Coupons ({coupons.length})
              </button>
              <button
                onClick={() => setActiveTab('tickets')}
                className={`flex-1 py-3 rounded-lg ${
                  activeTab === 'tickets'
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white'
                    : 'text-gray-400'
                }`}
              >
                🛒 Tickets ({tickets.length})
              </button>
            </div>

            {/* Coupons */}
            {!loading && activeTab === 'coupons' && coupons.map((coupon, index) => (
              <TransactionAccordion key={index} coupon={coupon} index={index} />
            ))}

            {/* Tickets */}
            {!loading && activeTab === 'tickets' && tickets.map((ticket, index) => (
              <TicketAccordion key={index} ticket={ticket} />
            ))}
          </div>
        </div>
      </LayoutNoHeader>
    </ProtectedRoute>
  );
}