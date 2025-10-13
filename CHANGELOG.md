# Changelog

Tous les changements notables de ce projet seront documentés dans ce fichier.

Le format est basé sur [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
et ce projet adhère à [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2025-01-13

### 🎉 Initial Release

#### ✨ Ajouté
- **Authentification complète**
  - Système de login/signup avec NextAuth.js
  - Validation des formulaires côté client et serveur
  - Protection des routes avec ProtectedRoute
  - Gestion de session persistante

- **Système multi-langues**
  - Support FR/EN/ES
  - Contexte de langue React
  - Persistance dans localStorage
  - Sélecteur de langue dans le menu

- **Workflow d'achat de coupon**
  - Étape 1 : Estimation (pays, montant, méthodes)
  - Étape 2 : Informations destinataire
  - Étape 3 : Paiement par carte
  - Génération automatique de codes coupon
  - Enregistrement blockchain automatique

- **Intégration blockchain**
  - Smart contract CashbackRegistry (Solidity)
  - Déploiement avec Hardhat
  - Service d'interaction frontend (ethers.js)
  - Enregistrement des coupons on-chain
  - Validation des codes
  - Consumption (burn) des cashbacks

- **Page History**
  - Affichage de toutes les transactions
  - Récupération depuis la blockchain
  - Panneau avec total transactions et volume mensuel
  - Jauge de volume (max 1000€/mois)
  - Copie des codes coupon
  - Liens vers les transactions blockchain

- **Page Verify (Partenaires)**
  - Validation de codes coupon
  - Vérification blockchain en temps réel
  - Affichage des détails du coupon
  - Bouton "Cash in Cashback" pour burn
  - Interface simple et épurée

- **UI/UX Design**
  - Menu latéral animé (StaggeredMenu) avec gradient violet
  - Globe 3D interactif en homepage (draggable + auto-rotate)
  - Globe 3D persistant avec parallax scroll
  - Animations GSAP fluides
  - Design responsive (mobile/tablet/desktop)
  - Toasts personnalisés pour les notifications

- **Composants réutilisables**
  - AnimatedList : Dropdown animé
  - InteractiveGlobe : Globe draggable
  - PersistentGlobe : Globe avec parallax
  - EstimateStep, PaymentStep, ReviewStep
  - CreditCardForm avec validation
  - ReceiverInformation
  - ProtectedRoute pour la sécurité
  - Toast notifications

- **Documentation complète**
  - README.md détaillé
  - CONTRIBUTING.md (guide de contribution)
  - BLOCKCHAIN_INTEGRATION.md
  - USER_WORKFLOW.md
  - TRANSLATIONS_GUIDE.md
  - LANGUAGE_PERSISTENCE.md
  - LOGS_DOCUMENTATION.md
  - TEST_CREDENTIALS.md
  - backend/DEPLOYMENT.md
  - backend/QUICK_START.md

#### 🔧 Configuration
- Next.js 15 avec TypeScript
- Tailwind CSS pour le styling
- NextAuth.js pour l'authentification
- Three.js pour le rendu 3D
- GSAP pour les animations
- Hardhat pour la blockchain
- ESLint + Prettier pour le code quality

#### 🌍 Support de 54 pays africains
- Algérie, Angola, Bénin, Botswana, Burkina Faso, Burundi, Cameroun, Cap-Vert, RCA, Tchad, Comores, République du Congo, RDC, Côte d'Ivoire, Djibouti, Égypte, Guinée équatoriale, Érythrée, Eswatini, Éthiopie, Gabon, Gambie, Ghana, Guinée, Guinée-Bissau, Kenya, Lesotho, Liberia, Libye, Madagascar, Malawi, Mali, Mauritanie, Maurice, Maroc, Mozambique, Namibie, Niger, Nigeria, Rwanda, São Tomé-et-Principe, Sénégal, Seychelles, Sierra Leone, Somalie, Afrique du Sud, Soudan du Sud, Soudan, Tanzanie, Togo, Tunisie, Ouganda, Zambie, Zimbabwe

#### 🔐 Sécurité
- Hash des mots de passe (bcrypt)
- Variables d'environnement sécurisées
- Protection CSRF
- Validation stricte des inputs
- Smart contracts auditables

#### 📱 Responsive Design
- Mobile-first approach
- Breakpoints adaptés (mobile/tablet/desktop)
- Touch-friendly sur mobile
- Menu hamburger sur mobile
- Globe draggable tactile

---

## [Unreleased]

### 🚀 À venir
- Tests unitaires et d'intégration
- CI/CD pipeline
- Déploiement sur testnet Ethereum
- Support de plus de méthodes de paiement
- KYC/AML integration
- Notifications push
- Mode sombre
- PWA support
- Analytics dashboard
- Export PDF des reçus

### 🔮 Fonctionnalités futures
- Support de plus de devises
- Taux de change en temps réel (API)
- Système de parrainage
- Programme de fidélité
- Chat support en direct
- Intégration mobile money (M-Pesa, Orange Money)
- Support de plus de blockchains (Polygon, BSC)
- NFT receipts

---

## Types de changements

- `✨ Ajouté` : Nouvelles fonctionnalités
- `🔧 Modifié` : Changements dans les fonctionnalités existantes
- `🗑️ Supprimé` : Fonctionnalités supprimées
- `🐛 Corrigé` : Corrections de bugs
- `🔐 Sécurité` : Corrections de vulnérabilités
- `📚 Documentation` : Changements dans la documentation
- `🎨 Style` : Changements qui n'affectent pas la logique (formatage, etc.)
- `♻️ Refactor` : Refactoring de code sans changer les fonctionnalités
- `⚡ Performance` : Améliorations de performance
- `✅ Tests` : Ajout ou modification de tests

---

## Comment lire ce changelog

- **[X.Y.Z]** : Numéro de version (Semantic Versioning)
  - **X** (Major) : Changements incompatibles avec les versions précédentes
  - **Y** (Minor) : Nouvelles fonctionnalités rétrocompatibles
  - **Z** (Patch) : Corrections de bugs rétrocompatibles

- **YYYY-MM-DD** : Date de release

- **[Unreleased]** : Changements en cours de développement

---

**Note** : Ce changelog est maintenu manuellement. Chaque changement significatif devrait être documenté ici avant la release.

Pour les détails complets des commits, voir l'[historique Git](https://github.com/JohnDDoey/dcard-mobileApp/commits/main).

