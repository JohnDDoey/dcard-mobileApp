# 🔗 Intégration Blockchain DCARD

## 📦 Installation des dépendances

```bash
npm install ethers
```

## 🎯 État actuel de l'intégration

### ✅ Prêt
1. **Smart Contract** : `CashbackRegistry.sol` compilé
2. **Service Frontend** : `cashbackService.ts` avec toutes les fonctions
3. **Génération de code** : `generateCouponCode()` intégré dans `ReviewStep`
4. **Page History** : Structure prête pour charger les coupons

### 🚧 À compléter

1. **Déployer le contrat** sur Hardhat local ou testnet
2. **Activer Web3Provider** dans le layout principal
3. **Connecter le wallet** MetaMask
4. **Enregistrer les coupons** on-chain après paiement
5. **Charger l'historique** depuis la blockchain

## 🚀 Workflow d'intégration

### 1️⃣ Déployer le contrat

```bash
cd backend

# Terminal 1 - Lancer le réseau local
npx hardhat node

# Terminal 2 - Déployer
npx hardhat run scripts/deploy.js --network localhost
```

Cela va créer `src/contracts/contractAddress.json` automatiquement.

### 2️⃣ Activer le Web3Provider

Dans `src/app/layout.tsx` :

```tsx
import { Web3Provider } from '@/contexts/Web3Context';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Web3Provider>
          {children}
        </Web3Provider>
      </body>
    </html>
  );
}
```

### 3️⃣ Enregistrer les coupons après paiement

Dans `ReviewStep.tsx`, décommenter et compléter :

```tsx
import { useWeb3 } from '@/contexts/Web3Context';
import { recordCashback } from '@/contracts/cashbackService';

const ReviewStep = ({ transactionData }) => {
  const { signer, isConnected } = useWeb3();
  
  useEffect(() => {
    const saveCouponOnChain = async () => {
      if (!couponCode || !signer || !isConnected) return;
      
      const result = await recordCashback(
        signer,
        couponCode,
        "Sender Name",                    // À récupérer des données utilisateur
        "sender@email.com",               // À récupérer des données utilisateur
        transactionData.receiverName,
        12345,                            // userId - À récupérer de l'auth
        parseInt(transactionData.amountSent)
      );
      
      if (result.success) {
        console.log('✅ Coupon enregistré on-chain!');
      }
    };
    
    saveCouponOnChain();
  }, [couponCode, signer, isConnected]);
};
```

### 4️⃣ Charger l'historique depuis la blockchain

Dans `history/page.tsx`, décommenter et compléter :

```tsx
import { useWeb3 } from '@/contexts/Web3Context';

const HistoryPage = () => {
  const { provider, isConnected } = useWeb3();
  
  useEffect(() => {
    if (provider && isConnected) {
      loadCouponsFromBlockchain();
    }
  }, [provider, isConnected]);
  
  const loadCouponsFromBlockchain = async () => {
    if (!provider) return;
    
    const { coupons } = await getAllCoupons(provider);
    
    // Mettre à jour les transactions avec les données blockchain
    setTransactions(prevTxs => {
      return prevTxs.map(tx => {
        const blockchainCoupon = coupons.find(c => c.code === tx.coupon);
        if (blockchainCoupon) {
          return { 
            ...tx, 
            status: blockchainCoupon.used ? 'Completed' : 'Available' 
          };
        }
        return tx;
      });
    });
  };
};
```

## 🔑 Bouton de connexion wallet

Créer un composant `ConnectWallet.tsx` :

```tsx
import { useWeb3 } from '@/contexts/Web3Context';

export default function ConnectWallet() {
  const { account, isConnected, connectWallet, disconnectWallet } = useWeb3();
  
  if (isConnected) {
    return (
      <button onClick={disconnectWallet}>
        {account?.substring(0, 6)}...{account?.substring(account.length - 4)}
      </button>
    );
  }
  
  return (
    <button onClick={connectWallet}>
      Connect Wallet
    </button>
  );
}
```

## 📝 Variables d'environnement (optionnel pour testnet)

Créer `.env.local` :

```env
NEXT_PUBLIC_NETWORK=localhost
NEXT_PUBLIC_RPC_URL=http://127.0.0.1:8545
```

## 🧪 Tester l'intégration

1. ✅ Démarrer Hardhat node
2. ✅ Déployer le contrat
3. ✅ Lancer l'app Next.js
4. ✅ Connecter MetaMask au réseau local (chainId: 1337)
5. ✅ Faire une transaction et vérifier que le coupon est enregistré
6. ✅ Aller sur History et vérifier que les coupons sont chargés

## 🚨 Points importants

- ⚠️ MetaMask doit être installé
- ⚠️ Le réseau doit correspondre (localhost:1337 ou Mumbai:80001)
- ⚠️ L'utilisateur doit avoir des ETH (ou MATIC sur testnet) pour les gas fees
- ⚠️ Pour le testnet, il faut des faucets (Mumbai: https://faucet.polygon.technology/)

## 🔄 Prochaines étapes

1. [ ] Déployer le contrat
2. [ ] Activer Web3Provider
3. [ ] Ajouter le bouton "Connect Wallet"
4. [ ] Tester l'enregistrement de coupons
5. [ ] Tester la page History
6. [ ] Déployer sur un testnet (Polygon Mumbai)
7. [ ] Passer en production (Polygon Mainnet)


