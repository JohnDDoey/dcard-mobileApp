'use client';

import { useRouter } from 'next/navigation';
import { useLanguage } from '@/contexts/LanguageContext';

export default function ChooseActionPage() {
  const router = useRouter();
  const { t } = useLanguage();

  return (
    <div className="fixed inset-0 bg-white flex items-center justify-center px-2 sm:px-4 overflow-hidden">
      <div className="max-w-4xl w-full">
            {/* Deux boutons côte à côte */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              {/* Bouton Envoyer des matériaux */}
              <button
                onClick={() => router.push('/marketplace')}
                className="group relative bg-gradient-to-br from-blue-50 to-cyan-50 hover:from-blue-100 hover:to-cyan-100 border-2 border-blue-200 hover:border-blue-300 rounded-3xl p-6 md:p-8 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl"
              >
                <div className="flex flex-col items-center space-y-4">
                  {/* Icône */}
                  <div className="w-20 h-20 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-full flex items-center justify-center transform group-hover:rotate-12 transition-transform duration-300">
                    <svg 
                      className="w-10 h-10 text-white" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                    </svg>
                  </div>
                  
                  {/* Texte */}
                  <div className="text-center">
                    <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">
                      Envoyer des matériaux
                    </h2>
                    <p className="text-gray-600 text-sm md:text-base">
                      Achetez et envoyez des produits via le Marketplace
                    </p>
                  </div>

                  {/* Badge */}
                  <div className="absolute top-4 right-4 bg-blue-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                    Populaire
                  </div>
                </div>
              </button>

              {/* Bouton Envoyer de l'amour */}
              <button
                onClick={() => router.push('/send-money')}
                className="group relative bg-gradient-to-br from-pink-50 to-purple-50 hover:from-pink-100 hover:to-purple-100 border-2 border-pink-200 hover:border-pink-300 rounded-3xl p-6 md:p-8 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl"
              >
                <div className="flex flex-col items-center space-y-4">
                  {/* Icône */}
                  <div className="w-20 h-20 bg-gradient-to-br from-pink-400 to-purple-500 rounded-full flex items-center justify-center transform group-hover:rotate-12 transition-transform duration-300">
                    <svg 
                      className="w-10 h-10 text-white" 
                      fill="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                    </svg>
                  </div>
                  
                  {/* Texte */}
                  <div className="text-center">
                    <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">
                      Envoyer de l'amour
                    </h2>
                    <p className="text-gray-600 text-sm md:text-base">
                      Transférez de l'argent à vos proches avec DCARD
                    </p>
                  </div>

                  {/* Badge */}
                  <div className="absolute top-4 right-4 bg-pink-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                    Nouveau
                  </div>
                </div>
              </button>
            </div>

      </div>
    </div>
  );
}

