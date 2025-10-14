'use client';

import { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

interface Store {
  id: number;
  name: string;
  address: string;
  city: string;
  postalCode: string;
  phone: string;
  hours: string;
  services: string[];
  isOpen: boolean;
}

interface Region {
  id: string;
  name: string;
  stores: Store[];
}

interface Country {
  id: string;
  name: string;
  emoji: string;
  regions: Region[];
}

interface Zone {
  id: string;
  name: string;
  emoji: string;
  countries: Country[];
}

// Données de démonstration avec hiérarchie : Zone > Pays > Région > Boutiques
const mockZones: Zone[] = [
  {
    id: 'europe',
    name: 'Europe',
    emoji: '🇪🇺',
    countries: [
      {
        id: 'france',
        name: 'France',
        emoji: '🇫🇷',
        regions: [
          {
            id: 'ile-de-france',
            name: 'Île-de-France',
            stores: [
              {
                id: 1,
                name: 'DCARD Paris Centre',
                address: '15 Rue de Rivoli',
                city: 'Paris',
                postalCode: '75001',
                phone: '+33 1 42 60 30 30',
                hours: 'Lun-Ven: 9h-19h, Sam: 10h-18h',
                services: ['Retrait cash', 'Dépôt', 'Cashback'],
                isOpen: true
              },
              {
                id: 2,
                name: 'DCARD Paris Montparnasse',
                address: '45 Avenue du Maine',
                city: 'Paris',
                postalCode: '75015',
                phone: '+33 1 43 20 50 50',
                hours: 'Lun-Sam: 9h-19h',
                services: ['Retrait cash', 'Cashback'],
                isOpen: true
              }
            ]
          },
          {
            id: 'auvergne-rhone-alpes',
            name: 'Auvergne-Rhône-Alpes',
            stores: [
              {
                id: 3,
                name: 'DCARD Lyon Bellecour',
                address: '22 Place Bellecour',
                city: 'Lyon',
                postalCode: '69002',
                phone: '+33 4 78 37 40 40',
                hours: 'Lun-Sam: 9h-18h',
                services: ['Retrait cash', 'Cashback'],
                isOpen: true
              }
            ]
          },
          {
            id: 'paca',
            name: 'Provence-Alpes-Côte d\'Azur',
            stores: [
              {
                id: 4,
                name: 'DCARD Marseille Vieux-Port',
                address: '8 Quai du Port',
                city: 'Marseille',
                postalCode: '13002',
                phone: '+33 4 91 90 60 60',
                hours: 'Lun-Ven: 9h-19h, Sam: 9h-17h',
                services: ['Retrait cash', 'Dépôt', 'Cashback'],
                isOpen: false
              },
              {
                id: 5,
                name: 'DCARD Nice Promenade',
                address: '5 Promenade des Anglais',
                city: 'Nice',
                postalCode: '06000',
                phone: '+33 4 93 87 60 60',
                hours: 'Lun-Dim: 10h-20h',
                services: ['Retrait cash', 'Cashback'],
                isOpen: true
              }
            ]
          },
          {
            id: 'occitanie',
            name: 'Occitanie',
            stores: [
              {
                id: 6,
                name: 'DCARD Toulouse Capitole',
                address: '12 Place du Capitole',
                city: 'Toulouse',
                postalCode: '31000',
                phone: '+33 5 61 22 33 33',
                hours: 'Lun-Sam: 9h-19h',
                services: ['Retrait cash', 'Dépôt', 'Cashback'],
                isOpen: true
              }
            ]
          }
        ]
      },
      {
        id: 'germany',
        name: 'Allemagne',
        emoji: '🇩🇪',
        regions: [
          {
            id: 'berlin',
            name: 'Berlin',
            stores: [
              {
                id: 7,
                name: 'DCARD Berlin Alexanderplatz',
                address: '10 Alexanderplatz',
                city: 'Berlin',
                postalCode: '10178',
                phone: '+49 30 2470 5050',
                hours: 'Lun-Sam: 9h-20h',
                services: ['Retrait cash', 'Dépôt', 'Cashback'],
                isOpen: true
              }
            ]
          },
          {
            id: 'bavaria',
            name: 'Bavière',
            stores: [
              {
                id: 8,
                name: 'DCARD Munich Marienplatz',
                address: '3 Marienplatz',
                city: 'Munich',
                postalCode: '80331',
                phone: '+49 89 2102 3030',
                hours: 'Lun-Ven: 9h-19h, Sam: 10h-18h',
                services: ['Retrait cash', 'Cashback'],
                isOpen: true
              }
            ]
          }
        ]
      },
      {
        id: 'uk',
        name: 'Royaume-Uni',
        emoji: '🇬🇧',
        regions: [
          {
            id: 'london',
            name: 'Londres',
            stores: [
              {
                id: 9,
                name: 'DCARD London Oxford Street',
                address: '125 Oxford Street',
                city: 'Londres',
                postalCode: 'W1D 2HS',
                phone: '+44 20 7946 0958',
                hours: 'Lun-Sam: 9h-20h, Dim: 11h-17h',
                services: ['Retrait cash', 'Dépôt', 'Cashback'],
                isOpen: true
              },
              {
                id: 10,
                name: 'DCARD London Canary Wharf',
                address: '40 Bank Street',
                city: 'Londres',
                postalCode: 'E14 5NR',
                phone: '+44 20 7946 1234',
                hours: 'Lun-Ven: 8h-19h',
                services: ['Retrait cash', 'Cashback'],
                isOpen: false
              }
            ]
          },
          {
            id: 'manchester',
            name: 'Manchester',
            stores: [
              {
                id: 11,
                name: 'DCARD Manchester City Centre',
                address: '15 Market Street',
                city: 'Manchester',
                postalCode: 'M1 1WR',
                phone: '+44 161 839 5050',
                hours: 'Lun-Sam: 9h-18h',
                services: ['Retrait cash', 'Dépôt', 'Cashback'],
                isOpen: true
              }
            ]
          }
        ]
      },
      {
        id: 'spain',
        name: 'Espagne',
        emoji: '🇪🇸',
        regions: [
          {
            id: 'madrid',
            name: 'Madrid',
            stores: [
              {
                id: 12,
                name: 'DCARD Madrid Sol',
                address: '8 Puerta del Sol',
                city: 'Madrid',
                postalCode: '28013',
                phone: '+34 91 521 4040',
                hours: 'Lun-Sam: 9h-20h',
                services: ['Retrait cash', 'Dépôt', 'Cashback'],
                isOpen: true
              }
            ]
          },
          {
            id: 'catalonia',
            name: 'Catalogne',
            stores: [
              {
                id: 13,
                name: 'DCARD Barcelona Ramblas',
                address: '25 La Rambla',
                city: 'Barcelone',
                postalCode: '08002',
                phone: '+34 93 342 6060',
                hours: 'Lun-Dim: 10h-21h',
                services: ['Retrait cash', 'Cashback'],
                isOpen: true
              }
            ]
          },
          {
            id: 'andalusia',
            name: 'Andalousie',
            stores: [
              {
                id: 14,
                name: 'DCARD Sevilla Centro',
                address: '12 Plaza Nueva',
                city: 'Séville',
                postalCode: '41001',
                phone: '+34 95 456 7070',
                hours: 'Lun-Ven: 9h-19h, Sam: 10h-14h',
                services: ['Retrait cash', 'Cashback'],
                isOpen: true
              }
            ]
          }
        ]
      }
    ]
  }
];

export default function StoresPage() {
  const { t } = useLanguage();
  const [expandedZone, setExpandedZone] = useState<string | null>(null);
  const [expandedCountry, setExpandedCountry] = useState<string | null>(null);
  const [expandedRegion, setExpandedRegion] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
      {/* Header compact avec retour */}
      <div className="sticky top-0 z-50 bg-gradient-to-r from-blue-600 to-purple-600 py-4 px-4 shadow-lg">
        <div className="max-w-4xl mx-auto flex items-center gap-4">
          <button
            onClick={() => window.location.href = '/'}
            className="p-2 hover:bg-white/10 rounded-lg transition-all"
            aria-label="Retour"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 className="text-2xl font-bold">DCARD</h1>
          <span className="text-sm opacity-75">• Nos boutiques</span>
        </div>
      </div>

      {/* Liste hiérarchique */}
      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="space-y-3">
          {mockZones.map(zone => (
            <div key={zone.id} className="bg-white/10 backdrop-blur-md rounded-2xl overflow-hidden">
              {/* Zone (Europe) */}
              <button
                onClick={() => setExpandedZone(expandedZone === zone.id ? null : zone.id)}
                className="w-full p-5 flex items-center gap-4 hover:bg-white/5 transition-all text-left"
              >
                <div className="text-3xl">{zone.emoji}</div>
                <div className="flex-1">
                  <h2 className="text-xl font-bold">{zone.name}</h2>
                  <p className="text-sm opacity-70">
                    {zone.countries.length} pays • {zone.countries.reduce((sum, c) => sum + c.regions.reduce((s, r) => s + r.stores.length, 0), 0)} boutiques
                  </p>
                </div>
                <svg 
                  className={`w-6 h-6 transition-transform ${expandedZone === zone.id ? 'rotate-180' : ''}`}
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* Pays (France) */}
              {expandedZone === zone.id && zone.countries.map(country => (
                <div key={country.id} className="border-t border-white/10 bg-white/5">
                  <button
                    onClick={() => setExpandedCountry(expandedCountry === country.id ? null : country.id)}
                    className="w-full p-4 pl-16 flex items-center gap-3 hover:bg-white/5 transition-all text-left"
                  >
                    <div className="text-2xl">{country.emoji}</div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold">{country.name}</h3>
                      <p className="text-xs opacity-70">
                        {country.regions.length} régions • {country.regions.reduce((s, r) => s + r.stores.length, 0)} boutiques
                      </p>
                    </div>
                    <svg 
                      className={`w-5 h-5 transition-transform ${expandedCountry === country.id ? 'rotate-180' : ''}`}
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {/* Régions */}
                  {expandedCountry === country.id && country.regions.map(region => (
                    <div key={region.id} className="border-t border-white/10 bg-white/10">
                      <button
                        onClick={() => setExpandedRegion(expandedRegion === region.id ? null : region.id)}
                        className="w-full p-4 pl-24 flex items-center gap-3 hover:bg-white/5 transition-all text-left"
                      >
                        <div className="text-xl">📍</div>
                        <div className="flex-1">
                          <h4 className="font-medium">{region.name}</h4>
                          <p className="text-xs opacity-70">{region.stores.length} boutique{region.stores.length > 1 ? 's' : ''}</p>
                        </div>
                        <svg 
                          className={`w-5 h-5 transition-transform ${expandedRegion === region.id ? 'rotate-180' : ''}`}
                          fill="none" 
                          stroke="currentColor" 
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>

                      {/* Boutiques */}
                      {expandedRegion === region.id && (
                        <div className="border-t border-white/10 p-4 pl-32 space-y-3 bg-white/5">
                          {region.stores.map(store => (
                            <div
                              key={store.id}
                              className="bg-white/10 hover:bg-white/15 rounded-xl p-4 transition-all border border-white/10"
                            >
                              <div className="flex justify-between items-start mb-3">
                                <h5 className="font-bold text-lg">{store.name}</h5>
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                  store.isOpen ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'
                                }`}>
                                  {store.isOpen ? '● Ouvert' : '● Fermé'}
                                </span>
                              </div>

                              <div className="space-y-2 text-sm mb-3">
                                <p>{store.address}, {store.postalCode} {store.city}</p>
                                <p className="opacity-70">📞 {store.phone}</p>
                                <p className="opacity-70">🕐 {store.hours}</p>
                              </div>

                              <div className="flex gap-2">
                                <a
                                  href={`tel:${store.phone}`}
                                  className="flex-1 bg-blue-500/20 hover:bg-blue-500/30 text-center py-2 rounded-lg transition-all text-sm font-medium"
                                >
                                  📞 Appeler
                                </a>
                                <a
                                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(store.address + ' ' + store.city)}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex-1 bg-purple-500/20 hover:bg-purple-500/30 text-center py-2 rounded-lg transition-all text-sm font-medium"
                                >
                                  🗺️ Itinéraire
                                </a>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          ))}

          {/* Vignette "Envoi en ligne" */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-6 text-center">
            <div className="text-4xl mb-3">💻</div>
            <h3 className="text-xl font-bold mb-2">Envoi en ligne</h3>
            <p className="text-sm opacity-90 mb-4">Transférez de l'argent partout dans le monde depuis chez vous</p>
            <button
              onClick={() => window.location.href = '/send-money'}
              className="bg-white text-purple-600 font-bold py-2 px-6 rounded-lg hover:bg-gray-100 transition-all"
            >
              Commencer un envoi
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

