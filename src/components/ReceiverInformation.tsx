'use client';

import { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

interface ReceiverInformationProps {
  onContinue: () => void;
  selectedCountry: string;
  onReceiverData: (data: any) => void;
}

const ReceiverInformation: React.FC<ReceiverInformationProps> = ({ 
  onContinue, 
  selectedCountry, 
  onReceiverData 
}) => {
  const { t } = useLanguage();
  const [receiverData, setReceiverData] = useState({
    firstName: '',
    lastName: '',
    phoneNumber: '',
    city: ''
  });

  const handleInputChange = (field: string, value: string) => {
    setReceiverData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Vérifier si tous les champs requis sont remplis
  const isFormValid = receiverData.firstName.trim() !== '' && 
                     receiverData.lastName.trim() !== '' && 
                     receiverData.phoneNumber.trim() !== '' && 
                     receiverData.city.trim() !== '';

  const handleContinue = () => {
    if (isFormValid) {
      onReceiverData(receiverData);
      onContinue();
    }
  };

  return (
    <div className="space-y-4">
      {/* Header - Ultra compact */}
      <div className="text-center">
        <h2 className="text-base font-bold text-white mb-0.5 drop-shadow-lg">{t('sendMoney.receiverInformation')}</h2>
        <p className="text-gray-300 text-xs drop-shadow-md">Informations du destinataire</p>
      </div>

      {/* Form - Ultra compact */}
      <div className="bg-gray-800/30 rounded-2xl p-3 border border-gray-600/40">
        <div className="space-y-2.5">
          {/* First Name */}
          <div>
            <label className="block text-xs font-medium text-gray-200 mb-1 drop-shadow-md">{t('sendMoney.firstName')} *</label>
            <input
              type="text"
              required
              value={receiverData.firstName}
              onChange={(e) => handleInputChange('firstName', e.target.value)}
              className="w-full px-2.5 py-2 bg-gray-800/40 border-2 border-gray-600/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 text-sm"
              placeholder={t('sendMoney.firstName')}
            />
          </div>

          {/* Last Name */}
          <div>
            <label className="block text-xs font-medium text-gray-200 mb-1 drop-shadow-md">{t('sendMoney.lastName')} *</label>
            <input
              type="text"
              required
              value={receiverData.lastName}
              onChange={(e) => handleInputChange('lastName', e.target.value)}
              className="w-full px-2.5 py-2 bg-gray-800/40 border-2 border-gray-600/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 text-sm"
              placeholder={t('sendMoney.lastName')}
            />
          </div>

          {/* Phone Number */}
          <div>
            <label className="block text-xs font-medium text-gray-200 mb-1 drop-shadow-md">{t('sendMoney.phoneNumber')} *</label>
            <input
              type="tel"
              required
              value={receiverData.phoneNumber}
              onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
              className="w-full px-2.5 py-2 bg-gray-800/40 border-2 border-gray-600/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 text-sm"
              placeholder={t('sendMoney.phoneNumber')}
            />
          </div>

          {/* Country - Compact et non-éditable */}
          <div>
            <label className="block text-xs font-medium text-gray-200 mb-1 drop-shadow-md">{t('sendMoney.country')}</label>
            <div className="w-full px-2.5 py-2 bg-gray-800/40 border-2 border-gray-600/50 rounded-lg text-gray-300 flex items-center">
              {selectedCountry ? (
                <span className="text-sm">{selectedCountry}</span>
              ) : (
                <span className="text-sm text-gray-400">Sélectionner un pays</span>
              )}
            </div>
          </div>

          {/* City */}
          <div>
            <label className="block text-xs font-medium text-gray-200 mb-1 drop-shadow-md">{t('sendMoney.city')} *</label>
            <input
              type="text"
              required
              value={receiverData.city}
              onChange={(e) => handleInputChange('city', e.target.value)}
              className="w-full px-2.5 py-2 bg-gray-800/40 border-2 border-gray-600/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 text-sm"
              placeholder={t('sendMoney.city')}
            />
          </div>
        </div>
      </div>

      {/* Continue Button - Grisé si formulaire invalide */}
      <button
        onClick={handleContinue}
        disabled={!isFormValid}
        className={`w-full font-bold py-2.5 px-4 rounded-lg transition-all transform shadow-lg text-sm ${
          isFormValid 
            ? 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white hover:scale-105' 
            : 'bg-gray-500 text-gray-300 cursor-not-allowed'
        }`}
      >
        {t('sendMoney.continue')}
      </button>
    </div>
  );
};

export default ReceiverInformation;