'use client';



import { useState } from 'react';

import { useAuth } from '@/contexts/AuthContext';

import { useLanguage } from '@/contexts/LanguageContext';

import CreditCardForm from './CreditCardForm';

import CreditCardWidget from './CreditCardWidget';

import GooglePayWidget from './GooglePayWidget';

import BankTransferWidget from './BankTransferWidget';

import CryptoPaymentWidget from './CryptoPaymentWidget';

import { generateCouponCode, recordCashback } from '@/contracts/cashbackService';



interface PaymentStepProps {
  isMarketplace?: boolean;
  onContinue: (couponCode: string) => void | Promise<void>;
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



const PaymentStep: React.FC<PaymentStepProps> = ({ onContinue, transactionData, isMarketplace = false }) => {

  const { user } = useAuth();

  const { t } = useLanguage();

  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>('');

  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  const [paymentError, setPaymentError] = useState('');

  const [paymentStep, setPaymentStep] = useState<string>('');



  const handlePaymentMethodSelect = (method: string) => {

    setSelectedPaymentMethod(method);

    setPaymentError('');

    setPaymentStep('');

    

    // Scroll automatique vers les widgets de paiement

    setTimeout(() => {

      const paymentWidgets = document.querySelector('[data-section="payment-widgets"]');

      if (paymentWidgets) {

        paymentWidgets.scrollIntoView({ behavior: 'smooth', block: 'start' });

      }

    }, 300);

  };



  const handlePaymentSuccess = async (paymentData: any) => {

    setIsProcessingPayment(true);

    setPaymentError('');

    

    console.log('✅ Payment successful:', paymentData);

    

    try {

      // Étape 1: Vérification du paiement

      setPaymentStep('Verifying payment...');

      console.log('🔍 Step 1: Verifying payment...');

      await new Promise(resolve => setTimeout(resolve, 1500));

      

      // Étape 2: Génération du coupon

      setPaymentStep('Generating coupon code...');

      console.log('🎫 Step 2: Generating coupon...');

      await new Promise(resolve => setTimeout(resolve, 800));

      

      // Générer le coupon

      const couponCode = `DCARD_${Date.now()}_${Math.random().toString(36).substr(2, 6).toUpperCase()}`;

      console.log('🎫 Coupon generated:', couponCode);

      

      // Étape 3: Enregistrement sur la blockchain

      setPaymentStep('Recording cashback on blockchain...');

      console.log('⛓️ Step 3: Recording on blockchain...');

      

      // Vraie appel à l'API blockchain (avec les bons paramètres)

      try {

        const blockchainResponse = await fetch('/api/blockchain/record-cashback', {

          method: 'POST',

          headers: {

            'Content-Type': 'application/json',

          },

          body: JSON.stringify({

            code: couponCode,

            senderName: user?.name || 'DCARD User',

            senderEmail: user?.email || 'user@example.com',

            beneficiary: transactionData?.receiverName || 'DCARD User',

            receiverCountry: transactionData?.receiverCountry || 'Unknown',

            userId: user?.id || 'user123',

            amount: Math.round(parseFloat(transactionData?.amountSent || '100') * 100) // Convertir en centimes

          })

        });



        if (!blockchainResponse.ok) {

          const errorData = await blockchainResponse.json();

          throw new Error(errorData.error || 'Blockchain recording failed');

        }



        const blockchainResult = await blockchainResponse.json();

        console.log('✅ Blockchain recording successful:', blockchainResult);

        console.log('   Transaction Hash:', blockchainResult.transactionHash);

        console.log('   Block Number:', blockchainResult.blockNumber);

        console.log('   Gas Used:', blockchainResult.gasUsed);

        

      } catch (blockchainError: any) {

        console.error('❌ Blockchain recording failed:', blockchainError);

        throw new Error(`Blockchain error: ${blockchainError.message}`);

      }

      

      // La confirmation blockchain est déjà faite dans l'API

      setPaymentStep('Blockchain transaction confirmed!');

      console.log('✅ Blockchain confirmed!');

      await new Promise(resolve => setTimeout(resolve, 1000));

      

      // Message de confirmation

      setPaymentStep('Payment successful! Redirecting...');

      await new Promise(resolve => setTimeout(resolve, 500));

      

      // Continuer vers l'étape suivante

      onContinue(couponCode);

      

    } catch (error) {

      console.error('❌ Payment processing failed:', error);

      setPaymentError('Payment processing failed. Please try again.');

      setIsProcessingPayment(false);

    }

  };



  // Fonction pour calculer le montant total avec frais

  const calculateTotalAmount = (baseAmount: string): number => {

    const amount = parseFloat(baseAmount || '0');

    const serviceFee = amount * 0.025; // 2.5%

    const blockchainFee = 0.50; // 0.50 EUR

    const infrastructureFee = 1.00; // 1.00 EUR

    return amount + serviceFee + blockchainFee + infrastructureFee;

  };



  // Vérifier si une méthode de paiement est sélectionnée

  const isPaymentMethodSelected = selectedPaymentMethod !== '';



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

    <div className="px-4 mt-2 space-y-4">

      {/* Transaction Summary Section - Ultra compact */}

      <div className="bg-gray-800/60 rounded-2xl p-3 border border-gray-600/50">

        <div className="flex justify-between items-start mb-3">

          {/* You are sending */}

          <div className="text-left">

            <p className="text-white text-xs mb-0.5 drop-shadow-md">{t('sendMoney.youAreSending')}</p>

            <p className="text-white text-lg font-bold drop-shadow-lg">

              {transactionData?.amountSent || '10000'} {transactionData?.currencySent || 'EUR'}

            </p>

          </div>

          

          {/* Receiver gets */}

          <div className="text-right">

            <p className="text-white text-xs mb-0.5 drop-shadow-md">{t('sendMoney.recipientGets')}</p>

            <p className="text-white text-lg font-bold drop-shadow-lg">

              {transactionData?.amountReceived || '6559570.00'} {transactionData?.currencyReceived || 'XAF'}

            </p>

          </div>

        </div>



        {/* Receiver details - Ultra compact */}

        <div className="border-t border-white/10 pt-2">

          <p className="text-white text-xs mb-1 drop-shadow-md">Sending to</p>

          <div className="space-y-0.5">

            <p className="text-white font-medium text-sm drop-shadow-md">

              {transactionData?.receiverName || 'Julienn Blot'}

            </p>

            <p className="text-white text-xs drop-shadow-md">

              {transactionData?.receiverCountry || 'KM Comoros'}

            </p>

            <p className="text-white text-xs drop-shadow-md">

              {transactionData?.receiverPhone || '+69690606000'}

            </p>

          </div>

        </div>

      </div>



      {/* How will you pay Section - Ultra compact */}

      <div className="bg-gray-800/60 rounded-2xl p-3 border border-gray-600/50">

        <h3 className="text-white text-base font-semibold mb-3 drop-shadow-md">

          How will you pay? <span className="text-red-400">*</span>

        </h3>

        

        <div className="grid grid-cols-3 gap-2">

          {/* Credit Card */}

          <button

            onClick={() => handlePaymentMethodSelect('credit-card')}

            className={`border-2 rounded-lg p-2 text-center transition-all ${

              selectedPaymentMethod === 'credit-card'

                ? 'border-purple-500 bg-purple-500/20'

                : 'border-white/10 hover:border-white/20'

            }`}

          >

            <div className="flex flex-col items-center space-y-1">

              <div className="w-6 h-6 bg-white/20 rounded flex items-center justify-center">

                <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">

                  <rect x="2" y="6" width="20" height="12" rx="2"/>

                  <path d="M2 10h20"/>

                  <rect x="6" y="14" width="4" height="2" rx="1"/>

                </svg>

              </div>

              <span className="text-white text-xs font-medium drop-shadow-md">{t('sendMoney.creditCard')}</span>

            </div>

          </button>



          {/* Crypto Payment - Marketplace only */}
          {isMarketplace && (
            <button
              onClick={() => handlePaymentMethodSelect('crypto')}
              className={`border-2 rounded-lg p-2 text-center transition-all ${
                selectedPaymentMethod === 'crypto'
                  ? 'border-yellow-500 bg-yellow-500/20'
                  : 'border-white/10 hover:border-white/20'
              }`}
            >
              <div className="flex flex-col items-center space-y-1">
                <div className="w-6 h-6 bg-gradient-to-r from-yellow-500 to-orange-500 rounded flex items-center justify-center">
                  <span className="text-white font-bold text-xs">₿</span>
                </div>
                <span className="text-white text-xs font-medium drop-shadow-md">Crypto</span>
              </div>
            </button>
          )}



          {/* Bank Transfer */}

          <button

            onClick={() => handlePaymentMethodSelect('bank-transfer')}

            className={`border-2 rounded-lg p-2 text-center transition-all ${

              selectedPaymentMethod === 'bank-transfer'

                ? 'border-purple-500 bg-purple-500/20'

                : 'border-white/10 hover:border-white/20'

            }`}

          >

            <div className="flex flex-col items-center space-y-1">

              <div className="w-6 h-6 bg-white/20 rounded flex items-center justify-center">

                <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">

                  <path d="M3 21h18"/>

                  <path d="M5 21V7l8-4v18"/>

                  <path d="M19 21V11l-6-4"/>

                  <path d="M9 9v.01"/>

                  <path d="M9 12v.01"/>

                  <path d="M9 15v.01"/>

                  <path d="M9 18v.01"/>

                </svg>

              </div>

              <span className="text-white text-xs font-medium drop-shadow-md">{t('sendMoney.bankTransfer')}</span>

            </div>

          </button>



        </div>

        

        {/* Error message for payment method selection */}

        {paymentError && paymentError.includes('méthode de paiement') && (

          <div className="mt-2 bg-red-500/20 border border-red-500/50 rounded-lg p-2">

            <p className="text-red-200 text-xs">{paymentError}</p>

          </div>

        )}

      </div>



      {/* Fees Summary */}

      {selectedPaymentMethod && !isProcessingPayment && (

        <div className="mt-4 p-3 bg-gray-700/50 rounded-lg border border-gray-600">

          <h4 className="text-white font-medium text-sm mb-2">💰 Payment Summary</h4>

          <div className="space-y-1 text-xs">

            <div className="flex justify-between">

              <span className="text-gray-300">Transfer Amount:</span>

              <span className="text-white">{transactionData?.amountSent || '100'} {transactionData?.currencySent || 'EUR'}</span>

            </div>

            <div className="flex justify-between">

              <span className="text-gray-300">Service Fee (2.5%):</span>

              <span className="text-white">{(parseFloat(transactionData?.amountSent || '100') * 0.025).toFixed(2)} {transactionData?.currencySent || 'EUR'}</span>

            </div>

            <div className="flex justify-between">

              <span className="text-gray-300">Blockchain Fee:</span>

              <span className="text-white">0.50 {transactionData?.currencySent || 'EUR'}</span>

            </div>

            <div className="flex justify-between">

              <span className="text-gray-300">Infrastructure Fee:</span>

              <span className="text-white">1.00 {transactionData?.currencySent || 'EUR'}</span>

            </div>

            <div className="border-t border-gray-600 pt-1 mt-1">

              <div className="flex justify-between">

                <span className="text-white font-semibold">Total to Pay:</span>

                <span className="text-white font-bold">{calculateTotalAmount(transactionData?.amountSent || '100').toFixed(2)} {transactionData?.currencySent || 'EUR'}</span>

              </div>

            </div>

          </div>

        </div>

      )}



      {/* Payment Widgets */}

      {selectedPaymentMethod === 'credit-card' && !isProcessingPayment && (

        <div data-section="payment-widgets" className="mt-4">

          <CreditCardWidget

            amount={calculateTotalAmount(transactionData?.amountSent || '100')}

            currency={transactionData?.currencySent || 'EUR'}

            onPaymentSuccess={handlePaymentSuccess}

            onCancel={() => setSelectedPaymentMethod('')}

          />

        </div>

      )}



      {selectedPaymentMethod === 'crypto' && !isProcessingPayment && isMarketplace && (

        <div data-section="payment-widgets" className="mt-4">

          <CryptoPaymentWidget

            amount={calculateTotalAmount(transactionData?.amountSent || '100')}

            currency={transactionData?.currencySent || 'EUR'}

            onPaymentSuccess={handlePaymentSuccess}

            onPaymentError={setPaymentError}

          />

        </div>

      )}



      {selectedPaymentMethod === 'bank-transfer' && !isProcessingPayment && (

        <div data-section="payment-widgets" className="mt-4">

          <BankTransferWidget

            amount={calculateTotalAmount(transactionData?.amountSent || '100')}

            currency={transactionData?.currencySent || 'EUR'}

            onPaymentSuccess={handlePaymentSuccess}

            onCancel={() => setSelectedPaymentMethod('')}

          />

        </div>

      )}



      {/* Payment Processing */}

      {isProcessingPayment && (

        <div data-section="payment-processing" className="mt-4 text-center">

          <div className="bg-blue-500/20 border border-blue-500/50 rounded-lg p-4">

            <div className="flex items-center justify-center space-x-2 mb-3">

              <div className="w-5 h-5 border-2 border-blue-400 border-t-transparent rounded-full animate-spin"></div>

              <span className="text-blue-200 text-sm font-medium">{paymentStep || 'Processing Payment...'}</span>

            </div>

            

            {/* Progress bar */}

            <div className="w-full bg-gray-700 rounded-full h-1.5 mb-3">

              <div className="bg-blue-500 h-1.5 rounded-full animate-pulse" style={{ width: '60%' }}></div>

            </div>

            

            <p className="text-blue-300 text-xs">

              {selectedPaymentMethod === 'credit-card' && '💳 Card payment in progress...'}

              {selectedPaymentMethod === 'crypto' && '₿ Crypto payment processing...'}

              {selectedPaymentMethod === 'bank-transfer' && '🏦 Bank transfer processing...'}

            </p>

            

            {paymentStep.includes('blockchain') && (

              <div className="mt-2 bg-gray-800/50 rounded p-2">

                <div className="flex items-center justify-between text-xs">

                  <span className="text-gray-300">⛓️ Blockchain Network:</span>

                  <span className="text-green-400">zkSync Era Sepolia</span>

                </div>

                <div className="flex items-center justify-between text-xs mt-1">

                  <span className="text-gray-300">⏱️ Avg. Confirmation:</span>

                  <span className="text-yellow-400">~3-5 seconds</span>

                </div>

              </div>

            )}

            

            <div className="mt-2 text-xs text-gray-400">

              {paymentStep.includes('blockchain') 

                ? 'This may take a few moments due to blockchain processing'

                : 'Please wait while we process your payment securely'

              }

            </div>

          </div>

        </div>

      )}





      {/* Error Message */}

      {paymentError && (

        <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-2">

          <p className="text-red-200 text-xs">{paymentError}</p>

        </div>

      )}



      {/* Processing Payment Loader - Ultra compact */}

      {isProcessingPayment && (

        <div className="mt-2 bg-gray-800/30 rounded-2xl p-3 border border-gray-600/40">

          <div className="flex flex-col items-center space-y-2">

            {/* Animated Loader */}

            <div className="relative">

              <div className="w-8 h-8 border-3 border-gray-600 border-t-blue-500 rounded-full animate-spin"></div>

              <div className="absolute inset-0 w-8 h-8 border-3 border-transparent border-r-purple-500 rounded-full animate-spin" style={{animationDirection: 'reverse', animationDuration: '0.8s'}}></div>

            </div>

            

            {/* Processing Text */}

            <div className="text-center">

              <h3 className="text-white text-sm font-semibold mb-1">💳 {t('sendMoney.processingPayment')}</h3>

              <p className="text-gray-300 text-xs">Validating payment and recording on blockchain...</p>

            </div>

            

            {/* Progress Dots */}

            <div className="flex space-x-1">

              <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse"></div>

              <div className="w-1.5 h-1.5 bg-purple-500 rounded-full animate-pulse" style={{animationDelay: '0.2s'}}></div>

              <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse" style={{animationDelay: '0.4s'}}></div>

            </div>

          </div>

        </div>

      )}



      {/* Continue Button for other payment methods - Ultra compact */}

      {selectedPaymentMethod && selectedPaymentMethod !== 'credit-card' && !isProcessingPayment && (

        <div data-section="continue-button" className="mt-2">

          <button

            onClick={handleContinue}

            disabled={isProcessingPayment || !isPaymentMethodSelected}

            className={`w-full font-bold py-2.5 px-4 rounded-lg transition-all transform shadow-lg text-sm ${

              isPaymentMethodSelected && !isProcessingPayment

                ? 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white hover:scale-105'

                : 'bg-gray-500 text-gray-300 cursor-not-allowed'

            }`}

          >

            {t('sendMoney.continueToReview')}

          </button>

        </div>

      )}

    </div>

  );

};



export default PaymentStep;

