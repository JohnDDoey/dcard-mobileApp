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

    /// 🔍 Lire un cashback par code
    function getCashbackByCode(string memory code) external view returns (
        string memory senderName,
        string memory senderEmail,
        string memory beneficiary,
        string memory receiverCountry,
        uint256 amount,
        uint256 createdAt,
        bool used
    ) {
        Cashback memory cb = cashbacks[code];
        require(cb.createdAt != 0, "Code not found");

        return (
            cb.senderName,
            cb.senderEmail,
            cb.beneficiary,
            cb.receiverCountry,
            cb.amount,
            cb.createdAt,
            cb.used
        );
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

        // Ajouter le code à l'utilisateur
        users[userId].couponCodes.push(code);

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


    /// 📄 Récupère tous les coupons d'un utilisateur via son userId
    function getCouponsByUser(uint256 userId) external view returns (string[] memory) {
        return users[userId].couponCodes;
    }

    /// 🛒 Récupère un achat marketplace par son code
    function getMarketplacePurchase(string memory code) external view returns (
        string memory buyerName,
        string memory buyerEmail,
        string memory beneficiary,
        uint256 userId,
        uint256 totalAmount,
        uint256 createdAt,
        bool used,
        string[] memory productNames,
        uint256[] memory productQuantities,
        uint256[] memory productPrices
    ) {
        MarketplacePurchase memory purchase = marketplacePurchases[code];
        require(bytes(purchase.buyerName).length > 0, "Purchase not found");

        // Extraire les produits
        productNames = new string[](purchase.products.length);
        productQuantities = new uint256[](purchase.products.length);
        productPrices = new uint256[](purchase.products.length);

        for (uint256 i = 0; i < purchase.products.length; i++) {
            productNames[i] = purchase.products[i].name;
            productQuantities[i] = purchase.products[i].quantity;
            productPrices[i] = purchase.products[i].price;
        }

        return (
            purchase.buyerName,
            purchase.buyerEmail,
            purchase.beneficiary,
            purchase.userId,
            purchase.totalAmount,
            purchase.createdAt,
            purchase.used,
            productNames,
            productQuantities,
            productPrices
        );
    }

    /// 🛒 Récupère tous les achats marketplace
    function getAllMarketplacePurchases() external view returns (
        string[] memory codes,
        string[] memory buyerNames,
        uint256[] memory totalAmounts,
        uint256[] memory createdAts,
        bool[] memory usedFlags
    ) {
        uint256 count = allMarketplaceCodes.length;

        codes = new string[](count);
        buyerNames = new string[](count);
        totalAmounts = new uint256[](count);
        createdAts = new uint256[](count);
        usedFlags = new bool[](count);

        for (uint256 i = 0; i < count; i++) {
            string memory code = allMarketplaceCodes[i];
            MarketplacePurchase memory purchase = marketplacePurchases[code];

            codes[i] = code;
            buyerNames[i] = purchase.buyerName;
            totalAmounts[i] = purchase.totalAmount;
            createdAts[i] = purchase.createdAt;
            usedFlags[i] = purchase.used;
        }

        return (codes, buyerNames, totalAmounts, createdAts, usedFlags);
    }

    /// 🎫 Récupère tous les tickets marketplace complets (comme getAllCoupons)
    function getTicketsShop() external view returns (
        string[] memory codes,
        string[] memory buyerNames,
        string[] memory beneficiaries,
        uint256[] memory userIds,
        uint256[] memory totalAmounts,
        uint256[] memory createdAts,
        bool[] memory usedFlags,
        uint256[] memory productCounts
    ) {
        uint256 count = allMarketplaceCodes.length;

        codes = new string[](count);
        buyerNames = new string[](count);
        beneficiaries = new string[](count);
        userIds = new uint256[](count);
        totalAmounts = new uint256[](count);
        createdAts = new uint256[](count);
        usedFlags = new bool[](count);
        productCounts = new uint256[](count);

        for (uint256 i = 0; i < count; i++) {
            string memory code = allMarketplaceCodes[i];
            MarketplacePurchase memory purchase = marketplacePurchases[code];

            codes[i] = code;
            buyerNames[i] = purchase.buyerName;
            beneficiaries[i] = purchase.beneficiary;
            userIds[i] = purchase.userId;
            totalAmounts[i] = purchase.totalAmount;
            createdAts[i] = purchase.createdAt;
            usedFlags[i] = purchase.used;
            productCounts[i] = purchase.products.length;
        }

        return (codes, buyerNames, beneficiaries, userIds, totalAmounts, createdAts, usedFlags, productCounts);
    }

    /// 📦 Retourne tous les coupons complets (code, montant, date, utilisé, sender, beneficiary, country)
    function getAllCoupons() external view returns (
        string[] memory codes,
        uint256[] memory amounts,
        uint256[] memory createdAts,
        bool[] memory usedFlags,
        string[] memory senderNames,
        string[] memory beneficiaries,
        string[] memory receiverCountries
    ) {
        uint256 count = allCouponCodes.length;

        codes = new string[](count);
        amounts = new uint256[](count);
        createdAts = new uint256[](count);
        usedFlags = new bool[](count);
        senderNames = new string[](count);
        beneficiaries = new string[](count);
        receiverCountries = new string[](count);

        for (uint256 i = 0; i < count; i++) {
            string memory code = allCouponCodes[i];
            Cashback memory cb = cashbacks[code];

            codes[i] = code;
            amounts[i] = cb.amount;
            createdAts[i] = cb.createdAt;
            usedFlags[i] = cb.used;
            senderNames[i] = cb.senderName;
            beneficiaries[i] = cb.beneficiary;
            receiverCountries[i] = cb.receiverCountry;
        }

        return (codes, amounts, createdAts, usedFlags, senderNames, beneficiaries, receiverCountries);
    }
}

