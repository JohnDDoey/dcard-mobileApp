import { NextRequest, NextResponse } from 'next/server';
import { ethers } from 'ethers';

// Import ABI
import CashbackRegistryABI from '../../../../../backend/artifacts/contracts/CashbackRegistry.sol/CashbackRegistryTest.json';

const RPC_URL = process.env.RPC_URL || 'http://127.0.0.1:8545';
const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS || '';

export async function GET(request: NextRequest) {
  try {
    // Connexion en lecture seule (pas besoin de wallet)
    const provider = new ethers.JsonRpcProvider(RPC_URL);
    
    // Créer l'instance du contrat
    const contract = new ethers.Contract(
      CONTRACT_ADDRESS,
      CashbackRegistryABI.abi,
      provider
    );

    // Récupérer tous les coupons
    console.log('📖 Fetching all coupons from blockchain...');
    const result = await contract.getAllCoupons();
    
    const codes = result[0];
    const amounts = result[1];
    const createdAts = result[2];
    const usedFlags = result[3];
    const senderNames = result[4];
    const beneficiaries = result[5];
    const receiverCountries = result[6];
    
    // Formatter les données
    const coupons = codes.map((code: string, index: number) => ({
      code,
      amount: amounts[index].toString(),
      createdAt: new Date(Number(createdAts[index]) * 1000).toISOString(),
      used: usedFlags[index],
      senderName: senderNames[index],
      beneficiary: beneficiaries[index],
      receiverCountry: receiverCountries[index]
    }));
    
    console.log(`✅ Retrieved ${coupons.length} coupons`);

    return NextResponse.json({
      success: true,
      count: coupons.length,
      coupons
    });

  } catch (error: any) {
    console.error('❌ Error fetching coupons:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch coupons' },
      { status: 500 }
    );
  }
}


