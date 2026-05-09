import { NextRequest, NextResponse } from 'next/server';
import { ethers } from 'ethers';
// Ancien import artifact Hardhat (non versionné — référence conservée).
// import CashbackRegistryABI from '../../../../../backend/artifacts/contracts/CashbackRegistry.sol/CashbackRegistryTest.json';
import CashbackRegistryABI from '@/contracts/abi/CashbackRegistry.json';
import addressJson from "@/contracts/contractAddress.json";

const RPC_URL = process.env.RPC_URL || 'http://127.0.0.1:8545';
const CONTRACT_ADDRESS = addressJson.CashbackRegistry;

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
    
    let result;
    try {
      result = await contract.getMarketTicketsByUserId(parseInt(userId));
      console.log('📋 Raw result from getMarketTicketsByUserId:', result);
    } catch (decodeError: any) {
      // Si erreur de décodage (0x), cela peut signifier que l'utilisateur n'a pas de tickets
      // ou que la fonction n'existe pas dans le contrat déployé
      if (decodeError.code === 'BAD_DATA' || decodeError.message?.includes('could not decode result data')) {
        console.log('⚠️ BAD_DATA error - Contract may not have this function or user has no tickets');
        console.log('   Error value:', decodeError.value);
        console.log('   Returning empty array');
        return NextResponse.json({
          success: true,
          userId: parseInt(userId),
          count: 0,
          tickets: []
        });
      }
      throw decodeError;
    }

    // Vérifier si le résultat est valide
    if (!result || result.length < 7) {
      console.log('ℹ️ Invalid result format, returning empty array');
      return NextResponse.json({
        success: true,
        userId: parseInt(userId),
        count: 0,
        tickets: []
      });
    }
    
    const codes = result[0] || [];
    const buyerNames = result[1] || [];
    const beneficiaries = result[2] || [];
    const totalAmounts = result[3] || [];
    const createdAts = result[4] || [];
    const usedFlags = result[5] || [];
    const productCounts = result[6] || [];
    
    // Si aucun code, retourner un tableau vide
    if (!codes || codes.length === 0) {
      console.log(`ℹ️ No tickets found for user ${userId}`);
      return NextResponse.json({
        success: true,
        userId: parseInt(userId),
        count: 0,
        tickets: []
      });
    }

    const tickets = codes.map((code: string, index: number) => ({
      code,
      buyerName: buyerNames[index] || '',
      beneficiary: beneficiaries[index] || '',
      totalAmount: totalAmounts[index]?.toString() || '0',
      createdAt: new Date(Number(createdAts[index] || 0) * 1000).toISOString(),
      used: usedFlags[index] || false,
      productCount: Number(productCounts[index] || 0)
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











