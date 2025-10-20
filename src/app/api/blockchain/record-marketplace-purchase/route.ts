import { NextRequest, NextResponse } from 'next/server';
import { ethers } from 'ethers';

// Import ABI
import CashbackRegistryABI from '../../../../../backend/artifacts/contracts/CashbackRegistry.sol/CashbackRegistryTest.json';

// Configuration du wallet de l'entreprise (côté serveur)
const PRIVATE_KEY = process.env.COMPANY_WALLET_PRIVATE_KEY || '';
const RPC_URL = process.env.RPC_URL || 'http://127.0.0.1:8545';
const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS || '';

export async function POST(request: NextRequest) {
  console.log('🔗 API: RECORD MARKETPLACE PURCHASE ON-CHAIN');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  
  try {
    const body = await request.json();
    const { 
      code, 
      buyerName, 
      buyerEmail, 
      beneficiary, 
      userId, 
      totalAmount,
      products 
    } = body;

    // Validation
    if (!code || !buyerName || !buyerEmail || !beneficiary || !userId || !totalAmount || !products) {
      return NextResponse.json(
        { error: 'Missing required fields: code, buyerName, buyerEmail, beneficiary, userId, totalAmount, products' },
        { status: 400 }
      );
    }

    // Vérifier la configuration blockchain
    if (!PRIVATE_KEY || !CONTRACT_ADDRESS) {
      console.error('❌ Missing blockchain configuration');
      console.error('   PRIVATE_KEY:', PRIVATE_KEY ? '✅ Set' : '❌ Missing');
      console.error('   CONTRACT_ADDRESS:', CONTRACT_ADDRESS ? '✅ Set' : '❌ Missing');
      return NextResponse.json(
        { error: 'Missing blockchain configuration' },
        { status: 500 }
      );
    }

    // Connexion au réseau avec le wallet de l'entreprise
    const provider = new ethers.JsonRpcProvider(RPC_URL);
    const wallet = new ethers.Wallet(PRIVATE_KEY, provider);
    
    // Créer l'instance du contrat
    const contract = new ethers.Contract(
      CONTRACT_ADDRESS,
      CashbackRegistryABI.abi,
      wallet
    );

    // Préparer les données des produits (convertir les prix en centimes - entier supérieur)
    const productNames = products.map((p: any) => p.name);
    const productQuantities = products.map((p: any) => p.quantity);
    const productPrices = products.map((p: any) => Math.ceil(p.price * 100)); // Convertir en centimes - entier supérieur

    // Enregistrer l'achat marketplace on-chain
    console.log('\n📝 Calling contract.recordMarketplacePurchase()...');
    console.log('   Function parameters:');
    console.log('   - code:', code);
    console.log('   - buyerName:', buyerName);
    console.log('   - buyerEmail:', buyerEmail);
    console.log('   - beneficiary:', beneficiary);
    console.log('   - userId:', userId);
    console.log('   - totalAmount:', totalAmount);
    console.log('   - products:', products.length, 'items');
    
    const tx = await contract.recordMarketplacePurchase(
      code,
      buyerName,
      buyerEmail,
      beneficiary,
      userId,
      Math.ceil(totalAmount * 100), // Convertir totalAmount en centimes - entier supérieur
      productNames,
      productQuantities,
      productPrices
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
    
    console.log('\n🎫 MARKETPLACE PURCHASE DETAILS:');
    console.log('   Code:', code);
    console.log('   User ID:', userId);
    console.log('   Total Amount:', totalAmount, 'centimes');
    console.log('   Beneficiary:', beneficiary);
    console.log('   Products:', products.length, 'items');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    return NextResponse.json({
      success: true,
      transactionHash: receipt.hash,
      blockNumber: receipt.blockNumber,
      gasUsed: receipt.gasUsed?.toString(),
      status: receipt.status === 1 ? 'Success' : 'Failed',
      couponCode: code,
      userId: userId,
      totalAmount: totalAmount,
      message: 'Marketplace purchase recorded successfully'
    });

  } catch (error: any) {
    console.error('❌ Error recording marketplace purchase:', error);
    console.error('❌ Error details:', {
      message: error.message,
      code: error.code,
      reason: error.reason,
      stack: error.stack
    });
    return NextResponse.json(
      { error: error.message || 'Failed to record marketplace purchase' },
      { status: 500 }
    );
  }
}
