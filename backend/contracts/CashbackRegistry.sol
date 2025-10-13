// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/// @title Cashback Registry System - version avec userId numérique
contract CashbackRegistryTest {
    struct Cashback {
        string senderName;
        string senderEmail;
        string beneficiary;
        uint256 amount;
        uint256 createdAt;
        bool used;
    }

    struct User {
        uint256 userId;
        string[] couponCodes;
    }

    // Mapping code unique -> cashback
    mapping(string => Cashback) private cashbacks;

    // Mapping userId -> user struct
    mapping(uint256 => User) private users;

    // Liste globale de tous les coupons
    string[] private allCouponCodes;

    event CashbackRecorded(
        string code,
        string senderName,
        string senderEmail,
        string beneficiary,
        uint256 amount
    );

    event CashbackUsed(string code);

    /// 🔹 Enregistre un cashback et le lie à un utilisateur via son userId
    function recordCashbackWithCode(
        string memory code,
        string memory senderName,
        string memory senderEmail,
        string memory beneficiary,
        uint256 userId,
        uint256 amount
    ) external {
        require(cashbacks[code].createdAt == 0, "Code already used");

        Cashback memory cb = Cashback({
            senderName: senderName,
            senderEmail: senderEmail,
            beneficiary: beneficiary,
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

        emit CashbackRecorded(code, senderName, senderEmail, beneficiary, amount);
    }

    /// 🔍 Lire un cashback par code
    function getCashbackByCode(string memory code) external view returns (
        string memory senderName,
        string memory senderEmail,
        string memory beneficiary,
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


    /// 📄 Récupère tous les coupons d'un utilisateur via son userId
    function getCouponsByUser(uint256 userId) external view returns (string[] memory) {
        return users[userId].couponCodes;
    }

    /// 📦 Retourne tous les coupons complets (code, montant, date, utilisé, sender, beneficiary)
    function getAllCoupons() external view returns (
        string[] memory codes,
        uint256[] memory amounts,
        uint256[] memory createdAts,
        bool[] memory usedFlags,
        string[] memory senderNames,
        string[] memory beneficiaries
    ) {
        uint256 count = allCouponCodes.length;

        codes = new string[](count);
        amounts = new uint256[](count);
        createdAts = new uint256[](count);
        usedFlags = new bool[](count);
        senderNames = new string[](count);
        beneficiaries = new string[](count);

        for (uint256 i = 0; i < count; i++) {
            string memory code = allCouponCodes[i];
            Cashback memory cb = cashbacks[code];

            codes[i] = code;
            amounts[i] = cb.amount;
            createdAts[i] = cb.createdAt;
            usedFlags[i] = cb.used;
            senderNames[i] = cb.senderName;
            beneficiaries[i] = cb.beneficiary;
        }

        return (codes, amounts, createdAts, usedFlags, senderNames, beneficiaries);
    }
}

