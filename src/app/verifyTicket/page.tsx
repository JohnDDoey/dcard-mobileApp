'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { verifyTicketCode, burnTicketCode } from '@/contracts/cashbackService';

interface TicketData {
  buyerName: string;
  beneficiary: string;
  amount: string;
  productCount: string;
  isUsed: boolean;
  isValid: boolean;
}

const showToast = (message: string, type: 'success' | 'error') => {
  const toast = document.createElement('div');
  toast.className = `fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 px-8 py-4 rounded-lg text-white font-medium text-center shadow-2xl ${
    type === 'success' ? 'bg-green-500' : 'bg-red-500'
  }`;
  toast.textContent = message;
  document.body.appendChild(toast);

  setTimeout(() => {
    toast.remove();
  }, 5000);
};

export default function VerifyTicketPage() {
  const router = useRouter();
  const [ticketCode, setTicketCode] = useState('');
  const [isValidating, setIsValidating] = useState(false);
  const [isBurning, setIsBurning] = useState(false);
  const [ticketData, setTicketData] = useState<TicketData | null>(null);
  const [isValidated, setIsValidated] = useState(false);

  const handleValidateTicket = async () => {
    if (!ticketCode.trim()) {
      showToast('Veuillez saisir le code du ticket', 'error');
      return;
    }

    setIsValidating(true);

    try {
      const result = await verifyTicketCode(ticketCode);

      if (result.success && result.data.isValid && !result.data.isUsed) {
        const data: TicketData = {
          buyerName: result.data.buyerName,
          beneficiary: result.data.beneficiary,
          amount: (parseFloat(result.data.totalAmount) / 100).toFixed(2),
          productCount: result.data.productCount,
          isUsed: result.data.isUsed,
          isValid: result.data.isValid,
        };

        setTicketData(data);
        setIsValidated(true);
        showToast('Ticket valide ! Vous pouvez maintenant encaisser la commande.', 'success');
      } else if (result.success && result.data.isUsed) {
        showToast('Ce ticket a déjà été utilisé', 'error');
      } else {
        showToast('Ticket invalide ou inexistant', 'error');
      }
    } catch (error) {
      console.error('Erreur lors de la vérification du ticket:', error);
      showToast('Erreur lors de la vérification du ticket', 'error');
    } finally {
      setIsValidating(false);
    }
  };

  const handleBurnTicket = async () => {
    if (!ticketData) return;

    setIsBurning(true);

    try {
      const burnResult = await burnTicketCode(ticketCode);

      if (burnResult.success) {
        showToast('Félicitations ! Le ticket marketplace a bien été encaissé.', 'success');
        setTicketCode('');
        setTicketData(null);
        setIsValidated(false);
      } else {
        showToast('Erreur lors de l\'encaissement', 'error');
      }
    } catch (error) {
      console.error('Erreur lors du burn du ticket:', error);
      showToast('Erreur lors de l\'encaissement du ticket', 'error');
    } finally {
      setIsBurning(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center p-4">
      <div className="absolute top-0 left-0 right-0 p-6 flex justify-between items-center">
        <button
          onClick={() => router.back()}
          className="text-white hover:text-gray-300 transition-colors"
          type="button"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
      </div>

      <div
        className={`bg-white rounded-3xl shadow-2xl transition-all duration-500 w-full max-w-md`}
      >
        <div className="p-6">
          <div className="flex justify-center mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z"
                />
              </svg>
            </div>
          </div>

          <h2 className="text-xl font-bold text-gray-800 text-center mb-1">
            Vérification ticket Marketplace
          </h2>
          <p className="text-gray-600 text-center mb-6 text-sm">
            Entrez le code du ticket marketplace à encaisser
          </p>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Code ticket
              </label>
              <input
                type="text"
                value={ticketCode}
                onChange={(e) => setTicketCode(e.target.value)}
                placeholder="Code affiché après l’achat marketplace"
                className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none ${
                  isValidated
                    ? 'border-gray-300 bg-gray-100 text-gray-500 cursor-not-allowed'
                    : 'border-gray-200 focus:border-purple-500 text-gray-800'
                }`}
                disabled={isValidating || isBurning || isValidated}
              />
              {isValidated && (
                <div className="flex items-center space-x-2 mt-2">
                  <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                    <svg className="w-2 h-2 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <span className="text-green-600 text-sm font-medium">Ticket valide !</span>
                </div>
              )}
            </div>

            {!isValidated && (
              <button
                type="button"
                onClick={handleValidateTicket}
                disabled={isValidating || !ticketCode.trim()}
                className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 disabled:from-gray-400 disabled:to-gray-500 text-white font-bold py-3 px-6 rounded-lg transition-all transform hover:scale-105 shadow-lg disabled:transform-none disabled:shadow-none"
              >
                {isValidating ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Vérification...</span>
                  </div>
                ) : (
                  'Valider'
                )}
              </button>
            )}

            {isValidated && ticketData && (
              <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                <div className="flex items-center space-x-2 mb-3">
                  <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                    <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <h3 className="text-base font-bold text-gray-800">Ticket valide</h3>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Acheteur :</span>
                    <span className="font-semibold text-gray-800 text-right pl-2 max-w-[58%] break-words">
                      {ticketData.buyerName}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Bénéficiaire :</span>
                    <span className="font-semibold text-gray-800 text-right pl-2 max-w-[58%] break-words">
                      {ticketData.beneficiary}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Montant :</span>
                    <span className="font-semibold text-gray-800">{ticketData.amount} €</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Lignes produit :</span>
                    <span className="font-semibold text-gray-800">{ticketData.productCount}</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleBurnTicket}
                  disabled={isBurning}
                  className="w-full mt-4 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-bold py-2.5 px-4 rounded-lg transition-all transform hover:scale-105 shadow-lg disabled:transform-none disabled:shadow-none text-sm"
                >
                  {isBurning ? (
                    <div className="flex items-center justify-center space-x-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Encaissement...</span>
                    </div>
                  ) : (
                    'Encaisser la commande'
                  )}
                </button>
              </div>
            )}
          </div>

          <div className="text-center mt-6 pt-4 border-t border-gray-200">
            <p className="text-gray-500 text-xs">
              Powered by DCARD • Marketplace Tickets
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
