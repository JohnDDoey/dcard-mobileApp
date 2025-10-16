'use client';

import { useState } from 'react';
import { useFlutterwave, closePaymentModal } from 'flutterwave-react-v3';
import { useLanguage } from '@/contexts/LanguageContext';

interface FlutterwavePaymentProps {
  amount: number;
  currency: string;
  email: string;
  customer_name: string;
  phone_number?: string;
  onSuccess: (response: any) => void;
  onClose: () => void;
  onError: (error: any) => void;
}

const FlutterwavePayment: React.FC<FlutterwavePaymentProps> = ({
  amount,
  currency,
  email,
  customer_name,
  phone_number,
  onSuccess,
  onClose,
  onError
}) => {
  const { t } = useLanguage();
  const [isLoading, setIsLoading] = useState(false);

  const config = {
    public_key: process.env.NEXT_PUBLIC_FLUTTERWAVE_PUBLIC_KEY || 'FLWPUBK_TEST-239c26e72045875ae9d37359a50c097b-X',
    tx_ref: `dcard_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    amount: amount,
    currency: currency,
    payment_options: 'card,mobilemoney,banktransfer',
    customer: {
      email: email,
      phone_number: phone_number || '',
      name: customer_name
    },
    customizations: {
      title: 'DCARD Money Transfer',
      description: 'Secure money transfer via DCARD',
      logo: '/logo.png'
    },
    meta: {
      source: 'dcard-mobile-app',
      transfer_id: `transfer_${Date.now()}`
    }
  };

  const handleFlutterPayment = useFlutterwave(config);

  const initiatePayment = async () => {
    setIsLoading(true);
    
    try {
      console.log('🚀 Initiating Flutterwave payment...');
      console.log('   Amount:', amount, currency);
      console.log('   Customer:', customer_name, email);

      // Appeler l'API Flutterwave
      const response = await handleFlutterPayment({
        callback: async (response) => {
          console.log('💳 Flutterwave payment response:', response);
          
          if (response.status === 'successful') {
            // Vérifier le paiement côté backend
            const verifyResponse = await fetch('/api/payments/verify', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                transaction_id: response.transaction_id,
                tx_ref: response.tx_ref
              })
            });

            const verifyResult = await verifyResponse.json();
            
            if (verifyResult.success) {
              console.log('✅ Payment verified successfully');
              onSuccess(verifyResult.data);
            } else {
              console.error('❌ Payment verification failed:', verifyResult.error);
              onError(verifyResult.error);
            }
          } else {
            console.log('❌ Payment failed:', response);
            onError(response.message || 'Payment failed');
          }
          
          closePaymentModal();
        },
        onClose: () => {
          console.log('🚪 Payment modal closed');
          onClose();
        }
      });

    } catch (error) {
      console.error('❌ Error initiating payment:', error);
      onError(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full">
      <button
        onClick={initiatePayment}
        disabled={isLoading}
        className={`
          w-full py-3 px-4 rounded-lg font-medium text-sm transition-all duration-200
          ${isLoading 
            ? 'bg-gray-600 text-gray-400 cursor-not-allowed' 
            : 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl'
          }
        `}
      >
        {isLoading ? (
          <div className="flex items-center justify-center space-x-2">
            <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
            <span>Processing Payment...</span>
          </div>
        ) : (
          <div className="flex items-center justify-center space-x-2">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
            </svg>
            <span>Pay with Flutterwave</span>
          </div>
        )}
      </button>
      
      <div className="mt-3 text-center">
        <p className="text-xs text-gray-400">
          Secure payment powered by Flutterwave
        </p>
        <div className="flex justify-center items-center space-x-4 mt-2">
          <span className="text-xs text-gray-500">💳 Cards</span>
          <span className="text-xs text-gray-500">📱 Mobile Money</span>
          <span className="text-xs text-gray-500">🏦 Bank Transfer</span>
        </div>
      </div>
    </div>
  );
};

export default FlutterwavePayment;
