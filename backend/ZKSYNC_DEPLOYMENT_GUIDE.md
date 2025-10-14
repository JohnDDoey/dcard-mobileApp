# Guide de Déploiement ZkSync Era Sepolia

## 🚀 Configuration ZkSync Era Sepolia Testnet

Votre projet est maintenant configuré pour utiliser **ZkSync Era Sepolia**, la blockchain de test officielle de ZkSync. Cette configuration vous permet de tester votre application dans des conditions réelles avant le déploiement sur le mainnet.

## 📋 Prérequis

### 1. Wallet et ETH de Test
- **MetaMask** ou wallet compatible
- **ETH Sepolia** (L1) : https://sepoliafaucet.com/
- **ETH ZkSync Era Sepolia** (L2) : https://portal.zksync.io/faucets/sepolia

### 2. Variables d'Environnement
```bash
# Copier le fichier d'exemple
cp .env.example .env

# Éditer le fichier .env
DEPLOYER_PRIVATE_KEY=0x1234567890abcdef...
ZKSYNC_ETHERSCAN_API_KEY=your_api_key_here
```

## 🔧 Configuration Technique

### Réseaux Configurés
- **ZkSync Era Sepolia** (Chain ID: 300)
- **ZkSync Era Mainnet** (Chain ID: 324) - pour plus tard
- **Hardhat Local** (Chain ID: 1337)

### Optimisations ZkSync
- **Compilateur ZkSync** : v1.3.16
- **Optimisation** : Mode "z" pour ZkSync
- **Gas** : Limite élevée (25M) pour les opérations complexes

## 🚀 Commandes de Déploiement

### Compilation
```bash
npm run compile
```

### Déploiement sur ZkSync Era Sepolia
```bash
npm run deploy:testnet
```

### Déploiement sur ZkSync Era Mainnet (production)
```bash
npm run deploy:mainnet
```

### Déploiement Local
```bash
npm run deploy:local
```

## 🔍 Vérification des Contrats

### Explorer ZkSync Era Sepolia
- **URL** : https://explorer.sepolia.era.zksync.dev/
- **Vérification automatique** configurée dans hardhat.config.js

### Commandes de Vérification
```bash
# Vérifier sur ZkSync Era Sepolia
npx hardhat verify --network zkSyncSepolia <CONTRACT_ADDRESS>

# Vérifier sur ZkSync Era Mainnet
npx hardhat verify --network zkSyncMainnet <CONTRACT_ADDRESS>
```

## 💰 Coûts de Déploiement

### ZkSync Era Sepolia (Testnet)
- **Déploiement** : Gratuit (ETH de test)
- **Transactions** : Gratuit (ETH de test)
- **Verification** : Gratuit

### ZkSync Era Mainnet (Production)
- **Déploiement** : ~0.01-0.05 ETH
- **Transactions** : Très bon marché (frais ZkSync)
- **Verification** : Gratuit

## 🛠️ Développement

### Structure des Fichiers
```
backend/
├── contracts/          # Contrats Solidity
├── scripts/           # Scripts de déploiement
├── artifacts/         # Artifacts standard
├── artifacts-zk/      # Artifacts ZkSync spécifiques
├── cache/             # Cache de compilation
└── hardhat.config.js  # Configuration Hardhat + ZkSync
```

### Compilation ZkSync
- **Artifacts spéciaux** : Générés dans `artifacts-zk/`
- **ABI optimisé** : Pour l'interaction avec ZkSync
- **Bytecode ZkSync** : Compatible avec la VM ZkSync

## 🔗 Intégration Frontend

### Configuration du Service
```typescript
// src/contracts/cashbackService.ts
const ZKSYNC_SEPOLIA_RPC = "https://sepolia.era.zksync.dev";
const CONTRACT_ADDRESS = "0x..."; // Adresse déployée
```

### Métadonnées du Réseau
```json
{
  "chainId": 300,
  "name": "ZkSync Era Sepolia",
  "rpcUrl": "https://sepolia.era.zksync.dev",
  "blockExplorer": "https://explorer.sepolia.era.zksync.dev"
}
```

## 🚨 Points Importants

### Sécurité
- **NE JAMAIS** commiter le fichier `.env`
- **Toujours** utiliser des clés de test pour Sepolia
- **Vérifier** les adresses avant le déploiement mainnet

### Performance
- **ZkSync** est plus rapide que Ethereum L1
- **Frais** beaucoup plus bas
- **Finalité** en quelques secondes

### Compatibilité
- **Contrats** compatibles avec Solidity 0.8.20+
- **Librairies** standard supportées
- **Opcodes** Ethereum compatibles

## 📞 Support

### Ressources Officielles
- **Documentation** : https://era.zksync.io/docs/
- **Discord** : https://discord.gg/zksync
- **GitHub** : https://github.com/matter-labs/zksync

### Communauté
- **Forum** : https://forum.zksync.io/
- **Twitter** : @zksync

## 🎯 Prochaines Étapes

1. **Configurer** votre wallet avec ZkSync Era Sepolia
2. **Obtenir** des ETH de test
3. **Déployer** votre contrat sur Sepolia
4. **Tester** toutes les fonctionnalités
5. **Déployer** sur mainnet quand prêt

---

**Votre projet est maintenant prêt pour ZkSync Era Sepolia ! 🎉**
