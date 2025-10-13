'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import ProtectedRoute from '@/components/ProtectedRoute';
import LayoutNoHeader from '@/components/LayoutNoHeader';
import StaggeredMenu from '@/components/StaggeredMenu';
import { getAllCoupons } from '@/contracts/cashbackService';
import { setGlobeZoom } from '@/components/PersistentGlobe';
import { useToastContext } from '@/components/ToastProvider';

const menuItems = [
  { label: 'History', ariaLabel: 'View transaction history', link: '/history', icon: 'history' },
  { label: 'Home', ariaLabel: 'Go to home page', link: '/' },
  { label: 'About', ariaLabel: 'Learn about DCARD', link: '/about' },
  { label: 'Services', ariaLabel: 'Our services', link: '/services' },
  { label: 'Verify', ariaLabel: 'Verify cashback coupons', link: '/verify' },
  { label: 'Settings', ariaLabel: 'Account settings', link: '/settings' },
  { label: 'Contact', ariaLabel: 'Contact us', link: '/contact' }
];

const socialItems = [
  { label: 'X', link: 'https://x.com/Dcard_world' },
  { label: 'Facebook', link: 'https://www.facebook.com/profile.php?id=61580771969007' },
  { label: 'GitBook', link: 'https://dcard.gitbook.io/dcard-docs/' },
  { label: 'TikTok', link: 'https://www.tiktok.com/' },
  { label: 'Instagram', link: 'https://www.instagram.com/dcard_world/' }
];

export default function HistoryPage() {
  const { user, logout } = useAuth();
  const [coupons, setCoupons] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { showConfirm, showSuccess } = useToastContext();

  // Charger les coupons au montage
  useEffect(() => {
    if (user) {
      loadCoupons();
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
      const { success, coupons: allCoupons } = await getAllCoupons();
      
      console.log('✅ Réponse blockchain:', { success, totalCoupons: allCoupons?.length || 0 });
      
      if (success && allCoupons) {
        console.log('📦 Coupons récupérés:', allCoupons);
        setCoupons(allCoupons);
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
    showSuccess('Code coupon copié dans le presse-papiers !');
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
                  onClick={loadCoupons}
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
            {/* LOADING */}
            {loading && (
              <div className="flex items-center justify-center space-x-3 bg-gray-800/30 border border-gray-600/40 rounded-xl p-6 mt-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                <span className="text-white text-lg">Synchronisation en cours...</span>
              </div>
            )}

            {/* CONDITION: Si 0 coupons */}
            {!loading && coupons.length === 0 && (
              <div className="bg-gray-800/30 border border-gray-600/40 rounded-xl p-8 text-center mt-4">
                <div className="text-6xl mb-4">📭</div>
                <h2 className="text-xl font-bold text-white mb-3">Aucun coupon trouvé</h2>
                <p className="text-gray-300 text-sm mb-6">
                  Vous n'avez pas encore utilisé DCARD pour envoyer de l'argent. 
                  Commencez dès maintenant et profitez de nos cashbacks !
                </p>
                <button 
                  onClick={() => window.location.href = '/send-money'}
                  className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold py-3 px-6 rounded-lg transition-all transform hover:scale-105"
                >
                  Envoyer de l'argent
                </button>
          </div>
        )}

            {/* AFFICHAGE: Si des coupons existent */}
            {!loading && coupons.length > 0 && (
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

                {/* Liste des coupons - EXACTEMENT comme dans l'image */}
                <div className="space-y-4">
                  {coupons.map((coupon, index) => (
                    <div key={index} className="bg-gray-800/40 border border-gray-600/50 rounded-2xl p-6 shadow-lg">
                      
                      {/* 1. Bénéficiaire + Pays (gauche) + Badge Status (droite) */}
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <div className="text-xl font-bold text-white">{coupon.beneficiary}</div>
                          <div className="text-sm text-gray-100">Comoros</div>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          coupon.used ? 'bg-blue-500 text-white' : 'bg-green-500 text-white'
                        }`}>
                          {coupon.used ? 'Completed' : 'Available'}
                </span>
              </div>

                      {/* 2. You sent + They received (côte à côte) */}
              <div className="space-y-2 mb-4">
                <div className="text-green-400 font-medium">
                          You sent {((parseInt(coupon.amount) / 100)).toFixed(0)} EUR
                </div>
                <div className="text-blue-400 font-medium">
                          They received {((parseInt(coupon.amount) * 6.55957) / 100).toFixed(2)} XAF
                </div>
              </div>

                      {/* 3. Date/Heure + TXN ID (côte à côte) */}
              <div className="text-sm text-gray-100 mb-4">
                        {new Date(coupon.createdAt).toLocaleDateString('en-US', { 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric' 
                        })} at {new Date(coupon.createdAt).toLocaleTimeString('en-US', { 
                          hour: '2-digit', 
                          minute: '2-digit',
                          hour12: true
                        })} • TXN-{Math.floor(Math.random() * 10000000000)}
              </div>

                      {/* 4. Coupon Code (boîte transparente avec clipboard) */}
                      <div className="bg-yellow-500/20 text-yellow-400 p-3 rounded-lg mb-4 border border-yellow-500/50">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="text-xs font-medium mb-1 text-yellow-300">Coupon</div>
                            <div className="font-bold text-yellow-400 break-all">{coupon.code}</div>
              </div>
                <button 
                            onClick={() => copyToClipboard(coupon.code)}
                            className="text-yellow-400 hover:text-yellow-300 ml-3 flex-shrink-0"
                >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </button>
              </div>
            </div>

                      {/* 5. Blockchain TX (lien en bas) */}
                      <div className="flex items-center space-x-2">
                        <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
                        </svg>
                        <span className="text-sm text-gray-100">Blockchain TX:</span>
                        <span className="text-sm font-mono text-blue-400">0x0021a040...64683796</span>
                      </div>
                    </div>
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

