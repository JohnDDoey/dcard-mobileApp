'use client';

import { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

interface GooglePayWidgetProps {
  amount: number;
  currency: string;
  onPaymentSuccess: (paymentData: any) => void;
  onCancel: () => void;
}

const GooglePayWidget: React.FC<GooglePayWidgetProps> = ({
  amount,
  currency,
  onPaymentSuccess,
  onCancel
}) => {
  const { t } = useLanguage();
  const [selectedAccount, setSelectedAccount] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const googlePayAccounts = [
    {
      id: 'account1',
      name: 'John Doe',
      email: 'john.doe@gmail.com',
      last4: '1234',
      type: 'Debit Card'
    },
    {
      id: 'account2', 
      name: 'John Doe',
      email: 'john.doe@gmail.com',
      last4: '5678',
      type: 'Credit Card'
    },
    {
      id: 'account3',
      name: 'John Doe', 
      email: 'john.doe@gmail.com',
      last4: '9012',
      type: 'Bank Account'
    }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedAccount) {
      return;
    }

    setIsProcessing(true);
    
    try {
      // Simulation du traitement Google Pay
      console.log('📱 Processing Google Pay payment...');
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const selectedAcc = googlePayAccounts.find(acc => acc.id === selectedAccount);
      const paymentData = {
        method: 'google-pay',
        account: selectedAcc,
        amount,
        currency,
        transactionId: `GP_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`
      };
      
      onPaymentSuccess(paymentData);
      
    } catch (error) {
      console.error('Google Pay payment failed:', error);
      setIsProcessing(false);
    }
  };

  return (
    <div className="bg-gray-800/90 backdrop-blur-sm rounded-lg p-4 border border-gray-600">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-red-500 rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-sm">G</span>
          </div>
          <h3 className="text-white font-medium">Google Pay</h3>
        </div>
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
        <div>
          <label className="block text-gray-300 text-sm mb-2">Select Payment Method</label>
          <div className="space-y-2">
            {googlePayAccounts.map((account) => (
              <label
                key={account.id}
                className={`
                  flex items-center p-3 rounded-lg border cursor-pointer transition-all
                  ${selectedAccount === account.id
                    ? 'border-blue-500 bg-blue-500/10'
                    : 'border-gray-600 bg-gray-700/50 hover:border-gray-500'
                  }
                `}
              >
                <input
                  type="radio"
                  name="account"
                  value={account.id}
                  checked={selectedAccount === account.id}
                  onChange={(e) => setSelectedAccount(e.target.value)}
                  className="mr-3"
                />
                <div className="flex-1">
                  <div className="text-white text-sm font-medium">{account.name}</div>
                  <div className="text-gray-400 text-xs">{account.email}</div>
                  <div className="text-gray-400 text-xs">
                    {account.type} ending in {account.last4}
                  </div>
                </div>
                <div className="text-blue-400 text-xs">●●●●</div>
              </label>
            ))}
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isProcessing || !selectedAccount}
          className={`
            w-full py-3 px-4 rounded-lg font-medium transition-all duration-200
            ${isProcessing || !selectedAccount
              ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
              : 'bg-gradient-to-r from-blue-500 to-red-500 hover:from-blue-600 hover:to-red-600 text-white shadow-lg hover:shadow-xl'
            }
          `}
        >
          {isProcessing ? (
            <div className="flex items-center justify-center space-x-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Processing with Google Pay...</span>
            </div>
          ) : (
            `Pay with Google Pay - ${amount} ${currency}`
          )}
        </button>
      </form>

      <div className="mt-3 text-center">
        <p className="text-gray-400 text-xs">
          🔒 Secured by Google Pay • Biometric authentication required
        </p>
      </div>
    </div>
  );
};

export default GooglePayWidget;



