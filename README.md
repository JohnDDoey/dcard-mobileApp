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

**DCARD Mobile** est une application web mobile moderne pour les transferts d'argent internationaux avec système de cashback basé sur la blockchain. L'application offre une expérience utilisateur fluide avec des animations élégantes et une interface multilingue.

## ✨ Fonctionnalités Principales

### 🔐 Authentification
- **Système de connexion** sécurisé avec validation
- **Gestion de session** persistante avec localStorage
- **Interface de login** avec boutons sociaux (Google, Facebook)
- **Protection des routes** avec composant ProtectedRoute

### 💰 Transfert d'Argent
- **Workflow en 4 étapes** : Estimation → Destinataire → Paiement → Vérification
- **Calcul automatique** des taux de change avec frais détaillés
- **Sélection du pays** avec interface interactive
- **Informations du destinataire** complètes avec validation
- **Méthodes de paiement** multiples (Carte bancaire, Google Pay, Virement)
- **Scroll automatique** lors des transitions
- **Validation des formulaires** avec boutons conditionnels

### 🎁 Système de Cashback
- **Génération automatique** de codes coupon
- **Enregistrement blockchain** avec Ethers.js
- **Historique des transactions** avec panneau accordéon
- **Codes coupon** uniques par transaction
- **Hash de burn** pour les transactions complétées
- **Reçu PDF** téléchargeable

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
│   │   ├── history/           # Page historique
│   │   ├── login/             # Page de connexion
│   │   ├── send-money/        # Page transfert d'argent
│   │   └── verify/            # Page vérification
│   ├── components/            # Composants React
│   │   ├── StaggeredMenu.tsx  # Menu principal
│   │   ├── MainLayout.tsx     # Layout global avec menu
│   │   ├── TransactionAccordion.tsx # Panneau accordéon historique
│   │   ├── EstimateStep.tsx   # Étape d'estimation
│   │   ├── ReceiverInformation.tsx # Informations destinataire
│   │   ├── PaymentStep.tsx    # Étape de paiement
│   │   ├── ReviewStep.tsx     # Étape de vérification
│   │   ├── LoadingPage.tsx    # Page de chargement
│   │   └── ...
│   ├── contexts/              # Contextes React
│   │   ├── AuthContext.tsx    # Gestion auth
│   │   └── LanguageContext.tsx # Gestion langues
│   ├── contracts/             # Smart contracts
│   ├── hooks/                 # Hooks personnalisés
│   ├── locales/               # Fichiers de traduction
│   ├── types/                 # Types TypeScript
│   └── utils/                 # Utilitaires
├── backend/                   # Projet blockchain Hardhat
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

## 💳 Workflow de Transfert

### 1. Estimation
- Sélection du pays de destination
- Calcul automatique du taux de change
- **Nouveaux frais détaillés** : Service Fee (2.5%), Blockchain Fee, Infrastructure Fee
- Estimation du total avec tous les frais

### 2. Destinataire
- **Informations personnelles** avec validation des champs requis
- Numéro de téléphone et adresse
- **Bouton continu** désactivé jusqu'à validation complète
- **Interface compacte** optimisée pour mobile

### 3. Paiement
- Sélection de la méthode de paiement
- **Validation conditionnelle** avec bouton grisé
- Formulaire de carte bancaire sécurisé
- **Scroll automatique** vers le loader

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
- **CashbackRegistry** - Gestion des cashbacks
- **Enregistrement** des transactions
- **Génération** des codes coupon

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
COMPANY_WALLET_PRIVATE_KEY=ac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80
RPC_URL=https://sepolia.era.zksync.dev
CONTRACT_ADDRESS=0x... # Adresse du contrat déployé
```

**Dashboard Vercel (production)**
- Ajoutez les mêmes variables dans Settings > Environment Variables
- Redéployez l'application

### API Endpoints
```
POST /api/blockchain/record-cashback  # Enregistrer un cashback
GET  /api/blockchain/get-all-coupons  # Récupérer tous les coupons
POST /api/blockchain/consume-cashback # Consommer un coupon
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

### 📱 Interface Améliorée
- **Panneau accordéon** pour l'historique des transactions
- **Layout global** avec menu intégré sur toutes les pages
- **Interface compacte** optimisée pour mobile
- **Scroll automatique** lors des transitions

### 💰 Frais Détaillés
- **Service Fee** (2.5%) sur chaque transaction
- **Blockchain Fee** fixe (0.50 EUR)
- **Infrastructure Fee** fixe (1.00 EUR)
- **Calcul automatique** du total avec tous les frais

### 🔍 Traçabilité Blockchain
- **Hash de création** pour chaque transaction
- **Hash de burn** pour les transactions complétées
- **Codes coupon** avec boutons de copie
- **Reçu PDF** téléchargeable

### 🌍 Traductions Complètes
- **Toutes les interfaces** traduites en 3 langues
- **Notifications** traduites (copie, téléchargement)
- **Messages d'erreur** localisés
- **Changement de langue** en temps réel

### ✅ Validation Améliorée
- **Champs requis** avec validation visuelle
- **Boutons conditionnels** (grisés si formulaire incomplet)
- **Messages d'erreur** contextuels
- **UX fluide** avec feedback immédiat

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