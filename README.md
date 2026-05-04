# DCARD App

Application web/mobile Next.js pour :
- le transfert d'argent avec coupons cashback,
- l'achat marketplace avec tickets,
- la traçabilité des opérations via smart contract.

Le produit est pensé pour une UX grand public : l'utilisateur final paie en CB et n'a pas besoin de wallet.

## Objectifs du projet

- Offrir deux parcours métier dans la même application :
  - **Coupon cashback** (transfert d'argent),
  - **Ticket marketplace** (achat de matériaux/produits).
- Fournir des écrans de vérification/encaissement :
  - `verify` pour les coupons,
  - `verifyTicket` pour les tickets.
- Conserver une preuve on-chain, mais masquer toute complexité blockchain à l'utilisateur final.

## Stack technique

- Frontend : Next.js 15 (App Router), React 19, TypeScript, Tailwind CSS.
- Animations/UI : Framer Motion, Three.js.
- Blockchain : Solidity + Hardhat + Ethers v6.
- Paiement : Flutterwave (intégration API).
- Déploiement applicatif recommandé : Vercel.

## Architecture fonctionnelle

### 1) Côté utilisateur (front)

- Authentification + navigation.
- Parcours `send-money` et `marketplace` / `buy-material`.
- Historique `history` avec onglets :
  - coupons (accordéons),
  - tickets (accordéons).
- Vérification/encaissement :
  - `/verify` (coupon),
  - `/verifyTicket` (ticket).

### 2) Côté backend (API Routes Next)

Routes principales :

- **Coupons**
  - `POST /api/blockchain/record-cashback`
  - `GET /api/blockchain/get-user-coupons`
  - `POST /api/blockchain/verify-coupon`
  - `POST /api/blockchain/burn-coupon`

- **Tickets marketplace**
  - `POST /api/blockchain/record-marketplace-purchase`
  - `GET /api/blockchain/get-market-tickets-by-user`
  - `POST /api/blockchain/verify-ticket`
  - `POST /api/blockchain/burn-ticket`

Ces routes appellent le contrat via Ethers.

### 3) Côté blockchain

Contrat principal : `backend/contracts/CashbackRegistry.sol` (`CashbackRegistryTest`).

Structures importantes :
- `Cashback`
- `MarketplacePurchase`
- `Product`

Fonctions importantes :
- enregistrement : `recordCashbackWithCode`, `recordMarketplacePurchase`
- lecture : `getCouponsByUserId`, `getMarketTicketsByUserId`
- vérification : `verifyCoupon`, `verifyTicket`
- encaissement (burn) : `burnCoupon`, `burnTicket`

## Wallet strategy recommandée

Pour une UX sans wallet utilisateur :

- **Wallet relayer/entreprise** (serveur) : signe les transactions d'écriture (`record*`, `burn*`) et paie le gas.
- **Utilisateur final** : aucun wallet, aucun “connect wallet”, paiement CB uniquement.

Bonnes pratiques :
- clé privée uniquement côté serveur,
- endpoints protégés,
- monitoring du solde gas du wallet relayer.

## État des flux métier

### Flux coupon (transfert)

1. paiement confirmé,
2. enregistrement coupon on-chain,
3. affichage et historique,
4. vérification via `/verify`,
5. burn via `/verify`.

### Flux ticket (marketplace)

1. paiement confirmé,
2. enregistrement ticket on-chain,
3. affichage dans `history`,
4. vérification via `/verifyTicket`,
5. burn via `/verifyTicket`.

## Limitation fonctionnelle actuelle (importante)

Aujourd'hui, l'historique tickets expose surtout `productCount` côté lecture standard.
La “nature détaillée” des produits n'est pas encore renvoyée dans les endpoints de lecture tickets.

Piste d'évolution recommandée :
- stocker/résoudre des `productId` (et snapshots de prix/quantité) pour garder une logique de catalogue évolutive sans dépendre du nom produit.

## Structure du repo

```text
.
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── blockchain/
│   │   │   ├── exchange-rates/
│   │   │   └── payments/
│   │   ├── send-money/
│   │   ├── marketplace/
│   │   ├── buy-material/
│   │   ├── history/
│   │   ├── verify/
│   │   └── verifyTicket/
│   ├── components/
│   ├── contexts/
│   └── contracts/
│       ├── cashbackService.ts
│       └── contractAddress.json
└── backend/
    ├── contracts/
    │   └── CashbackRegistry.sol
    ├── scripts/
    │   ├── deploy.js
    │   └── getBalance.js
    └── hardhat.config.js
```

## Installation locale

### Prérequis

- Node.js 18+
- npm

### 1) Installer les dépendances

Racine :

```bash
npm install
```

Backend :

```bash
cd backend
npm install
```

### 2) Démarrer en local (Hardhat + Next)

Terminal 1 :

```bash
cd backend
npm run node
```

Terminal 2 :

```bash
cd backend
npm run deploy:local
```

Terminal 3 :

```bash
npm run dev
```

L'application est ensuite accessible sur `http://localhost:3000`.

## Variables d'environnement

Créer un fichier `.env.local` à la racine :

```env
# Blockchain
RPC_URL=http://127.0.0.1:8545
NEXT_PUBLIC_RPC_URL=http://127.0.0.1:8545
COMPANY_WALLET_PRIVATE_KEY=<cle_privee_wallet_relayer>

# Flutterwave (si utilisé)
NEXT_PUBLIC_FLUTTERWAVE_PUBLIC_KEY=
FLUTTERWAVE_SECRET_KEY=
FLUTTERWAVE_ENCRYPTION_KEY=

# Exchange rates (si utilisé)
EXCHANGE_RATE_API_KEY=
```

Notes importantes :
- l'adresse du contrat utilisée par le front/API est lue depuis `src/contracts/contractAddress.json`,
- `backend/scripts/deploy.js` met automatiquement ce fichier à jour après déploiement local.

## Scripts utiles

### Racine

```bash
npm run dev
npm run build
npm run start
npm run lint
```

### Backend

```bash
cd backend
npm run compile
npm run test
npm run node
npm run deploy:local
npm run deploy:testnet
npm run deploy:mainnet
npm run balance
```

## Déploiement smart contract (testnet)

### Point d'attention avant toute chose

Le repo contient des scripts `deploy:testnet` / `deploy:mainnet`, mais `backend/hardhat.config.js` ne définit actuellement que `hardhat` et `localhost`.

Donc, avant un vrai déploiement testnet :
- ajouter la configuration réseau cible dans `hardhat.config.js` (ex: zkSync Sepolia),
- vérifier que le script `backend/scripts/deploy.js` est compatible réseau cible.

### Processus recommandé

1. Configurer le réseau testnet dans Hardhat.
2. Injecter la clé de déploiement et le RPC en variables d'env backend.
3. Lancer `npm run compile`.
4. Lancer `npm run deploy:testnet`.
5. Vérifier la mise à jour de `src/contracts/contractAddress.json`.
6. Tester les endpoints `verify` + `burn` pour coupons et tickets.

## Déploiement application (Vercel)

### Pourquoi Vercel

- Support natif Next.js App Router + API Routes.
- Déploiement simple et adapté à cette architecture.

### Étapes

1. Connecter le repo à Vercel.
2. Renseigner les variables d'environnement (mêmes clés que `.env.local`, avec les valeurs testnet/prod).
3. Vérifier `contractAddress.json` avec l'adresse du contrat du réseau cible.
4. Lancer le déploiement.
5. Exécuter un test bout-en-bout :
   - achat coupon -> verify -> burn,
   - achat marketplace -> verifyTicket -> burn.

## Checklist de démo publique (sans wallet utilisateur)

Avant la démo :
- contrat déployé sur le bon réseau,
- wallet relayer approvisionné en gas,
- variables Vercel correctes,
- paiement provider en mode test prêt,
- au moins un scénario coupon et un scénario ticket testés en réel.

Pendant la démo :
- ne pas afficher d'adresse wallet/tx hash au public si objectif full Web2,
- afficher des IDs métier (ticket/coupon) côté UI,
- garder une page admin/support interne pour diagnostic blockchain.

## Sécurité

- Ne jamais committer de clé privée.
- Utiliser des variables d'environnement (local + Vercel).
- Séparer wallet déployeur et wallet relayer si possible.
- Protéger les routes sensibles de burn/enregistrement.

## Roadmap suggérée

- Ajouter une lecture détaillée des produits ticket (au-delà du `productCount`).
- Ajouter un id produit stable pour découpler catalogue et blockchain.
- Renforcer l'observabilité (logs métier + monitoring relayer + retries).
- Ajouter tests d'intégration API blockchain.

## Licence

MIT (à adapter selon votre politique si nécessaire).