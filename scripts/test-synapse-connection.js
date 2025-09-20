import { Synapse, RPC_URLS } from '@filoz/synapse-sdk';

async function testSynapseConnection() {
  console.log('🧪 Testing Synapse SDK connection...');
  
  try {
    // Initialize Synapse SDK
    const synapse = await Synapse.create({
      rpcURL: RPC_URLS.calibration.websocket,
      withCDN: true
    });
    
    console.log('✅ Synapse SDK initialized successfully');
    
    // Test getting network info
    const network = await synapse.getNetwork();
    console.log('🌐 Network:', network);
    
    // Test getting payment contracts
    const paymentContracts = await synapse.getPaymentContracts();
    console.log('💳 Payment contracts:', Object.keys(paymentContracts));
    
    // Test getting storage providers
    const providers = await synapse.getStorageProviders();
    console.log('🖥️ Storage providers count:', providers.length);
    
    console.log('\n🎉 Synapse SDK connection test completed successfully!');
    
  } catch (error) {
    console.error('❌ Synapse SDK connection test failed:', error.message);
    console.error('Error stack:', error.stack);
  }
}

testSynapseConnection().catch(console.error);