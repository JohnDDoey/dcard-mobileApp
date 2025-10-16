'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import ProtectedRoute from '@/components/ProtectedRoute';
import LayoutNoHeader from '@/components/LayoutNoHeader';
import EstimateStep from '@/components/EstimateStep';
import ReceiverInformation from '@/components/ReceiverInformation';
import PaymentStep from '@/components/PaymentStep';
import ReviewStep from '@/components/ReviewStep';
import LoadingPage from '@/components/LoadingPage';
import { setGlobeZoom } from '@/components/PersistentGlobe';
import { useToastContext } from '@/components/ToastProvider';

export default function SendMoneyPage() {
  const { user, logout } = useAuth();
  const { t } = useLanguage();
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedCountryFromEstimate, setSelectedCountryFromEstimate] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { showConfirm } = useToastContext();
  
  // Données récupérées des étapes précédentes
  const [estimateData, setEstimateData] = useState({
    amountSent: '',
    amountReceived: '',
    currencySent: 'EUR',
    currencyReceived: '',
    exchangeRate: ''
  });
  
  const [receiverData, setReceiverData] = useState({
    firstName: '',
    lastName: '',
    phoneNumber: '',
    city: ''
  });

  // Stocker le code coupon généré après paiement
  const [generatedCouponCode, setGeneratedCouponCode] = useState('');

  // Zoom du globe selon l'étape
  useEffect(() => {
    console.log(`SendMoneyPage: currentStep changed to ${currentStep}`);
    setGlobeZoom(currentStep);
  }, [currentStep]);


  const handleNextStep = () => {
    if (currentStep < 4) {
      setIsLoading(true);
      
      // Scroll automatique vers le loader
      setTimeout(() => {
        const loaderElement = document.querySelector('[data-section="loading"]');
        if (loaderElement) {
          loaderElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 100);
      
      // Délai pour permettre le chargement des nouveaux composants
      setTimeout(() => {
        setCurrentStep(currentStep + 1);
        setIsLoading(false);
      }, 3000); // 3 secondes de chargement
    }
  };

  const handlePreviousStep = () => {
    if (currentStep > 1) {
      setIsLoading(true);
      // Délai pour permettre le chargement des composants précédents
      setTimeout(() => {
        setCurrentStep(currentStep - 1);
        setIsLoading(false);
      }, 2000); // 2 secondes de chargement
    }
  };

  // Construire les données de transaction à partir des étapes précédentes
  const buildTransactionData = () => {
    return {
      amountSent: estimateData.amountSent || '10000',
      amountReceived: estimateData.amountReceived || '6559570.00',
      currencySent: estimateData.currencySent || 'EUR',
      currencyReceived: estimateData.currencyReceived || 'XAF',
      receiverName: `${receiverData.firstName} ${receiverData.lastName}`.trim() || 'Julienn Blot',
      receiverCountry: selectedCountryFromEstimate || 'KM Comoros',
      receiverPhone: receiverData.phoneNumber || '+69690606000'
    };
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return <EstimateStep 
          onContinue={handleNextStep} 
          onCountrySelect={setSelectedCountryFromEstimate}
          onEstimateData={setEstimateData}
        />;
      case 2:
        return <ReceiverInformation 
          onContinue={handleNextStep} 
          selectedCountry={selectedCountryFromEstimate}
          onReceiverData={setReceiverData}
        />;
             case 3:
               return <PaymentStep 
                 onContinue={(couponCode) => {
                   setGeneratedCouponCode(couponCode);
                   handleNextStep();
                 }} 
                 transactionData={buildTransactionData()} 
               />;
      case 4:
        return <ReviewStep 
          couponCode={generatedCouponCode}
          transactionData={buildTransactionData()} 
          onStartNewTransfer={() => {
            // Reset pour recommencer
            setCurrentStep(1);
            setSelectedCountryFromEstimate('');
            setGeneratedCouponCode('');
            setEstimateData({
              amountSent: '',
              amountReceived: '',
              currencySent: 'EUR',
              currencyReceived: '',
              exchangeRate: ''
            });
            setReceiverData({
              firstName: '',
              lastName: '',
              phoneNumber: '',
              city: ''
            });
          }}
        />;
      default:
        return <EstimateStep 
          onContinue={handleNextStep} 
          onCountrySelect={setSelectedCountryFromEstimate}
          onEstimateData={setEstimateData}
        />;
    }
  };

  return (
    <ProtectedRoute redirectMessage="Vous devez d'abord vous inscrire et vous connecter pour envoyer de l'argent.">
    <LayoutNoHeader>
      <div className="min-h-screen text-white pb-8">
        {/* Header simplifié avec bouton retour */}
        <div className="flex items-center justify-between p-3">
          <button 
            onClick={() => window.history.back()}
            className="text-white"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 className="text-lg font-bold text-center flex-1">
            <span className="hidden md:inline">Send Money</span>
            <span className="md:hidden">Send Money</span>
          </h1>
          {/* Espace pour équilibrer le header */}
          <div className="w-8"></div>
        </div>

        {/* Stepper - Plus compact */}
        <div className="px-4 mt-6 mb-6">
          <div className="relative">
            {/* Progress Line - Plus compact et stylé */}
            <div className="absolute top-8 left-4 right-4 h-0.5 bg-gray-700/50 rounded-full">
              <div 
                className="h-full bg-gradient-to-r from-purple-500 to-blue-500 rounded-full transition-all duration-500 shadow-lg"
                style={{ width: `${((currentStep - 1) / 3) * 100}%` }}
              ></div>
            </div>
            
            <div className="flex justify-between items-center relative z-10">
              {[
                t('sendMoney.estimate'), 
                t('sendMoney.receiver'), 
                t('sendMoney.payment'), 
                t('sendMoney.review')
              ].map((label, index) => {
                const stepNumber = index + 1;
                const isActive = currentStep === stepNumber;
                const isCompleted = currentStep > stepNumber || (currentStep === 4 && stepNumber === 4);
                
                return (
                  <div key={index} className="flex flex-col items-center">
                    <span className={`text-xs font-medium transition-all duration-300 mb-1 ${
                      isActive 
                        ? 'text-white' 
                        : (currentStep === 4 && stepNumber === 4)
                        ? 'text-green-400'
                        : isCompleted
                        ? 'text-green-400'
                        : 'text-gray-400'
                    }`}>
                      {label}
                    </span>
                    <button
                      onClick={() => {
                        // Permettre de revenir en arrière sur les étapes complétées
                        if (isCompleted && stepNumber < currentStep) {
                          setIsLoading(true);
                          setTimeout(() => {
                            setCurrentStep(stepNumber);
                            setIsLoading(false);
                          }, 2000); // 2 secondes de chargement
                        }
                      }}
                      disabled={stepNumber > currentStep}
                      className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition-all duration-300 ${
                        (currentStep === 4 && stepNumber === 4)
                          ? 'bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg shadow-green-500/50 hover:scale-105 cursor-pointer'
                          : isActive 
                          ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-lg shadow-purple-500/50 scale-110' 
                          : isCompleted
                          ? 'bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg shadow-green-500/50 hover:scale-105 cursor-pointer'
                          : 'bg-gray-800 border-2 border-gray-600 text-gray-400 hover:border-gray-500'
                      }`}
                    >
                      {isCompleted || (currentStep === 4 && stepNumber === 4) ? (
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      ) : (
                        stepNumber
                      )}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

              {/* Render loading page or current step component */}
              <div className="px-4 pb-8">
                {isLoading ? (
                  <div data-section="loading">
                    <LoadingPage onComplete={() => setIsLoading(false)} loadingTime={2000} />
                  </div>
                ) : (
                  renderCurrentStep()
                )}
              </div>
      </div>
    </LayoutNoHeader>
    </ProtectedRoute>
  );
}