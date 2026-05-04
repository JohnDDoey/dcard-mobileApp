'use client';

import { useState } from 'react';

interface TicketAccordionProps {
  ticket: any;
}

const TicketAccordion: React.FC<TicketAccordionProps> = ({ ticket }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="bg-gray-800/40 border border-gray-600/50 rounded-2xl shadow-lg overflow-hidden">
      <div
        className="p-3 cursor-pointer hover:bg-gray-700/20 transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-base font-bold text-white">{ticket.beneficiary}</div>
                <div className="text-xs text-gray-300">
                  {(parseInt(ticket.totalAmount, 10) / 100).toFixed(2)} EUR • {ticket.productCount} produit
                  {ticket.productCount !== '1' ? 's' : ''}
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                    ticket.used ? 'bg-red-500 text-white' : 'bg-green-500 text-white'
                  }`}
                >
                  {ticket.used ? 'Utilisé' : 'Disponible'}
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

      {isExpanded && (
        <div className="border-t border-gray-600/50 p-4 space-y-4 animate-in slide-in-from-top-2 duration-200">
          <div className="bg-white rounded-2xl p-4 text-black">
            <div className="text-center mb-4">
              <h3 className="text-lg font-bold text-gray-800">DCARD</h3>
              <p className="text-sm text-gray-600">Ticket marketplace</p>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Code ticket</span>
                <span className="font-mono text-xs text-right ml-3 break-all">{ticket.code}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Date</span>
                <span className="text-sm">{new Date(ticket.createdAt).toLocaleString('fr-FR')}</span>
              </div>
              <div className="border-t pt-3 space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Acheteur</span>
                  <span className="text-sm text-right ml-3">{ticket.buyerName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Bénéficiaire</span>
                  <span className="text-sm text-right ml-3">{ticket.beneficiary}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Montant</span>
                  <span className="font-semibold">{(parseInt(ticket.totalAmount, 10) / 100).toFixed(2)} EUR</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Produits</span>
                  <span className="font-semibold">{ticket.productCount}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TicketAccordion;
