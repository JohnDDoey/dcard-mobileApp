// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/// @title Cashback Registry System - version avec userId numérique
contract CashbackRegistryTest {
    struct Cashback {
        string senderName;
        string senderEmail;
        string beneficiary;
        string receiverCountry;
        uint256 amount;
        uint256 createdAt;
        bool used;
    }

    struct MarketplacePurchase {
        string buyerName;
        string buyerEmail;
        string beneficiary;
        uint256 userId;
        uint256 totalAmount;
        uint256 createdAt;
        bool used;
        Product[] products;
    }

    struct Product {
        string name;
        uint256 quantity;
        uint256 price;
    }

    struct User {
        uint256 userId;
        string[] couponCodes;
    }

    // Mapping code unique -> cashback
    mapping(string => Cashback) private cashbacks;

    // Mapping code unique -> marketplace purchase
    mapping(string => MarketplacePurchase) private marketplacePurchases;

    // Mapping userId -> user struct
    mapping(uint256 => User) private users;

    // Liste globale de tous les coupons
    string[] private allCouponCodes;

    // Liste globale des achats marketplace
    string[] private allMarketplaceCodes;

    event CashbackRecorded(
        string code,
        string senderName,
        string senderEmail,
        string beneficiary,
        string receiverCountry,
        uint256 amount
    );

    event MarketplacePurchaseRecorded(
        string code,
        string buyerName,
        string buyerEmail,
        string beneficiary,
        uint256 userId,
        uint256 totalAmount,
        uint256 productCount
    );

    event CashbackUsed(string code);

    /// 🔹 Enregistre un cashback et le lie à un utilisateur via son userId
    function recordCashbackWithCode(
        string memory code,
        string memory senderName,
        string memory senderEmail,
        string memory beneficiary,
        string memory receiverCountry,
        uint256 userId,
        uint256 amount
    ) external {
        require(cashbacks[code].createdAt == 0, "Code already used");

        Cashback memory cb = Cashback({
            senderName: senderName,
            senderEmail: senderEmail,
            beneficiary: beneficiary,
            receiverCountry: receiverCountry,
            amount: amount,
            createdAt: block.timestamp,
            used: false
        });

        cashbacks[code] = cb;
        allCouponCodes.push(code);

        // Mise à jour utilisateur avec userId numérique
        User storage user = users[userId];
        user.userId = userId;
        user.couponCodes.push(code);

        emit CashbackRecorded(code, senderName, senderEmail, beneficiary, receiverCountry, amount);
    }

    /// 🔍 Vérifie si un code est encore valide + retourne les infos utiles
    function isValidCashbackCode(string memory code) external view returns (
        bool isValid,
        string memory senderName,
        string memory beneficiary,
        uint256 amount
    ) {
        Cashback memory cb = cashbacks[code];
        if (cb.createdAt == 0 || cb.used) {
            return (false, "", "", 0);
        }
        return (true, cb.senderName, cb.beneficiary, cb.amount);
    }

    /// 🔥 Consomme un cashback : marque le code comme utilisé et émet un événement
    function consumeCashbackCode(string memory code) external {
        Cashback storage cb = cashbacks[code];
        require(cb.createdAt != 0, "Code not found");
        require(!cb.used, "Already used");

        cb.used = true;
        emit CashbackUsed(code);
    }

    /// 🛒 Enregistre un achat marketplace avec les produits
    function recordMarketplacePurchase(
        string memory code,
        string memory buyerName,
        string memory buyerEmail,
        string memory beneficiary,
        uint256 userId,
        uint256 totalAmount,
        string[] memory productNames,
        uint256[] memory productQuantities,
        uint256[] memory productPrices
    ) external {
        require(bytes(code).length > 0, "Code cannot be empty");
        require(bytes(marketplacePurchases[code].buyerName).length == 0, "Code already exists");
        require(productNames.length == productQuantities.length, "Products arrays length mismatch");
        require(productNames.length == productPrices.length, "Products arrays length mismatch");
        require(productNames.length > 0, "Must have at least one product");

        // Créer le tableau de produits
        Product[] memory products = new Product[](productNames.length);
        for (uint256 i = 0; i < productNames.length; i++) {
            products[i] = Product({
                name: productNames[i],
                quantity: productQuantities[i],
                price: productPrices[i]
            });
        }

        // Créer l'achat marketplace
        MarketplacePurchase storage purchase = marketplacePurchases[code];
        purchase.buyerName = buyerName;
        purchase.buyerEmail = buyerEmail;
        purchase.beneficiary = beneficiary;
        purchase.userId = userId;
        purchase.totalAmount = totalAmount;
        purchase.createdAt = block.timestamp;
        purchase.used = false;

        // Ajouter les produits (on doit les ajouter un par un car Solidity ne supporte pas les arrays dynamiques dans les structs)
        for (uint256 i = 0; i < products.length; i++) {
            purchase.products.push(products[i]);
        }

        // Ajouter le code à la liste globale
        allMarketplaceCodes.push(code);

        // ❌ SUPPRIMÉ : Les tickets marketplace ne vont pas dans couponCodes
        // users[userId].couponCodes.push(code);

        emit MarketplacePurchaseRecorded(
            code,
            buyerName,
            buyerEmail,
            beneficiary,
            userId,
            totalAmount,
            productNames.length
        );
    }


    /// 📄 Récupère tous les détails des coupons d'un utilisateur pour le panneau historique
    function getCouponsByUserId(uint256 userId) external view returns (
        string[] memory codes,
        uint256[] memory amounts,
        uint256[] memory createdAts,
        bool[] memory usedFlags,
        string[] memory senderNames,
        string[] memory beneficiaries,
        string[] memory receiverCountries
    ) {
        string[] memory userCodes = users[userId].couponCodes;
        uint256 count = userCodes.length;

        codes = new string[](count);
        amounts = new uint256[](count);
        createdAts = new uint256[](count);
        usedFlags = new bool[](count);
        senderNames = new string[](count);
        beneficiaries = new string[](count);
        receiverCountries = new string[](count);

        for (uint256 i = 0; i < count; i++) {
            string memory code = userCodes[i];
            Cashback memory cb = cashbacks[code];

            codes[i] = code;
            amounts[i] = cb.amount;
            createdAts[i] = cb.createdAt;
            usedFlags[i] = cb.used;
            senderNames[i] = cb.senderName;
            beneficiaries[i] = cb.beneficiary;
            receiverCountries[i] = cb.receiverCountry;
        }
    }

    /// 🎫 Récupère tous les tickets marketplace d'un utilisateur pour l'onglet marketplace
    function getMarketTicketsByUserId(uint256 userId) external view returns (
        string[] memory codes,
        string[] memory buyerNames,
        string[] memory beneficiaries,
        uint256[] memory totalAmounts,
        uint256[] memory createdAts,
        bool[] memory usedFlags,
        uint256[] memory productCounts
    ) {
        // Filtrer les achats par userId
        uint256[] memory userPurchaseIndices = new uint256[](allMarketplaceCodes.length);
        uint256 userPurchaseCount = 0;
        
        for (uint256 i = 0; i < allMarketplaceCodes.length; i++) {
            string memory code = allMarketplaceCodes[i];
            MarketplacePurchase memory purchase = marketplacePurchases[code];
            if (purchase.userId == userId) {
                userPurchaseIndices[userPurchaseCount] = i;
                userPurchaseCount++;
            }
        }

        codes = new string[](userPurchaseCount);
        buyerNames = new string[](userPurchaseCount);
        beneficiaries = new string[](userPurchaseCount);
        totalAmounts = new uint256[](userPurchaseCount);
        createdAts = new uint256[](userPurchaseCount);
        usedFlags = new bool[](userPurchaseCount);
        productCounts = new uint256[](userPurchaseCount);

        for (uint256 i = 0; i < userPurchaseCount; i++) {
            uint256 index = userPurchaseIndices[i];
            string memory code = allMarketplaceCodes[index];
            MarketplacePurchase memory purchase = marketplacePurchases[code];

            codes[i] = code;
            buyerNames[i] = purchase.buyerName;
            beneficiaries[i] = purchase.beneficiary;
            totalAmounts[i] = purchase.totalAmount;
            createdAts[i] = purchase.createdAt;
            usedFlags[i] = purchase.used;
            productCounts[i] = purchase.products.length;
        }
    }

    /// 🔍 VÉRIFICATION - Vérifier un coupon (GRATUIT - pas de gas)
    function verifyCoupon(
        string memory code,
        string memory nomFamilleBeneficiaire
    ) external view returns (
        bool isValid,
        string memory senderName,
        string memory beneficiary,
        uint256 amount,
        bool isUsed
    ) {
        // Vérifier si le coupon existe
        if (cashbacks[code].amount == 0) {
            return (false, "", "", 0, false);
        }

        Cashback memory cb = cashbacks[code];
        
        // Vérifier si le nom de famille correspond (comparaison du nom de famille)
        // Exemple: "John Dissingar" contient "Dissingar"
        bool beneficiaryMatch = containsString(cb.beneficiary, nomFamilleBeneficiaire);
        
        return (
            beneficiaryMatch && !cb.used, // Valide si nom de famille correspond et pas encore utilisé
            cb.senderName,
            cb.beneficiary,
            cb.amount,
            cb.used
        );
    }

    /// Fonction utilitaire pour vérifier si une chaîne contient une sous-chaîne
    function containsString(string memory str, string memory substr) internal pure returns (bool) {
        bytes memory strBytes = bytes(str);
        bytes memory substrBytes = bytes(substr);
        
        if (substrBytes.length == 0) return true;
        if (strBytes.length < substrBytes.length) return false;
        
        for (uint i = 0; i <= strBytes.length - substrBytes.length; i++) {
            bool found = true;
            for (uint j = 0; j < substrBytes.length; j++) {
                if (strBytes[i + j] != substrBytes[j]) {
                    found = false;
                    break;
                }
            }
            if (found) return true;
        }
        return false;
    }

    /// 🔥 ENCAISSEMENT - Brûler un coupon (PAYANT - gas fees)
    function burnCoupon(string memory code) external {
        // Vérifier que le coupon existe
        require(cashbacks[code].amount > 0, "Coupon does not exist");
        
        // Vérifier que le coupon n'est pas déjà utilisé
        require(!cashbacks[code].used, "Coupon already used");
        
        // Marquer le coupon comme utilisé
        cashbacks[code].used = true;
        
        // Émettre l'événement
        emit CouponBurned(code, cashbacks[code].amount, msg.sender);
    }

    /// Événement pour l'encaissement
    event CouponBurned(string indexed code, uint256 amount, address indexed burner);

    /// 🎫 VÉRIFICATION - Vérifier un ticket marketplace (GRATUIT - pas de gas)
    function verifyTicket(
        string memory code
    ) external view returns (
        bool isValid,
        string memory buyerName,
        string memory beneficiary,
        uint256 totalAmount,
        bool isUsed,
        uint256 productCount
    ) {
        // Vérifier si le ticket existe
        if (marketplacePurchases[code].totalAmount == 0) {
            return (false, "", "", 0, false, 0);
        }

        MarketplacePurchase memory purchase = marketplacePurchases[code];
        
        return (
            !purchase.used, // Valide si pas encore utilisé
            purchase.buyerName,
            purchase.beneficiary,
            purchase.totalAmount,
            purchase.used,
            purchase.products.length
        );
    }

    /// 🔥 ENCAISSEMENT - Brûler un ticket marketplace (PAYANT - gas fees)
    function burnTicket(string memory code) external {
        // Vérifier que le ticket existe
        require(marketplacePurchases[code].totalAmount > 0, "Ticket does not exist");
        
        // Vérifier que le ticket n'est pas déjà utilisé
        require(!marketplacePurchases[code].used, "Ticket already used");
        
        // Marquer le ticket comme utilisé
        marketplacePurchases[code].used = true;
        
        // Émettre l'événement
        emit TicketBurned(code, marketplacePurchases[code].totalAmount, msg.sender);
    }

    /// Événement pour l'encaissement des tickets
    event TicketBurned(string indexed code, uint256 amount, address indexed burner);

}

