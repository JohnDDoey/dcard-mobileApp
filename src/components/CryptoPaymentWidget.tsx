'use client';

import { useState, useEffect } from 'react';

interface CryptoPaymentWidgetProps {
  amount: number;
  currency: string;
  onPaymentSuccess: (paymentData: any) => void;
  onPaymentError: (error: string) => void;
}

interface CryptoOption {
  id: string;
  name: string;
  symbol: string;
  icon: string;
  color: string;
  rate: number; // Taux de change vers EUR
}

const CryptoPaymentWidget: React.FC<CryptoPaymentWidgetProps> = ({
  amount,
  currency,
  onPaymentSuccess,
  onPaymentError
}) => {
  const [selectedCrypto, setSelectedCrypto] = useState<string>('');
  const [cryptoAmount, setCryptoAmount] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [walletAddress, setWalletAddress] = useState<string>('');
  const [showQRCode, setShowQRCode] = useState(false);

  // Options de crypto disponibles
  const cryptoOptions: CryptoOption[] = [
    {
      id: 'bitcoin',
      name: 'Bitcoin',
      symbol: 'BTC',
      icon: '₿',
      color: '#F7931A',
      rate: 0.000023 // 1 EUR = 0.000023 BTC (exemple)
    },
    {
      id: 'ethereum',
      name: 'Ethereum',
      symbol: 'ETH',
      icon: 'Ξ',
      color: '#627EEA',
      rate: 0.00038 // 1 EUR = 0.00038 ETH (exemple)
    },
    {
      id: 'usdc',
      name: 'USD Coin',
      symbol: 'USDC',
      icon: '💵',
      color: '#2775CA',
      rate: 1.1 // 1 EUR = 1.1 USDC (exemple)
    }
  ];

  // Adresses de wallet pour les tests (en production, utiliser des adresses réelles)
  const walletAddresses = {
    bitcoin: 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh',
    ethereum: '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6',
    usdc: '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6'
  };

  // Calculer le montant en crypto
  useEffect(() => {
    if (selectedCrypto && amount) {
      const crypto = cryptoOptions.find(c => c.id === selectedCrypto);
      if (crypto) {
        const cryptoAmount = (amount * crypto.rate).toFixed(8);
        setCryptoAmount(cryptoAmount);
      }
    }
  }, [selectedCrypto, amount]);

  // Générer l'adresse de wallet
  useEffect(() => {
    if (selectedCrypto) {
      setWalletAddress(walletAddresses[selectedCrypto as keyof typeof walletAddresses] || '');
    }
  }, [selectedCrypto]);

  const handleCryptoSelect = (cryptoId: string) => {
    setSelectedCrypto(cryptoId);
    setShowQRCode(false);
  };

  const handlePayment = async () => {
    if (!selectedCrypto || !cryptoAmount) {
      onPaymentError('Veuillez sélectionner une crypto et vérifier le montant');
      return;
    }

    setIsProcessing(true);

    try {
      // Simulation de vérification de paiement crypto
      await new Promise(resolve => setTimeout(resolve, 3000));

      // En production, ici on vérifierait réellement la transaction blockchain
      const paymentData = {
        crypto: selectedCrypto,
        amount: cryptoAmount,
        walletAddress,
        transactionHash: `0x${Math.random().toString(16).substr(2, 64)}`, // Hash simulé
        timestamp: Date.now()
      };

      onPaymentSuccess(paymentData);
    } catch (error) {
      onPaymentError('Erreur lors du traitement du paiement crypto');
    } finally {
      setIsProcessing(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // Toast notification pourrait être ajoutée ici
  };

  return (
    <div className="bg-gradient-to-br from-gray-800 to-gray-900 border border-white/20 rounded-xl p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full flex items-center justify-center">
          <span className="text-white font-bold text-lg">₿</span>
        </div>
        <div>
          <h3 className="text-lg font-bold text-white">Paiement Crypto</h3>
          <p className="text-sm text-gray-400">Payez avec Bitcoin, Ethereum ou USDC</p>
        </div>
      </div>

      {/* Sélection de crypto */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-300 mb-3">
          Choisissez votre crypto-monnaie
        </label>
        <div className="grid grid-cols-1 gap-3">
          {cryptoOptions.map((crypto) => (
            <button
              key={crypto.id}
              onClick={() => handleCryptoSelect(crypto.id)}
              className={`p-4 rounded-lg border-2 transition-all ${
                selectedCrypto === crypto.id
                  ? 'border-blue-500 bg-blue-500/10'
                  : 'border-gray-600 hover:border-gray-500'
              }`}
            >
              <div className="flex items-center gap-3">
                <div 
                  className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold"
                  style={{ backgroundColor: crypto.color }}
                >
                  {crypto.icon}
                </div>
                <div className="flex-1 text-left">
                  <div className="font-semibold text-white">{crypto.name}</div>
                  <div className="text-sm text-gray-400">{crypto.symbol}</div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-400">Taux: {crypto.rate}</div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Montant en crypto */}
      {selectedCrypto && (
        <div className="mb-6">
          <div className="bg-gray-700/50 rounded-lg p-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-300">Montant à payer</span>
              <span className="text-white font-semibold">
                {cryptoAmount} {cryptoOptions.find(c => c.id === selectedCrypto)?.symbol}
              </span>
            </div>
            <div className="flex justify-between items-center text-sm text-gray-400">
              <span>Équivalent à</span>
              <span>{amount.toFixed(2)} {currency}</span>
            </div>
          </div>
        </div>
      )}

      {/* Adresse de wallet */}
      {selectedCrypto && walletAddress && (
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Adresse de réception
          </label>
          <div className="bg-gray-700/50 rounded-lg p-3 flex items-center gap-3">
            <code className="flex-1 text-xs text-gray-300 font-mono break-all">
              {walletAddress}
            </code>
            <button
              onClick={() => copyToClipboard(walletAddress)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-xs"
            >
              Copier
            </button>
          </div>
          <p className="text-xs text-gray-400 mt-2">
            Envoyez exactement {cryptoAmount} {cryptoOptions.find(c => c.id === selectedCrypto)?.symbol} à cette adresse
          </p>
        </div>
      )}

      {/* QR Code (simulation) */}
      {selectedCrypto && (
        <div className="mb-6">
          <button
            onClick={() => setShowQRCode(!showQRCode)}
            className="w-full bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 rounded-lg transition-colors"
          >
            {showQRCode ? 'Masquer' : 'Afficher'} QR Code
          </button>
          {showQRCode && (
            <div className="mt-4 bg-white p-4 rounded-lg text-center">
              <div className="w-48 h-48 bg-gray-200 mx-auto mb-2 flex items-center justify-center">
                <span className="text-gray-500">QR Code</span>
              </div>
              <p className="text-xs text-gray-600">
                Scannez avec votre wallet crypto
              </p>
            </div>
          )}
        </div>
      )}

      {/* Bouton de paiement */}
      {selectedCrypto && (
        <button
          onClick={handlePayment}
          disabled={isProcessing}
          className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 disabled:from-gray-600 disabled:to-gray-700 text-white font-bold py-3 px-6 rounded-lg transition-all duration-200 disabled:cursor-not-allowed"
        >
          {isProcessing ? (
            <div className="flex items-center justify-center gap-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Vérification du paiement...
            </div>
          ) : (
            `Payer avec ${cryptoOptions.find(c => c.id === selectedCrypto)?.name}`
          )}
        </button>
      )}

      {/* Informations de sécurité */}
      <div className="mt-6 p-4 bg-blue-900/20 border border-blue-500/30 rounded-lg">
        <div className="flex items-start gap-2">
          <div className="text-blue-400 text-sm">🔒</div>
          <div className="text-xs text-blue-300">
            <p className="font-semibold mb-1">Paiement sécurisé</p>
            <p>Votre transaction est vérifiée sur la blockchain. Aucune donnée sensible n'est stockée.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CryptoPaymentWidget;
