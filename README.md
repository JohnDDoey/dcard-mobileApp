# 🌍 DCARD Mobile - Application de Transfert d'Argent International

<div align="center">
  <img src="https://img.shields.io/badge/Next.js-15.5.4-black" alt="Next.js">
  <img src="https://img.shields.io/badge/React-19.1.0-blue" alt="React">
  <img src="https://img.shields.io/badge/TypeScript-5.0-blue" alt="TypeScript">
  <img src="https://img.shields.io/badge/TailwindCSS-4.0-38B2AC" alt="TailwindCSS">
  <img src="https://img.shields.io/badge/Framer%20Motion-12.23.24-purple" alt="Framer Motion">
  <img src="https://img.shields.io/badge/Three.js-0.180.0-green" alt="Three.js">
</div>

## 📱 Aperçu

**DCARD Mobile** est une application web mobile moderne pour les transferts d'argent internationaux et l'achat de produits (marketplace) avec système de cashback basé sur la blockchain. 

L'application offre **2 services principaux** :
- 💸 **Transfert d'argent** ("Envoyer de l'amour") : Envoyez de l'argent à vos proches avec des taux de change en temps réel et un cashback blockchain
- 🛒 **Marketplace** ("Envoyer des matériaux") : Achetez et envoyez des produits essentiels (matériaux, aliments, énergie) directement dans 54 pays africains

Avec une expérience utilisateur fluide, des animations élégantes, une interface multilingue (3 langues) et une traçabilité blockchain complète.

## ✨ Fonctionnalités Principales

### 🔐 Authentification
- **Système de connexion** sécurisé avec validation
- **Gestion de session** persistante avec localStorage
- **Interface de login** avec boutons sociaux (Google, Facebook)
- **Protection des routes** avec composant ProtectedRoute

### 🎯 Page de Transition
- **Page `/choose-action`** sobre avec design blanc
- **2 options d'action** : "Envoyer de l'amour" (transfert d'argent) et "Envoyer des matériaux" (marketplace)
- **Interface non-scrollable** optimisée pour une expérience fluide
- **Badges visuels** "Nouveau" et "Populaire" pour guider l'utilisateur

### 💰 Transfert d'Argent (Coupon)
- **Workflow en 4 étapes** : Estimation → Destinataire → Paiement → Vérification
- **Taux de change en temps réel** via ExchangeRate-API (163 devises)
- **Calcul automatique** des taux de change avec frais détaillés
- **Sélection du pays** avec interface interactive et mapping automatique des devises
- **Informations du destinataire** complètes avec validation
- **Méthodes de paiement** multiples intégrées avec Flutterwave (Carte bancaire, Google Pay, Virement)
- **Widgets de paiement réalistes** avec formulaires détaillés
- **Scroll automatique** lors des transitions et sélection des méthodes de paiement
- **Validation des formulaires** avec boutons conditionnels
- **Simulation de paiement** avec progression et messages de statut

### 🛒 Marketplace (Nouveau)
- **Catalogue de produits** organisé en 4 catégories :
  - 🔧 **Matériaux** : Ciment, fer, tôle, peinture, sable, outils
  - 🌾 **Aliments** : Riz (sacs 30kg), huile, farine, maïs, sucre
  - ⚡ **Énergie** : Bonbonnes de gaz, panneaux solaires, lampes, batteries
  - 📦 **Divers** : Eau, hygiène, kits sanitaires, vêtements de travail
- **Sélecteur de pays** avec AnimatedList (54 pays africains avec drapeaux)
- **Filtres par catégorie** avec mini-boutons style Amazon
- **Disponibilité par pays** affichée pour chaque produit
- **Sélecteur de devise** EUR/USD pour la diaspora
- **Conversion automatique** des prix selon la devise choisie
- **Barre de recherche** pour trouver rapidement des produits
- **Design moderne** avec gradients, backdrop blur et effets visuels
- **Vignettes de produits** style Amazon (image à gauche, détails à droite)
- **Badge réduction** 10% sur première commande
- **Livraison en points relais** partenaires

### 🛍️ Panier et Commande
- **Panier global** avec React Context (CartContext)
- **Icône panier** dans le header avec compteur numérique
- **Page `/buy-material`** pour résumé de commande :
  - Ajustement des quantités (+ / -)
  - Suppression d'articles
  - Calcul automatique : Sous-total, TVA (20%), Total
  - Sélecteur de devise EUR/USD
  - Section "Articles" détaillée dans le résumé
- **Modal de confirmation** après ajout au panier ("Voir mon panier" ou "Continuer mes achats")
- **Intégration PaymentStep** pour le paiement
- **Enregistrement blockchain** après paiement via `recordWindowShopping()`

### 🎁 Système de Cashback
- **Génération automatique** de codes coupon uniques
- **Enregistrement blockchain** avec Ethers.js et paramètre `receiverCountry`
- **2 types de transactions** :
  - **Coupons** : Transferts d'argent classiques
  - **Tickets** : Achats marketplace avec détails des produits
- **Historique avec onglets** pour séparer Coupons et Tickets
- **Accordéons interactifs** pour chaque transaction
- **Codes coupon** uniques avec bouton de copie
- **Hash de création et burn** pour toutes les transactions
- **Reçu PDF** téléchargeable avec détails complets
- **Affichage du pays correct** dans les reçus
- **Traçabilité complète** de la transaction à la consommation

### 🌐 Internationalisation
- **3 langues supportées** : Anglais, Français, Espagnol
- **Changement de langue** en temps réel
- **Interface traduite** complète
- **Boutons de sélection** de langue dans le menu

### 🎨 Interface Utilisateur
- **Design mobile-first** responsive
- **Menu hamburger** avec animations Framer Motion et layout global
- **Globe 3D interactif** avec Three.js
- **Animations fluides** et transitions
- **Thème sombre** moderne
- **Composants réutilisables** modulaires
- **Panneau accordéon** pour l'historique des transactions
- **Interface compacte** optimisée pour mobile

### 🔗 Intégration Blockchain
- **Smart contracts** pour les cashbacks
- **API routes** pour l'interaction blockchain
- **Enregistrement des transactions** sur la blockchain
- **Gestion des erreurs** robuste

## 🛠️ Technologies Utilisées

### Frontend
- **Next.js 15.5.4** - Framework React avec SSR
- **React 19.1.0** - Bibliothèque UI
- **TypeScript 5.0** - Typage statique
- **TailwindCSS 4.0** - Framework CSS
- **Framer Motion 12.23.24** - Animations
- **Three.js 0.180.0** - Graphiques 3D

### Backend & Blockchain
- **Ethers.js 6.15.0** - Interaction avec Ethereum
- **API Routes** Next.js pour le backend
- **Smart Contracts** Solidity
- **Hardhat** - Développement blockchain
- **ExchangeRate-API** - Taux de change temps réel
- **Flutterwave** - Paiements (optionnel)

### Développement
- **ESLint** - Linting du code
- **Netlify** - Déploiement
- **Git** - Contrôle de version

## 📁 Structure du Projet

```
mobile-app/
├── src/
│   ├── app/                    # Pages Next.js (App Router)
│   │   ├── api/               # API Routes
│   │   │   ├── auth/          # Authentification
│   │   │   └── blockchain/    # Blockchain endpoints
│   │   ├── choose-action/     # Page de transition
│   │   ├── history/           # Page historique avec onglets
│   │   ├── login/             # Page de connexion
│   │   ├── marketplace/       # Page marketplace (nouveau)
│   │   ├── buy-material/      # Page panier (nouveau)
│   │   ├── send-money/        # Page transfert d'argent
│   │   ├── settings/          # Page paramètres
│   │   ├── stores/            # Page boutiques physiques
│   │   └── verify/            # Page vérification
│   ├── components/            # Composants React
│   │   ├── StaggeredMenu.tsx  # Menu principal
│   │   ├── MainLayout.tsx     # Layout global avec menu et panier
│   │   ├── TransactionAccordion.tsx # Panneau accordéon historique
│   │   ├── AnimatedList.tsx   # Liste animée (pays, filtres)
│   │   ├── EstimateStep.tsx   # Étape d'estimation avec taux temps réel
│   │   ├── ReceiverInformation.tsx # Informations destinataire
│   │   ├── PaymentStep.tsx    # Étape de paiement avec Flutterwave
│   │   ├── ReviewStep.tsx     # Étape de vérification
│   │   ├── LoadingPage.tsx    # Page de chargement
│   │   ├── CreditCardWidget.tsx # Widget carte bancaire avec logos
│   │   ├── GooglePayWidget.tsx  # Widget Google Pay
│   │   ├── BankTransferWidget.tsx # Widget virement bancaire
│   │   ├── FlutterwavePayment.tsx # Intégration Flutterwave
│   │   └── ...
│   ├── contexts/              # Contextes React
│   │   ├── AuthContext.tsx    # Gestion auth
│   │   ├── CartContext.tsx    # Gestion panier (nouveau)
│   │   └── LanguageContext.tsx # Gestion langues
│   ├── contracts/             # Smart contracts & Services blockchain
│   │   ├── cashbackService.ts # Service blockchain
│   │   └── contractAddress.json # Adresse du contrat
│   ├── hooks/                 # Hooks personnalisés
│   ├── locales/               # Fichiers de traduction
│   ├── data/                  # Données (54 pays africains avec drapeaux)
│   ├── types/                 # Types TypeScript
│   └── utils/                 # Utilitaires
├── backend/                   # Projet blockchain Hardhat
│   ├── contracts/             # Smart contracts Solidity
│   │   └── CashbackRegistry.sol # Contrat avec Coupons & Tickets
│   └── scripts/               # Scripts de déploiement
└── public/                    # Assets statiques
```

## 🚀 Installation et Démarrage

### Prérequis
- Node.js 18+ 
- npm ou yarn
- Git

### Installation
```bash
# Cloner le repository
git clone <votre-repo-url>
cd mobile-app

# Installer les dépendances
npm install

# Démarrer le serveur de développement
npm run dev
```

### Configuration des Variables d'Environnement

**Créer le fichier `.env.local` à la racine du projet :**

```env
# Blockchain Configuration (Testnet - Pas de clés sensibles)
COMPANY_WALLET_PRIVATE_KEY=ac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80
RPC_URL=https://sepolia.era.zksync.dev
CONTRACT_ADDRESS=0x... # Adresse du contrat déployé (à remplacer après déploiement)

# Flutterwave (Optionnel - pour les paiements réels)
NEXT_PUBLIC_FLUTTERWAVE_PUBLIC_KEY=pk_test_...
FLUTTERWAVE_SECRET_KEY=sk_test_...
FLUTTERWAVE_ENCRYPTION_KEY=...

# Exchange Rate API (Optionnel - pour les taux de change)
EXCHANGE_RATE_API_KEY=your_api_key_here
```

**⚠️ Note importante :** Toutes les clés sont des clés de test (testnet). Aucune donnée sensible n'est exposée.

### Démarrage rapide
```bash
npm run dev
```
L'application sera accessible sur `http://localhost:3000`

## 🔧 Scripts Disponibles

```bash
npm run dev      # Démarrage en mode développement
npm run build    # Build de production
npm run start    # Démarrage en mode production
npm run lint     # Linting du code
```

## 🌍 Fonctionnalités Multilingues

L'application supporte 3 langues avec changement dynamique :

- 🇺🇸 **English** - Interface en anglais
- 🇫🇷 **Français** - Interface en français  
- 🇪🇸 **Español** - Interface en espagnol

Le changement de langue se fait via les boutons dans le menu principal.

## 🗺️ Routes et Navigation

### Pages Principales
| Route | Description | Fonctionnalités |
|-------|-------------|-----------------|
| `/` | Page d'accueil | Globe 3D, bouton "Send Money" vers `/choose-action` |
| `/choose-action` | Page de transition | 2 boutons : "Envoyer de l'amour" et "Envoyer des matériaux" |
| `/send-money` | Transfert d'argent | Workflow 4 étapes : Estimation → Destinataire → Paiement → Vérification |
| `/marketplace` | Marketplace | Catalogue produits, filtres, recherche, panier |
| `/buy-material` | Panier & Commande | Résumé commande, paiement, enregistrement blockchain |
| `/history` | Historique | 2 onglets (Coupons/Tickets), accordéons, refresh |
| `/stores` | Boutiques physiques | Localisation des points de vente et relais |
| `/verify` | Vérification | Vérifier et consommer des coupons/tickets |
| `/settings` | Paramètres | Compte utilisateur, préférences |
| `/login` | Connexion | Authentification utilisateur |

### Menu de Navigation
1. **Home** (`/`) - Page d'accueil
2. **History** (`/history`) - Historique transactions
3. **Market** (`/marketplace`) - Marketplace produits
4. **Coupon** (`/send-money`) - Transfert d'argent
5. **Boutiques** (`/stores`) - Points de vente
6. **Verify** (`/verify`) - Vérification coupons
7. **Settings** (`/settings`) - Paramètres compte

## 💳 Workflow de Transfert

### 1. Estimation
- Sélection du pays de destination avec mapping automatique des devises
- **Taux de change en temps réel** via ExchangeRate-API (163 devises supportées)
- Calcul automatique du taux de change avec cache de 1 heure
- **Frais détaillés** : Service Fee (2.5%), Blockchain Fee (0.50 EUR), Infrastructure Fee (1.00 EUR)
- Estimation du total avec tous les frais
- **Indicateur visuel** du pays et devise sélectionnés

### 2. Destinataire
- **Informations personnelles** avec validation des champs requis
- Numéro de téléphone et adresse
- **Bouton continu** désactivé jusqu'à validation complète
- **Interface compacte** optimisée pour mobile

### 3. Paiement
- Sélection de la méthode de paiement (Carte bancaire, Google Pay, Virement)
- **Widgets de paiement réalistes** avec formulaires détaillés
- **Intégration Flutterwave** invisible pour les méthodes de paiement
- **Logos Visa/Mastercard** colorés et visibles
- **Simulation de paiement** avec progression et messages de statut
- **Scroll automatique** vers les widgets de paiement lors de la sélection
- **Calcul du total** avec tous les frais inclus

### 4. Vérification
- **Résumé complet** avec reçu DCARD professionnel
- **Code coupon** avec bouton de copie
- **Hash de transaction** (création et burn)
- **Téléchargement PDF** du reçu
- **Enregistrement blockchain** avec confirmation

## 🔐 Authentification

### Comptes de Test
```
Email: user1@gmail.com
Mot de passe: user1!
```

### Fonctionnalités Auth
- Connexion/déconnexion
- Protection des routes
- Session persistante
- Interface de login responsive

## 📱 Design Responsive

L'application est optimisée pour :
- **Mobile** (320px+) - Interface principale
- **Tablet** (768px+) - Adaptation tablette
- **Desktop** (1024px+) - Version desktop

## 🎨 Composants Principaux

### StaggeredMenu
Menu hamburger avec :
- Animations Framer Motion
- Sélection de langue
- Liens sociaux
- Gestion utilisateur
- **Layout global** intégré dans MainLayout

### TransactionAccordion
Panneau accordéon pour l'historique avec :
- **Vue compacte** (2 lignes) par défaut
- **Résumé complet** en déploiement
- **Hash de burn** pour les transactions complétées
- **Copie des codes** et hash blockchain
- **Téléchargement PDF** du reçu

### MainLayout
Layout global avec :
- **Menu intégré** sur toutes les pages
- **Header fixe** avec logo et menu
- **Espacement** pour le header
- **Cohérence** de navigation

### Globe 3D
Globe interactif avec :
- Rotation automatique
- Zoom dynamique
- Animations fluides
- Performance optimisée

## 🔗 Intégration Blockchain

### Smart Contracts
- **CashbackRegistry** - Gestion des cashbacks et tickets marketplace
- **Enregistrement** de 2 types de transactions :
  - **Coupons** : Transferts d'argent avec `recordCashbackWithCode()`
  - **Tickets** : Achats marketplace avec `recordMarketplacePurchase()` (détails produits)
- **Génération** des codes coupon uniques
- **Structs** :
  - `Cashback` : senderName, senderEmail, beneficiary, receiverCountry, amount, createdAt, used
  - `MarketplacePurchase` : buyerName, beneficiary, userId, totalAmount, createdAt, used, Product[]
  - `Product` : name, quantity, price
- **Fonctions de lecture** :
  - `getAllCoupons()` : Récupère tous les coupons de transfert
  - `getTicketsShop()` : Récupère tous les tickets marketplace
  - `getCouponsByUser()` : Récupère les coupons d'un utilisateur
- **Gestion des erreurs** : Retour d'un tableau vide si aucune donnée (BAD_DATA)

### 📦 Déploiement du Smart Contract sur zkEra Sepolia

#### Prérequis
1. **Node.js 18+** installé
2. **ETH de test** sur Sepolia (via faucet)
3. **Configuration Hardhat** (déjà faite)

#### Obtenir des ETH de test

**Étape 1 : Ajouter zkSync Era Sepolia à MetaMask**
- **Network Name** : zkSync Era Sepolia
- **RPC URL** : https://sepolia.era.zksync.dev
- **Chain ID** : 300
- **Currency Symbol** : ETH
- **Block Explorer** : https://sepolia.era.zksync.dev

**Étape 2 : Obtenir des ETH sur Sepolia L1**
- Visitez : https://sepoliafaucet.com/ ou https://faucet.sepolia.dev/
- Entrez votre adresse : `0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266`
- Attendez la réception (~30 secondes)

**Étape 3 : Bridge vers zkSync Era Sepolia**
- Visitez : https://portal.zksync.io/bridge
- Connectez votre wallet
- Bridge vos ETH vers zkSync Era Sepolia
- Attendez quelques minutes

#### Déploiement du contrat

**1. Créer le fichier .env dans backend/**
```bash
cd backend
```

Créez un fichier `.env` :
```env
# Clé privée du déployeur
DEPLOYER_PRIVATE_KEY=ac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80

# RPC zkSync Era Sepolia
ZKSYNC_SEPOLIA_RPC=https://sepolia.era.zksync.dev
```

**2. Installer les dépendances**
```bash
npm install
```

**3. Compiler le contrat**
```bash
npx hardhat compile
```

**4. Déployer sur zkSync Era Sepolia**
```bash
npx hardhat run scripts/deploy.js --network zkSyncSepolia
```

**5. Récupérer l'adresse du contrat**
Le script affichera :
```
✅ CashbackRegistryTest déployé à l'adresse: 0x...
📝 Adresse sauvegardée dans src/contracts/contractAddress.json
```

**6. Vérifier le contrat (optionnel)**
Visitez l'explorer zkSync Era Sepolia :
```
https://sepolia.era.zksync.dev/address/VOTRE_ADRESSE_CONTRAT
```

#### Variables d'environnement pour le frontend

Après le déploiement, mettez à jour vos variables :

**Fichier `.env.local` (local)**
```env
# Blockchain
COMPANY_WALLET_PRIVATE_KEY=ac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80
RPC_URL=https://sepolia.era.zksync.dev
CONTRACT_ADDRESS=0x... # Adresse du contrat déployé

# Flutterwave (optionnel - pour les paiements réels)
NEXT_PUBLIC_FLUTTERWAVE_PUBLIC_KEY=pk_test_...
FLUTTERWAVE_SECRET_KEY=sk_test_...
FLUTTERWAVE_ENCRYPTION_KEY=...
```

**Dashboard Vercel (production)**
- Ajoutez les mêmes variables dans Settings > Environment Variables
- Redéployez l'application

### API Endpoints
```
# 💰 Coupons (Transfert d'argent)
POST /api/blockchain/record-cashback           # Enregistrer un coupon cashback
GET  /api/blockchain/get-user-coupons          # Récupérer coupons par userId
POST /api/blockchain/verify-coupon             # Vérifier validité coupon + nom
POST /api/blockchain/burn-coupon               # Encaisser/brûler un coupon

# 🎫 Tickets (Marketplace)
POST /api/blockchain/record-marketplace-purchase  # Enregistrer achat marketplace
GET  /api/blockchain/get-market-tickets-by-user   # Récupérer tickets par userId
POST /api/blockchain/verify-ticket                # Vérifier validité ticket
POST /api/blockchain/burn-ticket                  # Encaisser/brûler un ticket

# 💱 Autres
GET  /api/exchange-rates              # Taux de change temps réel (163 devises)
POST /api/payments/init               # Initialiser paiement Flutterwave
POST /api/payments/verify             # Vérifier paiement Flutterwave
```

### Services Blockchain (cashbackService.ts)
```typescript
// Coupons (Transfert d'argent)
getCouponsByUser(userId)              // Récupère les coupons d'un utilisateur
verifyCouponCode(code, nom)           // Vérifie validité + nom de famille
burnCouponCode(code)                  // Brûle/encaisse un coupon

// Tickets (Marketplace)
getMarketTicketsByUser(userId)        // Récupère les tickets marketplace d'un user
verifyTicketCode(code)                // Vérifie validité d'un ticket
burnTicketCode(code)                  // Brûle/encaisse un ticket
recordMarketplacePurchase(...)        // Enregistre un achat marketplace

// Utilitaires
generateCouponCode()                  // Génère un code unique DCARD-XXXXX
```

### Configuration Blockchain

#### 🏠 Local (Hardhat)
- **RPC URL** : http://127.0.0.1:8545
- **Contrat** : 0x5FbDB2315678afecb367f032d93F642f64180aa3
- **Wallet** : Compte Hardhat par défaut
- **Chain ID** : 1337

#### 🌐 zkSync Era Sepolia Testnet
- **RPC URL** : https://sepolia.era.zksync.dev
- **Chain ID** : 300
- **Explorer** : https://sepolia.era.zksync.dev
- **Faucet** : https://portal.zksync.io/faucet
- **Wallet déployeur** : 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266
- **Hash de burn** : Affiché pour les transactions complétées

## 🆕 Nouvelles Fonctionnalités

### 🛒 Marketplace Intégré (Nouveau)
- **Catalogue de 4 catégories** : Matériaux, Aliments, Énergie, Divers
- **Sélecteur de pays** avec 54 pays africains et drapeaux 🇸🇳 🇲🇱 etc.
- **Filtres dynamiques** style Amazon avec mini-boutons
- **Conversion de devises** EUR/USD pour la diaspora
- **Panier intelligent** avec React Context (ajout, suppression, quantités)
- **Icône panier** dans le header avec compteur en temps réel
- **Design moderne** : gradients, backdrop blur, animations
- **Livraison en points relais** partenaires
- **Badge réduction** 10% sur première commande

### 🛍️ Système de Commande
- **Page panier complète** avec ajustement des quantités
- **Calcul automatique** : Sous-total + TVA (20%) = Total
- **Modal de confirmation** après ajout ("Continuer" ou "Voir panier")
- **Intégration PaymentStep** pour paiements sécurisés
- **Paiement Crypto exclusif** : Bitcoin, Ethereum, USDC pour marketplace
- **Enregistrement blockchain** des achats marketplace
- **Tickets marketplace** distincts des coupons de transfert

### 📊 Historique avec Onglets et Verify/Burn
- **2 onglets distincts** : Coupons (transfert) et Tickets (marketplace)
- **Accordéons interactifs** pour chaque type de transaction
- **Affichage détaillé** :
  - **Coupons** : sender, beneficiary, pays, montant, hash, statut
  - **Tickets** : acheteur, nombre de produits, montant total, statut, hash
- **Boutons d'action pour agents DCARD** :
  - 🔍 **Vérifier** : Vérifie validité (+ nom de famille pour coupons)
  - 💰 **Encaisser** : Brûle le coupon/ticket (marque comme utilisé)
- **Compteurs en temps réel** dans les onglets
- **Bouton rafraîchissement** pour recharger les données blockchain
- **Hash de burn** affiché pour transactions complétées

### 🎯 Page de Transition
- **Page `/choose-action`** design blanc sobre
- **2 boutons côte à côte** : "Envoyer de l'amour" vs "Envoyer des matériaux"
- **Badges visuels** : "Nouveau" et "Populaire"
- **Interface non-scrollable** optimisée pour l'UX
- **Navigation fluide** vers /send-money ou /marketplace

### 💱 Taux de Change en Temps Réel
- **ExchangeRate-API** intégrée avec 163 devises supportées
- **Cache intelligent** de 1 heure pour optimiser les performances
- **Mapping automatique** pays → devise (ex: Algérie → DZD, Cameroun → XAF)
- **Indicateur visuel** du pays et devise sélectionnés
- **Fallback robuste** si l'API est indisponible

### 💳 Intégration Paiements
- **Méthodes de paiement** multiples intégrées
- **Widgets réalistes** pour chaque méthode (Carte, Virement, Crypto)
- **Logos Visa/Mastercard** colorés et visibles
- **Paiement Crypto exclusif marketplace** : Bitcoin, Ethereum, USDC
- **Simulation de paiement** avec progression détaillée
- **Variables d'environnement** configurées pour Flutterwave

### 🔗 Smart Contract Étendu
- **2 types de transactions** :
  - `Cashback` : Transferts d'argent classiques
  - `MarketplacePurchase` : Achats marketplace avec détails produits
- **Structs avancés** avec Product[] pour les tickets
- **Fonctions dédiées** :
  - `getCouponsByUserId(userId)` : Récupère tous les détails des coupons d'un user
  - `getMarketTicketsByUserId(userId)` : Récupère tous les tickets marketplace d'un user
  - `verifyCoupon(code, nomFamille)` : Vérifie validité coupon + nom bénéficiaire
  - `burnCoupon(code)` : Marque coupon comme utilisé (encaissement)
  - `verifyTicket(code)` : Vérifie validité d'un ticket
  - `burnTicket(code)` : Marque ticket comme utilisé (encaissement)
  - `recordCashbackWithCode()` : Enregistrer un coupon
  - `recordMarketplacePurchase()` : Enregistrer un achat avec produits
- **Événements blockchain** distincts :
  - `CashbackRecorded`, `CouponBurned`
  - `MarketplacePurchaseRecorded`, `TicketBurned`
- **Paramètre `receiverCountry`** pour géolocalisation
- **Montants arrondis** au supérieur avec Math.ceil() avant enregistrement

### 📱 Interface Améliorée
- **Menu modernisé** avec 7 items : Home, History, Market, Coupon, Boutiques, Verify, Settings
- **Icônes sobres** devant chaque item du menu
- **Header compact** avec logo cliquable vers accueil
- **Panier visible** dans le header avec compteur
- **Layout responsive** optimisé mobile-first
- **AnimatedList** réutilisé (pays, filtres)
- **Scroll automatique** lors des transitions

### 💰 Frais Détaillés
- **Service Fee** (2.5%) sur chaque transaction
- **Blockchain Fee** fixe (0.50 EUR)
- **Infrastructure Fee** fixe (1.00 EUR)
- **Calcul automatique** du total avec tous les frais
- **Affichage détaillé** dans le résumé de paiement

### 🔍 Traçabilité Blockchain
- **Hash de création** pour chaque transaction
- **Hash de burn** pour les transactions complétées
- **Codes coupon** avec boutons de copie
- **Reçu PDF** téléchargeable
- **Pays du destinataire** correctement affiché

### 🌍 Traductions Complètes
- **Toutes les interfaces** traduites en 3 langues
- **Notifications** traduites (copie, téléchargement)
- **Messages d'erreur** localisés
- **Changement de langue** en temps réel
- **Nouvelles clés** pour les widgets de paiement

### ✅ Validation Améliorée
- **Champs requis** avec validation visuelle
- **Boutons conditionnels** (grisés si formulaire incomplet)
- **Messages d'erreur** contextuels
- **UX fluide** avec feedback immédiat
- **Scroll automatique** vers les éléments pertinents

## 📊 Performance

- **Lazy loading** des composants
- **Optimisation** des images
- **Code splitting** automatique
- **Animations** optimisées

## 🚀 Déploiement

### 🌐 Déploiement sur Vercel (Recommandé)

**Vercel est recommandé** car il supporte nativement les **API Routes Next.js** nécessaires pour les transactions blockchain.

#### Prérequis
- Compte Vercel (gratuit)
- Contrat déployé sur zkEra Sepolia
- ETH de test sur Sepolia

#### Étapes de déploiement

**1. Installer Vercel CLI**
```bash
npm i -g vercel
```

**2. Déployer l'application**
```bash
# Déploiement en production
vercel --prod
```

**3. Configurer les variables d'environnement sur Vercel**

Dans le dashboard Vercel (Settings > Environment Variables) :

| Variable | Valeur | Description |
|----------|--------|-------------|
| `COMPANY_WALLET_PRIVATE_KEY` | `ac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80` | Clé privée du wallet déployeur |
| `RPC_URL` | `https://sepolia.era.zksync.dev` | RPC zkSync Era Sepolia |
| `CONTRACT_ADDRESS` | `0x...` | Adresse du contrat déployé |

**4. Redéployer après configuration**
```bash
vercel --prod
```

### ⚠️ Netlify (Non recommandé)

**Netlify ne supporte pas les API Routes Next.js** directement. Vos routes blockchain (`/api/blockchain/*`) ne fonctionneront pas sans configuration supplémentaire complexe.

Pour Netlify, il faudrait :
- Convertir les API routes en Netlify Functions
- Refactoring important du code
- Configuration manuelle complexe

**→ Utilisez Vercel à la place**

## 📋 Workflow Complet de Déploiement

### 🎯 Résumé : De Local à Production

#### 1️⃣ **Développement Local**
```bash
# Démarrer Hardhat local
cd backend
npx hardhat node

# Dans un autre terminal - déployer le contrat
npx hardhat run scripts/deploy.js --network localhost

# Démarrer le frontend
cd ..
npm run dev
```

Variables locales :
- `RPC_URL=http://127.0.0.1:8545`
- `CONTRACT_ADDRESS=0x5FbDB2315678afecb367f032d93F642f64180aa3`

#### 2️⃣ **Déploiement Testnet (zkEra Sepolia)**
```bash
# 1. Obtenir des ETH de test
# Visitez les faucets mentionnés ci-dessus

# 2. Déployer le contrat
cd backend
npx hardhat run scripts/deploy.js --network zkSyncSepolia

# 3. Noter l'adresse du contrat déployé
# Exemple : 0xABC123...
```

#### 3️⃣ **Déploiement Frontend (Vercel)**
```bash
# 1. Installer Vercel CLI
npm i -g vercel

# 2. Déployer
vercel --prod

# 3. Configurer les variables d'environnement dans Vercel Dashboard
# - COMPANY_WALLET_PRIVATE_KEY
# - RPC_URL=https://sepolia.era.zksync.dev
# - CONTRACT_ADDRESS=0x... (adresse du contrat déployé)

# 4. Redéployer
vercel --prod
```

#### 4️⃣ **Vérification**
- ✅ Frontend accessible sur `https://votre-projet.vercel.app`
- ✅ API Routes fonctionnelles
- ✅ Transactions blockchain enregistrées
- ✅ Hash de création et burn visibles
- ✅ Historique consultable

### 🔗 Liens Utiles

| Ressource | URL |
|-----------|-----|
| **zkSync Era Sepolia Explorer** | https://sepolia.era.zksync.dev |
| **zkSync Bridge** | https://portal.zksync.io/bridge |
| **Sepolia Faucet 1** | https://sepoliafaucet.com |
| **Sepolia Faucet 2** | https://faucet.sepolia.dev |
| **Vercel Dashboard** | https://vercel.com/dashboard |
| **Documentation zkSync** | https://era.zksync.io/docs |
| **Hardhat zkSync Plugin** | https://era.zksync.io/docs/tools/hardhat |

### ⚠️ Notes Importantes

**Sécurité** :
- ⚠️ **NE JAMAIS** commiter les fichiers `.env` avec des clés privées
- ⚠️ **NE JAMAIS** utiliser la clé privée de test sur le mainnet
- ✅ Utiliser des variables d'environnement sur Vercel
- ✅ Générer de nouvelles clés pour la production

**Performance** :
- ⚡ Les transactions sur zkEra Sepolia prennent ~30 secondes
- ⚡ Les confirmations blockchain peuvent varier
- ⚡ Prévoir des loaders et feedback utilisateur

**Coûts** :
- 💰 **Testnet** : Gratuit (ETH de test)
- 💰 **Vercel** : Gratuit pour les projets personnels
- 💰 **Mainnet** : Frais de gas réels (à budgétiser)
- 💰 **ExchangeRate-API** : 1500 requêtes/mois gratuites
- 💰 **Flutterwave** : 3.8% par transaction (optionnel)

## 🚧 Prochaines Étapes

### 📋 Todo pour la Production
1. **Recompiler le smart contract** avec les nouvelles fonctions marketplace
2. **Déployer sur zkEra Sepolia** avec la version complète (Coupons + Tickets)
3. **Mettre à jour l'adresse** du contrat dans `contractAddress.json`
4. **Tester les 2 workflows** :
   - Transfert d'argent → Coupon blockchain
   - Achat marketplace → Ticket blockchain avec produits
5. **Configurer Flutterwave** pour les vrais paiements
6. **Ajouter plus de produits** au marketplace
7. **Implémenter la gestion des stocks** par pays

### 🔄 Améliorations Futures
- **💳 Paiement Crypto exclusivement pour le marketplace** - Bitcoin, Ethereum, USDC
- **Intégration Mobile Money** directe (Orange Money, MTN, Wave)
- **Notifications push** pour les statuts de transaction
- **Géolocalisation** pour les pays et points relais proches
- **Dashboard admin** pour gérer produits et stocks
- **Tests automatisés** pour les transactions blockchain
- **Système de reviews** pour les produits marketplace
- **Tracking de livraison** pour les commandes
- **Programme de fidélité** avec points cumulables
- **API publique** pour partenaires et intégrations
- **Support multi-devises** étendu (FCFA réintégration)

## 🤝 Contribution

1. Fork le projet
2. Créer une branche feature (`git checkout -b feature/nouvelle-fonctionnalite`)
3. Commit les changements (`git commit -m 'Ajouter nouvelle fonctionnalité'`)
4. Push vers la branche (`git push origin feature/nouvelle-fonctionnalite`)
5. Ouvrir une Pull Request

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

## 👥 Équipe

- **Développement Frontend** - Interface utilisateur et UX
- **Développement Blockchain** - Smart contracts et intégration
- **Design** - Interface et expérience utilisateur

## 📞 Support

Pour toute question ou problème :
- Ouvrir une issue sur GitHub
- Contacter l'équipe de développement

---

<div align="center">
  <strong>🌍 DCARD Mobile - Révolutionnant les transferts d'argent internationaux</strong>
</div>