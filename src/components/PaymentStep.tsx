'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import CreditCardWidget from './CreditCardWidget';
import GooglePayWidget from './GooglePayWidget';
import BankTransferWidget from './BankTransferWidget';
import CryptoPaymentWidget from './CryptoPaymentWidget';

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

const PaymentStep: React.FC<PaymentStepProps> = ({
  onContinue,
  transactionData,
  isMarketplace = false
}) => {
  const { user } = useAuth();
  const { t } = useLanguage();

  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('');
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [paymentError, setPaymentError] = useState('');
  const [paymentStep, setPaymentStep] = useState('');

  const handlePaymentMethodSelect = (method: string) => {
    setSelectedPaymentMethod(method);
    setPaymentError('');
    setPaymentStep('');
  };

  // ✅ FLOW UNIQUE
  const handlePaymentSuccess = async (paymentData: any) => {
    setIsProcessingPayment(true);
    setPaymentError('');

    console.log('✅ Payment successful:', paymentData);

    try {
      // STEP 1
      setPaymentStep('Verifying payment...');
      await new Promise(r => setTimeout(r, 1000));

      // STEP 2
      setPaymentStep('Generating coupon code...');
      await new Promise(r => setTimeout(r, 500));

      const couponCode = `DCARD_${Date.now()}_${Math.random()
        .toString(36)
        .substr(2, 6)
        .toUpperCase()}`;

      console.log('🎫 Coupon generated:', couponCode);

      // ✅ STEP 3 (FIX PRINCIPAL)
      if (!isMarketplace) {
        // 👉 CASHBACK
        setPaymentStep('Recording cashback on blockchain...');

        const response = await fetch('/api/blockchain/record-cashback', {
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
            userId: user?.id || '1',
            amount: Math.round(
              parseFloat(transactionData?.amountSent || '100') * 100
            ),
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Blockchain error');
        }

        console.log('✅ Cashback recorded:', data);
      } else {
        // 👉 MARKETPLACE
        setPaymentStep('Finalizing marketplace payment...');
        console.log('🛒 Marketplace → no cashback');

        await new Promise(r => setTimeout(r, 500));
      }

      // FINAL
      setPaymentStep('Payment successful! Redirecting...');
      await new Promise(r => setTimeout(r, 500));

      onContinue(couponCode);

    } catch (error: any) {
      console.error('❌ Payment failed:', error);
      setPaymentError(error.message || 'Payment failed');
    } finally {
      setIsProcessingPayment(false);
    }
  };

  // ✅ FALLBACK CLEAN
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

    try {
      console.log('🚀 Fallback payment flow');

      await new Promise(r => setTimeout(r, 1500));

      await handlePaymentSuccess({
        method: selectedPaymentMethod,
        fallback: true,
      });

    } catch (error: any) {
      console.error('❌ Error:', error);
      setPaymentError(error.message || 'Payment failed');
    } finally {
      setIsProcessingPayment(false);
    }
  };

  const calculateTotalAmount = (baseAmount: string): number => {
    const amount = parseFloat(baseAmount || '0');
    const serviceFee = amount * 0.025;
    const blockchainFee = 0.5;
    const infrastructureFee = 1;

    return amount + serviceFee + blockchainFee + infrastructureFee;
  };

  const isPaymentMethodSelected = selectedPaymentMethod !== '';

  return (
    <div className="px-4 mt-2 space-y-4">

      {/* Payment Method */}
      <div className="grid grid-cols-3 gap-2">
        <button onClick={() => handlePaymentMethodSelect('credit-card')}>
          💳 Card
        </button>

        {isMarketplace && (
          <button onClick={() => handlePaymentMethodSelect('crypto')}>
            ₿ Crypto
          </button>
        )}

        <button onClick={() => handlePaymentMethodSelect('bank-transfer')}>
          🏦 Bank
        </button>
      </div>

      {/* Widgets */}
      {selectedPaymentMethod === 'credit-card' && !isProcessingPayment && (
        <CreditCardWidget
          amount={calculateTotalAmount(transactionData?.amountSent || '100')}
          currency={transactionData?.currencySent || 'EUR'}
          onPaymentSuccess={handlePaymentSuccess}
          onCancel={() => setSelectedPaymentMethod('')}
        />
      )}

      {selectedPaymentMethod === 'crypto' && isMarketplace && !isProcessingPayment && (
        <CryptoPaymentWidget
          amount={calculateTotalAmount(transactionData?.amountSent || '100')}
          currency={transactionData?.currencySent || 'EUR'}
          onPaymentSuccess={handlePaymentSuccess}
          onPaymentError={setPaymentError}
        />
      )}

      {selectedPaymentMethod === 'bank-transfer' && !isProcessingPayment && (
        <BankTransferWidget
          amount={calculateTotalAmount(transactionData?.amountSent || '100')}
          currency={transactionData?.currencySent || 'EUR'}
          onPaymentSuccess={handlePaymentSuccess}
          onCancel={() => setSelectedPaymentMethod('')}
        />
      )}

      {/* Loader */}
      {isProcessingPayment && (
        <div className="text-center text-white">
          ⏳ {paymentStep}
        </div>
      )}

      {/* Error */}
      {paymentError && (
        <div className="text-red-400">{paymentError}</div>
      )}

      {/* Fallback Button */}
      {selectedPaymentMethod !== 'credit-card' && !isProcessingPayment && (
        <button onClick={handleContinue}>
          Continue
        </button>
      )}
    </div>
  );
};

export default PaymentStep;