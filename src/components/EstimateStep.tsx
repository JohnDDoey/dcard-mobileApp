'use client';

import { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import AnimatedList from './AnimatedList';
import countriesData from '@/data/countries.json';

interface EstimateStepProps {
  onContinue: () => void;
  onCountrySelect?: (country: string) => void;
  onEstimateData?: (data: any) => void;
}

const EstimateStep: React.FC<EstimateStepProps> = ({ onContinue, onCountrySelect, onEstimateData }) => {
  const { t } = useLanguage();
  const [selectedCountry, setSelectedCountry] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [fromAmount, setFromAmount] = useState('');
  const [fromCurrency, setFromCurrency] = useState('EUR');
  const [toCurrency, setToCurrency] = useState('XAF');
  const [hasCalculated, setHasCalculated] = useState(false);
  const [selectedDelivery, setSelectedDelivery] = useState('');
  const [selectedPayment, setSelectedPayment] = useState('');
  const [showPaymentOptions, setShowPaymentOptions] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('');
  const [showTransactionSummary, setShowTransactionSummary] = useState(false);
  
  // Nouveaux états pour les taux de change réels
  const [exchangeRates, setExchangeRates] = useState<any>(null);
  const [loadingRates, setLoadingRates] = useState(false);
  const [ratesError, setRatesError] = useState('');
  
  // Charger les taux de change au montage
  useEffect(() => {
    fetchExchangeRates();
  }, []);
  
  const fetchExchangeRates = async () => {
    setLoadingRates(true);
    try {
      const response = await fetch('/api/exchange-rates');
      const result = await response.json();
      
      if (result.success) {
        setExchangeRates(result.data);
        console.log('✅ Exchange rates loaded:', result.data);
      } else {
        setRatesError('Failed to load exchange rates');
      }
    } catch (error) {
      console.error('Error fetching exchange rates:', error);
      setRatesError('Error loading exchange rates');
    } finally {
      setLoadingRates(false);
    }
  };
  
  // Fonction helper pour obtenir le taux de change
  const getExchangeRate = (currency: string): number => {
    if (!exchangeRates || !exchangeRates.rates) {
      return 655.957; // Fallback
    }
    return exchangeRates.rates[currency] || 655.957;
  };
  
  // Fonction pour obtenir la devise d'un pays
  const getCountryCurrency = (countryName: string): string => {
    // Mapper les noms de la liste vers les noms dans countries.json
    const countryMappings: { [key: string]: string } = {
      '🇩🇿 Algeria': 'Algérie',
      '🇸🇳 Senegal': 'Sénégal', 
      '🇨🇮 Ivory Coast': 'Côte d\'Ivoire',
      '🇨🇲 Cameroon': 'Cameroun',
      '🇰🇲 Comoros': 'Comores',
      '🇲🇬 Madagascar': 'Madagascar',
      '🇲🇦 Morocco': 'Maroc',
      '🇹🇳 Tunisia': 'Tunisie',
      '🇲🇱 Mali': 'Mali',
      '🇧🇫 Burkina Faso': 'Burkina Faso',
      '🇬🇦 Gabon': 'Gabon',
      '🇹🇩 Chad': 'Tchad',
      '🇨🇬 Republic of the Congo': 'Congo-Brazzaville'
    };
    
    const mappedName = countryMappings[countryName] || countryName;
    const country = countriesData.countries.find(c => 
      c.name.toLowerCase() === mappedName.toLowerCase() ||
      mappedName.toLowerCase().includes(c.name.toLowerCase())
    );
    
    console.log(`🔍 getCountryCurrency: "${countryName}" → "${mappedName}" → "${country?.currency || 'XAF'}"`);
    return country?.currency || 'XAF';
  };
  
  // Fonction pour mettre à jour estimateData
  const updateEstimateData = (amount?: string, currency?: string) => {
    const currentAmount = amount || fromAmount;
    const currentCurrency = currency || toCurrency;
    
    if (currentAmount && onEstimateData) {
      const rate = getExchangeRate(currentCurrency);
      onEstimateData({
        amountSent: currentAmount,
        amountReceived: (parseFloat(currentAmount) * rate).toFixed(2),
        currencySent: fromCurrency,
        currencyReceived: currentCurrency,
        exchangeRate: rate.toFixed(3)
      });
    }
  };

  // Fonction pour mettre à jour la devise quand le pays change
  const handleCountryChange = (country: string) => {
    setSelectedCountry(country);
    const newCurrency = getCountryCurrency(country);
    setToCurrency(newCurrency);
    
    // Notifier le parent
    if (onCountrySelect) {
      onCountrySelect(country);
    }
    
    // Mettre à jour estimateData
    updateEstimateData(fromAmount, newCurrency);
  };
  
  // Fonction pour mettre à jour le montant
  const handleAmountChange = (amount: string) => {
    setFromAmount(amount);
    updateEstimateData(amount, toCurrency);
  };

  const countries = [
    '🇩🇿 Algeria',
    '🇦🇴 Angola',
    '🇧🇯 Benin',
    '🇧🇼 Botswana',
    '🇧🇫 Burkina Faso',
    '🇧🇮 Burundi',
    '🇨🇲 Cameroon',
    '🇨🇻 Cape Verde',
    '🇨🇫 Central African Republic',
    '🇹🇩 Chad',
    '🇰🇲 Comoros',
    '🇨🇬 Republic of the Congo',
    '🇨🇩 Democratic Republic of the Congo',
    '🇨🇮 Ivory Coast',
    '🇩🇯 Djibouti',
    '🇪🇬 Egypt',
    '🇬🇶 Equatorial Guinea',
    '🇪🇷 Eritrea',
    '🇸🇿 Eswatini',
    '🇪🇹 Ethiopia',
    '🇬🇦 Gabon',
    '🇬🇲 Gambia',
    '🇬🇭 Ghana',
    '🇬🇳 Guinea',
    '🇬🇼 Guinea-Bissau',
    '🇰🇪 Kenya',
    '🇱🇸 Lesotho',
    '🇱🇷 Liberia',
    '🇱🇾 Libya',
    '🇲🇬 Madagascar',
    '🇲🇼 Malawi',
    '🇲🇱 Mali',
    '🇲🇷 Mauritania',
    '🇲🇺 Mauritius',
    '🇲🇦 Morocco',
    '🇲🇿 Mozambique',
    '🇳🇦 Namibia',
    '🇳🇪 Niger',
    '🇳🇬 Nigeria',
    '🇷🇼 Rwanda',
    '🇸🇹 São Tomé and Príncipe',
    '🇸🇳 Senegal',
    '🇸🇨 Seychelles',
    '🇸🇱 Sierra Leone',
    '🇸🇴 Somalia',
    '🇿🇦 South Africa',
    '🇸🇸 South Sudan',
    '🇸🇩 Sudan',
    '🇹🇿 Tanzania',
    '🇹🇬 Togo',
    '🇹🇳 Tunisia',
    '🇺🇬 Uganda',
    '🇿🇲 Zambia',
    '🇿🇼 Zimbabwe'
  ];


  const swapCurrencies = () => {
    const tempCurrency = fromCurrency;
    const tempAmount = fromAmount;
    setFromCurrency(toCurrency);
    setToCurrency(tempCurrency);
    setFromAmount(tempAmount);
  };

  const handleContinueToPayment = () => {
    // Envoyer les données d'estimation au parent
    if (onEstimateData) {
      onEstimateData({
        amountSent: fromAmount,
        amountReceived: (parseFloat(fromAmount) * getExchangeRate(toCurrency)).toFixed(2),
        currencySent: fromCurrency,
        currencyReceived: toCurrency,
        exchangeRate: getExchangeRate(toCurrency).toFixed(3)
      });
    }
    
    // Délai pour permettre le chargement complet des éléments
    setTimeout(() => {
      onContinue();
    }, 1000); // 1 seconde d'attente
  };

  return (
    <div>
      {/* Section Content - Version ultra compacte */}
      <div className="px-4 mt-2">
        <div className="space-y-3 bg-gray-800/30 rounded-2xl p-3 border border-gray-600/40">
          {/* Titre et sous-titre - Ultra compact */}
          <div className="text-center">
            <h2 className="text-lg font-bold text-white mb-0.5 drop-shadow-lg leading-tight">{t('sendMoney.whatDoYouWantToDo')}</h2>
            <p className="text-gray-200 text-xs drop-shadow-md">{t('sendMoney.letsGetYouStarted')}</p>
          </div>

          {/* Select your country - Ultra compact */}
          <div>
            <label className="block text-xs font-medium text-gray-200 mb-1.5 drop-shadow-md">{t('sendMoney.selectCountry')}</label>
            
            {/* Dropdown Button */}
            <div className="relative">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="w-full px-2.5 py-2.5 bg-gray-800/40 border-2 border-gray-600/50 rounded-lg text-white focus:outline-none focus:border-purple-500 drop-shadow-md text-left flex justify-between items-center text-sm"
              >
                <div className="flex flex-col text-left">
                  <span className={selectedCountry ? 'text-white' : 'text-gray-400'}>
                    {selectedCountry || t('sendMoney.selectCountry')}
                  </span>
                  {selectedCountry && (
                    <span className="text-xs text-gray-500">
                      {getCountryCurrency(selectedCountry)} - {countriesData.countries.find(c => 
                        c.name.toLowerCase() === selectedCountry.toLowerCase() ||
                        selectedCountry.toLowerCase().includes(c.name.toLowerCase())
                      )?.currencyName || 'Devise'}
                    </span>
                  )}
                </div>
                <svg 
                  className={`w-3.5 h-3.5 text-gray-400 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* Dropdown List - Position relative pour pousser les éléments */}
              <div className="relative w-full">
                <AnimatedList
                  items={countries}
                  onItemSelect={(item, index) => {
                    handleCountryChange(item);
                    setIsDropdownOpen(false);
                  }}
                  showGradients={true}
                  enableArrowNavigation={true}
                  displayScrollbar={false}
                  className="w-full"
                  isOpen={isDropdownOpen}
                  maxHeight={200}
                />
              </div>
            </div>
          </div>

          {/* Fee Information - Ultra compact */}
          {selectedCountry && (
            <div className="p-2.5 bg-blue-500/20 border border-blue-400/30 rounded-lg mt-2">
              <p className="text-blue-200 text-xs leading-tight text-center">
                Money transfers sent to <span className="font-bold text-blue-100">{selectedCountry}</span> are subject to <span className="font-bold text-blue-100">2.5%</span> tax which will be deducted from the principal amount during payment.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Currency Conversion Section - Ultra compact */}
      <div className="px-4 mt-2">
        <div className="space-y-3 bg-gray-800/30 rounded-2xl p-3 border border-gray-600/40">
          {/* Currency Conversion Row */}
          <div className="flex items-end gap-3">
            {/* You Send */}
            <div className="flex-1">
              <div className="bg-black/50 border-2 border-white/30 rounded-lg p-2.5">
                <div className="flex items-center justify-between">
                  <div className="text-xs text-gray-300 drop-shadow-md">You send</div>
                  <div className="text-xs text-gray-400">{fromCurrency}</div>
                </div>
                <input
                  type="number"
                  value={fromAmount}
                  onChange={(e) => handleAmountChange(e.target.value)}
                  className="w-full bg-transparent text-base font-bold text-white placeholder-gray-400 border-none outline-none mt-0.5"
                  placeholder="0.00"
                />
              </div>
            </div>

            {/* Swap Button */}
            <div className="pb-1.5">
              <button
                onClick={swapCurrencies}
                className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center hover:bg-purple-700 transition-colors"
              >
                <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                </svg>
              </button>
            </div>

            {/* Received Amount */}
            <div className="flex-1">
              <div className="bg-black/50 border-2 border-white/30 rounded-lg p-2.5">
                <div className="flex items-center justify-between">
                  <div className="text-xs text-gray-300 drop-shadow-md">Receive amount</div>
                  <div className="text-xs text-gray-400">{toCurrency}</div>
                </div>
                <div className="text-base font-bold text-white mt-0.5">
                  {fromAmount ? (parseFloat(fromAmount) * getExchangeRate(toCurrency)).toLocaleString('fr-FR', { minimumFractionDigits: 2 }) : '0.00'}
                </div>
              </div>
            </div>
          </div>

          {/* Calculate Button - Ultra compact */}
          <button 
            onClick={(e) => {
              // Animation de clic
              const button = e.currentTarget;
              button.style.transform = 'scale(0.95)';
              button.style.transition = 'transform 0.1s ease';
              
              setTimeout(() => {
                button.style.transform = 'scale(1.05)';
              }, 100);
              
              setTimeout(() => {
                button.style.transform = 'scale(1)';
                
                setHasCalculated(true);
                // Scroll automatique vers la section suivante
                setTimeout(() => {
                  const deliverySection = document.querySelector('[data-section="delivery"]');
                  if (deliverySection) {
                    deliverySection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }
                }, 300);
              }, 200);
            }}
            disabled={!fromAmount || !selectedCountry}
            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-bold py-2.5 px-3 rounded-lg transition-all transform hover:scale-105 shadow-lg text-sm active:scale-95 active:shadow-xl"
          >
            {t('sendMoney.calculate')}
          </button>

          {/* Exchange Rate Info - Plus compact */}
          {hasCalculated && (
            <div className="text-center">
              <p className="text-gray-300 text-xs">
                Exchange Rate: <span className="font-semibold text-white">1 {fromCurrency} = {getExchangeRate(toCurrency).toFixed(3)} {toCurrency}</span>
              </p>
              <p className="text-gray-400 text-xs mt-1">
                Exchange rate varies with delivery and payment method
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Delivery Options Section - Plus compact */}
      <div className="px-4 mt-4" data-section="delivery">
        {hasCalculated && (
          <div className="space-y-4 bg-gray-800/30 rounded-2xl p-4 border border-gray-600/40">
            <div>
              <h3 className="text-base font-semibold text-white mb-3 drop-shadow-md text-center">{t('sendMoney.howWillReceiverGetIt')}</h3>
              <div className="grid grid-cols-2 gap-3">
                <button 
                  onClick={() => {
                    setSelectedDelivery('Cash Pickup');
                    setShowPaymentOptions(true);
                    // Scroll automatique vers la section payment
                    setTimeout(() => {
                      const paymentSection = document.querySelector('[data-section="payment"]');
                      if (paymentSection) {
                        paymentSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                      }
                    }, 300);
                  }}
                  className={`border-2 rounded-lg p-3 text-center transition-colors  ${
                    selectedDelivery === 'Cash Pickup' 
                      ? 'border-purple-500 bg-purple-500/20' 
                      : 'bg-black/30 border-white/20 hover:border-purple-500'
                  }`}
                >
                  <div className="w-6 h-6 bg-white/20 rounded-lg flex items-center justify-center mx-auto mb-1">
                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <div className="text-white font-medium text-sm">Cash Pickup</div>
                </button>
                
                <button 
                  onClick={() => {
                    setSelectedDelivery('Mobile Money');
                    setShowPaymentOptions(true);
                    // Scroll automatique vers la section payment
                    setTimeout(() => {
                      const paymentSection = document.querySelector('[data-section="payment"]');
                      if (paymentSection) {
                        paymentSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                      }
                    }, 300);
                  }}
                  className={`border-2 rounded-lg p-3 text-center transition-colors  ${
                    selectedDelivery === 'Mobile Money' 
                      ? 'border-purple-500 bg-purple-500/20' 
                      : 'bg-black/30 border-white/20 hover:border-purple-500'
                  }`}
                >
                  <div className="w-6 h-6 bg-white/20 rounded-lg flex items-center justify-center mx-auto mb-1">
                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div className="text-white font-medium text-sm">Mobile Money</div>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Payment Options Section - Plus compact */}
      <div className="px-4 mt-4" data-section="payment">
        {showPaymentOptions && (
          <div className="space-y-4 bg-gray-800/30 rounded-2xl p-4 border border-gray-600/40">
            <div>
              <h3 className="text-base font-semibold text-white mb-3 drop-shadow-md text-center">{t('sendMoney.howWillYouPay')}</h3>
              
              {/* Pay Online / Pay in Store */}
              <div className="grid grid-cols-2 gap-3 mb-4">
                <button 
                  onClick={() => {
                    setSelectedPayment('Pay Online');
                    // Scroll automatique vers les options de paiement
                    setTimeout(() => {
                      const paymentMethods = document.querySelector('[data-section="payment-methods"]');
                      if (paymentMethods) {
                        paymentMethods.scrollIntoView({ behavior: 'smooth', block: 'start' });
                      }
                    }, 300);
                  }}
                  className={`border-2 rounded-lg p-3 text-center transition-colors  ${
                    selectedPayment === 'Pay Online' 
                      ? 'border-purple-500 bg-purple-500/20' 
                      : 'bg-black/30 border-white/20 hover:border-purple-500'
                  }`}
                >
                  <div className="text-white font-medium text-sm">Pay Online</div>
                </button>
                
                <button 
                  onClick={() => {
                    setSelectedPayment('Pay in Store');
                    // Scroll automatique vers les options de paiement
                    setTimeout(() => {
                      const paymentMethods = document.querySelector('[data-section="payment-methods"]');
                      if (paymentMethods) {
                        paymentMethods.scrollIntoView({ behavior: 'smooth', block: 'start' });
                      }
                    }, 300);
                  }}
                  className={`border-2 rounded-lg p-3 text-center transition-colors  ${
                    selectedPayment === 'Pay in Store' 
                      ? 'border-purple-500 bg-purple-500/20' 
                      : 'bg-black/30 border-white/20 hover:border-purple-500'
                  }`}
                >
                  <div className="text-white font-medium text-sm">Pay in Store</div>
                </button>
              </div>

              {/* Pay Online Options */}
              {selectedPayment === 'Pay Online' && (
                <div className="grid grid-cols-3 gap-2" data-section="payment-methods">
                  <button 
                    onClick={() => {
                      setSelectedPaymentMethod('Credit Card');
                      setShowTransactionSummary(true);
                      // Scroll vers la facture
                      setTimeout(() => {
                        const summarySection = document.querySelector('[data-section="transaction-summary"]');
                        if (summarySection) {
                          summarySection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                        }
                      }, 300);
                    }}
                    className={`border-2 rounded-lg p-3 text-center transition-colors  ${
                      selectedPaymentMethod === 'Credit Card' 
                        ? 'border-purple-500 bg-purple-500/20' 
                        : 'bg-black/30 border-white/20 hover:border-purple-500'
                    }`}
                  >
                    <div className="w-6 h-6 bg-white/20 rounded-lg flex items-center justify-center mx-auto mb-1">
                      <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                      </svg>
                    </div>
                    <div className="text-white font-medium text-xs">Credit Card</div>
                  </button>
                  
                  <button 
                    onClick={() => {
                      setSelectedPaymentMethod('Google Pay');
                      setShowTransactionSummary(true);
                      // Scroll vers la facture
                      setTimeout(() => {
                        const summarySection = document.querySelector('[data-section="transaction-summary"]');
                        if (summarySection) {
                          summarySection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                        }
                      }, 300);
                    }}
                    className={`border-2 rounded-lg p-3 text-center transition-colors  ${
                      selectedPaymentMethod === 'Google Pay' 
                        ? 'border-purple-500 bg-purple-500/20' 
                        : 'bg-black/30 border-white/20 hover:border-purple-500'
                    }`}
                  >
                    <div className="w-6 h-6 bg-white/20 rounded-lg flex items-center justify-center mx-auto mb-1">
                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                      </svg>
                    </div>
                    <div className="text-white font-medium text-xs">Google Pay</div>
                  </button>
                  
                  <button 
                    onClick={() => {
                      setSelectedPaymentMethod('Bank Transfer');
                      setShowTransactionSummary(true);
                      // Scroll vers la facture
                      setTimeout(() => {
                        const summarySection = document.querySelector('[data-section="transaction-summary"]');
                        if (summarySection) {
                          summarySection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                        }
                      }, 300);
                    }}
                    className={`border-2 rounded-lg p-3 text-center transition-colors  ${
                      selectedPaymentMethod === 'Bank Transfer' 
                        ? 'border-purple-500 bg-purple-500/20' 
                        : 'bg-black/30 border-white/20 hover:border-purple-500'
                    }`}
                  >
                    <div className="w-6 h-6 bg-white/20 rounded-lg flex items-center justify-center mx-auto mb-1">
                      <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                    </div>
                    <div className="text-white font-medium text-xs">Bank Transfer</div>
                  </button>
                </div>
              )}

              {/* Pay in Store - Find nearby store - Plus compact */}
              {selectedPayment === 'Pay in Store' && (
                <div className="space-y-3" data-section="payment-methods">
                  <h4 className="text-white font-medium text-sm mb-2">Find a store near you:</h4>
                  <div className="space-y-2">
                    <input
                      type="text"
                      placeholder="Enter your location or postal code"
                      className="w-full px-3 py-2 bg-gray-800/50 border-2 border-gray-600/60 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 text-sm"
                    />
                    <button className="w-full bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white font-bold py-2 px-4 rounded-lg transition-all transform hover:scale-105 shadow-lg text-sm">
                      Find Nearby Stores
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Transaction Summary Section - Facture - Plus compact */}
      <div className="px-4 mt-2" data-section="transaction-summary">
        {showTransactionSummary && (
          <div className="space-y-4 bg-gradient-to-br from-purple-500/10 via-blue-500/10 to-pink-500/10 rounded-2xl p-4 border border-white/20">
            <div>
              <h3 className="text-base font-semibold text-white mb-3 drop-shadow-md">{t('sendMoney.transactionSummary')}</h3>
              
              {/* Détails de la transaction - Plus compact */}
              <div className="space-y-2">
                <div className="flex justify-between items-center py-1">
                  <span className="text-gray-300 text-sm">{t('sendMoney.youSend')}:</span>
                  <span className="text-white font-medium text-sm">{fromAmount || '0.00'} {fromCurrency}</span>
                </div>
                
                <div className="flex justify-between items-center py-1">
                  <span className="text-gray-300 text-sm">{t('sendMoney.exchangeRate')}:</span>
                  <span className="text-white font-medium text-sm">1 {fromCurrency} = {getExchangeRate(toCurrency).toFixed(3)} {toCurrency}</span>
                </div>
                
                <div className="flex justify-between items-center py-1">
                  <span className="text-gray-300 text-sm">{t('sendMoney.recipientGets')}:</span>
                  <span className="text-white font-medium text-sm">
                    {fromAmount ? (parseFloat(fromAmount) * getExchangeRate(toCurrency)).toLocaleString('fr-FR', { minimumFractionDigits: 2 }) : '0.00'} {toCurrency}
                  </span>
                </div>
                
                <div className="flex justify-between items-center py-1">
                  <span className="text-gray-300 text-sm">{t('sendMoney.deliveryMethod')}:</span>
                  <span className="text-white font-medium text-sm">{selectedDelivery}</span>
                </div>
                
                <div className="flex justify-between items-center py-1">
                  <span className="text-gray-300 text-sm">{t('sendMoney.paymentMethod')}:</span>
                  <span className="text-white font-medium text-sm">{selectedPaymentMethod}</span>
                </div>
                
                {/* Frais - Nouvelle section */}
                <div className="border-t border-white/20 pt-2 mt-2">
                  <div className="space-y-1">
                    <div className="flex justify-between items-center py-1">
                      <span className="text-gray-300 text-sm">Service Fee (2.5%):</span>
                      <span className="text-white font-medium text-sm">
                        {fromAmount ? (parseFloat(fromAmount) * 0.025).toFixed(2) : '0.00'} {fromCurrency}
                      </span>
                    </div>
                    
                    <div className="flex justify-between items-center py-1">
                      <span className="text-gray-300 text-sm">Blockchain Fee:</span>
                      <span className="text-white font-medium text-sm">0.50 {fromCurrency}</span>
                    </div>
                    
                    <div className="flex justify-between items-center py-1">
                      <span className="text-gray-300 text-sm">Infrastructure Fee:</span>
                      <span className="text-white font-medium text-sm">1.00 {fromCurrency}</span>
                    </div>
                  </div>
                </div>
                
                <div className="border-t border-white/20 pt-2 mt-2">
                  <div className="flex justify-between items-center py-1">
                    <span className="text-white font-semibold text-base">Total:</span>
                    <span className="text-white font-bold text-base">
                      {fromAmount ? (parseFloat(fromAmount) + parseFloat(fromAmount) * 0.025 + 0.50 + 1.00).toFixed(2) : '0.00'} {fromCurrency}
                    </span>
                  </div>
                </div>
              </div>
              
              {/* Bouton Continue to Payment - Plus petit */}
              <button 
                onClick={handleContinueToPayment}
                className="w-full bg-white text-gray-900 font-bold py-3 px-4 rounded-lg transition-all transform hover:scale-105 shadow-lg mt-4"
              >
                Continue to Payment
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EstimateStep;

// === FIN DU FICHIER ===
