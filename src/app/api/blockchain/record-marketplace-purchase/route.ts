import { NextRequest, NextResponse } from 'next/server';
import { ethers } from 'ethers';
import addressJson from "@/contracts/contractAddress.json";

// Import ABI
import CashbackRegistryABI from '../../../../../backend/artifacts/contracts/CashbackRegistry.sol/CashbackRegistryTest.json';

// Config
const PRIVATE_KEY = process.env.COMPANY_WALLET_PRIVATE_KEY || '';
const RPC_URL = process.env.RPC_URL || 'http://127.0.0.1:8545';

// ✅ Source unique
const CONTRACT_ADDRESS = addressJson?.CashbackRegistry;

if (!CONTRACT_ADDRESS) {
  throw new Error("❌ Contract address not found in contractAddress.json");
}

export async function POST(request: NextRequest) {
  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('🔗 API: RECORD MARKETPLACE PURCHASE ON-CHAIN');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  
  try {
    const body = await request.json();
    const { 
      code, 
      buyerName, 
      buyerEmail, 
      beneficiary, 
      receiverCountry,
      receiverCity,
      userId, 
      totalAmount,
      products 
    } = body;

    console.log('📥 Request Body:', body);

    // ✅ Validation
    if (!code || !buyerName || !buyerEmail || !beneficiary || !receiverCountry || !receiverCity || !userId || !totalAmount || !products) {
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

    // ✅ Vérifie que le contrat existe (comme dans ton autre script)
    const contractCode = await provider.getCode(CONTRACT_ADDRESS);
    if (contractCode === "0x") {
      throw new Error(`❌ No contract deployed at ${CONTRACT_ADDRESS}`);
    }

    const wallet = new ethers.Wallet(PRIVATE_KEY, provider);
    console.log('   Wallet:', wallet.address);

    const contract = new ethers.Contract(
      CONTRACT_ADDRESS,
      CashbackRegistryABI.abi,
      wallet
    );

    // 🔧 Préparer les données produits
    const productNames = products.map((p: any) => p.name);
    const productQuantities = products.map((p: any) => p.quantity);
    const productPrices = products.map((p: any) => Math.ceil(p.price * 100));

    // 🚀 Appel du smart contract
    console.log('\n📝 Calling recordMarketplacePurchase...');

    const tx = await contract.recordMarketplacePurchase(
      code,
      buyerName,
      buyerEmail,
      beneficiary,
      receiverCountry,
      receiverCity,
      userId,
      Math.ceil(totalAmount * 100),
      productNames,
      productQuantities,
      productPrices
    );

    console.log('⏳ Tx sent:', tx.hash);

    const receipt = await tx.wait();

    console.log('✅ Tx confirmed:', receipt.hash);

    return NextResponse.json({
      success: true,
      transactionHash: receipt.hash,
      blockNumber: receipt.blockNumber,
      gasUsed: receipt.gasUsed?.toString(),
      status: receipt.status === 1 ? 'Success' : 'Failed',
      couponCode: code,
      userId,
      totalAmount,
      receiverCountry,
      receiverCity
    });

  } catch (error: any) {
    console.error('❌ ERROR:', error);

    return NextResponse.json(
      { error: error.message || 'Failed to record marketplace purchase' },
      { status: 500 }
    );
  }
}