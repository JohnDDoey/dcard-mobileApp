'use client';

import { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useToastContext } from '@/components/ToastProvider';

interface TransactionAccordionProps {
  coupon: any;
  index: number;
}

const TransactionAccordion: React.FC<TransactionAccordionProps> = ({ coupon, index }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const { t } = useLanguage();
  const { showSuccess } = useToastContext();

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    showSuccess(`${type} copié dans le presse-papiers !`);
  };

  // Générer un hash de burn simulé (en production, ce serait le vrai hash)
  const burnTxHash = `0x${Math.random().toString(16).substr(2, 64)}`;

  return (
    <div className="bg-gray-800/40 border border-gray-600/50 rounded-2xl shadow-lg overflow-hidden">
      {/* Header de l'accordéon - ultra compact */}
      <div 
        className="p-3 cursor-pointer hover:bg-gray-700/20 transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center justify-between">
          {/* Informations principales - une ligne */}
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-base font-bold text-white">{coupon.beneficiary}</div>
                <div className="text-xs text-gray-300">
                  {((parseInt(coupon.amount) / 100)).toFixed(0)} EUR → {((parseInt(coupon.amount) * 6.55957) / 100).toFixed(2)} XAF
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  coupon.used ? 'bg-blue-500 text-white' : 'bg-green-500 text-white'
                }`}>
                  {coupon.used ? t('transaction.done') : t('transaction.active')}
                </span>
                <svg 
                  className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${
                    isExpanded ? 'rotate-180' : ''
                  }`} 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contenu expandable - Résumé complet de transaction */}
      {isExpanded && (
        <div className="border-t border-gray-600/50 p-4 space-y-4 animate-in slide-in-from-top-2 duration-200">
          {/* Reçu DCARD - Style identique à ReviewStep */}
          <div className="bg-white rounded-2xl p-4 text-black">
            <div className="text-center mb-4">
              <h3 className="text-lg font-bold text-gray-800">DCARD</h3>
              <p className="text-sm text-gray-600">{t('transaction.transactionReceipt')}</p>
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">{t('transaction.transactionId')}</span>
                <span className="font-mono text-sm">TXN-{Math.floor(Math.random() * 10000000000)}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-600">{t('transaction.date')}</span>
                <span className="text-sm">{new Date(coupon.createdAt).toLocaleDateString('en-US', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric',
                  hour: '2-digit', 
                  minute: '2-digit',
                  hour12: true
                })}</span>
              </div>
              
              <div className="border-t pt-3">
                <h4 className="font-semibold text-gray-800 mb-2">{t('transaction.transferDetails')}</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">{t('transaction.amount')}</span>
                    <span className="font-semibold">{((parseInt(coupon.amount) / 100)).toFixed(0)} EUR</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">{t('transaction.companyFee')}</span>
                    <span>300.00 EUR</span>
                  </div>
                  <div className="flex justify-between border-t pt-2">
                    <span className="font-semibold">{t('transaction.totalPaid')}</span>
                    <span className="font-semibold">{(parseInt(coupon.amount) / 100 + 300).toFixed(2)} EUR</span>
                  </div>
                </div>
              </div>
              
              <div className="border-t pt-3">
                <h4 className="font-semibold text-gray-800 mb-2">{t('transaction.receiverDetails')}</h4>
                <div className="space-y-1">
                  <div className="flex justify-between">
                    <span className="text-gray-600">{t('transaction.name')}</span>
                    <span className="text-sm">{coupon.beneficiary}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">{t('transaction.country')}</span>
                    <span className="text-sm">{coupon.receiverCountry || 'Unknown'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">{t('transaction.amountReceived')}</span>
                    <span className="font-semibold">{((parseInt(coupon.amount) * 6.55957) / 100).toFixed(2)} XAF</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Cashback Coupon */}
          <div className="bg-gradient-to-br from-yellow-400/20 to-orange-500/20 rounded-2xl p-3 border border-yellow-500/30">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-semibold text-white">{t('transaction.cashbackCoupon')}</h3>
              <span className="bg-red-500 text-white text-xs px-2 py-1 rounded">{t('transaction.new')}</span>
            </div>
            
            <div className="bg-yellow-100 rounded-lg p-2 border border-yellow-300">
              <div className="flex items-center justify-between">
                <span className="font-mono font-bold text-sm text-gray-900">{coupon.code}</span>
                <button
                  onClick={() => copyToClipboard(coupon.code, t('transaction.copyCode'))}
                  className="bg-yellow-500 hover:bg-yellow-600 text-white p-1 rounded transition-colors"
                >
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {/* Blockchain Transactions */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-white">{t('transaction.blockchainTransactions')}</h4>
            
            {/* Transaction de création */}
            <div className="bg-gray-700/30 rounded-lg p-3">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm font-medium text-white">{t('transaction.creationTx')}</span>
                </div>
                <button 
                  onClick={() => copyToClipboard('0x0021a040...64683796', t('transaction.creationHashCopied'))}
                  className="text-blue-400 hover:text-blue-300 text-xs p-1 rounded hover:bg-blue-500/20 transition-colors"
                >
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </button>
              </div>
              <div className="text-xs font-mono text-blue-400 break-all">0x0021a040...64683796</div>
            </div>

            {/* Transaction de burn (si completed) */}
            {coupon.used && (
              <div className="bg-red-500/20 rounded-lg p-3 border border-red-500/30">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    <span className="text-sm font-medium text-white">{t('transaction.burnTx')}</span>
                    <span className="bg-red-500/30 text-red-300 text-xs px-2 py-1 rounded">{t('transaction.completed')}</span>
                  </div>
                  <button 
                    onClick={() => copyToClipboard(burnTxHash, t('transaction.burnHashCopied'))}
                    className="text-red-400 hover:text-red-300 text-xs p-1 rounded hover:bg-red-500/20 transition-colors"
                  >
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  </button>
                </div>
                <div className="text-xs font-mono text-red-400 break-all">{burnTxHash}</div>
                <div className="text-xs text-red-300 mt-1">{t('transaction.couponBurned')}</div>
              </div>
            )}
          </div>

          {/* Bouton Download PDF */}
          <div className="flex space-x-2">
            <button 
              onClick={() => {
                // Logique pour générer et télécharger le PDF
                console.log('Generate PDF receipt for transaction:', coupon.code);
                showSuccess(t('transaction.pdfGenerated'));
              }}
              className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold py-3 px-4 rounded-lg transition-all transform hover:scale-105 shadow-lg"
            >
              <div className="flex items-center justify-center space-x-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span>{t('transaction.downloadPdf')}</span>
              </div>
            </button>
            
            <button 
              onClick={() => window.open('https://etherscan.io', '_blank')}
              className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 px-4 rounded-lg transition-all transform hover:scale-105"
              title={t('transaction.viewOnExplorer')}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TransactionAccordion;
