import { FilecoinStorage } from './filecoinStorage'

/**
 * Demo utility functions for ProofMint MVP
 * Demonstrates real Filecoin storage capabilities
 */

export class ProofMintDemo {
  constructor(signer) {
    this.signer = signer
    this.filecoinStorage = null
  }

  async initialize() {
    try {
      console.log('🚀 Initializing ProofMint Demo...')
      
      this.filecoinStorage = new FilecoinStorage()
      await this.filecoinStorage.initialize(this.signer)
      
      console.log('✅ Demo initialized successfully')
      return true
    } catch (error) {
      console.error('❌ Demo initialization failed:', error)
      throw error
    }
  }

  /**
   * Demo flow: Merchant issues a digital receipt
   */
  async demonstrateMerchantFlow() {
    console.log('\n📋 === MERCHANT DEMO FLOW ===')
    
    try {
      // 1. Create sample receipt data
      const receiptData = FilecoinStorage.createSampleReceipt({
        merchantInfo: {
          name: "Demo Electronics Store",
          address: "123 Innovation Blvd, San Francisco, CA",
        },
        items: [{
          name: "iPhone 15 Pro Demo",
          category: "smartphone",
          price: 899.99,
          serialNumber: `DEMO${Date.now()}`
        }]
      })

      console.log('📦 Created receipt metadata:', {
        merchant: receiptData.merchantInfo.name,
        product: receiptData.items[0].name,
        price: receiptData.items[0].price,
        sustainability: receiptData.sustainability
      })

      // 2. Store on Filecoin
      console.log('🌐 Storing receipt metadata on Filecoin...')
      const ipfsHash = await this.filecoinStorage.storeReceiptMetadata(receiptData)
      
      console.log('✅ Receipt stored successfully!')
      console.log(`📍 IPFS Hash: ${ipfsHash}`)

      // 3. Simulate NFT minting (would call smart contract in real implementation)
      console.log('🎭 Minting NFT receipt (simulated)...')
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      const tokenId = Math.floor(Math.random() * 10000)
      console.log(`✅ NFT minted with Token ID: ${tokenId}`)

      return {
        tokenId,
        ipfsHash,
        receiptData,
        success: true
      }

    } catch (error) {
      console.error('❌ Merchant flow failed:', error)
      throw error
    }
  }

  /**
   * Demo flow: Consumer views receipt details
   */
  async demonstrateConsumerFlow(ipfsHash) {
    console.log('\n👤 === CONSUMER DEMO FLOW ===')
    
    try {
      console.log('🔍 Retrieving receipt from Filecoin...')
      const receiptData = await this.filecoinStorage.retrieveReceiptMetadata(ipfsHash)
      
      console.log('✅ Receipt retrieved successfully!')
      console.log('📋 Receipt Details:')
      console.log(`   Product: ${receiptData.items[0].name}`)
      console.log(`   Merchant: ${receiptData.merchantInfo.name}`)
      console.log(`   Price: $${receiptData.items[0].price}`)
      console.log(`   Carbon Footprint: ${receiptData.sustainability.carbonFootprint}`)
      console.log(`   Recyclability: ${receiptData.sustainability.recyclabilityScore}%`)

      // Simulate status update
      console.log('🔄 Updating gadget status...')
      await new Promise(resolve => setTimeout(resolve, 1000))
      console.log('✅ Status updated to: Active')

      return {
        receiptData,
        success: true
      }

    } catch (error) {
      console.error('❌ Consumer flow failed:', error)
      throw error
    }
  }

  /**
   * Demo flow: Full end-to-end demonstration
   */
  async runFullDemo() {
    console.log('\n🎬 === FULL PROOFMINT DEMO ===')
    console.log('Demonstrating complete digital receipt lifecycle on Filecoin\n')

    try {
      // Initialize storage
      await this.initialize()

      // Merchant issues receipt
      const merchantResult = await this.demonstrateMerchantFlow()
      
      // Consumer retrieves receipt
      const consumerResult = await this.demonstrateConsumerFlow(merchantResult.ipfsHash)

      // Show final summary
      console.log('\n📊 === DEMO SUMMARY ===')
      console.log('✅ All flows completed successfully!')
      console.log(`📋 Receipt NFT Token ID: ${merchantResult.tokenId}`)
      console.log(`🌐 Filecoin Storage Hash: ${merchantResult.ipfsHash}`)
      console.log(`♻️  Recyclability Score: ${consumerResult.receiptData.sustainability.recyclabilityScore}%`)
      console.log(`🌱 Carbon Footprint: ${consumerResult.receiptData.sustainability.carbonFootprint}`)

      // Get storage stats
      const stats = await this.filecoinStorage.getStorageStats()
      console.log('\n💾 Filecoin Storage Stats:')
      console.log(`   Network: ${stats.network}`)
      console.log(`   Balance: ${stats.balance} USDFC`)
      console.log(`   Status: ${stats.initialized ? 'Ready' : 'Not Ready'}`)

      return {
        success: true,
        merchantResult,
        consumerResult,
        stats
      }

    } catch (error) {
      console.error('❌ Full demo failed:', error)
      throw error
    }
  }

  /**
   * Validate Filecoin integration
   */
  async validateFilecoinIntegration() {
    console.log('\n🔍 === FILECOIN INTEGRATION VALIDATION ===')
    
    try {
      if (!this.filecoinStorage) {
        await this.initialize()
      }

      // Test storage stats
      const stats = await this.filecoinStorage.getStorageStats()
      console.log('📊 Storage Stats Retrieved:', stats)

      // Test small data upload
      const testData = FilecoinStorage.createSampleReceipt()
      const ipfsHash = await this.filecoinStorage.storeReceiptMetadata(testData)
      console.log('📤 Test Upload Successful:', ipfsHash)

      // Test data retrieval
      const retrievedData = await this.filecoinStorage.retrieveReceiptMetadata(ipfsHash)
      console.log('📥 Test Retrieval Successful')

      // Validate data integrity
      const originalJson = JSON.stringify(testData, null, 2)
      const retrievedJson = JSON.stringify(retrievedData, null, 2)
      const dataIntact = originalJson === retrievedJson
      
      console.log(`🔐 Data Integrity: ${dataIntact ? 'VERIFIED ✅' : 'FAILED ❌'}`)

      console.log('\n✅ Filecoin integration validation complete!')
      
      return {
        success: true,
        stats,
        dataIntegrity: dataIntact,
        testUploadHash: ipfsHash
      }

    } catch (error) {
      console.error('❌ Validation failed:', error)
      throw error
    }
  }
}

/**
 * Quick demo launcher for browser console
 */
export const launchDemo = async (signer) => {
  const demo = new ProofMintDemo(signer)
  return await demo.runFullDemo()
}

/**
 * Quick validation launcher
 */
export const validateIntegration = async (signer) => {
  const demo = new ProofMintDemo(signer)
  return await demo.validateFilecoinIntegration()
}