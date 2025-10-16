import { NextRequest, NextResponse } from 'next/server';

// Cache pour les taux de change (1 heure)
let cachedRates: any = null;
let lastFetchTime = 0;
const CACHE_DURATION = 60 * 60 * 1000; // 1 heure en millisecondes

export async function GET(request: NextRequest) {
  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('💱 API: GET EXCHANGE RATES');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

  try {
    const now = Date.now();
    
    // Vérifier si on a des données en cache et si elles sont encore valides
    if (cachedRates && (now - lastFetchTime) < CACHE_DURATION) {
      console.log('✅ Returning cached exchange rates');
      console.log('   Cache age:', Math.round((now - lastFetchTime) / 1000 / 60), 'minutes');
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
      
      return NextResponse.json({
        success: true,
        data: cachedRates,
        cached: true,
        cacheAge: Math.round((now - lastFetchTime) / 1000 / 60)
      });
    }

    // Sinon, récupérer de nouvelles données
    console.log('📡 Fetching fresh exchange rates from API...');
    
    const response = await fetch('https://api.exchangerate-api.com/v4/latest/EUR', {
      next: { revalidate: 3600 } // Cache Next.js de 1 heure
    });

    if (!response.ok) {
      throw new Error(`Exchange rate API error: ${response.status}`);
    }

    const data = await response.json();
    
    console.log('✅ Exchange rates fetched successfully');
    console.log('   Base currency:', data.base);
    console.log('   Number of rates:', Object.keys(data.rates).length);
    console.log('   Sample rates:');
    console.log('     - XAF (Franc CFA):', data.rates.XAF);
    console.log('     - XOF (Franc CFA Ouest):', data.rates.XOF);
    console.log('     - KMF (Franc Comorien):', data.rates.KMF);
    console.log('     - MAD (Dirham Marocain):', data.rates.MAD);
    console.log('     - TND (Dinar Tunisien):', data.rates.TND);
    console.log('     - MGA (Ariary Malgache):', data.rates.MGA);

    // Mettre à jour le cache
    cachedRates = {
      base: data.base,
      rates: data.rates,
      lastUpdated: new Date(data.time_last_updated).toISOString()
    };
    lastFetchTime = now;

    console.log('💾 Rates cached for 1 hour');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    return NextResponse.json({
      success: true,
      data: cachedRates,
      cached: false
    });

  } catch (error: any) {
    console.error('\n❌ ERROR fetching exchange rates:');
    console.error('   Message:', error.message);
    console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    // Si on a des données en cache (même anciennes), les retourner
    if (cachedRates) {
      console.log('⚠️ Using stale cache data due to API error');
      return NextResponse.json({
        success: true,
        data: cachedRates,
        cached: true,
        stale: true,
        error: error.message
      });
    }

    // Sinon, retourner des taux de fallback (anciens taux fixes)
    const fallbackRates = {
      base: 'EUR',
      rates: {
        DZD: 135.5,    // Dinar Algérien
        XAF: 655.957,  // Franc CFA (Afrique Centrale)
        XOF: 655.957,  // Franc CFA (Afrique de l'Ouest)
        KMF: 491.968,  // Franc Comorien
        MAD: 10.8,     // Dirham Marocain
        TND: 3.35,     // Dinar Tunisien
        MGA: 4900,     // Ariary Malgache
        EUR: 1
      },
      lastUpdated: new Date().toISOString()
    };

    console.log('⚠️ Using fallback rates');
    
    return NextResponse.json({
      success: true,
      data: fallbackRates,
      fallback: true,
      error: error.message
    }, { status: 200 });
  }
}

