import { ethers } from 'ethers';

// Import ABI (sera généré après compilation)
// @ts-ignore
import CashbackRegistryABI from '../../backend/artifacts/contracts/CashbackRegistry.sol/CashbackRegistryTest.json';

// Configuration
const RPC_URL = process.env.NEXT_PUBLIC_RPC_URL || 'http://127.0.0.1:8545';
let CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || '';

// Charger l'adresse du contrat depuis le fichier généré
try {
  const contractAddress = require('./contractAddress.json');
  CONTRACT_ADDRESS = contractAddress.CashbackRegistry;
} catch (error) {
  console.warn('Contract address not found. Please deploy the contract first.');
}

/**
 * Obtenir le provider public (lecture seule, GRATUIT - pas de gas fees)
 */
export function getProvider() {
  return new ethers.JsonRpcProvider(RPC_URL);
}

/**
 * Obtenir le contrat avec un provider (lecture seule)
 */
export function getCashbackContract() {
  const provider = getProvider();
  return new ethers.Contract(CONTRACT_ADDRESS, CashbackRegistryABI.abi, provider);
}

/**
 * ✍️ ÉCRITURE - Enregistrer un cashback (via API backend - l'entreprise paie les gas)
 */
export async function recordCashback(
  code: string,
  senderName: string,
  senderEmail: string,
  beneficiary: string,
  userId: number,
  amount: number
) {
  try {
    const response = await fetch('/api/blockchain/record-cashback', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        code,
        senderName,
        senderEmail,
        beneficiary,
        userId,
        amount,
      }),
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Failed to record cashback');
    }

    return { success: true, data };
  } catch (error) {
    console.error('Error recording cashback:', error);
    return { success: false, error };
  }
}

/**
 * 📖 LECTURE - Récupérer un cashback par code (GRATUIT - pas de gas)
 */
export async function getCashbackByCode(code: string) {
  try {
    const contract = getCashbackContract();
    const result = await contract.getCashbackByCode(code);
    return {
      success: true,
      data: {
        senderName: result[0],
        senderEmail: result[1],
        beneficiary: result[2],
        amount: result[3].toString(),
        createdAt: result[4].toString(),
        used: result[5]
      }
    };
  } catch (error) {
    console.error('Error getting cashback:', error);
    return { success: false, error };
  }
}

/**
 * 📖 LECTURE - Vérifier si un code est valide (GRATUIT - pas de gas)
 */
export async function isValidCashbackCode(code: string) {
  try {
    const contract = getCashbackContract();
    const result = await contract.isValidCashbackCode(code);
    return {
      success: true,
      isValid: result[0],
      senderName: result[1],
      beneficiary: result[2],
      amount: result[3].toString()
    };
  } catch (error) {
    console.error('Error validating code:', error);
    return { success: false, error };
  }
}

/**
 * ✍️ ÉCRITURE - Consommer (burn) un cashback (via API backend - l'entreprise paie les gas)
 */
export async function consumeCashback(code: string) {
  try {
    const response = await fetch('/api/blockchain/consume-cashback', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ code }),
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Failed to consume cashback');
    }

    return { success: true, data };
  } catch (error) {
    console.error('Error consuming cashback:', error);
    return { success: false, error };
  }
}

/**
 * 📖 LECTURE - Récupérer tous les coupons d'un utilisateur (GRATUIT - pas de gas)
 */
export async function getCouponsByUser(userId: number) {
  try {
    const contract = getCashbackContract();
    const coupons = await contract.getCouponsByUser(userId);
    return { success: true, coupons };
  } catch (error) {
    console.error('Error getting user coupons:', error);
    return { success: false, error };
  }
}

/**
 * 📖 LECTURE - Récupérer tous les coupons pour l'historique (GRATUIT - pas de gas)
 */
export async function getAllCoupons() {
  try {
    const contract = getCashbackContract();
    const result = await contract.getAllCoupons();
    
    const codes = result[0];
    const amounts = result[1];
    const createdAts = result[2];
    const usedFlags = result[3];
    const senderNames = result[4];      // ✅ Nouveau
    const beneficiaries = result[5];    // ✅ Nouveau
    
    // Formatter les données
    const coupons = codes.map((code: string, index: number) => ({
      code,
      amount: amounts[index].toString(),
      createdAt: new Date(Number(createdAts[index]) * 1000).toISOString(),
      used: usedFlags[index],
      senderName: senderNames[index],        // ✅ Nouveau
      beneficiary: beneficiaries[index]      // ✅ Nouveau
    }));
    
    return { success: true, coupons };
  } catch (error) {
    console.error('Error getting all coupons:', error);
    return { success: false, error };
  }
}

/**
 * 🎲 Générer un code coupon aléatoire unique
 */
export function generateCouponCode(): string {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 7).toUpperCase();
  return `DCARD-${timestamp}-${random}`;
}
