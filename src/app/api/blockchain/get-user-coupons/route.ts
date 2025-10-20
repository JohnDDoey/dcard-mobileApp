import { NextRequest, NextResponse } from 'next/server';
import { ethers } from 'ethers';

// Import ABI
import CashbackRegistryABI from '../../../../../backend/artifacts/contracts/CashbackRegistry.sol/CashbackRegistryTest.json';

const RPC_URL = process.env.RPC_URL || 'http://127.0.0.1:8545';
const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS || '';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { error: 'userId parameter is required' },
        { status: 400 }
      );
    }

    console.log(`🔍 Getting coupons for userId: ${userId} using getCouponsByUserId`);

    // Connexion au contrat
    const provider = new ethers.JsonRpcProvider(RPC_URL);
    const contract = new ethers.Contract(
      CONTRACT_ADDRESS,
      CashbackRegistryABI.abi,
      provider
    );

    // Utiliser la fonction getCouponsByUserId
    console.log('📖 Calling contract.getCouponsByUserId...');
    const result = await contract.getCouponsByUserId(parseInt(userId));
    
    console.log('📋 Raw result from getCouponsByUserId:', result);
    
    const codes = result[0];
    const amounts = result[1];
    const createdAts = result[2];
    const usedFlags = result[3];
    const senderNames = result[4];
    const beneficiaries = result[5];
    const receiverCountries = result[6];
    
    console.log(`📊 Found ${codes.length} coupons for user ${userId}`);

    // Formatter les données pour le panneau historique
    const coupons = codes.map((code: string, index: number) => ({
      code,
      amount: amounts[index].toString(),
      createdAt: new Date(Number(createdAts[index]) * 1000).toISOString(),
      used: usedFlags[index],
      senderName: senderNames[index],
      beneficiary: beneficiaries[index],
      receiverCountry: receiverCountries[index]
    }));
    
    console.log(`✅ Retrieved ${coupons.length} complete coupons for user ${userId}`);

    return NextResponse.json({
      success: true,
      userId: parseInt(userId),
      count: coupons.length,
      coupons
    });

  } catch (error: any) {
    console.error('❌ Error fetching user coupons:', error);
    console.error('❌ Error details:', {
      message: error.message,
      code: error.code,
      reason: error.reason
    });
    return NextResponse.json(
      { error: error.message || 'Failed to fetch user coupons' },
      { status: 500 }
    );
  }
}
