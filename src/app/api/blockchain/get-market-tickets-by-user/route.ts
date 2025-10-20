import { NextRequest, NextResponse } from 'next/server';
import { ethers } from 'ethers';
import CashbackRegistryABI from '../../../../../backend/artifacts/contracts/CashbackRegistry.sol/CashbackRegistryTest.json';

const RPC_URL = process.env.RPC_URL || 'http://127.0.0.1:8545';
const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS || '';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ error: 'Missing userId parameter' }, { status: 400 });
    }

    const provider = new ethers.JsonRpcProvider(RPC_URL);
    const contract = new ethers.Contract(
      CONTRACT_ADDRESS,
      CashbackRegistryABI.abi,
      provider
    );

    console.log(`🎫 Getting marketplace tickets for userId: ${userId} using getMarketTicketsByUserId`);

    // Utiliser la nouvelle fonction getMarketTicketsByUserId
    console.log('📖 Calling contract.getMarketTicketsByUserId...');
    const result = await contract.getMarketTicketsByUserId(parseInt(userId));

    console.log('📋 Raw result from getMarketTicketsByUserId:', result);

    const codes = result[0];
    const buyerNames = result[1];
    const beneficiaries = result[2];
    const totalAmounts = result[3];
    const createdAts = result[4];
    const usedFlags = result[5];
    const productCounts = result[6];

    const tickets = codes.map((code: string, index: number) => ({
      code,
      buyerName: buyerNames[index],
      beneficiary: beneficiaries[index],
      totalAmount: totalAmounts[index].toString(),
      createdAt: new Date(Number(createdAts[index]) * 1000).toISOString(),
      used: usedFlags[index],
      productCount: Number(productCounts[index])
    }));

    console.log(`✅ Retrieved ${tickets.length} marketplace tickets for user ${userId}`);

    return NextResponse.json({
      success: true,
      userId: parseInt(userId),
      count: tickets.length,
      tickets
    });

  } catch (error: any) {
    console.error('❌ Error fetching marketplace tickets:', error);
    console.error('❌ Error details:', {
      message: error.message,
      code: error.code,
      reason: error.reason,
      stack: error.stack
    });
    return NextResponse.json(
      { error: error.message || 'Failed to fetch marketplace tickets' },
      { status: 500 }
    );
  }
}











