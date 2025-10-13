# 🚀 DCARD Cashback Smart Contract

## 📋 Vue d'ensemble

Système de cashback décentralisé pour DCARD utilisant Ethereum/Polygon.

## 🔄 Workflow

### 1️⃣ **Enregistrement du Cashback**
Après validation du paiement :
```javascript
// Générer un code unique
const code = generateCouponCode(); // Ex: DCARD-1759416050786-E5A36

// Enregistrer on-chain
await recordCashback(
  signer,
  code,
  "John Doe",              // Nom de l'expéditeur
  "john@email.com",        // Email de l'expéditeur
  "Jane Smith",            // Bénéficiaire
  12345,                   // userId
  10000                    // Montant (en centimes ou unité de base)
);
```

### 2️⃣ **Vérification du Coupon**
Le bénéficiaire vérifie son coupon :
```javascript
const { isValid, senderName, beneficiary, amount } = await isValidCashbackCode(provider, code);

if (isValid) {
  console.log(`Cashback de ${amount} disponible pour ${beneficiary}`);
}
```

### 3️⃣ **Utilisation (Burn) du Coupon**
Quand le cashback est encaissé en cash :
```javascript
await consumeCashback(signer, code);
// Le coupon est marqué comme "used" (burn)
// L'argent est donné en cash physique
```

### 4️⃣ **Historique**
Récupérer tous les coupons pour la page History :
```javascript
const { coupons } = await getAllCoupons(provider);
// Retourne tous les coupons avec leur statut
```

## 🛠️ Commandes

### Compilation
```bash
npx hardhat compile
```

### Déploiement (réseau local)
```bash
# Terminal 1 - Lancer le réseau local
npx hardhat node

# Terminal 2 - Déployer le contrat
npx hardhat run scripts/deploy.js --network localhost
```

### Déploiement (Polygon Mumbai testnet)
```bash
npx hardhat run scripts/deploy.js --network mumbai
```

### Tests
```bash
npx hardhat test
```

## 📦 Fonctions du Smart Contract

### `recordCashbackWithCode()`
Enregistre un nouveau cashback avec code unique
- **Paramètres** : code, senderName, senderEmail, beneficiary, userId, amount
- **Événement** : `CashbackRecorded`

### `getCashbackByCode()`
Récupère les détails complets d'un cashback
- **Retour** : senderName, senderEmail, beneficiary, amount, createdAt, used

### `isValidCashbackCode()`
Vérifie si un code est valide (non utilisé)
- **Retour** : isValid, senderName, beneficiary, amount

### `consumeCashbackCode()`
Marque un code comme utilisé (burn)
- **Événement** : `CashbackUsed`

### `getCouponsByUser()`
Récupère tous les coupons d'un utilisateur spécifique
- **Paramètre** : userId
- **Retour** : Array de codes

### `getAllCoupons()`
Récupère tous les coupons du système (pour l'historique)
- **Retour** : codes[], amounts[], createdAts[], usedFlags[]

## 🔐 Sécurité

- ✅ Un code ne peut être enregistré qu'une seule fois
- ✅ Un code ne peut être utilisé qu'une seule fois
- ✅ Tous les événements sont tracés on-chain
- ✅ Données immuables après enregistrement

## 🌐 Configuration Réseau

### Hardhat Local
- ChainId: 1337
- RPC: http://127.0.0.1:8545

### Polygon Mumbai (Testnet)
- ChainId: 80001
- RPC: https://rpc-mumbai.maticvigil.com

## 📝 Notes

- Le contrat ne gère PAS de tokens/transferts
- Le cashback est donné en cash physique
- Le coupon sert uniquement de preuve de traçabilité
- Une fois "burn", le coupon ne peut plus être réutilisé


