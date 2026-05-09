import { NextRequest, NextResponse } from 'next/server';
import { ethers } from 'ethers';
// Ancien import artifact Hardhat (non versionné — référence conservée).
// import CashbackRegistryABI from '../../../../../backend/artifacts/contracts/CashbackRegistry.sol/CashbackRegistryTest.json';
import CashbackRegistryABI from '@/contracts/abi/CashbackRegistry.json';
import addressJson from "@/contracts/contractAddress.json";

const RPC_URL = process.env.RPC_URL || 'http://127.0.0.1:8545';

// ✅ Source unique
const CONTRACT_ADDRESS = addressJson?.CashbackRegistry;

export async function POST(request: NextRequest) {
  console.log('🔍 API: VERIFY COUPON');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

  try {
    const body = await request.json();
    const { code, nomFamilleBeneficiaire } = body;

    console.log('📥 Request Body:');
    console.log('   Code:', code);
    console.log('   Nom de famille:', nomFamilleBeneficiaire);

    if (!code || !nomFamilleBeneficiaire) {
      console.error('❌ Validation failed: Missing required fields');
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    console.log('\n🔧 Blockchain Configuration:');
    console.log('   RPC URL:', RPC_URL);
    console.log('   Contract Address:', CONTRACT_ADDRESS);

    if (!CONTRACT_ADDRESS || !RPC_URL) {
      console.error('❌ Missing blockchain configuration');
      return NextResponse.json(
        { error: 'Missing blockchain configuration' },
        { status: 500 }
      );
    }

    const provider = new ethers.JsonRpcProvider(RPC_URL);
    const contract = new ethers.Contract(
      CONTRACT_ADDRESS,
      CashbackRegistryABI.abi,
      provider
    );

    // Appel à la fonction verifyCoupon du smart contract
    console.log('\n📖 Calling contract.verifyCoupon...');
    console.log('   Function parameters:');
    console.log('   - code:', code);
    console.log('   - nomFamilleBeneficiaire:', nomFamilleBeneficiaire);

    const result = await contract.verifyCoupon(code, nomFamilleBeneficiaire);

    console.log('\n📋 Raw result from verifyCoupon:', result);

    const isValid = result[0];
    const senderName = result[1];
    const beneficiary = result[2];
    const amount = result[3].toString();
    const isUsed = result[4];

    console.log('\n✅ VERIFICATION RESULT:');
    console.log('   Valid:', isValid);
    console.log('   Sender Name:', senderName);
    console.log('   Beneficiary:', beneficiary);
    console.log('   Amount:', amount, 'centimes');
    console.log('   Used:', isUsed);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    return NextResponse.json({
      success: true,
      data: {
        isValid,
        senderName,
        beneficiary,
        amount,
        isUsed
      }
    });

  } catch (error: any) {
    console.error('❌ Error verifying coupon:', error);
    console.error('❌ Error details:', {
      message: error.message,
      code: error.code,
      reason: error.reason,
      stack: error.stack
    });
    return NextResponse.json(
      { error: error.message || 'Failed to verify coupon' },
      { status: 500 }
    );
  }
}










