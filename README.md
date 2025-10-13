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
- **Calcul automatique** des taux de change
- **Sélection du pays** avec interface interactive
- **Informations du destinataire** complètes
- **Méthodes de paiement** multiples (Carte bancaire, Google Pay, Virement)

### 🎁 Système de Cashback
- **Génération automatique** de codes coupon
- **Enregistrement blockchain** avec Ethers.js
- **Historique des transactions** avec statuts
- **Codes coupon** uniques par transaction

### 🌐 Internationalisation
- **3 langues supportées** : Anglais, Français, Espagnol
- **Changement de langue** en temps réel
- **Interface traduite** complète
- **Boutons de sélection** de langue dans le menu

### 🎨 Interface Utilisateur
- **Design mobile-first** responsive
- **Menu hamburger** avec animations Framer Motion
- **Globe 3D interactif** avec Three.js
- **Animations fluides** et transitions
- **Thème sombre** moderne
- **Composants réutilisables** modulaires

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
│   │   ├── AnimatedList.tsx   # Liste animée
│   │   ├── CreditCardForm.tsx # Formulaire carte
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
- Estimation des frais

### 2. Destinataire
- Informations personnelles du destinataire
- Numéro de téléphone et adresse
- Méthode de livraison

### 3. Paiement
- Sélection de la méthode de paiement
- Formulaire de carte bancaire sécurisé
- Validation des informations

### 4. Vérification
- Résumé de la transaction
- Génération du code coupon
- Enregistrement blockchain

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

### AnimatedList
Liste interactive avec :
- Animations d'apparition
- Navigation clavier
- Gradients de scroll
- Glassmorphism

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

### API Endpoints
```
POST /api/blockchain/record-cashback
GET  /api/blockchain/get-all-coupons
POST /api/blockchain/consume-cashback
```

## 📊 Performance

- **Lazy loading** des composants
- **Optimisation** des images
- **Code splitting** automatique
- **Animations** optimisées

## 🚀 Déploiement

### Netlify (Recommandé)
```bash
npm run build
# Déployer le dossier 'out'
```

### Vercel
```bash
npm run build
vercel deploy
```

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