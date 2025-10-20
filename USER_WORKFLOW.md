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

**2 ONGLETS DISTINCTS :**
- 📋 **Coupons** : Transferts d'argent classiques
- 🎫 **Tickets** : Achats marketplace avec produits

**Au chargement de l'onglet "Coupons" :**

```javascript
// 1. Récupérer userId depuis JWT
const userId = parseInt(session.user.id); // Ex: 12345

// 2. Charger les coupons de l'utilisateur depuis le smart contract (lecture, GRATUIT)
const { codes, amounts, createdAts, usedFlags, senderNames, beneficiaries, receiverCountries } = await getCouponsByUser(userId);
// Appelle getCouponsByUserId(userId) du smart contract

// 3. Formatter les données pour l'affichage
const userCoupons = codes.map((code, i) => ({
  code: code,
  amount: amounts[i],
  createdAt: createdAts[i],
  used: usedFlags[i],
  senderName: senderNames[i],
  beneficiary: beneficiaries[i],
  receiverCountry: receiverCountries[i]
}));

// 4. Afficher les accordéons de transactions
setCoupons(userCoupons);
```

**Au chargement de l'onglet "Tickets" :**

```javascript
// 1. Récupérer userId depuis JWT
const userId = parseInt(session.user.id); // Ex: 12345

// 2. Charger les tickets de l'utilisateur depuis le smart contract (lecture, GRATUIT)
const { codes, buyerNames, beneficiaries, totalAmounts, createdAts, usedFlags, productCounts } = await getMarketTicketsByUser(userId);
// Appelle getMarketTicketsByUserId(userId) du smart contract

// 3. Formatter les données pour l'affichage
const userTickets = codes.map((code, i) => ({
  code: code,
  buyerName: buyerNames[i],
  beneficiary: beneficiaries[i],
  totalAmount: totalAmounts[i],
  createdAt: createdAts[i],
  used: usedFlags[i],
  productCount: productCounts[i]
}));

// 4. Afficher les accordéons de tickets
setTickets(userTickets);
```

**Informations affichées pour chaque COUPON :**
- ✅ Nom du bénéficiaire (depuis blockchain)
- ✅ Pays du bénéficiaire
- ✅ Statut (Available / Completed)
- ✅ Montant envoyé (EUR) - arrondi au supérieur avec Math.ceil()
- ✅ Date et heure
- ✅ **Code coupon** (avec bouton copier)
- ✅ Boutons d'action :
  - 🔍 **Vérifier** : Vérifie la validité du coupon + nom de famille
  - 💰 **Encaisser** : Brûle le coupon (marque comme utilisé)
- ✅ Hash de création et burn

**Informations affichées pour chaque TICKET :**
- ✅ Nom de l'acheteur (depuis blockchain)
- ✅ Bénéficiaire
- ✅ Statut (Available / Completed)
- ✅ Montant total (EUR) - arrondi au supérieur avec Math.ceil()
- ✅ Nombre de produits commandés
- ✅ Date et heure
- ✅ **Code ticket** (avec bouton copier)
- ✅ Boutons d'action :
  - 🔍 **Vérifier** : Vérifie la validité du ticket
  - 📦 **Encaisser** : Brûle le ticket (marque comme utilisé)
- ✅ Hash de création et burn

**Synchronisation automatique :**
- La page charge automatiquement les données depuis la blockchain
- Le statut est mis à jour en temps réel (Available ↔ Completed)
- Bouton "Rafraîchir" pour recharger les données manuellement

---

### 4️⃣ **UTILISATION DU CASHBACK (Bénéficiaire) - COUPONS**

#### Page : `/history` - Onglet "Coupons" (🔒 Protégée - agent DCARD)

#### Scénario : Le bénéficiaire vient réclamer son cashback

**Étape 1 - Vérification du coupon :**
```javascript
// Agent entre le code coupon + nom de famille du bénéficiaire
const code = "DCARD-1728567890-A5X9K";
const nomFamilleBeneficiaire = "Blot";

// Vérifier la validité (lecture blockchain, GRATUIT)
const { isValid, senderName, beneficiary, amount, isUsed } = await verifyCouponCode(code, nomFamilleBeneficiaire);

if (isValid && !isUsed) {
  console.log(`✅ Coupon valide !`);
  console.log(`Expéditeur : ${senderName}`);
  console.log(`Bénéficiaire : ${beneficiary}`);
  console.log(`Montant : ${amount / 100} EUR`);
} else if (isUsed) {
  console.log(`❌ Coupon déjà utilisé`);
} else {
  console.log(`❌ Coupon invalide ou nom de famille incorrect`);
}
```

**Étape 2 - Remise du cash physique :**
- L'agent DCARD vérifie l'identité du bénéficiaire (pièce d'identité)
- Confirme que le nom de famille correspond au beneficiary enregistré
- Remet l'argent en cash
- Clique sur "Encaisser" dans l'historique

**Étape 3 - Burn du coupon :**
```javascript
// Marquer le coupon comme utilisé (Backend API paie les gas)
await burnCouponCode(code);

// Smart Contract :
// - cashbacks[code].used = true
// - Émet événement CouponBurned(code, amount, burner)
```

**État final :**
- ✅ Coupon marqué "Completed" dans l'historique
- ✅ Ne peut plus être réutilisé
- ✅ Hash de burn visible dans l'historique
- ✅ Traçabilité complète on-chain

---

### 5️⃣ **MARKETPLACE - ACHAT DE PRODUITS**

#### Page : `/marketplace` (🔒 Protégée - nécessite connexion)

#### **Étape 1 : Sélection Pays et Ville**
1. User sélectionne un pays depuis la liste des 54 pays africains
2. **Gating obligatoire** : Une fois le pays sélectionné, l'interface propose les 3 plus grandes villes du pays
3. User doit choisir une ville parmi les 3 proposées
4. **Localisation persistante** : Le choix pays/ville est sauvegardé dans localStorage
5. Seulement après cette sélection, les produits deviennent visibles et cliquables

**Données collectées :**
```javascript
{
  selectedCountry: "Sénégal",
  selectedCity: "Dakar", // Une des 3 plus grandes villes
  locationSaved: true
}
```

#### **Étape 2 : Navigation et Filtres**
1. **Filtres par catégorie** : Matériaux, Aliments, Énergie, Divers
2. **Barre de recherche** pour trouver des produits spécifiques
3. **Sélecteur de devise** EUR/USD pour la diaspora
4. **Conversion automatique** des prix selon la devise choisie

#### **Étape 3 : Ajout au Panier**
1. User clique sur un produit pour l'ajouter au panier
2. **Modal de confirmation** : "Produit ajouté !"
3. Options : "Voir mon panier" ou "Continuer mes achats"
4. **Compteur panier** mis à jour dans le header

#### **Étape 4 : Page Panier (`/buy-material`)**
1. **Résumé de commande** avec tous les articles
2. **Ajustement des quantités** (+ / -) pour chaque produit
3. **Suppression d'articles** si nécessaire
4. **Calculs automatiques** :
   - Sous-total
   - TVA (20%)
   - Total final
5. **Sélecteur de devise** pour conversion
6. **Badge réduction** 10% sur première commande
7. **Point relais** : "Retrait disponible dans nos points relais partenaires"

#### **Étape 5 : Paiement**
1. User clique "Procéder au paiement"
2. **Modal de paiement** avec résumé de commande
3. **Intégration PaymentStep** pour les méthodes de paiement
4. **Enregistrement blockchain** après paiement réussi

**🔥 CE QUI SE PASSE (CRUCIAL) :**

```javascript
// 1. VALIDATION DU PAIEMENT
const paymentResult = await processPayment(...);

// 2. SI PAIEMENT VALIDÉ ✅
if (paymentResult.success) {
  // Générer le code ticket unique
  const ticketCode = generateCouponCode();
  // Ex: "DCARD-1728567890-B7Z3M"
  
  // Récupérer userId depuis JWT
  const userId = parseInt(session.user.id); // Ex: 12345
  
  // Récupérer la localisation choisie
  const location = JSON.parse(localStorage.getItem('marketplaceLocation'));
  const receiverCountry = location.country; // "Sénégal"
  const receiverCity = location.city;      // "Dakar"
  
  // Enregistrer on-chain (Backend API paie les gas fees)
  await recordMarketplacePurchase(
    ticketCode,                    // "DCARD-..."
    session.user.name,            // "John Doe"
    session.user.email,           // "john@example.com"
    'Marketplace DCARD',         // Bénéficiaire
    receiverCountry,              // "Sénégal"
    receiverCity,                 // "Dakar"
    userId,                       // 12345
    total,                        // Montant total
    products                      // [{name, quantity, price}, ...]
  );
  
  // Smart Contract enregistre :
  // - marketplacePurchases["DCARD-..."] = { buyerName, email, beneficiary, receiverCountry, receiverCity, userId, totalAmount, products[], ... }
  // - allMarketplaceCodes.push("DCARD-...")
  
  // Redirection vers Review avec le ticket
  onContinue(ticketCode);
}
```

**Transaction Blockchain :**
- ✅ Ticket enregistré on-chain avec détails des produits
- ✅ Localisation (pays/ville) persistée
- ✅ Mappé au userId de l'utilisateur
- ✅ Immuable et traçable
- ✅ Gas fees payés par l'entreprise DCARD

#### **Étape 6 : Reçu de Commande**
1. **Modal de reçu** avec tous les détails
2. **Informations de localisation** : Pays et ville sélectionnés
3. **Liste des produits** commandés avec quantités et prix
4. **Code ticket** unique avec bouton de copie
5. **Boutons d'action** :
   - "Imprimer" : Télécharge le reçu PDF
   - "Fermer" : Ferme le modal
   - "Voir mes tickets" : Redirige vers l'historique

---

### 6️⃣ **UTILISATION DES TICKETS MARKETPLACE (Bénéficiaire)**

#### Page : `/history` - Onglet "Tickets" (🔒 Protégée - agent DCARD)

#### Scénario : Le bénéficiaire vient récupérer sa commande au point relais

**Étape 1 - Vérification du ticket :**
```javascript
// Agent entre le code ticket
const code = "DCARD-1728567890-B7Z3M";

// Vérifier la validité (lecture blockchain, GRATUIT)
const { isValid, buyerName, beneficiary, totalAmount, isUsed, productCount } = await verifyTicketCode(code);

if (isValid && !isUsed) {
  console.log(`✅ Ticket valide !`);
  console.log(`Acheteur : ${buyerName}`);
  console.log(`Bénéficiaire : ${beneficiary}`);
  console.log(`Montant total : ${totalAmount / 100} EUR`);
  console.log(`Nombre de produits : ${productCount}`);
} else if (isUsed) {
  console.log(`❌ Ticket déjà utilisé`);
} else {
  console.log(`❌ Ticket invalide`);
}
```

**Étape 2 - Remise de la commande :**
- L'agent vérifie l'identité du bénéficiaire
- Vérifie que les produits commandés sont disponibles
- Remet la commande au point relais ou domicile
- Clique sur "Encaisser" dans l'historique

**Étape 3 - Burn du ticket :**
```javascript
// Marquer le ticket comme utilisé (Backend API paie les gas)
await burnTicketCode(code);

// Smart Contract :
// - marketplacePurchases[code].used = true
// - Émet événement TicketBurned(code, amount, burner)
```

**État final :**
- ✅ Ticket marqué "Completed" dans l'historique
- ✅ Ne peut plus être réutilisé
- ✅ Hash de burn visible dans l'historique
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
│  • /api/blockchain/record-marketplace-purchase - Ticket     │
│  • /api/blockchain/get-user-coupons - Coupons par userId    │
│  • /api/blockchain/get-market-tickets-by-user - Tickets     │
│  • /api/blockchain/verify-coupon - Vérifier coupon          │
│  • /api/blockchain/burn-coupon - Encaisser coupon           │
│  • /api/blockchain/verify-ticket - Vérifier ticket          │
│  • /api/blockchain/burn-ticket - Encaisser ticket           │
│  → Wallet entreprise paie tous les gas fees                 │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│          SMART CONTRACT (zkSync Era Sepolia)                │
│  • CashbackRegistry.sol                                     │
│  • Mappings :                                               │
│    - userId → User (balance, couponCodes)                   │
│    - couponCode → Cashback (details + receiverCountry)      │
│    - ticketCode → MarketplacePurchase (details + products)  │
│  • Fonctions :                                              │
│    - getCouponsByUserId(userId) → tous détails coupons      │
│    - getMarketTicketsByUserId(userId) → tous tickets        │
│    - verifyCoupon(code, nom) → validité + détails           │
│    - burnCoupon(code) → marque utilisé                      │
│    - verifyTicket(code) → validité + détails                │
│    - burnTicket(code) → marque utilisé                      │
│  • Events :                                                 │
│    - CashbackRecorded, CouponBurned                         │
│    - MarketplacePurchaseRecorded, TicketBurned              │
└─────────────────────────────────────────────────────────────┘
```

---

## 🎉 Résumé du Flow

**WORKFLOW COUPONS (Transfert d'argent) :**
1. **User s'inscrit** → userId créé, stocké dans JWT ✅
2. **User envoie de l'argent** → Formulaire multi-étapes ✅
3. **Paiement validé** → Coupon généré + enregistré on-chain ✅
4. **Coupon affiché** → User peut le partager au bénéficiaire ✅
5. **Bénéficiaire réclame** → Agent vérifie (code + nom) + remise cash + burn ✅
6. **Historique** → User voit tous ses coupons depuis blockchain (onglet Coupons) ✅

**WORKFLOW TICKETS (Marketplace) :**
1. **User s'inscrit** → userId créé, stocké dans JWT ✅
2. **User achète des produits** → Panier + formulaire multi-étapes ✅
3. **Paiement validé** → Ticket généré + enregistré on-chain avec produits ✅
4. **Ticket affiché** → Reçu imprimable avec détails commande ✅
5. **Bénéficiaire récupère** → Agent vérifie ticket + remet commande + burn ✅
6. **Historique** → User voit tous ses tickets depuis blockchain (onglet Tickets) ✅

**Tout est tracé, sécurisé, et décentralisé !** 🔐🌍✨



