import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('🔍 API: VERIFY FLUTTERWAVE PAYMENT');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

  try {
    const body = await request.json();
    const { transaction_id, tx_ref } = body;

    console.log('🔍 Verifying transaction:');
    console.log('   Transaction ID:', transaction_id);
    console.log('   TX Ref:', tx_ref);

    // Simulation de vérification Flutterwave
    // En production, on ferait un appel à l'API Flutterwave
    const verificationResult = {
      status: 'successful',
      transaction_id: transaction_id,
      tx_ref: tx_ref,
      amount: 100.00, // Montant simulé
      currency: 'EUR',
      customer: {
        email: 'user@example.com',
        name: 'DCARD User'
      },
      created_at: new Date().toISOString(),
      payment_type: 'card',
      processor_response: 'Approved by financial institution'
    };

    console.log('✅ Payment verification successful');
    console.log('   Status:', verificationResult.status);
    console.log('   Amount:', verificationResult.amount, verificationResult.currency);

    // Si paiement validé → simuler la génération du coupon blockchain
    if (verificationResult.status === 'successful') {
      console.log('🎫 Generating blockchain coupon...');
      
      // Simulation de l'appel au smart contract
      const couponCode = `DCARD_${Date.now()}_${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
      
      console.log('✅ Coupon generated:', couponCode);
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

      return NextResponse.json({
        success: true,
        data: {
          payment: verificationResult,
          coupon: {
            code: couponCode,
            status: 'active',
            created_at: new Date().toISOString(),
            transaction_hash: `0x${Math.random().toString(16).substr(2, 64)}`
          }
        },
        message: 'Payment verified and coupon generated successfully'
      });
    } else {
      console.log('❌ Payment verification failed');
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

      return NextResponse.json({
        success: false,
        error: 'Payment verification failed'
      }, { status: 400 });
    }

  } catch (error: any) {
    console.error('\n❌ ERROR verifying Flutterwave payment:');
    console.error('   Message:', error.message);
    console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}
