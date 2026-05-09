import { NextRequest, NextResponse } from 'next/server';
import { ethers } from 'ethers';
import addressJson from "@/contracts/contractAddress.json";

// Import ABI — ancien artifact Hardhat (référence conservée).
// import CashbackRegistryABI from '../../../../../backend/artifacts/contracts/CashbackRegistry.sol/CashbackRegistryTest.json';
import CashbackRegistryABI from '@/contracts/abi/CashbackRegistry.json';

// Config
const PRIVATE_KEY = process.env.COMPANY_WALLET_PRIVATE_KEY || '';
const RPC_URL = process.env.RPC_URL || 'http://127.0.0.1:8545';

// ✅ Adresse depuis le JSON (source unique)
const CONTRACT_ADDRESS = addressJson?.CashbackRegistry;

if (!CONTRACT_ADDRESS) {
  throw new Error("❌ Contract address not found in contractAddress.json");
}

export async function POST(request: NextRequest) {
  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('🔗 API: RECORD CASHBACK ON-CHAIN');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  
  try {
    const body = await request.json();
    const { code, senderName, senderEmail, beneficiary, receiverCountry, userId, amount } = body;

    console.log('📥 Request Body:', body);

    // ✅ Validation
    if (!code || !senderName || !senderEmail || !beneficiary || !userId || !amount) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    if (!PRIVATE_KEY) {
      return NextResponse.json(
        { error: 'Missing PRIVATE_KEY in .env.local' },
        { status: 500 }
      );
    }

    console.log('\n🔧 Blockchain Configuration:');
    console.log('   RPC URL:', RPC_URL);
    console.log('   Contract Address:', CONTRACT_ADDRESS);

    // 🔗 Connexion
    const provider = new ethers.JsonRpcProvider(RPC_URL);

    // ✅ Vérifie que le contrat existe
    const contractCode = await provider.getCode(CONTRACT_ADDRESS);
    if (contractCode === "0x") {
      throw new Error(`❌ No contract deployed at ${CONTRACT_ADDRESS}. Did you redeploy?`);
    }

    const wallet = new ethers.Wallet(PRIVATE_KEY, provider);
    console.log('   Wallet:', wallet.address);

    const contract = new ethers.Contract(
      CONTRACT_ADDRESS,
      CashbackRegistryABI.abi,
      wallet
    );

    // 🚀 Appel du smart contract
    console.log('\n📝 Calling recordCashbackWithCode...');

    const tx = await contract.recordCashbackWithCode(
      code,
      senderName,
      senderEmail,
      beneficiary,
      receiverCountry,
      userId,
      amount
    );

    console.log('⏳ Tx sent:', tx.hash);

    const receipt = await tx.wait();

    console.log('✅ Tx confirmed:', receipt.hash);

    return NextResponse.json({
      success: true,
      transactionHash: receipt.hash,
      blockNumber: receipt.blockNumber,
      gasUsed: receipt.gasUsed?.toString(),
      couponCode: code,
      beneficiary,
      receiverCountry: receiverCountry || 'Unknown',
      amount
    });

  } catch (error: any) {
    console.error('❌ ERROR:', error);

    return NextResponse.json(
      { error: error.message || 'Failed to record cashback' },
      { status: 500 }
    );
  }
}