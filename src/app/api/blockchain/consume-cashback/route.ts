import { NextRequest, NextResponse } from 'next/server';
import { ethers } from 'ethers';

// Import ABI
import CashbackRegistryABI from '../../../../../backend/artifacts/contracts/CashbackRegistry.sol/CashbackRegistryTest.json';

// Configuration du wallet de l'entreprise (côté serveur)
const PRIVATE_KEY = process.env.COMPANY_WALLET_PRIVATE_KEY || '';
const RPC_URL = process.env.RPC_URL || 'http://127.0.0.1:8545';
const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS || '';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { code } = body;

    // Validation
    if (!code) {
      return NextResponse.json(
        { error: 'Coupon code is required' },
        { status: 400 }
      );
    }

    // Connexion au réseau avec le wallet de l'entreprise
    const provider = new ethers.JsonRpcProvider(RPC_URL);
    const wallet = new ethers.Wallet(PRIVATE_KEY, provider);
    
    // Créer l'instance du contrat
    const contract = new ethers.Contract(
      CONTRACT_ADDRESS,
      CashbackRegistryABI.abi,
      wallet
    );

    // Consommer le cashback on-chain (l'entreprise paie les gas fees)
    console.log('🔥 Consuming cashback on-chain:', code);
    const tx = await contract.consumeCashbackCode(code);

    // Attendre la confirmation de la transaction
    const receipt = await tx.wait();
    
    console.log('✅ Cashback consumed! TxHash:', receipt.hash);

    return NextResponse.json({
      success: true,
      transactionHash: receipt.hash,
      blockNumber: receipt.blockNumber,
      couponCode: code,
      message: 'Cashback successfully consumed'
    });

  } catch (error: any) {
    console.error('❌ Error consuming cashback:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to consume cashback' },
      { status: 500 }
    );
  }
}


