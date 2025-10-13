'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import CreditCardForm from './CreditCardForm';
import { generateCouponCode, recordCashback } from '@/contracts/cashbackService';

interface PaymentStepProps {
  onContinue: (couponCode: string) => void;
  transactionData?: {
    amountSent: string;
    amountReceived: string;
    currencySent: string;
    currencyReceived: string;
    receiverName: string;
    receiverCountry: string;
    receiverPhone: string;
  };
}

const PaymentStep: React.FC<PaymentStepProps> = ({ onContinue, transactionData }) => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>('');
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [paymentError, setPaymentError] = useState('');

  const handlePaymentMethodSelect = (method: string) => {
    setSelectedPaymentMethod(method);
    // Auto-scroll après sélection
    setTimeout(() => {
      const element = document.querySelector('[data-section="payment-form"]');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }, 500);
  };

  const handleContinue = async () => {
    if (!selectedPaymentMethod) {
      setPaymentError('Veuillez sélectionner une méthode de paiement');
      return;
    }
    
    if (!user || !transactionData) {
      setPaymentError('Données de transaction manquantes');
      return;
    }

    setIsProcessingPayment(true);
    setPaymentError('');

    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('🚀 SEND MONEY WORKFLOW - PAYMENT STEP');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

    try {
      // 1️⃣ VALIDATION DU PAIEMENT (à intégrer avec Stripe/PayPal)
      console.log('📝 Transaction Details:');
      console.log('   User ID:', user.id);
      console.log('   User Name:', user.name);
      console.log('   User Email:', user.email);
      console.log('   Amount Sent:', transactionData.amountSent, transactionData.currencySent);
      console.log('   Amount Received:', transactionData.amountReceived, transactionData.currencyReceived);
      console.log('   Receiver Name:', transactionData.receiverName);
      console.log('   Receiver Country:', transactionData.receiverCountry);
      console.log('   Receiver Phone:', transactionData.receiverPhone);
      console.log('   Payment Method:', selectedPaymentMethod);
      
      console.log('\n💳 Processing payment...');
      // TODO: Intégrer Stripe/PayPal ici
      // const paymentResult = await processPayment(...);
      
      // Simuler la validation du paiement
      await new Promise(resolve => setTimeout(resolve, 2000));
      console.log('✅ Payment validated!');
      
      // 2️⃣ SI PAIEMENT VALIDÉ → Enregistrer on-chain
      console.log('\n🔗 Recording cashback on blockchain...');
      
      const couponCode = generateCouponCode();
      console.log('🎫 Generated Coupon Code:', couponCode);
      
      console.log('\n📤 Calling recordCashback API with:');
      console.log('   Coupon Code:', couponCode);
      console.log('   Sender Name:', user.name);
      console.log('   Sender Email:', user.email);
      console.log('   Beneficiary:', transactionData.receiverName);
      console.log('   User ID:', parseInt(user.id));
      console.log('   Amount (centimes):', parseInt(transactionData.amountSent) * 100);
      
      const result = await recordCashback(
        couponCode,
        user.name,
        user.email,
        transactionData.receiverName,
        parseInt(user.id),
        parseInt(transactionData.amountSent) * 100 // Convertir en centimes
      );

      console.log('\n📥 API Response:');
      console.log('   Success:', result.success);
      if (result.success) {
        console.log('   Transaction Hash:', result.data?.txHash);
        console.log('   Block Number:', result.data?.blockNumber);
        console.log('   Gas Used:', result.data?.gasUsed);
        console.log('\n✅ Coupon recorded on-chain successfully!');
        console.log('🎫 COUPON CODE TO SHARE:', couponCode);
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
        
        // 3️⃣ Redirection vers ReviewStep avec le coupon
        setTimeout(() => {
          onContinue(couponCode);
        }, 1000);
      } else {
        console.error('❌ Failed to record on blockchain:', result.error);
        throw new Error('Failed to record cashback on blockchain');
      }
      
    } catch (error: any) {
      console.error('\n❌ Payment/Recording error:', error);
      console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
      setPaymentError(error.message || 'Payment failed. Please try again.');
    } finally {
      setIsProcessingPayment(false);
    }
  };

  return (
    <div className="px-4 mt-8 space-y-6">
      {/* Transaction Summary Section */}
      <div className="bg-gray-800/60 rounded-2xl p-6 border border-gray-600/50">
        <div className="flex justify-between items-start mb-6">
          {/* You are sending */}
          <div className="text-left">
            <p className="text-white text-sm mb-1 drop-shadow-md">{t('sendMoney.youAreSending')}</p>
            <p className="text-white text-2xl font-bold drop-shadow-lg">
              {transactionData?.amountSent || '10000'} {transactionData?.currencySent || 'EUR'}
            </p>
          </div>
          
          {/* Receiver gets */}
          <div className="text-right">
            <p className="text-white text-sm mb-1 drop-shadow-md">{t('sendMoney.recipientGets')}</p>
            <p className="text-white text-2xl font-bold drop-shadow-lg">
              {transactionData?.amountReceived || '6559570.00'} {transactionData?.currencyReceived || 'XAF'}
            </p>
          </div>
        </div>

        {/* Receiver details */}
        <div className="border-t border-white/10 pt-4">
          <p className="text-white text-sm mb-2 drop-shadow-md">Sending to</p>
          <div className="space-y-1">
            <p className="text-white font-medium drop-shadow-md">
              {transactionData?.receiverName || 'Julienn Blot'}
            </p>
            <p className="text-white drop-shadow-md">
              {transactionData?.receiverCountry || 'KM Comoros'}
            </p>
            <p className="text-white drop-shadow-md">
              {transactionData?.receiverPhone || '+69690606000'}
            </p>
          </div>
        </div>
      </div>

      {/* How will you pay Section */}
      <div className="bg-gray-800/60 rounded-2xl p-6 border border-gray-600/50">
        <h3 className="text-white text-lg font-semibold mb-4 drop-shadow-md">
          How will you pay? <span className="text-red-400">*</span>
        </h3>
        
        <div className="grid grid-cols-3 gap-4">
          {/* Credit Card */}
          <button
            onClick={() => handlePaymentMethodSelect('credit-card')}
            className={`border-2 rounded-lg p-4 text-center transition-all ${
              selectedPaymentMethod === 'credit-card'
                ? 'border-purple-500 bg-purple-500/20'
                : 'border-white/10 hover:border-white/20'
            }`}
          >
            <div className="flex flex-col items-center space-y-2">
              <div className="w-8 h-8 bg-white/20 rounded flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <rect x="2" y="6" width="20" height="12" rx="2"/>
                  <path d="M2 10h20"/>
                  <rect x="6" y="14" width="4" height="2" rx="1"/>
                </svg>
              </div>
              <span className="text-white text-sm font-medium drop-shadow-md">{t('sendMoney.creditCard')}</span>
            </div>
          </button>

          {/* Google Pay */}
          <button
            onClick={() => handlePaymentMethodSelect('google-pay')}
            className={`border-2 rounded-lg p-4 text-center transition-all ${
              selectedPaymentMethod === 'google-pay'
                ? 'border-purple-500 bg-purple-500/20'
                : 'border-white/10 hover:border-white/20'
            }`}
          >
            <div className="flex flex-col items-center space-y-2">
              <div className="w-8 h-8 bg-white/20 rounded flex items-center justify-center">
                <span className="text-white font-bold text-sm">G</span>
              </div>
              <span className="text-white text-sm font-medium drop-shadow-md">{t('sendMoney.googlePay')}</span>
            </div>
          </button>

          {/* Bank Transfer */}
          <button
            onClick={() => handlePaymentMethodSelect('bank-transfer')}
            className={`border-2 rounded-lg p-4 text-center transition-all ${
              selectedPaymentMethod === 'bank-transfer'
                ? 'border-purple-500 bg-purple-500/20'
                : 'border-white/10 hover:border-white/20'
            }`}
          >
            <div className="flex flex-col items-center space-y-2">
              <div className="w-8 h-8 bg-white/20 rounded flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path d="M3 21h18"/>
                  <path d="M5 21V7l8-4v18"/>
                  <path d="M19 21V11l-6-4"/>
                  <path d="M9 9v.01"/>
                  <path d="M9 12v.01"/>
                  <path d="M9 15v.01"/>
                  <path d="M9 18v.01"/>
                </svg>
              </div>
              <span className="text-white text-sm font-medium drop-shadow-md">{t('sendMoney.bankTransfer')}</span>
            </div>
          </button>
        </div>
        
        {/* Error message for payment method selection */}
        {paymentError && paymentError.includes('méthode de paiement') && (
          <div className="mt-4 bg-red-500/20 border border-red-500/50 rounded-lg p-3">
            <p className="text-red-200 text-sm">{paymentError}</p>
          </div>
        )}
      </div>

      {/* Payment Form */}
      {selectedPaymentMethod === 'credit-card' && (
        <div data-section="payment-form" className="mt-6">
          <CreditCardForm onContinue={handleContinue} />
        </div>
      )}

      {/* Error Message */}
      {paymentError && (
        <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-4">
          <p className="text-red-200 text-sm">{paymentError}</p>
        </div>
      )}

      {/* Processing Payment Loader */}
      {isProcessingPayment && (
        <div className="mt-6 bg-gray-800/30 rounded-2xl p-6 border border-gray-600/40">
          <div className="flex flex-col items-center space-y-4">
            {/* Animated Loader */}
            <div className="relative">
              <div className="w-12 h-12 border-4 border-gray-600 border-t-blue-500 rounded-full animate-spin"></div>
              <div className="absolute inset-0 w-12 h-12 border-4 border-transparent border-r-purple-500 rounded-full animate-spin" style={{animationDirection: 'reverse', animationDuration: '0.8s'}}></div>
            </div>
            
            {/* Processing Text */}
            <div className="text-center">
              <h3 className="text-white text-lg font-semibold mb-2">💳 {t('sendMoney.processingPayment')}</h3>
              <p className="text-gray-300 text-sm">Validating payment and recording on blockchain...</p>
            </div>
            
            {/* Progress Dots */}
            <div className="flex space-x-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
              <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse" style={{animationDelay: '0.2s'}}></div>
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" style={{animationDelay: '0.4s'}}></div>
            </div>
          </div>
        </div>
      )}

      {/* Continue Button for other payment methods */}
      {selectedPaymentMethod && selectedPaymentMethod !== 'credit-card' && !isProcessingPayment && (
        <div data-section="continue-button" className="mt-6">
          <button
            onClick={handleContinue}
            disabled={isProcessingPayment}
            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold py-4 px-6 rounded-lg transition-all transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {t('sendMoney.continueToReview')}
          </button>
        </div>
      )}
    </div>
  );
};

export default PaymentStep;




