import { NextRequest, NextResponse } from 'next/server';
import { ethers } from 'ethers';

// Import ABI
import CashbackRegistryABI from '../../../../../backend/artifacts/contracts/CashbackRegistry.sol/CashbackRegistryTest.json';

// Configuration du wallet de l'entreprise (côté serveur)
const PRIVATE_KEY = process.env.COMPANY_WALLET_PRIVATE_KEY || '';
const RPC_URL = process.env.RPC_URL || 'http://127.0.0.1:8545';
const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS || '';

export async function POST(request: NextRequest) {
  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('🔗 API: RECORD CASHBACK ON-CHAIN');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  
  try {
    const body = await request.json();
    const { code, senderName, senderEmail, beneficiary, userId, amount } = body;

    console.log('📥 Request Body:');
    console.log('   Code:', code);
    console.log('   Sender Name:', senderName);
    console.log('   Sender Email:', senderEmail);
    console.log('   Beneficiary:', beneficiary);
    console.log('   User ID:', userId);
    console.log('   Amount (centimes):', amount);

    // Validation des données
    if (!code || !senderName || !senderEmail || !beneficiary || !userId || !amount) {
      console.error('❌ Validation failed: Missing required fields');
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    console.log('\n🔧 Blockchain Configuration:');
    console.log('   RPC URL:', RPC_URL);
    console.log('   Contract Address:', CONTRACT_ADDRESS);
    console.log('   Company Wallet:', PRIVATE_KEY ? '✅ Configured' : '❌ Missing');

    // Validation de la configuration
    if (!PRIVATE_KEY || !CONTRACT_ADDRESS) {
      console.error('❌ Missing blockchain configuration');
      return NextResponse.json(
        { error: 'Blockchain configuration error: Missing private key or contract address' },
        { status: 500 }
      );
    }

    // Connexion au réseau avec le wallet existant (qui a déployé le contrat)
    console.log('\n📡 Connecting to blockchain...');
    const provider = new ethers.JsonRpcProvider(RPC_URL);
    const wallet = new ethers.Wallet(PRIVATE_KEY, provider);
    console.log('   Deployer Wallet Address:', wallet.address);
    
    const balance = await provider.getBalance(wallet.address);
    console.log('   Wallet Balance:', ethers.formatEther(balance), 'ETH');
    
    // Créer l'instance du contrat
    const contract = new ethers.Contract(
      CONTRACT_ADDRESS,
      CashbackRegistryABI.abi,
      wallet
    );

    // Enregistrer le cashback on-chain (l'entreprise paie les gas fees)
    console.log('\n📝 Calling contract.recordCashbackWithCode()...');
    console.log('   Function parameters:');
    console.log('   - code:', code);
    console.log('   - senderName:', senderName);
    console.log('   - senderEmail:', senderEmail);
    console.log('   - beneficiary:', beneficiary);
    console.log('   - userId:', userId);
    console.log('   - amount:', amount);
    
    const tx = await contract.recordCashbackWithCode(
      code,
      senderName,
      senderEmail,
      beneficiary,
      userId,
      amount
    );

    console.log('\n⏳ Transaction sent! Waiting for confirmation...');
    console.log('   Tx Hash:', tx.hash);
    console.log('   Nonce:', tx.nonce);
    console.log('   Gas Limit:', tx.gasLimit?.toString());

    // Attendre la confirmation de la transaction
    const receipt = await tx.wait();
    
    console.log('\n✅ Transaction confirmed!');
    console.log('   Block Number:', receipt.blockNumber);
    console.log('   Block Hash:', receipt.blockHash);
    console.log('   Gas Used:', receipt.gasUsed?.toString());
    console.log('   Status:', receipt.status === 1 ? 'Success' : 'Failed');
    console.log('   Cumulative Gas Used:', receipt.cumulativeGasUsed?.toString());
    
    console.log('\n🎫 COUPON DETAILS:');
    console.log('   Code:', code);
    console.log('   User ID:', userId);
    console.log('   Amount:', amount, 'centimes');
    console.log('   Beneficiary:', beneficiary);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    return NextResponse.json({
      success: true,
      transactionHash: receipt.hash,
      blockNumber: receipt.blockNumber,
      gasUsed: receipt.gasUsed?.toString(),
      couponCode: code
    });

  } catch (error: any) {
    console.error('\n❌ ERROR recording cashback:');
    console.error('   Message:', error.message);
    console.error('   Code:', error.code);
    console.error('   Details:', error);
    console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    
    return NextResponse.json(
      { error: error.message || 'Failed to record cashback' },
      { status: 500 }
    );
  }
}


