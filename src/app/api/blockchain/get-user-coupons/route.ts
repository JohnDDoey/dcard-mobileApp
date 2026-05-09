import { NextRequest, NextResponse } from 'next/server';
import { ethers } from 'ethers';

// Import ABI — ancien chemin artifact (référence conservée pour retour possible en local après `hardhat compile`).
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
      return NextResponse.json(
        { error: 'userId parameter is required' },
        { status: 400 }
      );
    }

    console.log(`🔍 Getting coupons for userId: ${userId} using getCouponsByUserId`);

    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/fcf01f36-71f7-454b-930c-070c8f7bb088',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'get-user-coupons/route.ts:22',message:'HYP-A: Contract address from env',data:{CONTRACT_ADDRESS,RPC_URL},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
    // #endregion

    // Connexion au contrat
    const provider = new ethers.JsonRpcProvider(RPC_URL);
    const contract = new ethers.Contract(
      CONTRACT_ADDRESS,
      CashbackRegistryABI.abi,
      provider
    );

    // 🔍 Vérifier si la fonction existe dans l'ABI
    const hasFunction = contract.interface.hasFunction('getCouponsByUserId');
    console.log('📋 Function exists in ABI:', hasFunction);
    
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/fcf01f36-71f7-454b-930c-070c8f7bb088',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'get-user-coupons/route.ts:33',message:'HYP-B: Function exists in ABI check',data:{hasFunction},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B'})}).catch(()=>{});
    // #endregion
    
    if (!hasFunction) {
      return NextResponse.json(
        { error: 'Function getCouponsByUserId not found in contract ABI. Please recompile the contract.' },
        { status: 500 }
      );
    }

    // 🔍 Vérifier le code du contrat déployé
    const contractCode = await provider.getCode(CONTRACT_ADDRESS);
    console.log('📋 Contract has code:', contractCode !== '0x' ? '✅ Yes' : '❌ No');
    console.log('📋 Contract address:', CONTRACT_ADDRESS);
    
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/fcf01f36-71f7-454b-930c-070c8f7bb088',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'get-user-coupons/route.ts:52',message:'HYP-C: Contract code check result',data:{address:CONTRACT_ADDRESS,hasCode:contractCode!=='0x',codeLength:contractCode.length},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'C'})}).catch(()=>{});
    
    // Test direct : essayer d'appeler une fonction simple pour voir si le contrat répond
    // Même si getCode() retourne 0x, le contrat peut exister (problème avec getCode())
    try {
      const testEncoded = contract.interface.encodeFunctionData('isValidCashbackCode', ['TEST']);
      const testResult = await provider.call({ to: CONTRACT_ADDRESS, data: testEncoded });
      fetch('http://127.0.0.1:7242/ingest/fcf01f36-71f7-454b-930c-070c8f7bb088',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'get-user-coupons/route.ts:60',message:'HYP-C: Direct call test to contract',data:{testResult,is0x:testResult==='0x',canCallContract:testResult!=='0x',resultLength:testResult?.length},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'C'})}).catch(()=>{});
    } catch (testErr: any) {
      fetch('http://127.0.0.1:7242/ingest/fcf01f36-71f7-454b-930c-070c8f7bb088',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'get-user-coupons/route.ts:60',message:'HYP-C: Direct call test failed',data:{testError:testErr.message},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'C'})}).catch(()=>{});
    }
    // #endregion
    
    // Ne pas retourner d'erreur si getCode() retourne 0x - continuer et tester l'appel direct
    // car recordCashbackWithCode fonctionne, donc le contrat existe

    // Utiliser la fonction getCouponsByUserId
    console.log('📖 Calling contract.getCouponsByUserId...');
    
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/fcf01f36-71f7-454b-930c-070c8f7bb088',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'get-user-coupons/route.ts:65',message:'HYP-D: Before calling getCouponsByUserId',data:{userId:parseInt(userId),contractAddress:CONTRACT_ADDRESS,hasFunction},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'D'})}).catch(()=>{});
    // #endregion
    
    let result;
    try {
      result = await contract.getCouponsByUserId(parseInt(userId));
      console.log('📋 Raw result from getCouponsByUserId:', result);
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/fcf01f36-71f7-454b-930c-070c8f7bb088',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'get-user-coupons/route.ts:70',message:'HYP-D: Success - getCouponsByUserId result',data:{resultLength:result?.length,codesLength:result?.[0]?.length},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'D'})}).catch(()=>{});
      // #endregion
    } catch (decodeError: any) {
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/fcf01f36-71f7-454b-930c-070c8f7bb088',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'get-user-coupons/route.ts:74',message:'HYP-D/E: Error calling getCouponsByUserId',data:{errorCode:decodeError.code,errorValue:decodeError.value,errorMessage:decodeError.message},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'D,E'})}).catch(()=>{});
      // #endregion
      // Si erreur de décodage (0x), cela peut signifier que l'utilisateur n'a pas de coupons
      // ou que la fonction n'existe pas dans le contrat déployé
      if (decodeError.code === 'BAD_DATA' || decodeError.message?.includes('could not decode result data')) {
        console.log('⚠️ BAD_DATA error - Contract may not have this function or user has no coupons');
        console.log('   Error value:', decodeError.value);
        console.log('   This usually means the deployed contract does not have getCouponsByUserId function');
        
        // #region agent log
        // Test direct avec provider.call pour voir la réponse brute
        try {
          const encodedCall = contract.interface.encodeFunctionData('getCouponsByUserId', [parseInt(userId)]);
          const rawCallResult = await provider.call({ to: CONTRACT_ADDRESS, data: encodedCall });
          fetch('http://127.0.0.1:7242/ingest/fcf01f36-71f7-454b-930c-070c8f7bb088',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'get-user-coupons/route.ts:74',message:'HYP-E: Raw call result when BAD_DATA occurs',data:{rawResult:rawCallResult,is0x:rawCallResult==='0x'},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'E'})}).catch(()=>{});
        } catch (callErr: any) {
          fetch('http://127.0.0.1:7242/ingest/fcf01f36-71f7-454b-930c-070c8f7bb088',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'get-user-coupons/route.ts:74',message:'HYP-E: Raw call failed',data:{callError:callErr.message},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'E'})}).catch(()=>{});
        }
        // #endregion
        
        return NextResponse.json({
          success: true,
          userId: parseInt(userId),
          count: 0,
          coupons: [],
          warning: 'Function may not exist in deployed contract. Please verify contract deployment.'
        });
      }
      throw decodeError;
    }
    
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
