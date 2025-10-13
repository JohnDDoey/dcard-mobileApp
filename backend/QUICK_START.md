# ⚡ Quick Start - DCARD Backend

## 🚀 Commandes rapides

### 📦 Compiler le contrat
```bash
npm run compile
```

### 🧪 Tester localement

```bash
# Terminal 1 - Lancer le nœud local
npm run node

# Terminal 2 - Déployer
npm run deploy:local
```

### 🌐 Déployer sur zkSync Sepolia Testnet

1. **Obtenir des ETH Sepolia** : https://sepoliafaucet.com/
2. **Bridge vers zkSync** : https://bridge.zksync.io/
3. **Créer `.env`** avec votre clé privée :
   ```
   DEPLOYER_PRIVATE_KEY=0xvotre_cle_privee
   ```
4. **Vérifier le solde** :
   ```bash
   npm run balance -- --network zkSyncSepolia
   ```
5. **Déployer** :
   ```bash
   npm run deploy:testnet
   ```

### 📊 Vérifier le solde
```bash
# Local
npm run balance

# Testnet
npm run balance -- --network zkSyncSepolia
```

### 🧹 Nettoyer
```bash
npm run clean
```

## 🔗 Liens utiles

- **zkSync Sepolia Explorer** : https://sepolia.explorer.zksync.io/
- **Bridge zkSync** : https://bridge.zksync.io/
- **Faucet Sepolia** : https://sepoliafaucet.com/
- **Documentation zkSync** : https://docs.zksync.io/

## ⚡ Avantages zkSync

- ✅ **Gas fees ~100x moins chers** que Ethereum
- ✅ **Transactions rapides** (quelques secondes)
- ✅ **Compatible EVM** (même code Solidity)
- ✅ **Sécurisé** par Ethereum (L1)



