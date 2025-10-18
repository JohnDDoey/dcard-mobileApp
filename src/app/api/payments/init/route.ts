import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('💳 API: INIT FLUTTERWAVE PAYMENT');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

  try {
    const body = await request.json();
    const { amount, email, currency = 'EUR', customer_name, phone_number } = body;

    console.log('📋 Payment details:');
    console.log('   Amount:', amount);
    console.log('   Email:', email);
    console.log('   Currency:', currency);
    console.log('   Customer:', customer_name);
    console.log('   Phone:', phone_number);

    // Configuration Flutterwave
    const flutterwaveConfig = {
      public_key: 'FLWPUBK_TEST-239c26e72045875ae9d37359a50c097b-X',
      tx_ref: `dcard_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      amount: parseFloat(amount),
      currency: currency,
      payment_options: 'card,mobilemoney,banktransfer',
      redirect_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/payments/callback`,
      customer: {
        email: email,
        phone_number: phone_number || '',
        name: customer_name || 'DCARD User'
      },
      customizations: {
        title: 'DCARD Money Transfer',
        description: 'Secure money transfer via DCARD',
        logo: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/logo.png`
      },
      meta: {
        source: 'dcard-mobile-app',
        transfer_id: `transfer_${Date.now()}`
      }
    };

    console.log('✅ Flutterwave config created');
    console.log('   Transaction ref:', flutterwaveConfig.tx_ref);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    return NextResponse.json({
      success: true,
      data: flutterwaveConfig,
      message: 'Payment initialized successfully'
    });

  } catch (error: any) {
    console.error('\n❌ ERROR initializing Flutterwave payment:');
    console.error('   Message:', error.message);
    console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}



