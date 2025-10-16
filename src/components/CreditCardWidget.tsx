'use client';

import { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

interface CreditCardWidgetProps {
  amount: number;
  currency: string;
  onPaymentSuccess: (paymentData: any) => void;
  onCancel: () => void;
}

const CreditCardWidget: React.FC<CreditCardWidgetProps> = ({
  amount,
  currency,
  onPaymentSuccess,
  onCancel
}) => {
  const { t } = useLanguage();
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [cardholderName, setCardholderName] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const formatCardNumber = (value: string) => {
    return value.replace(/\s/g, '').replace(/(.{4})/g, '$1 ').trim();
  };

  const formatExpiryDate = (value: string) => {
    return value.replace(/\D/g, '').replace(/(.{2})/, '$1/').substring(0, 5);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!cardNumber || !expiryDate || !cvv || !cardholderName) {
      return;
    }

    setIsProcessing(true);
    
    try {
      // Simulation du traitement de la carte
      console.log('💳 Processing credit card payment...');
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const paymentData = {
        method: 'credit-card',
        cardNumber: cardNumber.replace(/\s/g, ''),
        expiryDate,
        cvv,
        cardholderName,
        amount,
        currency,
        transactionId: `CC_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`
      };
      
      onPaymentSuccess(paymentData);
      
    } catch (error) {
      console.error('Credit card payment failed:', error);
      setIsProcessing(false);
    }
  };

  return (
    <div className="bg-gray-800/90 backdrop-blur-sm rounded-lg p-4 border border-gray-600">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-white font-medium">💳 Credit Card Payment</h3>
        <button
          onClick={onCancel}
          className="text-gray-400 hover:text-white transition-colors"
        >
          ✕
        </button>
      </div>

      <div className="mb-4 p-3 bg-gray-700/50 rounded-lg">
        <div className="flex justify-between items-center">
          <span className="text-gray-300 text-sm">Amount to pay:</span>
          <span className="text-white font-semibold">{amount} {currency}</span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Card Number */}
        <div>
          <label className="block text-gray-300 text-sm mb-1">Card Number</label>
          <input
            type="text"
            value={cardNumber}
            onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
            placeholder="1234 5678 9012 3456"
            maxLength={19}
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          {/* Expiry Date */}
          <div>
            <label className="block text-gray-300 text-sm mb-1">Expiry Date</label>
            <input
              type="text"
              value={expiryDate}
              onChange={(e) => setExpiryDate(formatExpiryDate(e.target.value))}
              placeholder="MM/YY"
              maxLength={5}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none"
              required
            />
          </div>

          {/* CVV */}
          <div>
            <label className="block text-gray-300 text-sm mb-1">CVV</label>
            <input
              type="text"
              value={cvv}
              onChange={(e) => setCvv(e.target.value.replace(/\D/g, '').substring(0, 4))}
              placeholder="123"
              maxLength={4}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none"
              required
            />
          </div>
        </div>

        {/* Cardholder Name */}
        <div>
          <label className="block text-gray-300 text-sm mb-1">Cardholder Name</label>
          <input
            type="text"
            value={cardholderName}
            onChange={(e) => setCardholderName(e.target.value.toUpperCase())}
            placeholder="JOHN DOE"
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none"
            required
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isProcessing || !cardNumber || !expiryDate || !cvv || !cardholderName}
          className={`
            w-full py-3 px-4 rounded-lg font-medium transition-all duration-200
            ${isProcessing || !cardNumber || !expiryDate || !cvv || !cardholderName
              ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl'
            }
          `}
        >
          {isProcessing ? (
            <div className="flex items-center justify-center space-x-2">
              <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
              <span>Processing Payment...</span>
            </div>
          ) : (
            `Pay ${amount} ${currency}`
          )}
        </button>
      </form>

      <div className="mt-3 flex justify-center items-center space-x-4">
        {/* Visa Logo */}
        <div className="flex items-center">
          <svg className="h-6 w-12" viewBox="0 0 60 20" fill="none">
            <rect width="60" height="20" fill="#1A1F71"/>
            <text x="30" y="14" textAnchor="middle" fill="white" fontSize="12" fontWeight="bold">VISA</text>
          </svg>
        </div>
        
        {/* Mastercard Logo */}
        <div className="flex items-center">
          <svg className="h-6 w-8" viewBox="0 0 40 24" fill="none">
            <circle cx="12" cy="12" r="8" fill="#EB001B"/>
            <circle cx="28" cy="12" r="8" fill="#F79E1B"/>
            <path d="M20 4.5C22.5 6.5 24 9.5 24 12C24 14.5 22.5 17.5 20 19.5C17.5 17.5 16 14.5 16 12C16 9.5 17.5 6.5 20 4.5Z" fill="#FF5F00"/>
          </svg>
        </div>
        
        <span className="text-gray-400 text-xs">Secure payment</span>
      </div>
    </div>
  );
};

export default CreditCardWidget;
