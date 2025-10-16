'use client';

import { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

interface ReviewStepProps {
  couponCode: string;
  transactionData: {
    amountSent: string;
    amountReceived: string;
    currencySent: string;
    currencyReceived: string;
    receiverName: string;
    receiverCountry: string;
    receiverPhone: string;
  };
  onStartNewTransfer: () => void;
}

const ReviewStep: React.FC<ReviewStepProps> = ({ 
  couponCode, 
  transactionData, 
  onStartNewTransfer 
}) => {
  const { t } = useLanguage();
  const [couponCopied, setCouponCopied] = useState(false);

  // Générer un numéro de transaction
  const transactionId = `TXN-${Date.now().toString().slice(-10)}`;
  
  // Date actuelle
  const currentDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });

  const copyCouponCode = () => {
    navigator.clipboard.writeText(couponCode);
    setCouponCopied(true);
    setTimeout(() => setCouponCopied(false), 2000);
  };

  return (
    <div className="space-y-4">
      {/* Payment Successful Banner */}
      <div className="bg-gradient-to-r from-green-500/20 to-blue-500/20 rounded-2xl p-6 border border-green-500/30 text-center">
        <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">Payment Successful!</h2>
        <p className="text-gray-300">Your transfer has been processed successfully</p>
      </div>

      {/* DCARD Receipt */}
      <div className="bg-white rounded-2xl p-4 text-black">
        <div className="text-center mb-4">
          <h3 className="text-xl font-bold text-gray-800">DCARD</h3>
          <p className="text-sm text-gray-600">Transaction Receipt</p>
        </div>
        
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-gray-600">Transaction ID:</span>
            <span className="font-mono text-sm">{transactionId}</span>
          </div>
          
          <div className="flex justify-between">
            <span className="text-gray-600">Date:</span>
            <span className="text-sm">{currentDate}</span>
          </div>
          
          <div className="border-t pt-3">
            <h4 className="font-semibold text-gray-800 mb-2">Transfer Details</h4>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Amount:</span>
                <span className="font-semibold">{transactionData.amountSent} {transactionData.currencySent}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Company fee:</span>
                <span>300.00 {transactionData.currencySent}</span>
              </div>
              <div className="flex justify-between border-t pt-2">
                <span className="font-semibold">Total paid:</span>
                <span className="font-semibold">{(parseFloat(transactionData.amountSent) + 300).toFixed(2)} {transactionData.currencySent}</span>
              </div>
            </div>
          </div>
          
          <div className="border-t pt-3">
            <h4 className="font-semibold text-gray-800 mb-2">Receiver Details</h4>
            <div className="space-y-1">
              <div className="flex justify-between">
                <span className="text-gray-600">Name:</span>
                <span className="text-sm">{transactionData.receiverName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Phone:</span>
                <span className="text-sm">{transactionData.receiverPhone}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Country:</span>
                <span className="text-sm">{transactionData.receiverCountry}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Amount received:</span>
                <span className="font-semibold">{transactionData.amountReceived} {transactionData.currencyReceived}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Cashback Coupon */}
      <div className="bg-gradient-to-br from-yellow-400/20 to-orange-500/20 rounded-2xl p-4 border border-yellow-500/30">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold text-white">Cashback Coupon</h3>
          <span className="bg-red-500 text-white text-xs px-2 py-1 rounded">NEW</span>
        </div>
        
        <div className="bg-yellow-100 rounded-lg p-3 border border-yellow-300">
          <p className="text-gray-800 text-sm mb-2">Share this code with your receiver to claim cashback at our partner stores</p>
          <div className="flex items-center justify-between">
            <span className="font-mono font-bold text-lg text-gray-900">{couponCode}</span>
            <button
              onClick={copyCouponCode}
              className="bg-yellow-500 hover:bg-yellow-600 text-white p-2 rounded-lg transition-colors"
            >
              {couponCopied ? (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-3">
        <button
          onClick={() => {
            // Logique pour télécharger le reçu
            console.log('Download receipt');
          }}
          className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold py-3 px-4 rounded-lg transition-all transform hover:scale-105 shadow-lg"
        >
          Download Receipt
        </button>
        
        <button
          onClick={onStartNewTransfer}
          className="w-full bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 px-4 rounded-lg transition-all transform hover:scale-105"
        >
          Send Another Transfer
        </button>
      </div>

      {/* Notification de copie */}
      {couponCopied && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50">
          Code coupon copié dans le presse-papiers !
        </div>
      )}
    </div>
  );
};

export default ReviewStep;