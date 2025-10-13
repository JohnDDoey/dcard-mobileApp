# 🚀 Guide de Déploiement - DCARD Cashback Smart Contract

## 📋 Prérequis

1. **Wallet avec des fonds** :
   - Pour zkSync Sepolia Testnet : Besoin de ETH Sepolia
   - Obtenir des ETH Sepolia : https://sepoliafaucet.com/
   - Bridge vers zkSync Sepolia : https://bridge.zksync.io/

2. **Clé privée** de votre wallet :
   - ⚠️ NE JAMAIS partager cette clé !
   - Format : `0x...` (64 caractères hexadécimaux)

## 🔧 Configuration

### 1. Créer le fichier `.env`

Dans le dossier `backend/`, créer un fichier `.env` :

```bash
# Clé privée du wallet qui va déployer et payer les gas fees
DEPLOYER_PRIVATE_KEY=0xvotre_cle_privee_ici

# Optionnel : API key pour vérifier le contrat sur l'explorer
ZKSYNC_ETHERSCAN_API_KEY=
```

### 2. Vérifier la configuration

```bash
npx hardhat compile
```

## 📡 Déploiement sur zkSync Sepolia Testnet

### Méthode 1 : Déploiement Standard

```bash
npx hardhat run scripts/deploy.js --network zkSyncSepolia
```

### Méthode 2 : Déploiement Local d'abord (recommandé pour tester)

```bash
# Terminal 1 - Lancer un nœud local
npx hardhat node

# Terminal 2 - Déployer localement
npx hardhat run scripts/deploy.js --network localhost
```

## ✅ Après le déploiement

Le script va :
1. ✅ Déployer le contrat CashbackRegistryTest
2. ✅ Afficher l'adresse du contrat
3. ✅ Sauvegarder l'adresse dans `../src/contracts/contractAddress.json`

### Exemple de sortie :

```
🚀 Déploiement du contrat CashbackRegistryTest...
✅ CashbackRegistryTest déployé à l'adresse: 0x1234567890abcdef...
📝 Adresse sauvegardée dans src/contracts/contractAddress.json
```

## 🔗 Configuration Frontend

Après le déploiement, mettre à jour `mobile-app/.env.local` :

```bash
# RPC URL pour zkSync Sepolia
NEXT_PUBLIC_RPC_URL=https://sepolia.era.zksync.dev
NEXT_PUBLIC_CONTRACT_ADDRESS=0xAdresse_Du_Contrat_Déployé

# Backend (même clé privée que DEPLOYER_PRIVATE_KEY)
COMPANY_WALLET_PRIVATE_KEY=0xvotre_cle_privee_ici
RPC_URL=https://sepolia.era.zksync.dev
CONTRACT_ADDRESS=0xAdresse_Du_Contrat_Déployé
```

## 🌐 Réseaux disponibles

### zkSync Era Sepolia Testnet (recommandé pour test)
- **ChainId**: 300
- **RPC**: https://sepolia.era.zksync.dev
- **Explorer**: https://sepolia.explorer.zksync.io/
- **Faucet ETH Sepolia**: https://sepoliafaucet.com/
- **Bridge**: https://bridge.zksync.io/

### zkSync Era Mainnet (production)
- **ChainId**: 324
- **RPC**: https://mainnet.era.zksync.io
- **Explorer**: https://explorer.zksync.io/

### Localhost (développement)
- **ChainId**: 1337
- **RPC**: http://127.0.0.1:8545

## 💰 Coûts estimés

### zkSync Sepolia (Testnet)
- **Gratuit** - ETH de test

### zkSync Era Mainnet
- Déploiement : ~0.001 ETH (~$2-3)
- Transaction `recordCashback` : ~0.0001 ETH (~$0.20-0.30)
- Transaction `consumeCashback` : ~0.0001 ETH (~$0.20-0.30)

**Avantage zkSync** : ~10-100x moins cher que Ethereum Mainnet ! 🎉

## 🔍 Vérifier le contrat

### Sur zkSync Explorer

1. Aller sur https://sepolia.explorer.zksync.io/
2. Chercher l'adresse du contrat
3. Vérifier les transactions

### Vérifier le code (optionnel)

```bash
npx hardhat verify --network zkSyncSepolia ADRESSE_DU_CONTRAT
```

## 🧪 Tester après déploiement

```bash
# Tester une fonction de lecture (gratuit)
npx hardhat console --network zkSyncSepolia

# Dans la console :
const Contract = await ethers.getContractFactory("CashbackRegistryTest");
const contract = await Contract.attach("ADRESSE_DU_CONTRAT");
const coupons = await contract.getAllCoupons();
console.log(coupons);
```

## 📝 Commandes utiles

```bash
# Compiler
npx hardhat compile

# Nettoyer le cache
npx hardhat clean

# Lister les comptes
npx hardhat accounts

# Obtenir le solde du deployer
npx hardhat run scripts/getBalance.js --network zkSyncSepolia
```

## ⚠️ Sécurité

- ✅ Toujours utiliser `.env` pour les clés privées
- ✅ Ajouter `.env` au `.gitignore`
- ✅ Ne jamais commit les clés privées
- ✅ Utiliser un wallet dédié pour le déploiement
- ✅ Tester sur testnet avant mainnet


