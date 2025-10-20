'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import ProtectedRoute from '@/components/ProtectedRoute';
import PaymentStep from '@/components/PaymentStep';
import { recordMarketplacePurchase } from '@/contracts/cashbackService';
import MainLayout from '@/components/MainLayout';
import { useToastContext } from '@/components/ToastProvider';

export default function BuyMaterialPage() {
  const router = useRouter();
  const { user } = useAuth();
  const { cart, updateQuantity, removeFromCart, getTotalPrice, clearCart } = useCart();
  const { showSuccess, showError } = useToastContext();
  const [selectedCurrency, setSelectedCurrency] = useState('EUR');
  const [showPayment, setShowPayment] = useState(false);
  const [showReview, setShowReview] = useState(false);
  const [reviewData, setReviewData] = useState<{ code: string; total: number; products: Array<{ name: string; quantity: number; price: number }>; createdAt: string } | null>(null);

  // Taux de change
  const exchangeRates = {
    'EUR': 1,
    'USD': 1.1,
    'FCFA': 650
  };

  // Fonction pour convertir les prix
  const convertPrice = (priceInEUR: number, currency: string) => {
    if (currency === 'EUR') {
      return {
        amount: priceInEUR.toFixed(2),
        symbol: '€'
      };
    } else if (currency === 'USD') {
      const priceInUSD = priceInEUR * exchangeRates.USD;
      return {
        amount: priceInUSD.toFixed(2),
        symbol: '$'
      };
    } else if (currency === 'FCFA') {
      const priceInFCFA = priceInEUR * exchangeRates.FCFA;
      return {
        amount: priceInFCFA.toLocaleString(),
        symbol: 'FCFA'
      };
    }
    
    return {
      amount: priceInEUR.toFixed(2),
      symbol: '€'
    };
  };

  // Calculs
  const subtotal = getTotalPrice();
  const tva = subtotal * 0.20; // TVA 20%
  const total = subtotal + tva;

  const subtotalConverted = convertPrice(subtotal, selectedCurrency);
  const tvaConverted = convertPrice(tva, selectedCurrency);
  const totalConverted = convertPrice(total, selectedCurrency);

  useEffect(() => {
    if (cart.length === 0) {
      router.push('/marketplace');
    }
  }, [cart, router]);

  return (
    <ProtectedRoute redirectMessage="Vous devez d'abord vous inscrire et vous connecter pour accéder au panier.">
      <MainLayout>
        <div className="min-h-screen bg-gray-900 text-white pb-8 px-2 sm:px-4 overflow-y-auto">
        <div className="max-w-6xl mx-auto">
          {/* En-tête */}
          <div className="mb-6">
            <button
              onClick={() => router.push('/marketplace')}
              className="text-purple-400 hover:text-purple-300 mb-4 flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Retour au marketplace
            </button>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              🛒 Mon Panier
            </h1>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Liste des produits */}
            <div className="lg:col-span-2 space-y-4">
              {cart.map((item) => (
                <div
                  key={item.id}
                  className="bg-gradient-to-r from-gray-800/80 to-gray-700/80 backdrop-filter backdrop-blur-10 border border-white/15 rounded-lg p-4"
                >
                  <div className="flex gap-4">
                    {/* Image */}
                    <div className="flex-shrink-0 w-24 h-24 bg-gray-700 rounded-lg flex items-center justify-center text-4xl">
                      {item.image}
                    </div>

                    {/* Détails */}
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold mb-2">{item.name}</h3>
                      <p className="text-sm text-gray-400 mb-3">
                        {convertPrice(item.price, selectedCurrency).amount} {convertPrice(item.price, selectedCurrency).symbol}
                      </p>

                      {/* Quantité */}
                      <div className="flex items-center gap-3">
                        <span className="text-sm text-gray-300">Quantité:</span>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="bg-gray-700 hover:bg-gray-600 text-white w-8 h-8 rounded flex items-center justify-center"
                          >
                            -
                          </button>
                          <span className="w-12 text-center font-semibold">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="bg-gray-700 hover:bg-gray-600 text-white w-8 h-8 rounded flex items-center justify-center"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Prix total et suppression */}
                    <div className="flex flex-col items-end justify-between min-w-[120px]">
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-red-400 hover:text-red-300 mb-2"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                      <div className="text-right">
                        <p className="text-lg font-bold text-white">
                          {convertPrice(item.price * item.quantity, selectedCurrency).amount} {convertPrice(item.price * item.quantity, selectedCurrency).symbol}
                        </p>
                        <p className="text-xs text-gray-400">
                          Total
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Résumé de la facture */}
            <div className="lg:col-span-1">
              <div className="bg-gradient-to-br from-purple-900/50 to-pink-900/50 backdrop-filter backdrop-blur-10 border border-white/15 rounded-lg p-6 sticky top-20">
                <h2 className="text-xl font-bold mb-4">Résumé de la commande</h2>

                {/* Section Articles */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-3 text-white">Articles ({cart.length})</h3>
                  <div className="space-y-3 max-h-48 overflow-y-auto">
                    {cart.map((item) => (
                      <div key={item.id} className="bg-gray-800/50 rounded-lg p-3 flex items-center gap-3">
                        {/* Image produit */}
                        <div className="w-12 h-12 bg-gray-700 rounded-lg flex items-center justify-center text-2xl flex-shrink-0">
                          {item.image}
                        </div>
                        
                        {/* Détails produit */}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-white truncate">{item.name}</p>
                          <p className="text-xs text-gray-400">
                            {convertPrice(item.price, selectedCurrency).amount} {convertPrice(item.price, selectedCurrency).symbol} × {item.quantity}
                          </p>
                        </div>
                        
                        {/* Prix total */}
                        <div className="text-right">
                          <p className="text-sm font-bold text-white">
                            {convertPrice(item.price * item.quantity, selectedCurrency).amount} {convertPrice(item.price * item.quantity, selectedCurrency).symbol}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Sélecteur de devise */}
                <div className="mb-4">
                  <label className="text-sm text-gray-300 mb-2 block">Devise</label>
                  <select
                    value={selectedCurrency}
                    onChange={(e) => setSelectedCurrency(e.target.value)}
                    className="w-full bg-gray-700/80 border border-white/15 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-purple-500/50"
                  >
                    <option value="EUR" className="bg-gray-700">EUR (€)</option>
                    <option value="USD" className="bg-gray-700">USD ($)</option>
                  </select>
                </div>

                <div className="space-y-3 mb-4">
                  {/* Sous-total */}
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-300">Sous-total</span>
                    <span className="font-semibold">
                      {subtotalConverted.amount} {subtotalConverted.symbol}
                    </span>
                  </div>

                  {/* TVA */}
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-300">TVA (20%)</span>
                    <span className="font-semibold">
                      {tvaConverted.amount} {tvaConverted.symbol}
                    </span>
                  </div>

                  <div className="border-t border-white/15 pt-3">
                    {/* Total */}
                    <div className="flex justify-between text-lg">
                      <span className="font-bold">Total</span>
                      <span className="font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                        {totalConverted.amount} {totalConverted.symbol}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Réduction */}
                <div className="bg-green-100 text-green-800 text-xs px-3 py-2 rounded mb-4">
                  🎁 Réduction de 10% appliquée sur votre première commande
                </div>

                {/* Point relais */}
                <div className="bg-blue-900/30 border border-blue-500/30 text-blue-300 text-xs px-3 py-2 rounded mb-4">
                  📦 Retrait disponible dans nos points relais partenaires
                </div>

                {/* Bouton de paiement */}
                <button
                  onClick={() => setShowPayment(true)}
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-4 px-6 rounded-lg transition-all duration-200 text-lg shadow-lg hover:shadow-xl"
                >
                  💳 Procéder au paiement
                </button>

                {/* Informations supplémentaires */}
                <div className="mt-4 text-xs text-gray-400 space-y-1">
                  <p>✓ Paiement sécurisé</p>
                  <p>✓ Garantie satisfait ou remboursé</p>
                  <p>✓ Support client 24/7</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de paiement */}
      {showPayment && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 border border-white/20 rounded-2xl p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            {/* En-tête du modal */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">💳 Paiement</h2>
              <button
                onClick={() => setShowPayment(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Résumé de la commande dans le modal */}
            <div className="bg-gray-700/50 rounded-lg p-4 mb-6">
              <h3 className="text-lg font-semibold mb-3 text-white">Résumé de votre commande</h3>
              <div className="space-y-2">
                {cart.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span className="text-gray-300">
                      {item.name} × {item.quantity}
                    </span>
                    <span className="text-white font-medium">
                      {convertPrice(item.price * item.quantity, selectedCurrency).amount} {convertPrice(item.price * item.quantity, selectedCurrency).symbol}
                    </span>
                  </div>
                ))}
                <div className="border-t border-gray-600 pt-2 mt-2">
                  <div className="flex justify-between text-lg font-bold">
                    <span className="text-white">Total</span>
                    <span className="text-purple-400">
                      {convertPrice(total, selectedCurrency).amount} {convertPrice(total, selectedCurrency).symbol}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Composant PaymentStep */}
            <PaymentStep
              isMarketplace={true}
              onContinue={async (couponCode) => {
                try {
                  // Traitement après paiement réussi
                  console.log('Paiement réussi, coupon:', couponCode);
                  
                  // Enregistrer l'achat sur la blockchain
                  if (user) {
                    const products = cart.map(item => ({
                      name: item.name,
                      quantity: item.quantity,
                      price: item.price
                    }));
                    
                    // Récupérer la localisation choisie dans le marketplace
                    let receiverCountry = 'Pays non défini';
                    let receiverCity = 'Ville non définie';
                    try {
                      const saved = localStorage.getItem('marketplaceLocation');
                      if (saved) {
                        const parsed = JSON.parse(saved);
                        receiverCountry = parsed.country || receiverCountry;
                        receiverCity = parsed.city || receiverCity;
                      }
                    } catch (e) {}

                    await recordMarketplacePurchase(
                      couponCode,
                      user.name || 'Acheteur DCARD',
                      user.email || 'acheteur@dcard.com',
                      'Marketplace DCARD',
                      receiverCountry,
                      receiverCity,
                      Number(user.id || 1),
                      total,
                      products
                    );
                    
                    console.log('✅ Achat enregistré sur la blockchain');
                  }
                  
                  // Vider le panier et afficher un panneau de review (PAS de redirection)
                  clearCart();
                  setShowPayment(false);
                  setReviewData({
                    code: couponCode,
                    total,
                    products: cart.map(item => ({ name: item.name, quantity: item.quantity, price: item.price })),
                    createdAt: new Date().toISOString()
                  });
                  setShowReview(true);
                  showSuccess('Commande confirmée ! Votre ticket marketplace a été généré et enregistré sur la blockchain.');
                  
                } catch (error) {
                  console.error('❌ Erreur lors de l\'enregistrement:', error);
                  showError('Commande confirmée mais erreur lors de l\'enregistrement du cashback. Contactez le support.');
                  
                  // Vider le panier quand même et afficher un résumé local
                  clearCart();
                  setShowPayment(false);
                  setReviewData({
                    code: couponCode,
                    total,
                    products: cart.map(item => ({ name: item.name, quantity: item.quantity, price: item.price })),
                    createdAt: new Date().toISOString()
                  });
                  setShowReview(true);
                }
              }}
              transactionData={{
                amountSent: total.toString(),
                amountReceived: total.toString(),
                currencySent: selectedCurrency,
                currencyReceived: selectedCurrency,
                receiverName: 'Marketplace DCARD',
                receiverCountry: 'Sénégal',
                receiverPhone: '+221 77 123 45 67'
              }}
            />
          </div>
        </div>
      )}
      {/* Modal de review (après succès) */}
      {showReview && reviewData && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 border border-white/20 rounded-2xl p-6 max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">🧾 Reçu de commande</h2>
              <button onClick={() => setShowReview(false)} className="text-gray-400 hover:text-white transition-colors">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>

            <div className="space-y-4 print-receipt">
              {/* En-tête reçu comme ReviewStep */}
              <div className="bg-white text-gray-900 rounded-xl p-4 shadow">
                <div className="text-center font-bold text-lg">DCARD</div>
                <div className="text-center text-xs text-gray-600">Reçu de transaction</div>
                <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                  <div className="flex justify-between"><span className="text-gray-600">ID de transaction:</span><span className="font-mono">{reviewData.code}</span></div>
                  <div className="flex justify-between"><span className="text-gray-600">Date:</span><span>{new Date(reviewData.createdAt).toLocaleString('fr-FR')}</span></div>
                </div>
              </div>

              {/* Détails transfert comme ReviewStep */}
              <div className="bg-white text-gray-900 rounded-xl p-4 shadow">
                <div className="font-semibold mb-2">Détails du transfert</div>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between"><span className="text-gray-600">Montant:</span><span>{reviewData.total.toFixed(2)} EUR</span></div>
                  <div className="flex justify-between"><span className="text-gray-600">Frais de l'entreprise (2.5%):</span><span>{(reviewData.total * 0.025).toFixed(2)} EUR</span></div>
                  <div className="flex justify-between border-t pt-2"><span className="font-semibold">Total payé:</span><span className="font-semibold">{(reviewData.total * 1.025).toFixed(2)} EUR</span></div>
                </div>
              </div>

              {/* Détails destinataire */}
              <div className="bg-white text-gray-900 rounded-xl p-4 shadow">
                <div className="font-semibold mb-2">Détails du destinataire</div>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between"><span className="text-gray-600">Nom:</span><span>Marketplace DCARD</span></div>
                  <div className="flex justify-between"><span className="text-gray-600">Pays:</span><span>{(() => { try { const s = localStorage.getItem('marketplaceLocation'); if (s) { return JSON.parse(s).country || '—'; } } catch(e) {} return '—'; })()}</span></div>
                  <div className="flex justify-between"><span className="text-gray-600">Ville:</span><span>{(() => { try { const s = localStorage.getItem('marketplaceLocation'); if (s) { return JSON.parse(s).city || '—'; } } catch(e) {} return '—'; })()}</span></div>
                </div>
              </div>

              {/* Articles */}
              <div className="bg-white text-gray-900 rounded-xl p-4 shadow">
                <div className="font-semibold mb-2">Articles ({reviewData.products.length})</div>
                <div className="space-y-1 text-sm">
                  {reviewData.products.map((p, i) => (
                    <div key={i} className="flex justify-between">
                      <span className="truncate mr-2">{p.name} × {p.quantity}</span>
                      <span>{(p.price * p.quantity).toFixed(2)} EUR</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-3">
                <button onClick={() => window.print()} className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-3 rounded-lg font-medium">Imprimer</button>
                <button onClick={() => setShowReview(false)} className="flex-1 bg-gray-700 hover:bg-gray-600 text-white px-4 py-3 rounded-lg font-medium">Fermer</button>
                <button onClick={() => { setShowReview(false); router.push('/history?tab=tickets'); }} className="flex-1 bg-purple-600 hover:bg-purple-700 text-white px-4 py-3 rounded-lg font-medium">Voir mes tickets</button>
              </div>
            </div>
            <style jsx global>{`
              @media print {
                body * { visibility: hidden; }
                .print-receipt, .print-receipt * { visibility: visible; }
                .print-receipt { position: absolute; left: 0; top: 0; width: 100%; }
              }
            `}</style>
          </div>
        </div>
      )}
      </MainLayout>
    </ProtectedRoute>
  );
}

