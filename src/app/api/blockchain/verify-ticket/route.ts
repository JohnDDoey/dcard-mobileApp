import { NextRequest, NextResponse } from 'next/server';
import { ethers } from 'ethers';
import CashbackRegistryABI from '../../../../../backend/artifacts/contracts/CashbackRegistry.sol/CashbackRegistryTest.json';
import addressJson from "@/contracts/contractAddress.json";

const RPC_URL = process.env.RPC_URL || 'http://127.0.0.1:8545';

// ✅ Source unique
const CONTRACT_ADDRESS = addressJson?.CashbackRegistry;

export async function POST(request: NextRequest) {
  console.log('🎫 API: VERIFY TICKET');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

  try {
    const body = await request.json();
    const { code } = body;

    console.log('📥 Request Body:');
    console.log('   Code:', code);

    if (!code) {
      console.error('❌ Validation failed: Missing code');
      return NextResponse.json(
        { error: 'Missing code parameter' },
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

    // Appel à la fonction verifyTicket du smart contract
    console.log('\n📖 Calling contract.verifyTicket...');
    console.log('   Function parameters:');
    console.log('   - code:', code);

    const result = await contract.verifyTicket(code);

    console.log('\n📋 Raw result from verifyTicket:', result);

    const isValid = result[0];
    const buyerName = result[1];
    const beneficiary = result[2];
    const totalAmount = result[3].toString();
    const isUsed = result[4];
    const productCount = result[5].toString();

    console.log('\n✅ TICKET VERIFICATION RESULT:');
    console.log('   Valid:', isValid);
    console.log('   Buyer Name:', buyerName);
    console.log('   Beneficiary:', beneficiary);
    console.log('   Total Amount:', totalAmount, 'centimes');
    console.log('   Used:', isUsed);
    console.log('   Product Count:', productCount);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    return NextResponse.json({
      success: true,
      data: {
        isValid,
        buyerName,
        beneficiary,
        totalAmount,
        isUsed,
        productCount
      }
    });

  } catch (error: any) {
    console.error('❌ Error verifying ticket:', error);
    console.error('❌ Error details:', {
      message: error.message,
      code: error.code,
      reason: error.reason,
      stack: error.stack
    });
    return NextResponse.json(
      { error: error.message || 'Failed to verify ticket' },
      { status: 500 }
    );
  }
}










