'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/contexts/LanguageContext';
import { useCart } from '@/contexts/CartContext';
import ProtectedRoute from '@/components/ProtectedRoute';
import AnimatedList from '@/components/AnimatedList';
import countriesData from '@/data/countries.json';

export default function MarketplacePage() {
  const router = useRouter();
  const { t } = useLanguage();
  const { addToCart } = useCart();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedSubcategory, setSelectedSubcategory] = useState('all');
  const [selectedCountry, setSelectedCountry] = useState('Tous les pays');
  const [selectedCity, setSelectedCity] = useState<string>('');
  const [showFilters, setShowFilters] = useState(false);
  const [showCountrySelector, setShowCountrySelector] = useState(false);
  const [showCitySelector, setShowCitySelector] = useState(false);
  const [selectedCurrency, setSelectedCurrency] = useState('EUR');
  const [showModal, setShowModal] = useState(false);
  const [addedProduct, setAddedProduct] = useState<any>(null);

  // Pays disponibles avec drapeaux - triés par ordre alphabétique
  const countries = countriesData.countries
    .map(country => `${country.flag} ${country.name}`)
    .sort(); // Tri alphabétique
  const allCountries = ['Tous les pays', ...countries];
  
  console.log('Countries loaded:', countries.length, 'countries');
  console.log('First few countries:', countries.slice(0, 5));

  // Taux de change pour la diaspora (prix de base en EUR/USD)
  const exchangeRates = {
    'EUR': 1,        // Prix de base en euros
    'USD': 1.1,      // 1 EUR = 1.1 USD
    'FCFA': 650      // 1 EUR = 650 FCFA
  };

  // Récupération dynamique des top 3 villes depuis countries.json
  const countryRecord = countriesData.countries.find(c => `${c.flag} ${c.name}` === selectedCountry);
  const availableCities = countryRecord?.topCities || [];
  const gatingIncomplete = selectedCountry === 'Tous les pays' || !selectedCity;

  // Fonction pour convertir les prix (prix de base en EUR)
  const convertPrice = (priceInEUR: number, currency: string) => {
    if (currency === 'EUR') {
      return {
        amount: priceInEUR.toFixed(2),
        symbol: '€',
        perKg: (priceInEUR / 10).toFixed(2) + '€/kg'
      };
    } else if (currency === 'USD') {
      const priceInUSD = priceInEUR * exchangeRates.USD;
      return {
        amount: priceInUSD.toFixed(2),
        symbol: '$',
        perKg: (priceInUSD / 10).toFixed(2) + '$/kg'
      };
    } else if (currency === 'FCFA') {
      const priceInFCFA = priceInEUR * exchangeRates.FCFA;
      return {
        amount: priceInFCFA.toLocaleString(),
        symbol: 'FCFA',
        perKg: (priceInFCFA / 1000).toFixed(1) + 'k FCFA/kg'
      };
    }
    
    return {
      amount: priceInEUR.toFixed(2),
      symbol: '€',
      perKg: (priceInEUR / 10).toFixed(2) + '€/kg'
    };
  };

  // Catégories et produits style Amazon
  const categories = {
    'materiaux': {
      name: 'Matériaux',
      icon: '🔧',
      products: [
        { id: 1, name: 'Ciment 50kg', price: 13.08, image: '🏗️', countries: ['🇸🇳 Sénégal', '🇲🇱 Mali', '🇧🇫 Burkina Faso'] },
        { id: 2, name: 'Fer à béton 12mm', price: 1.85, image: '🔩', countries: ['🇸🇳 Sénégal', '🇲🇱 Mali', '🇨🇮 Côte d\'Ivoire'] },
        { id: 3, name: 'Tôle galvanisée', price: 3.85, image: '📏', countries: ['🇸🇳 Sénégal', '🇧🇫 Burkina Faso', '🇳🇪 Niger'] },
        { id: 4, name: 'Peinture 20L', price: 6.92, image: '🎨', countries: ['🇸🇳 Sénégal', '🇲🇱 Mali', '🇬🇳 Guinée'] },
        { id: 5, name: 'Sable 1 tonne', price: 23.08, image: '🏖️', countries: ['🇸🇳 Sénégal', '🇧🇫 Burkina Faso', '🇲🇷 Mauritanie'] },
        { id: 6, name: 'Kit outils', price: 5.38, image: '🔨', countries: ['🇸🇳 Sénégal', '🇲🇱 Mali', '🇨🇮 Côte d\'Ivoire'] }
      ]
    },
    'aliments': {
      name: 'Aliments',
      icon: '🍎',
      products: [
        { id: 7, name: 'Sac riz 30kg', price: 27.69, image: '🍚', countries: ['🇸🇳 Sénégal', '🇲🇱 Mali', '🇧🇫 Burkina Faso'] },
        { id: 8, name: 'Huile 5L', price: 4.92, image: '🫒', countries: ['🇸🇳 Sénégal', '🇲🇱 Mali', '🇨🇮 Côte d\'Ivoire'] },
        { id: 9, name: 'Farine 25kg', price: 13.08, image: '🌾', countries: ['🇸🇳 Sénégal', '🇧🇫 Burkina Faso', '🇳🇪 Niger'] },
        { id: 10, name: 'Maïs 50kg', price: 18.46, image: '🌽', countries: ['🇸🇳 Sénégal', '🇲🇱 Mali', '🇬🇳 Guinée'] },
        { id: 11, name: 'Sucre 25kg', price: 14.62, image: '🍯', countries: ['🇸🇳 Sénégal', '🇧🇫 Burkina Faso', '🇲🇷 Mauritanie'] }
      ]
    },
    'energie': {
      name: 'Énergie',
      icon: '⚡',
      products: [
        { id: 12, name: 'Bonbonne gaz 12kg', price: 13.08, image: '🛢️', countries: ['🇸🇳 Sénégal', '🇲🇱 Mali', '🇧🇫 Burkina Faso'] },
        { id: 13, name: 'Panneau solaire 100W', price: 69.23, image: '☀️', countries: ['🇸🇳 Sénégal', '🇧🇫 Burkina Faso', '🇳🇪 Niger'] },
        { id: 14, name: 'Lampe LED rechargeable', price: 5.38, image: '💡', countries: ['🇸🇳 Sénégal', '🇲🇱 Mali', '🇨🇮 Côte d\'Ivoire'] },
        { id: 15, name: 'Batterie 12V 100Ah', price: 130.77, image: '🔋', countries: ['🇸🇳 Sénégal', '🇧🇫 Burkina Faso', '🇬🇳 Guinée'] }
      ]
    },
    'divers': {
      name: 'Divers',
      icon: '🛠️',
      products: [
        { id: 16, name: 'Kit hygiène complet', price: 3.85, image: '🧴', countries: ['🇸🇳 Sénégal', '🇲🇱 Mali', '🇧🇫 Burkina Faso'] },
        { id: 17, name: 'Kit sanitaire', price: 23.08, image: '🚿', countries: ['🇸🇳 Sénégal', '🇧🇫 Burkina Faso', '🇳🇪 Niger'] },
        { id: 18, name: 'Vêtements de travail', price: 13.08, image: '👷', countries: ['🇸🇳 Sénégal', '🇲🇱 Mali', '🇨🇮 Côte d\'Ivoire'] },
        { id: 19, name: 'Kit de survie', price: 18.46, image: '🎒', countries: ['🇸🇳 Sénégal', '🇧🇫 Burkina Faso', '🇬🇳 Guinée'] }
      ]
    }
  };

  return (
    <ProtectedRoute redirectMessage="Vous devez d'abord vous inscrire et vous connecter pour accéder au marketplace.">
      <div className="min-h-screen bg-gray-900 text-white">
        {/* Contenu principal */}
        <div className="pt-4 pb-16">

          {/* Contenu principal */}
          <div className="px-2 sm:px-4 pb-16">
            {/* Section recherche moderne */}
            <div className="relative bg-gradient-to-r from-gray-800/40 to-gray-900/40 backdrop-filter backdrop-blur-15 rounded-xl p-4 border border-white/10 shadow-2xl">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Rechercher des produits..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-3 pl-12 bg-gradient-to-r from-gray-800/60 to-gray-900/60 backdrop-filter backdrop-blur-10 border border-white/15 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500/50 focus:shadow-lg focus:shadow-purple-500/25 transition-all duration-300"
                />
                <svg 
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-purple-400"
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>

            {/* Barre de filtres compacte */}
            <div className="mt-4 flex flex-wrap gap-2 items-center">
              {/* Bouton Filtres moderne */}
              <button
                onClick={() => {
                  console.log('Filters clicked, current state:', showFilters);
                  setShowFilters(!showFilters);
                  // Fermer l'autre dropdown si ouvert
                  if (showCountrySelector) setShowCountrySelector(false);
                }}
                className="bg-gradient-to-r from-purple-600/80 to-purple-700/80 backdrop-filter backdrop-blur-15 border border-purple-500/30 rounded-xl px-4 py-2.5 text-white text-sm font-medium hover:from-purple-500/80 hover:to-purple-600/80 focus:outline-none focus:border-purple-400/50 focus:shadow-lg focus:shadow-purple-500/25 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/10 hover:-translate-y-1 flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.414A1 1 0 013 6.707V4z" />
                </svg>
                Filtres
              </button>
              
              {/* Sélecteur de pays */}
              <button
                onClick={() => {
                  console.log('Country selector clicked, current state:', showCountrySelector);
                  setShowCountrySelector(!showCountrySelector);
                  // Fermer l'autre dropdown si ouvert
                  if (showFilters) setShowFilters(false);
                  setShowCitySelector(false);
                }}
                className="bg-gradient-to-r from-gray-700/80 to-gray-800/80 backdrop-filter backdrop-blur-15 border border-white/15 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-purple-500/50 focus:shadow-lg focus:shadow-purple-500/25 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/10 hover:-translate-y-1 flex items-center gap-2"
              >
                <span>{selectedCountry}</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* Sélecteur de ville (affiché après choix pays) */}
              {selectedCountry !== 'Tous les pays' && (
                <button
                  onClick={() => {
                    setShowCitySelector(!showCitySelector);
                    setShowCountrySelector(false);
                    setShowFilters(false);
                  }}
                  className="bg-gradient-to-r from-gray-700/80 to-gray-800/80 backdrop-filter backdrop-blur-15 border border-white/15 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-purple-500/50 focus:shadow-lg focus:shadow-purple-500/25 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/10 hover:-translate-y-1 flex items-center gap-2"
                >
                  <span>{selectedCity || 'Choisir une ville'}</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
              )}
              
              
              {/* Affichage du filtre actuel moderne */}
              {selectedCategory !== 'all' && (
                <div className="bg-gradient-to-r from-gray-700/80 to-gray-800/80 backdrop-filter backdrop-blur-10 border border-white/15 px-4 py-2.5 rounded-lg text-sm text-purple-300 font-medium">
                  {categories[selectedCategory as keyof typeof categories]?.name || 'Toutes catégories'}
                </div>
              )}
              
              {/* Sélecteur de devise */}
              <button
                onClick={() => {
                  // Changer de devise
                  setSelectedCurrency(selectedCurrency === 'EUR' ? 'USD' : 'EUR');
                  setShowCountrySelector(false);
                  setShowFilters(false);
                }}
                className="bg-gradient-to-r from-gray-700/80 to-gray-800/80 backdrop-filter backdrop-blur-15 border border-white/15 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-purple-500/50 focus:shadow-lg focus:shadow-purple-500/25 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/10 hover:-translate-y-1"
              >
                {selectedCurrency === 'EUR' ? 'EUR (€)' : 'USD ($)'}
              </button>
            </div>

            {/* Filtres avec mini boutons style Amazon */}
            {showFilters && (
              <div className="mt-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-white font-semibold">Filtrer par catégorie</h3>
                  <button
                    onClick={() => setShowFilters(false)}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                
                {/* Mini boutons de filtres style Amazon */}
                <div className="flex flex-wrap gap-2">
                  {/* Bouton "Toutes catégories" */}
                  <button
                    onClick={() => setSelectedCategory('all')}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                      selectedCategory === 'all'
                        ? 'bg-purple-600 text-white border-2 border-purple-400 shadow-lg shadow-purple-500/25'
                        : 'bg-gray-700/80 text-gray-300 border border-gray-600/50 hover:bg-gray-600/80 hover:border-gray-500/70'
                    }`}
                  >
                    🏪 Toutes catégories
                  </button>
                  
                  {/* Boutons pour chaque catégorie */}
                  {Object.entries(categories).map(([key, category]) => (
                    <button
                      key={key}
                      onClick={() => setSelectedCategory(key)}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                        selectedCategory === key
                          ? 'bg-purple-600 text-white border-2 border-purple-400 shadow-lg shadow-purple-500/25'
                          : 'bg-gray-700/80 text-gray-300 border border-gray-600/50 hover:bg-gray-600/80 hover:border-gray-500/70'
                      }`}
                    >
                      {category.icon} {category.name}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Sélecteur de pays - EXACTEMENT comme dans EstimateStep */}
            {showCountrySelector && (
              <div className="mt-4">
                <h3 className="text-white font-semibold mb-3">Pays disponibles ({allCountries.length})</h3>
                
                {/* Dropdown List - Position relative pour pousser les éléments - EXACTEMENT comme EstimateStep */}
                <div className="relative w-full">
                  <AnimatedList
                    items={allCountries}
                    onItemSelect={(item, index) => {
                      console.log('Country selected:', item);
                      setSelectedCountry(item);
                      setSelectedCity('');
                      setShowCountrySelector(false);
                      setShowCitySelector(true);
                    }}
                    showGradients={true}
                    enableArrowNavigation={true}
                    displayScrollbar={false}
                    className="w-full"
                    isOpen={showCountrySelector}
                    maxHeight={200}
                  />
                </div>
                
              </div>
            )}

            {/* Sélecteur de ville */}
            {showCitySelector && selectedCountry !== 'Tous les pays' && (
              <div className="mt-4">
                <h3 className="text-white font-semibold mb-3">Villes disponibles ({availableCities.length})</h3>
                <div className="flex flex-wrap gap-2">
                  {availableCities.map((city) => (
                    <button
                      key={city}
                      onClick={() => {
                        setSelectedCity(city);
                        setShowCitySelector(false);
                        try {
                          const loc = { country: selectedCountry, city };
                          localStorage.setItem('marketplaceLocation', JSON.stringify(loc));
                        } catch (e) {}
                      }}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                        selectedCity === city
                          ? 'bg-purple-600 text-white border-2 border-purple-400 shadow-lg shadow-purple-500/25'
                          : 'bg-gray-700/80 text-gray-300 border border-gray-600/50 hover:bg-gray-600/80 hover:border-gray-500/70'
                      }`}
                    >
                      {city}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Produits style Amazon */}
            <div className="mt-6 relative">
              {/* En-tête produits (toujours rendu pour préserver la mise en page) */}
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-white">
                  {selectedCategory === 'all' ? 'Tous les produits' : categories[selectedCategory as keyof typeof categories]?.name}
                </h2>
                <div className="text-sm text-gray-400">
                  {(() => {
                    if (selectedCategory === 'all') {
                      const allProducts = Object.values(categories).flatMap(cat => cat.products);
                      return allProducts.filter(product => 
                        selectedCountry === 'Tous les pays' || product.countries.includes(selectedCountry)
                      ).length;
                    } else {
                      return categories[selectedCategory as keyof typeof categories]?.products.filter(product => 
                        selectedCountry === 'Tous les pays' || product.countries.includes(selectedCountry)
                      ).length || 0;
                    }
                  })()} produits
                </div>
              </div>

              {/* Liste de produits style Amazon */}
              <div className={`space-y-4 ${gatingIncomplete ? 'opacity-40 pointer-events-none select-none' : ''}`}>
                {(() => {
                  let productsToShow = [];
                  
                  if (selectedCategory === 'all') {
                    productsToShow = Object.values(categories).flatMap(cat => cat.products);
                  } else {
                    productsToShow = categories[selectedCategory as keyof typeof categories]?.products || [];
                  }
                  
                  // Filtrer par pays
                  productsToShow = productsToShow.filter(product => 
                    selectedCountry === 'Tous les pays' || product.countries.includes(selectedCountry)
                  );
                  
                  // Filtrer par recherche
                  if (searchQuery) {
                    productsToShow = productsToShow.filter(product =>
                      product.name.toLowerCase().includes(searchQuery.toLowerCase())
                    );
                  }
                  
                  return productsToShow.map(product => (
                    <div
                      key={product.id}
                      className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer"
                    >
                      {/* En-tête avec badges */}
                      <div className="relative">
                        <div className="absolute top-2 left-2 bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded">
                          Choix DCARD
                        </div>
                        <div className="absolute top-2 right-2 bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded flex items-center gap-1">
                          <span>Sponsorisé</span>
                          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                          </svg>
                        </div>
                      </div>

                      {/* Contenu principal */}
                      <div className="flex p-4">
                        {/* Image produit - gauche */}
                        <div className="flex-shrink-0 w-24 h-24 bg-gray-100 rounded-lg flex items-center justify-center mr-4">
                          <div className="text-3xl">
                            {product.image}
                          </div>
                        </div>
                        
                        {/* Détails produit - droite */}
                        <div className="flex-1 min-w-0">
                          {/* Nom produit */}
                          <h3 className="text-sm font-medium text-gray-900 mb-2 line-clamp-2 leading-tight">
                            {product.name}
                          </h3>
                          
                          {/* Note et avis */}
                          <div className="flex items-center mb-2">
                            <div className="flex items-center">
                              <span className="text-sm font-medium text-gray-900 mr-1">4,3</span>
                              <div className="flex">
                                {[...Array(5)].map((_, i) => (
                                  <svg key={i} className="w-3 h-3 text-orange-400 fill-current" viewBox="0 0 20 20">
                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                  </svg>
                                ))}
                              </div>
                              <span className="text-xs text-gray-500 ml-1">(252)</span>
                            </div>
                          </div>
                          
                          {/* Info ventes */}
                          <div className="text-xs text-gray-600 mb-2">
                            Plus de 50 achetés au cours du mois dernier
                          </div>
                          
                          {/* Disponibilité */}
                          <div className="flex items-center gap-2 text-sm mb-2">
                            <span className="text-green-600 font-semibold">Disponible</span>
                            <span className="text-gray-500">dans {product.countries.length} pays</span>
                          </div>
                          
                          {/* Prix */}
                          <div className="mb-2">
                            {(() => {
                              const priceInfo = convertPrice(product.price, selectedCurrency);
                              return (
                                <>
                                  <span className="text-lg font-bold text-gray-900">
                                    {priceInfo.amount} {priceInfo.symbol}
                                  </span>
                                  <span className="text-xs text-gray-500 ml-1">
                                    ({priceInfo.perKg})
                                  </span>
                                </>
                              );
                            })()}
                          </div>
                          
                          {/* Réduction */}
                          <div className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded mb-2 inline-block">
                            Réduction de 10% sur votre première commande
                          </div>
                          
                          {/* Service de point relais */}
                          <div className="text-xs text-gray-600 mb-3">
                            📦 Retrait disponible dans nos points relais partenaires
                          </div>
                          
                          {/* Bouton d'action */}
                          <button 
                            onClick={() => {
                              addToCart({
                                id: product.id,
                                name: product.name,
                                price: product.price,
                                image: product.image,
                                countries: product.countries,
                                category: selectedCategory
                              });
                              setAddedProduct(product);
                              setShowModal(true);
                            }}
                            className="w-full bg-yellow-400 hover:bg-yellow-500 text-gray-900 py-2 px-4 rounded-lg text-sm font-medium transition-colors duration-200"
                          >
                            Ajouter au panier
                          </button>
                        </div>
                      </div>
                      
                      {/* Pays disponibles - en bas */}
                      <div className="px-4 pb-3">
                        <div className="text-xs text-gray-500">
                          Disponible: {product.countries.join(', ')}
                        </div>
                      </div>
                    </div>
                  ));
                })()}
              </div>
              
              {/* Message si aucun produit */}
              {(() => {
                let productsToShow = [];
                
                if (selectedCategory === 'all') {
                  productsToShow = Object.values(categories).flatMap(cat => cat.products);
                } else {
                  productsToShow = categories[selectedCategory as keyof typeof categories]?.products || [];
                }
                
                productsToShow = productsToShow.filter(product => 
                  selectedCountry === 'Tous les pays' || product.countries.includes(selectedCountry)
                );
                
                if (searchQuery) {
                  productsToShow = productsToShow.filter(product =>
                    product.name.toLowerCase().includes(searchQuery.toLowerCase())
                  );
                }
                
                if (productsToShow.length === 0) {
                  return (
                    <div className="text-center py-12">
                      <div className="text-6xl mb-4">🔍</div>
                      <h3 className="text-xl font-semibold text-white mb-2">Aucun produit trouvé</h3>
                      <p className="text-gray-400">Essayez de modifier vos filtres ou votre recherche</p>
                    </div>
                  );
                }
                
                return null;
              })()}

              {/* Overlay de gating (affiché mais non destructif) */}
              {gatingIncomplete && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="backdrop-blur-sm bg-gray-900/40 border border-white/10 rounded-xl p-6 text-center max-w-md">
                    <div className="text-5xl mb-3">🗺️</div>
                    <h3 className="text-lg font-semibold text-white mb-2">Sélectionnez d'abord un pays puis une ville</h3>
                    <p className="text-gray-300">Choisissez un pays, puis l'une des 3 plus grandes villes proposées.</p>
                  </div>
                </div>
              )}
            </div>

            {/* Message temporaire (déplacé plus haut) */}
            <div className="bg-gradient-to-br from-purple-500/20 via-blue-500/20 to-pink-500/20 border border-white/20 rounded-xl p-6 mt-6 text-center">
              <div className="text-4xl mb-3">🚀</div>
              <h2 className="text-xl font-bold text-white mb-2">
                Marketplace bientôt disponible !
              </h2>
              <p className="text-gray-300 mb-4 text-sm">
                Achetez et envoyez des produits dans les catégories Matériaux, Aliments et Énergie directement à vos proches.
              </p>

              <button
                onClick={() => router.push('/choose-action')}
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold py-2 px-4 rounded-lg transition-all transform hover:scale-105 text-sm"
              >
                Retour aux options
              </button>
            </div>
        </div>
      </div>

      {/* Modal de confirmation */}
      {showModal && addedProduct && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 border border-white/20 rounded-2xl p-6 max-w-md w-full shadow-2xl">
            {/* En-tête */}
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white">Produit ajouté !</h3>
            </div>

            {/* Produit ajouté */}
            <div className="bg-gray-700/50 rounded-lg p-4 mb-6">
              <div className="flex items-center gap-4">
                <div className="text-4xl">{addedProduct.image}</div>
                <div>
                  <p className="font-semibold text-white">{addedProduct.name}</p>
                  <p className="text-sm text-gray-400">
                    {convertPrice(addedProduct.price, selectedCurrency).amount} {convertPrice(addedProduct.price, selectedCurrency).symbol}
                  </p>
                </div>
              </div>
            </div>

            {/* Question */}
            <p className="text-gray-300 mb-6 text-center">
              Souhaitez-vous continuer vos achats ou voir votre panier ?
            </p>

            {/* Boutons */}
            <div className="flex flex-col gap-3">
              <button
                onClick={() => {
                  setShowModal(false);
                  router.push('/buy-material');
                }}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-3 px-4 rounded-lg transition-all duration-200"
              >
                🛒 Voir mon panier
              </button>
              
              <button
                onClick={() => setShowModal(false)}
                className="w-full bg-gray-700 hover:bg-gray-600 text-white font-medium py-3 px-4 rounded-lg transition-all duration-200"
              >
                Continuer mes achats
              </button>
            </div>
          </div>
        </div>
      )}
      </div>
    </ProtectedRoute>
  );
}

