'use client';

import { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

interface CreditCardFormProps {
  onContinue: () => void;
}

const CreditCardForm: React.FC<CreditCardFormProps> = ({ onContinue }) => {
  const { t } = useLanguage();
  const [cardData, setCardData] = useState({
    cardNumber: '',
    cardholderName: '',
    expiryDate: '',
    cvv: ''
  });
  const [errors, setErrors] = useState<{[key: string]: string}>({});

  const handleInputChange = (field: string, value: string) => {
    setCardData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};
    
    if (!cardData.cardNumber.trim()) {
      newErrors.cardNumber = 'Le numéro de carte est requis';
    } else if (cardData.cardNumber.replace(/\s/g, '').length < 16) {
      newErrors.cardNumber = 'Le numéro de carte doit contenir 16 chiffres';
    }
    
    if (!cardData.cardholderName.trim()) {
      newErrors.cardholderName = 'Le nom du titulaire est requis';
    }
    
    if (!cardData.expiryDate.trim()) {
      newErrors.expiryDate = 'La date d\'expiration est requise';
    } else if (!/^\d{2}\/\d{2}$/.test(cardData.expiryDate)) {
      newErrors.expiryDate = 'Format MM/YY requis';
    }
    
    if (!cardData.cvv.trim()) {
      newErrors.cvv = 'Le CVV est requis';
    } else if (cardData.cvv.length < 3) {
      newErrors.cvv = 'Le CVV doit contenir 3 chiffres';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePay = () => {
    if (validateForm()) {
      setTimeout(() => {
        onContinue();
      }, 2000); // Simuler le traitement du paiement
    }
  };

  const handleButtonClick = (e: React.MouseEvent) => {
    // Effet de clic plus visible
    const button = e.currentTarget;
    button.style.transform = 'scale(0.95)';
    button.style.transition = 'transform 0.1s ease';
    
    setTimeout(() => {
      button.style.transform = 'scale(1.05)';
    }, 100);
    
    setTimeout(() => {
      button.style.transform = 'scale(1)';
      handlePay();
    }, 200);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-white mb-2 drop-shadow-lg">{t('sendMoney.payment')}</h2>
        <p className="text-gray-300 text-sm drop-shadow-md">Entrez vos informations de carte bancaire</p>
      </div>

      {/* Card Form */}
      <div className="bg-gray-800/20 rounded-2xl p-6 border border-gray-600/30">
        <div className="space-y-4">
          {/* Card Number */}
          <div>
            <label className="block text-sm font-medium text-gray-200 mb-2 drop-shadow-md">{t('sendMoney.cardNumber')} <span className="text-red-400">*</span></label>
            <input
              type="text"
              value={cardData.cardNumber}
              onChange={(e) => handleInputChange('cardNumber', e.target.value)}
              className={`w-full px-4 py-3 bg-gray-800/40 border-2 rounded-lg text-white placeholder-gray-400 focus:outline-none ${
                errors.cardNumber 
                  ? 'border-red-500 focus:border-red-500' 
                  : 'border-gray-600/50 focus:border-purple-500'
              }`}
              placeholder="1234 5678 9012 3456"
              required
            />
            {errors.cardNumber && (
              <p className="text-red-400 text-sm mt-1">{errors.cardNumber}</p>
            )}
          </div>

          {/* Cardholder Name */}
          <div>
            <label className="block text-sm font-medium text-gray-200 mb-2 drop-shadow-md">{t('sendMoney.cardHolder')} <span className="text-red-400">*</span></label>
            <input
              type="text"
              value={cardData.cardholderName}
              onChange={(e) => handleInputChange('cardholderName', e.target.value)}
              className={`w-full px-4 py-3 bg-gray-800/40 border-2 rounded-lg text-white placeholder-gray-400 focus:outline-none ${
                errors.cardholderName 
                  ? 'border-red-500 focus:border-red-500' 
                  : 'border-gray-600/50 focus:border-purple-500'
              }`}
              placeholder="John Doe"
              required
            />
            {errors.cardholderName && (
              <p className="text-red-400 text-sm mt-1">{errors.cardholderName}</p>
            )}
          </div>

          {/* Expiry Date and CVV */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-200 mb-2 drop-shadow-md">{t('sendMoney.expiryDate')} <span className="text-red-400">*</span></label>
              <input
                type="text"
                value={cardData.expiryDate}
                onChange={(e) => handleInputChange('expiryDate', e.target.value)}
                className={`w-full px-4 py-3 bg-gray-800/40 border-2 rounded-lg text-white placeholder-gray-400 focus:outline-none ${
                  errors.expiryDate 
                    ? 'border-red-500 focus:border-red-500' 
                    : 'border-gray-600/50 focus:border-purple-500'
                }`}
                placeholder="MM/YY"
                required
              />
              {errors.expiryDate && (
                <p className="text-red-400 text-sm mt-1">{errors.expiryDate}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-200 mb-2 drop-shadow-md">{t('sendMoney.cvv')} <span className="text-red-400">*</span></label>
              <input
                type="text"
                value={cardData.cvv}
                onChange={(e) => handleInputChange('cvv', e.target.value)}
                className={`w-full px-4 py-3 bg-gray-800/40 border-2 rounded-lg text-white placeholder-gray-400 focus:outline-none ${
                  errors.cvv 
                    ? 'border-red-500 focus:border-red-500' 
                    : 'border-gray-600/50 focus:border-purple-500'
                }`}
                placeholder="123"
                required
              />
              {errors.cvv && (
                <p className="text-red-400 text-sm mt-1">{errors.cvv}</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Pay Button */}
      <button
        onClick={handleButtonClick}
        className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold py-4 px-6 rounded-lg transition-all transform hover:scale-105 shadow-lg active:scale-95 active:shadow-xl"
      >
        {t('sendMoney.payment')}
      </button>
    </div>
  );
};

export default CreditCardForm;

