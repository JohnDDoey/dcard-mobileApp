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
 * 🛒 ÉCRITURE - Enregistrer un achat marketplace (via API backend - l'entreprise paie les gas)
 */
export async function recordMarketplacePurchase(
  code: string,
  buyerName: string,
  buyerEmail: string,
  beneficiary: string,
  userId: number,
  amount: number,
  products: Array<{name: string, quantity: number, price: number}>
) {
  try {
    const response = await fetch('/api/blockchain/record-marketplace-purchase', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        code,
        buyerName,
        buyerEmail,
        beneficiary,
        userId,
        totalAmount: amount,
        products
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    console.log('✅ recordMarketplacePurchase success:', result);
    return result;
  } catch (error) {
    console.error('❌ recordMarketplacePurchase error:', error);
    throw error;
  }
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

// === FONCTIONS PARASITES SUPPRIMÉES ===

/**
 * 📖 LECTURE - Récupérer tous les coupons d'un utilisateur (GRATUIT - pas de gas)
 */
export async function getCouponsByUser(userId: number) {
  try {
    const response = await fetch(`/api/blockchain/get-user-coupons?userId=${userId}`);
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Failed to fetch user coupons');
    }

    return { success: true, coupons: data.coupons };
  } catch (error: any) {
    console.error('Error getting user coupons:', error);
    return { success: false, error };
  }
}

// === FONCTION PARASITE getAllCoupons() SUPPRIMÉE ===

/**
 * 🎫 LECTURE - Récupérer les tickets marketplace d'un utilisateur (GRATUIT - pas de gas)
 */
export async function getMarketTicketsByUser(userId: number) {
  try {
    const response = await fetch(`/api/blockchain/get-market-tickets-by-user?userId=${userId}`);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Failed to fetch user marketplace tickets');
    }

    return { success: true, tickets: data.tickets };
  } catch (error: any) {
    console.error('Error getting user marketplace tickets:', error);
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

/**
 * 🔍 VÉRIFICATION - Vérifier un coupon (GRATUIT - pas de gas)
 */
export async function verifyCouponCode(
  code: string, 
  nomFamilleBeneficiaire: string
) {
  try {
    const response = await fetch('/api/blockchain/verify-coupon', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        code,
        nomFamilleBeneficiaire
      }),
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Failed to verify coupon');
    }

    return { success: true, data };
  } catch (error: any) {
    console.error('Error verifying coupon:', error);
    return { success: false, error };
  }
}

/**
 * 🔥 ENCAISSEMENT - Brûler un coupon (via API backend - l'entreprise paie les gas)
 */
export async function burnCouponCode(code: string) {
  try {
    const response = await fetch('/api/blockchain/burn-coupon', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ code }),
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Failed to burn coupon');
    }

    return { success: true, data };
  } catch (error: any) {
    console.error('Error burning coupon:', error);
    return { success: false, error };
  }
}

/**
 * 🎫 VÉRIFICATION - Vérifier un ticket marketplace (GRATUIT - pas de gas)
 */
export async function verifyTicketCode(code: string) {
  try {
    const response = await fetch('/api/blockchain/verify-ticket', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ code }),
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Failed to verify ticket');
    }

    return { success: true, data };
  } catch (error: any) {
    console.error('Error verifying ticket:', error);
    return { success: false, error };
  }
}

/**
 * 🔥 ENCAISSEMENT - Brûler un ticket marketplace (via API backend - l'entreprise paie les gas)
 */
export async function burnTicketCode(code: string) {
  try {
    const response = await fetch('/api/blockchain/burn-ticket', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ code }),
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Failed to burn ticket');
    }

    return { success: true, data };
  } catch (error: any) {
    console.error('Error burning ticket:', error);
    return { success: false, error };
  }
}

// === FIN DU FICHIER ===