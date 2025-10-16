'use client';

import { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

interface BankTransferWidgetProps {
  amount: number;
  currency: string;
  onPaymentSuccess: (paymentData: any) => void;
  onCancel: () => void;
}

const BankTransferWidget: React.FC<BankTransferWidgetProps> = ({
  amount,
  currency,
  onPaymentSuccess,
  onCancel
}) => {
  const { t } = useLanguage();
  const [bankName, setBankName] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [routingNumber, setRoutingNumber] = useState('');
  const [accountHolderName, setAccountHolderName] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const banks = [
    'Bank of America',
    'Wells Fargo',
    'Chase Bank',
    'Citibank',
    'Capital One',
    'US Bank',
    'PNC Bank',
    'TD Bank'
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!bankName || !accountNumber || !routingNumber || !accountHolderName) {
      return;
    }

    setIsProcessing(true);
    
    try {
      // Simulation du traitement du virement bancaire
      console.log('🏦 Processing bank transfer...');
      await new Promise(resolve => setTimeout(resolve, 2500));
      
      const paymentData = {
        method: 'bank-transfer',
        bankName,
        accountNumber,
        routingNumber,
        accountHolderName,
        amount,
        currency,
        transactionId: `BT_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`
      };
      
      onPaymentSuccess(paymentData);
      
    } catch (error) {
      console.error('Bank transfer failed:', error);
      setIsProcessing(false);
    }
  };

  return (
    <div className="bg-gray-800/90 backdrop-blur-sm rounded-lg p-4 border border-gray-600">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-sm">🏦</span>
          </div>
          <h3 className="text-white font-medium">Bank Transfer</h3>
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
          <span className="text-gray-300 text-sm">Amount to transfer:</span>
          <span className="text-white font-semibold">{amount} {currency}</span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Bank Name */}
        <div>
          <label className="block text-gray-300 text-sm mb-1">Bank Name</label>
          <select
            value={bankName}
            onChange={(e) => setBankName(e.target.value)}
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-blue-500 focus:outline-none"
            required
          >
            <option value="">Select your bank</option>
            {banks.map((bank) => (
              <option key={bank} value={bank}>{bank}</option>
            ))}
          </select>
        </div>

        {/* Account Number */}
        <div>
          <label className="block text-gray-300 text-sm mb-1">Account Number</label>
          <input
            type="text"
            value={accountNumber}
            onChange={(e) => setAccountNumber(e.target.value.replace(/\D/g, ''))}
            placeholder="Enter your account number"
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none"
            required
          />
        </div>

        {/* Routing Number */}
        <div>
          <label className="block text-gray-300 text-sm mb-1">Routing Number</label>
          <input
            type="text"
            value={routingNumber}
            onChange={(e) => setRoutingNumber(e.target.value.replace(/\D/g, '').substring(0, 9))}
            placeholder="Enter 9-digit routing number"
            maxLength={9}
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none"
            required
          />
        </div>

        {/* Account Holder Name */}
        <div>
          <label className="block text-gray-300 text-sm mb-1">Account Holder Name</label>
          <input
            type="text"
            value={accountHolderName}
            onChange={(e) => setAccountHolderName(e.target.value)}
            placeholder="Enter account holder's full name"
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none"
            required
          />
        </div>

        {/* Security Notice */}
        <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3">
          <div className="flex items-start space-x-2">
            <span className="text-yellow-400 text-sm">⚠️</span>
            <div className="text-yellow-300 text-xs">
              <p className="font-medium mb-1">Security Notice:</p>
              <ul className="space-y-1 text-xs">
                <li>• Bank transfers may take 1-3 business days</li>
                <li>• Ensure account details are correct</li>
                <li>• You will receive a confirmation email</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isProcessing || !bankName || !accountNumber || !routingNumber || !accountHolderName}
          className={`
            w-full py-3 px-4 rounded-lg font-medium transition-all duration-200
            ${isProcessing || !bankName || !accountNumber || !routingNumber || !accountHolderName
              ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
              : 'bg-green-600 hover:bg-green-700 text-white shadow-lg hover:shadow-xl'
            }
          `}
        >
          {isProcessing ? (
            <div className="flex items-center justify-center space-x-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Processing Bank Transfer...</span>
            </div>
          ) : (
            `Initiate Transfer - ${amount} ${currency}`
          )}
        </button>
      </form>

      <div className="mt-3 text-center">
        <p className="text-gray-400 text-xs">
          🏛️ Your bank account will be debited for this transaction
        </p>
      </div>
    </div>
  );
};

export default BankTransferWidget;
