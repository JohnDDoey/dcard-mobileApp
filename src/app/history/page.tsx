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
  { label: 'Boutiques', ariaLabel: 'Find our physical stores and pickup locations', link: '/stores', icon: 'store' },
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

  // Charger les données au montage
  useEffect(() => {
    if (user) {
      loadCoupons();
      loadTickets();
    }
  }, [user]);

  // Effet de parallax scroll avec zoom du globe
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      
      // Calculer le pourcentage de scroll
      const scrollPercentage = scrollY / (documentHeight - windowHeight);
      
      // Zoom progressif basé sur le scroll
      if (scrollPercentage < 0.25) {
        setGlobeZoom(1); // Zoom normal
      } else if (scrollPercentage < 0.5) {
        setGlobeZoom(2); // Zoom moyen
      } else if (scrollPercentage < 0.75) {
        setGlobeZoom(3); // Zoom proche
      } else {
        setGlobeZoom(4); // Zoom maximum (centre)
      }
    };

    // Ajouter l'écouteur de scroll
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    // Initialiser le zoom
    setGlobeZoom(1);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

    const loadCoupons = async () => {
      console.log('🔍 Chargement des coupons depuis la blockchain...');
      setLoading(true);
      
      try {
        const { success, coupons: userCoupons } = await getCouponsByUser(parseInt(user?.id || '1'));
        
        console.log('✅ Réponse blockchain:', { success, totalCoupons: userCoupons?.length || 0 });
        
        if (success && userCoupons) {
          console.log('📦 Coupons récupérés RAW:', userCoupons);
    
          // ✅ IMPORTANT : filtre SAFE (pas de variable inconnue)
          const filteredCoupons = userCoupons.filter(coupon => {
            // adapte selon ta structure réelle
            return coupon.type !== 'ticket'; 
          });
    
          console.log('✅ Coupons filtrés:', filteredCoupons);
    
          setCoupons(filteredCoupons);
        } else {
          console.log('⚠️ Aucun coupon trouvé');
          setCoupons([]);
        }
      } catch (error) {
        console.error('❌ Erreur chargement coupons:', error);
        setCoupons([]);
      } finally {
        setLoading(false);
      }
    };

    const loadTickets = async () => {
      console.log('🛒 Chargement des tickets marketplace depuis la blockchain...');
      
      try {
        const { success, tickets: userTickets } = await getMarketTicketsByUser(parseInt(user?.id || '1'));
        
        console.log('✅ Réponse tickets blockchain:', { success, totalTickets: userTickets?.length || 0 });
        
        if (success && userTickets && userTickets.length > 0) {
          console.log('📋 Tickets chargés RAW:', userTickets);
    
          // ✅ FILTRAGE ICI (IMPORTANT)
          const filteredTickets = userTickets.filter((item: any) => {
            return item.totalAmount;
          });
    
          console.log('✅ Tickets filtrés:', filteredTickets);
    
          setTickets(filteredTickets);
        } else {
          console.log('ℹ️ Aucun ticket trouvé ou erreur blockchain');
          setTickets([]);
        }
      } catch (error) {
        console.error('❌ Erreur chargement tickets:', error);
        setTickets([]);
      }
    };

  const handleLogout = () => {
    showConfirm(
      'Êtes-vous sûr de vouloir vous déconnecter ?',
      () => {
        logout();
      }
    );
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    showSuccess(t('transaction.codeCopied'));
  };

  return (
    <ProtectedRoute redirectMessage="Vous devez d'abord vous inscrire et vous connecter pour accéder à votre historique de transactions.">
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

              {/* Titre et bouton rafraîchissement */}
              <div className="flex items-center space-x-3">
                <h1 className="text-xl font-bold">
                  <span className="hidden md:inline">History</span>
                  <span className="md:hidden">Hist.</span>
                </h1>
                <button
                  onClick={() => {
                    loadCoupons();
                    loadTickets();
                  }}
                  disabled={loading}
                  className="text-white hover:text-gray-300 disabled:text-gray-500 transition-colors"
                  title="Rafraîchir les données"
                >
                  <svg 
                    className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                </button>
              </div>

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

          {/* Contenu principal */}
          <div className="px-4 pb-8">
            {/* Onglets Coupon/Ticket */}
            <div className="flex bg-gray-800/30 border border-gray-600/40 rounded-xl p-1 mt-4 mb-4">
              <button
                onClick={() => setActiveTab('coupons')}
                className={`flex-1 py-3 px-4 rounded-lg transition-all duration-200 ${
                  activeTab === 'coupons'
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                🎫 Coupons ({coupons.length})
              </button>
              <button
                onClick={() => setActiveTab('tickets')}
                className={`flex-1 py-3 px-4 rounded-lg transition-all duration-200 ${
                  activeTab === 'tickets'
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                🛒 Tickets ({tickets.length})
              </button>
            </div>
            {/* LOADING */}
            {loading && (
              <div className="flex items-center justify-center space-x-3 bg-gray-800/30 border border-gray-600/40 rounded-xl p-6 mt-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                <span className="text-white text-lg">{t('history.synchronizing')}</span>
              </div>
            )}

            {/* CONDITION: Si 0 données pour l'onglet actif */}
            {!loading && activeTab === 'coupons' && coupons.length === 0 && (
              <div className="bg-gray-800/30 border border-gray-600/40 rounded-xl p-8 text-center mt-4">
                <div className="text-6xl mb-4">📭</div>
                <h2 className="text-xl font-bold text-white mb-3">{t('history.noCouponsFound')}</h2>
                <p className="text-gray-300 text-sm mb-6">
                  {t('history.noCouponsDesc')}
                </p>
                <button 
                  onClick={() => window.location.href = '/send-money'}
                  className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold py-3 px-6 rounded-lg transition-all transform hover:scale-105"
                >
                  {t('history.sendMoney')}
                </button>
              </div>
            )}

            {!loading && activeTab === 'tickets' && tickets.length === 0 && (
              <div className="bg-gray-800/30 border border-gray-600/40 rounded-xl p-8 text-center mt-4">
                <div className="text-6xl mb-4">🛒</div>
                <h2 className="text-xl font-bold text-white mb-3">Aucun ticket marketplace</h2>
                <p className="text-gray-300 text-sm mb-6">
                  Vous n'avez pas encore effectué d'achats sur le marketplace.
                </p>
                <button 
                  onClick={() => window.location.href = '/marketplace'}
                  className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold py-3 px-6 rounded-lg transition-all transform hover:scale-105"
                >
                  Aller au marketplace
                </button>
              </div>
            )}

            {/* AFFICHAGE: Onglet Coupons */}
            {!loading && activeTab === 'coupons' && coupons.length > 0 && (
              <>
                {/* Panel avec Total + Jauge mensuelle */}
                <div className="bg-gray-800/30 border border-gray-600/40 rounded-xl p-4 mt-4 mb-4">
                  <div className="grid grid-cols-2 gap-6 relative">
                    {/* Total transactions */}
                    <div className="text-center">
                      <span className="text-gray-400 text-sm">Total transactions</span>
                      <div className="text-3xl font-bold text-white mt-1">{coupons.length}</div>
                    </div>

                    {/* Barre verticale séparatrice */}
                    <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gray-600/50 transform -translate-x-1/2"></div>

                    {/* Jauge mensuelle */}
                    <div className="text-center">
                      <span className="text-gray-400 text-sm">Volume mensuel</span>
                      <div className="mt-2">
                        {/* Calcul du total mensuel */}
                        {(() => {
                          const currentMonth = new Date().getMonth();
                          const currentYear = new Date().getFullYear();
                          
                          const monthlyTotal = coupons
                            .filter(coupon => {
                              const couponDate = new Date(coupon.createdAt);
                              return couponDate.getMonth() === currentMonth && couponDate.getFullYear() === currentYear;
                            })
                            .reduce((sum, coupon) => sum + (parseInt(coupon.amount) / 100), 0);
                          
                          const monthlyLimit = 1000; // 1000€ par mois
                          const percentage = Math.min((monthlyTotal / monthlyLimit) * 100, 100);
                          const isNearLimit = percentage > 80;
                          const isOverLimit = percentage >= 100;
                          
                          return (
                            <>
                              <div className="text-xl font-bold text-white mb-2">
                                {monthlyTotal.toFixed(0)}€ / {monthlyLimit}€
          </div>
                              
                              {/* Barre de progression */}
                              <div className="w-full bg-gray-700 rounded-full h-3 mb-2">
                                <div 
                                  className={`h-3 rounded-full transition-all duration-500 ${
                                    isOverLimit 
                                      ? 'bg-red-500' 
                                      : isNearLimit 
                                        ? 'bg-yellow-500' 
                                        : 'bg-gradient-to-r from-green-500 to-blue-500'
                                  }`}
                                  style={{ width: `${percentage}%` }}
                                ></div>
        </div>

                              {/* Pourcentage et statut */}
                              <div className="flex items-center justify-center space-x-2">
                                <span className={`text-sm font-medium ${
                                  isOverLimit 
                                    ? 'text-red-400' 
                                    : isNearLimit 
                                      ? 'text-yellow-400' 
                                      : 'text-green-400'
                                }`}>
                                  {percentage.toFixed(1)}%
                                </span>
                                <span className={`text-xs px-2 py-1 rounded-full ${
                                  isOverLimit 
                                    ? 'bg-red-500/20 text-red-300' 
                                    : isNearLimit 
                                      ? 'bg-yellow-500/20 text-yellow-300' 
                                      : 'bg-green-500/20 text-green-300'
                                }`}>
                                  {isOverLimit 
                                    ? 'Limite atteinte' 
                                    : isNearLimit 
                                      ? 'Attention' 
                                      : 'Dans la limite'}
                                </span>
                              </div>
                            </>
                          );
                        })()}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Liste des transactions en accordéon */}
                <div className="space-y-3">
                  {coupons.map((coupon, index) => (
                    <TransactionAccordion 
                      key={index} 
                      coupon={coupon} 
                      index={index} 
                    />
                  ))}
                </div>
              </>
            )}

            {/* AFFICHAGE: Onglet Tickets */}
            {!loading && activeTab === 'tickets' && tickets.length > 0 && (
              <>
                {/* Panel avec Total tickets */}
                <div className="bg-gray-800/30 border border-gray-600/40 rounded-xl p-4 mt-4 mb-4">
                  <div className="text-center">
                    <span className="text-gray-400 text-sm">Total tickets marketplace</span>
                    <div className="text-3xl font-bold text-white mt-1">{tickets.length}</div>
                  </div>
                </div>

                {/* Liste des tickets en accordéon */}
                <div className="space-y-3">
                  {tickets.map((ticket, index) => (
                    <TicketAccordion key={index} ticket={ticket} />
                  ))}
                </div>
              </>
            )}

            {/* Espacement pour le parallax scroll */}
            <div className="py-16"></div>
          </div>
        </div>
      </LayoutNoHeader>
    </ProtectedRoute>
  );
}
// === FIN DU FICHIER ===
