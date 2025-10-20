import { NextRequest, NextResponse } from 'next/server';
import { ethers } from 'ethers';
import CashbackRegistryABI from '../../../../../backend/artifacts/contracts/CashbackRegistry.sol/CashbackRegistryTest.json';

const PRIVATE_KEY = process.env.COMPANY_WALLET_PRIVATE_KEY || '';
const RPC_URL = process.env.RPC_URL || 'http://127.0.0.1:8545';
const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS || '';

export async function POST(request: NextRequest) {
  console.log('🔥 API: BURN TICKET');
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
    console.log('   Company Wallet:', PRIVATE_KEY ? '✅ Configured' : '❌ Missing');

    if (!PRIVATE_KEY || !CONTRACT_ADDRESS || !RPC_URL) {
      console.error('❌ Missing blockchain configuration');
      return NextResponse.json(
        { error: 'Missing blockchain configuration' },
        { status: 500 }
      );
    }

    const provider = new ethers.JsonRpcProvider(RPC_URL);
    const wallet = new ethers.Wallet(PRIVATE_KEY, provider);

    const contract = new ethers.Contract(
      CONTRACT_ADDRESS,
      CashbackRegistryABI.abi,
      wallet
    );

    // Appel à la fonction burnTicket du smart contract
    console.log('\n🔥 Calling contract.burnTicket...');
    console.log('   Function parameters:');
    console.log('   - code:', code);

    const tx = await contract.burnTicket(code);

    console.log('\n⏳ Transaction sent! Waiting for confirmation...');
    console.log('   Tx Hash:', tx.hash);
    console.log('   Nonce:', tx.nonce);
    console.log('   Gas Limit:', tx.gasLimit?.toString());

    const receipt = await tx.wait();

    console.log('\n✅ Transaction confirmed!');
    console.log('   Block Number:', receipt.blockNumber);
    console.log('   Block Hash:', receipt.blockHash);
    console.log('   Gas Used:', receipt.gasUsed?.toString());
    console.log('   Status:', receipt.status === 1 ? 'Success' : 'Failed');
    console.log('   Cumulative Gas Used:', receipt.cumulativeGasUsed?.toString());

    console.log('\n🎫 TICKET BURNED SUCCESSFULLY:');
    console.log('   Code:', code);
    console.log('   Transaction Hash:', receipt.hash);
    console.log('   Block Number:', receipt.blockNumber);
    console.log('   Gas Used:', receipt.gasUsed?.toString());
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    return NextResponse.json({
      success: true,
      txHash: receipt.hash,
      blockNumber: receipt.blockNumber,
      gasUsed: receipt.gasUsed?.toString(),
      ticketCode: code,
      message: 'Ticket burned successfully'
    });

  } catch (error: any) {
    console.error('❌ Error burning ticket:', error);
    console.error('❌ Error details:', {
      message: error.message,
      code: error.code,
      reason: error.reason,
      stack: error.stack
    });
    return NextResponse.json(
      { error: error.message || 'Failed to burn ticket' },
      { status: 500 }
    );
  }
}










