'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { verifyCouponCode, burnCouponCode } from '@/contracts/cashbackService';

interface CouponData {
  issuer: string;
  beneficiary: string;
  amount: string;
  isValid: boolean;
}

// Toast simple sans provider
const showToast = (message: string, type: 'success' | 'error') => {
  const toast = document.createElement('div');
  toast.className = `fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 px-8 py-4 rounded-lg text-white font-medium text-center shadow-2xl ${
    type === 'success' ? 'bg-green-500' : 'bg-red-500'
  }`;
  toast.textContent = message;
  document.body.appendChild(toast);
  
  setTimeout(() => {
    toast.remove();
  }, 5000);
};

export default function VerifyPage() {
  const router = useRouter();
  const [couponCode, setCouponCode] = useState('');
  const [beneficiaryName, setBeneficiaryName] = useState('');
  const [isValidating, setIsValidating] = useState(false);
  const [isBurning, setIsBurning] = useState(false);
  const [couponData, setCouponData] = useState<CouponData | null>(null);
  const [isValidated, setIsValidated] = useState(false);

  const handleValidateCoupon = async () => {
    console.log('🔍 handleValidateCoupon appelé !');
    console.log('📋 Coupon code:', couponCode);
    console.log('📋 Bénéficiaire:', beneficiaryName);
    
    if (!couponCode.trim() || !beneficiaryName.trim()) {
      console.log('❌ Champs manquants');
      showToast('Veuillez remplir tous les champs', 'error');
      return;
    }

    console.log('✅ Validation des champs OK, démarrage de la vérification...');
    setIsValidating(true);
    
    try {
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log('🔍 VERIFICATION COUPON - PARTNERS PAGE');
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log('📋 Données du coupon:');
      console.log('   • Code coupon:', couponCode);
      console.log('   • Bénéficiaire:', beneficiaryName);
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

      // Appel à la nouvelle fonction blockchain
      const result = await verifyCouponCode(couponCode, beneficiaryName);
      
      console.log('✅ Résultat de la vérification:', result);
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

      if (result.success && result.data.isValid) {
        // Utiliser les vraies données du smart contract
        const couponData: CouponData = {
          issuer: result.data.senderName,
          beneficiary: result.data.beneficiary,
          amount: (parseFloat(result.data.amount) / 100).toFixed(2), // Convertir centimes en euros
          isValid: true
        };
        
        setCouponData(couponData);
        setIsValidated(true);
        showToast('Code valide ! Vous pouvez maintenant l\'encaisser.', 'success');
      } else {
        showToast('Code invalide ou déjà utilisé', 'error');
      }
    } catch (error) {
      console.error('❌ Erreur lors de la vérification:', error);
      showToast('Erreur lors de la vérification du coupon', 'error');
    } finally {
      setIsValidating(false);
    }
  };

  const handleBurnCoupon = async () => {
    if (!couponData) return;

    console.log('🔥 handleBurnCoupon appelé !');
    setIsBurning(true);
    
    try {
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log('🔥 BURN COUPON - PARTNERS PAGE');
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log('📋 Données du burn:');
      console.log('   • Code coupon:', couponCode);
      console.log('   • Bénéficiaire:', beneficiaryName);
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

      // Appel à la nouvelle fonction de burn
      const burnResult = await burnCouponCode(couponCode);
      
      console.log('✅ Résultat du burn:', burnResult);
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

      if (burnResult.success) {
        showToast('🎉 Félicitations ! Vous pouvez maintenant donner le cash !', 'success');
        
        // Reset du formulaire
        setCouponCode('');
        setBeneficiaryName('');
        setCouponData(null);
        setIsValidated(false);
      } else {
        showToast('Erreur lors de l\'encaissement', 'error');
      }
    } catch (error) {
      console.error('❌ Erreur lors du burn:', error);
      showToast('Erreur lors de l\'encaissement du coupon', 'error');
    } finally {
      setIsBurning(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center p-4">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 p-6 flex justify-between items-center">
        <button 
          onClick={() => router.back()}
          className="text-white hover:text-gray-300 transition-colors"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
      </div>

      {/* Panneau principal */}
      <div className={`bg-white rounded-3xl shadow-2xl transition-all duration-500 ${
        isValidated ? 'w-full max-w-md' : 'w-full max-w-md'
      }`}>
        <div className="p-6">
          {/* Icône de succès */}
          <div className="flex justify-center mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>

          {/* Titre */}
          <h2 className="text-xl font-bold text-gray-800 text-center mb-1">
            Vérification Cashback
          </h2>
          <p className="text-gray-600 text-center mb-6 text-sm">
            Entrez le code du coupon à encaisser
          </p>

          {/* Formulaire */}
          <div className="space-y-4">
            {/* Code Coupon */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Code Coupon
              </label>
              <input
                type="text"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                placeholder="DCARD-1759406481260-HWN33S"
                className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none ${
                  isValidated 
                    ? 'border-gray-300 bg-gray-100 text-gray-500 cursor-not-allowed' 
                    : 'border-gray-200 focus:border-purple-500 text-gray-800'
                }`}
                disabled={isValidating || isBurning || isValidated}
              />
              {isValidated && (
                <div className="flex items-center space-x-2 mt-2">
                  <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                    <svg className="w-2 h-2 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="text-green-600 text-sm font-medium">Code valide !</span>
                </div>
              )}
            </div>

            {/* Bénéficiaire */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nom du Bénéficiaire
              </label>
              <input
                type="text"
                value={beneficiaryName}
                onChange={(e) => setBeneficiaryName(e.target.value)}
                placeholder="212351"
                className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none ${
                  isValidated 
                    ? 'border-gray-300 bg-gray-100 text-gray-500 cursor-not-allowed' 
                    : 'border-gray-200 focus:border-purple-500 text-gray-800'
                }`}
                disabled={isValidating || isBurning || isValidated}
              />
            </div>

            {/* Bouton Valider */}
            {!isValidated && (
              <button
                onClick={handleValidateCoupon}
                disabled={isValidating || !couponCode.trim() || !beneficiaryName.trim()}
                className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 disabled:from-gray-400 disabled:to-gray-500 text-white font-bold py-3 px-6 rounded-lg transition-all transform hover:scale-105 shadow-lg disabled:transform-none disabled:shadow-none"
              >
                {isValidating ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Vérification...</span>
                  </div>
                ) : (
                  'Valider'
                )}
              </button>
            )}

            {/* Informations du coupon validé */}
            {isValidated && couponData && (
              <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                <div className="flex items-center space-x-2 mb-3">
                  <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                    <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <h3 className="text-base font-bold text-gray-800">Code Valide !</h3>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Émetteur:</span>
                    <span className="font-semibold text-gray-800">{couponData.issuer}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Bénéficiaire:</span>
                    <span className="font-semibold text-gray-800">{couponData.beneficiary}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Montant:</span>
                    <span className="font-semibold text-gray-800">{couponData.amount} €</span>
                  </div>
                </div>

                {/* Bouton Encaisser */}
                <button
                  onClick={handleBurnCoupon}
                  disabled={isBurning}
                  className="w-full mt-4 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-bold py-2.5 px-4 rounded-lg transition-all transform hover:scale-105 shadow-lg disabled:transform-none disabled:shadow-none text-sm"
                >
                  {isBurning ? (
                    <div className="flex items-center justify-center space-x-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Encaissement...</span>
                    </div>
                  ) : (
                    'Encaisser le Cashback'
                  )}
                </button>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="text-center mt-6 pt-4 border-t border-gray-200">
            <p className="text-gray-500 text-xs">
              Powered by DCARD • Cashback Registry
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}