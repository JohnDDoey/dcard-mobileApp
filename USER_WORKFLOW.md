# 👤 DCARD - Workflow Utilisateur Complet

## 🎯 Vue d'ensemble

DCARD est une application de transfert d'argent avec système de cashback décentralisé sur blockchain (zkSync Era).

## 🔄 Parcours Utilisateur Complet

---

### 1️⃣ **INSCRIPTION / CONNEXION**

#### Page : `/login`

**Inscription (Register) :**
1. User clique sur "Log In / Sign Up" depuis la page d'accueil
2. Remplit le formulaire :
   - Nom complet
   - Email
   - Mot de passe
3. Clique sur "Register"
4. **Backend** :
   - Hash le mot de passe (bcrypt)
   - Crée l'utilisateur en DB
   - Génère un **userId unique**
   - Retourne un **JWT** avec le userId
5. User est automatiquement connecté
6. Redirection vers page d'accueil

**Connexion (Login) :**
1. User entre email + mot de passe
2. Backend vérifie les credentials
3. Si valide → JWT généré avec userId
4. Redirection vers page d'accueil

**Données dans le JWT :**
```json
{
  "id": "12345",        // userId (mappé au smart contract)
  "email": "user@example.com",
  "name": "John Doe"
}
```

---

### 2️⃣ **ENVOI D'ARGENT (Send Money)**

#### Page : `/send-money` (🔒 Protégée - nécessite connexion)

#### **Étape 1 : Estimate**
1. User sélectionne le pays du bénéficiaire
2. Entre le montant à envoyer (EUR)
3. Voit la conversion (EUR → XAF)
4. Clique "Continue"

**Données collectées :**
```javascript
{
  amountSent: "10000",
  amountReceived: "6559570.00",
  currencySent: "EUR",
  currencyReceived: "XAF",
  exchangeRate: "655.957"
}
```

#### **Étape 2 : Receiver Information**
1. User entre les informations du bénéficiaire :
   - Prénom
   - Nom
   - Numéro de téléphone
   - Ville
2. Le pays est pré-rempli (de l'étape 1)
3. Clique "Continue"

**Données collectées :**
```javascript
{
  firstName: "Julienn",
  lastName: "Blot",
  phoneNumber: "+2691234567",
  city: "Moroni"
}
```

#### **Étape 3 : Payment**
1. User voit le résumé de la transaction
2. Choisit une méthode de paiement :
   - Credit Card
   - PayPal
   - Google Pay
   - Bank Transfer
3. Entre les détails de paiement (si carte)
4. Clique "Continue to Review"

**🔥 CE QUI SE PASSE (CRUCIAL) :**

```javascript
// 1. VALIDATION DU PAIEMENT
const paymentResult = await processPayment(...);

// 2. SI PAIEMENT VALIDÉ ✅
if (paymentResult.success) {
  // Générer le code coupon unique
  const couponCode = generateCouponCode();
  // Ex: "DCARD-1728567890-A5X9K"
  
  // Récupérer userId depuis JWT
  const userId = parseInt(session.user.id); // Ex: 12345
  
  // Enregistrer on-chain (Backend API paie les gas fees)
  await recordCashback(
    couponCode,                      // "DCARD-..."
    session.user.name,               // "John Doe"
    session.user.email,              // "john@example.com"
    transactionData.receiverName,    // "Julienn Blot"
    userId,                          // 12345
    parseInt(transactionData.amountSent) // 10000
  );
  
  // Smart Contract enregistre :
  // - cashbacks["DCARD-..."] = { senderName, email, beneficiary, amount, ... }
  // - users[12345].couponCodes.push("DCARD-...")
  
  // Redirection vers Review avec le coupon
  onContinue(couponCode);
}
```

**Transaction Blockchain :**
- ✅ Coupon enregistré on-chain
- ✅ Mappé au userId de l'utilisateur
- ✅ Immuable et traçable
- ✅ Gas fees payés par l'entreprise DCARD

#### **Étape 4 : Review**
1. User voit le message de succès ✅
2. Voit le résumé de la transaction
3. Voit le **code coupon** (déjà enregistré on-chain)
4. Peut copier le code pour le partager au bénéficiaire
5. Peut télécharger le reçu
6. Peut démarrer un nouveau transfert

**Données affichées :**
- Nom du bénéficiaire
- Téléphone du bénéficiaire
- Montant reçu
- Méthode de paiement
- **Code coupon** (à partager)

---

### 3️⃣ **HISTORIQUE DES TRANSACTIONS**

#### Page : `/history` (🔒 Protégée - nécessite connexion)

**Au chargement de la page :**

```javascript
// 1. Récupérer userId depuis JWT
const userId = parseInt(session.user.id); // Ex: 12345

// 2. Charger les codes de coupons de l'utilisateur (lecture blockchain, GRATUIT)
const { coupons: userCoupons } = await getCouponsByUser(userId);
// Retourne : ["DCARD-123...", "DCARD-456...", "DCARD-789..."]

// 3. Charger tous les détails des coupons (lecture blockchain, GRATUIT)
const { coupons } = await getAllCoupons();
// Retourne : [
//   { code, amount, createdAt, used, senderName, beneficiary },
//   ...
// ]

// 4. Filtrer pour ne garder que les coupons de cet utilisateur
const userTransactions = coupons.filter(c => userCoupons.includes(c.code));

// 5. Afficher les cartes de transactions
setTransactions(userTransactions);
```

**Informations affichées pour chaque transaction :**
- ✅ Nom du bénéficiaire (depuis blockchain)
- ✅ Pays du bénéficiaire
- ✅ Statut (Available / Completed)
- ✅ Montant envoyé (EUR)
- ✅ Montant reçu (XAF)
- ✅ Date et heure
- ✅ Transaction ID
- ✅ **Code coupon** (avec bouton copier)
- ✅ Hash de la transaction blockchain

**Synchronisation automatique :**
- La page charge automatiquement les données depuis la blockchain
- Le statut du coupon est mis à jour en temps réel (Available ↔ Completed)

---

### 4️⃣ **UTILISATION DU CASHBACK (Bénéficiaire)**

#### Scénario : Le bénéficiaire vient réclamer son cashback

**Étape 1 - Vérification :**
```javascript
// User entre le code coupon
const code = "DCARD-1728567890-A5X9K";

// Vérifier la validité (lecture blockchain, GRATUIT)
const { isValid, senderName, beneficiary, amount } = await isValidCashbackCode(code);

if (isValid) {
  console.log(`✅ Cashback valide !`);
  console.log(`Expéditeur : ${senderName}`);
  console.log(`Bénéficiaire : ${beneficiary}`);
  console.log(`Montant : ${amount}`);
}
```

**Étape 2 - Remise du cash physique :**
- L'agent DCARD vérifie l'identité du bénéficiaire
- Remet l'argent en cash
- Marque le coupon comme utilisé

**Étape 3 - Burn du coupon :**
```javascript
// Marquer le coupon comme utilisé (Backend API paie les gas)
await consumeCashback(code);

// Smart Contract :
// - cashbacks[code].used = true
// - Émet événement CashbackUsed
```

**État final :**
- ✅ Coupon marqué "Completed" dans l'historique
- ✅ Ne peut plus être réutilisé
- ✅ Traçabilité complète on-chain

---

## 🔐 Sécurité et Traçabilité

### Avantages de la blockchain :

1. **Immuabilité** :
   - Impossible de modifier un coupon après création
   - Historique permanent et vérifiable

2. **Traçabilité** :
   - Chaque transaction est traçable
   - Événements émis pour chaque action

3. **Anti-fraude** :
   - Un coupon ne peut être utilisé qu'une seule fois
   - Vérification en temps réel de la validité

4. **Transparence** :
   - Toutes les transactions sont publiques sur l'explorer
   - Audit possible à tout moment

### Protection des données :

- ✅ JWT sécurisé (HttpOnly cookies)
- ✅ Mots de passe hashés (bcrypt)
- ✅ Routes protégées (middleware NextAuth)
- ✅ Gas fees payés par l'entreprise (pas de wallet utilisateur)

---

## 📊 Architecture technique

```
┌─────────────────────────────────────────────────────────────┐
│                     FRONTEND (Next.js)                      │
│  • Pages : Home, Login, Send Money, History                │
│  • Auth : NextAuth (JWT avec userId)                        │
│  • Lecture blockchain : cashbackService (GRATUIT)           │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                  API BACKEND (Next.js API)                  │
│  • /api/auth/register - Inscription                         │
│  • /api/auth/[...nextauth] - Connexion                      │
│  • /api/blockchain/record-cashback - Enregistrer coupon     │
│  • /api/blockchain/consume-cashback - Burn coupon           │
│  → Wallet entreprise paie tous les gas fees                 │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│          SMART CONTRACT (zkSync Era Sepolia)                │
│  • CashbackRegistryTest.sol                                 │
│  • Mappings : userId → couponCodes                          │
│  • Mappings : couponCode → cashback details                 │
│  • Events : CashbackRecorded, CashbackUsed                  │
└─────────────────────────────────────────────────────────────┘
```

---

## 🎉 Résumé du Flow

1. **User s'inscrit** → userId créé, stocké dans JWT ✅
2. **User envoie de l'argent** → Formulaire multi-étapes ✅
3. **Paiement validé** → Coupon généré + enregistré on-chain ✅
4. **Coupon affiché** → User peut le partager au bénéficiaire ✅
5. **Bénéficiaire réclame** → Vérification + remise cash + burn ✅
6. **Historique** → User voit toutes ses transactions depuis blockchain ✅

**Tout est tracé, sécurisé, et décentralisé !** 🔐🌍✨



