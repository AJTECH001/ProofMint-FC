import { Synapse, RPC_URLS } from '@filoz/synapse-sdk';
import { ethers } from 'ethers';

/**
 * FilecoinStorage utility for storing receipt metadata using Synapse SDK
 * Demonstrates real-world usage of Filecoin for decentralized storage
 */
export class FilecoinStorage {
  constructor() {
    this.synapse = null;
    this.initialized = false;
  }

  /**
   * Initialize Synapse SDK with wallet connection
   * @param {object} signer - Ethers signer from wallet
   */
  async initialize(signer) {
    try {
      console.log('🚀 Initializing Filecoin storage with Synapse SDK...');
      
      this.synapse = await Synapse.create({
        signer,
        rpcURL: RPC_URLS.calibration.websocket,
        withCDN: true // Enable CDN for faster retrieval
      });

      this.initialized = true;
      console.log('✅ Filecoin storage initialized successfully');
      return true;
    } catch (error) {
      console.error('❌ Failed to initialize Filecoin storage:', error);
      throw error;
    }
  }

  /**
   * Store receipt metadata on Filecoin using PDP (Proof of Data Possession)
   * @param {object} receiptData - Receipt metadata to store
   * @returns {string} IPFS hash of stored data
   */
  async storeReceiptMetadata(receiptData) {
    if (!this.initialized) {
      throw new Error('FilecoinStorage not initialized. Call initialize() first.');
    }

    try {
      console.log('📦 Storing receipt metadata on Filecoin...', receiptData);

      // Prepare receipt metadata for storage
      const metadata = {
        version: "1.0",
        type: "ProofMint Digital Receipt",
        createdAt: new Date().toISOString(),
        ...receiptData,
        sustainability: {
          carbonFootprint: this.calculateCarbonFootprint(receiptData),
          recyclabilityScore: this.calculateRecyclabilityScore(receiptData),
          ...receiptData.sustainability
        }
      };

      // Convert to JSON and then to Uint8Array for storage
      const jsonData = JSON.stringify(metadata, null, 2);
      const dataBuffer = new TextEncoder().encode(jsonData);

      console.log(`📊 Storing ${dataBuffer.length} bytes of receipt data...`);

      // Store on Filecoin with PDP verification
      const uploadResult = await this.synapse.storage.upload(dataBuffer);
      
      console.log('✅ Receipt stored on Filecoin!');
      console.log(`📍 PieceCID: ${uploadResult.pieceCid}`);
      console.log(`📏 Size: ${uploadResult.size} bytes`);

      // Return the IPFS-compatible hash for NFT metadata
      return `ipfs://${uploadResult.pieceCid}`;

    } catch (error) {
      console.error('❌ Failed to store receipt metadata:', error);
      throw new Error(`Filecoin storage failed: ${error.message}`);
    }
  }

  /**
   * Retrieve receipt metadata from Filecoin
   * @param {string} ipfsHash - IPFS hash or PieceCID
   * @returns {object} Receipt metadata
   */
  async retrieveReceiptMetadata(ipfsHash) {
    if (!this.initialized) {
      throw new Error('FilecoinStorage not initialized. Call initialize() first.');
    }

    try {
      // Extract PieceCID from IPFS URI
      const pieceCid = ipfsHash.replace('ipfs://', '');
      console.log(`🔍 Retrieving receipt from Filecoin: ${pieceCid}`);

      // Download from Filecoin with CDN acceleration
      const data = await this.synapse.storage.download(pieceCid);
      
      // Convert back to JSON
      const jsonString = new TextDecoder().decode(data);
      const metadata = JSON.parse(jsonString);

      console.log('✅ Receipt retrieved successfully');
      return metadata;

    } catch (error) {
      console.error('❌ Failed to retrieve receipt metadata:', error);
      throw new Error(`Filecoin retrieval failed: ${error.message}`);
    }
  }

  /**
   * Check storage balance and deposit funds if needed
   */
  async ensureStorageFunds() {
    try {
      let balanceInfo;
      try {
        balanceInfo = await this.synapse.payments.accountInfo();
      } catch (contractError) {
        console.warn('⚠️ Cannot access payment contract, skipping balance check');
        return true; // Continue with storage operations
      }

      const requiredBalance = ethers.parseUnits('10', 18); // 10 USDFC
      
      console.log(`💰 Current balance: ${balanceInfo.availableFunds} USDFC`);

      if (balanceInfo.availableFunds < requiredBalance) {
        console.log('💳 Insufficient balance, depositing funds...');
        
        try {
          const depositTx = await this.synapse.payments.deposit(requiredBalance);
          await depositTx.wait();
          console.log('✅ Funds deposited successfully');
        } catch (depositError) {
          console.warn('⚠️ Could not deposit funds automatically:', depositError.message);
          console.log('💡 Please deposit funds manually through the Filecoin wallet');
        }
      }

      return true;
    } catch (error) {
      console.error('❌ Failed to ensure storage funds:', error);
      return false;
    }
  }

  /**
   * Get storage statistics with fallback handling
   */
  async getStorageStats() {
    try {
      // Try to get network info first (less likely to fail)
      let network = 'calibration';
      try {
        network = await this.synapse.getNetwork();
      } catch (networkError) {
        console.warn('⚠️ Could not fetch network info, using default:', networkError.message);
      }

      // Try to get balance info with fallback
      let balanceInfo = { availableFunds: '0', lockupFunds: '0' };
      try {
        balanceInfo = await this.synapse.payments.accountInfo();
      } catch (balanceError) {
        console.warn('⚠️ Could not fetch balance info, using defaults:', balanceError.message);
      }
      
      return {
        network,
        balance: balanceInfo.availableFunds?.toString() || '0',
        lockupFunds: balanceInfo.lockupFunds?.toString() || '0',
        initialized: this.initialized
      };
    } catch (error) {
      console.error('❌ Failed to get storage stats:', error);
      // Return basic info even if everything fails
      return {
        network: 'calibration',
        balance: '0',
        lockupFunds: '0',
        initialized: this.initialized
      };
    }
  }

  /**
   * Calculate estimated carbon footprint (simplified)
   * @param {object} receiptData - Receipt data
   * @returns {string} Carbon footprint estimate
   */
  calculateCarbonFootprint(receiptData) {
    // Simplified calculation based on product type and price
    const baseFootprint = 2.5; // kg CO2eq
    const priceMultiplier = Math.log10(receiptData.totalAmount || 100) / 2;
    
    return `${(baseFootprint * priceMultiplier).toFixed(2)}kg CO2eq`;
  }

  /**
   * Calculate recyclability score (simplified)
   * @param {object} receiptData - Receipt data
   * @returns {number} Recyclability score (0-100)
   */
  calculateRecyclabilityScore(receiptData) {
    // Simplified scoring based on product categories
    const categoryScores = {
      'electronics': 85,
      'smartphone': 75,
      'laptop': 80,
      'tablet': 70,
      'headphones': 65,
      'default': 60
    };

    const category = receiptData.items?.[0]?.category?.toLowerCase() || 'default';
    return categoryScores[category] || categoryScores.default;
  }

  /**
   * Create sample receipt data for demo
   */
  static createSampleReceipt(overrides = {}) {
    return {
      receiptId: `PMR-${Date.now()}`,
      merchantInfo: {
        name: "TechHub Electronics",
        address: "123 Innovation Blvd, San Francisco, CA",
        taxId: "EIN-12-3456789",
        ...overrides.merchantInfo
      },
      purchaseDetails: {
        timestamp: new Date().toISOString(),
        totalAmount: 899.99,
        currency: "USD",
        paymentMethod: "Credit Card",
        ...overrides.purchaseDetails
      },
      items: [
        {
          name: "iPhone 15 Pro",
          category: "smartphone",
          brand: "Apple",
          model: "A2484",
          serialNumber: "F2LW8QHQP3GX",
          price: 899.99,
          warranty: "1 year manufacturer warranty",
          ...overrides.items?.[0]
        }
      ],
      sustainability: {
        eWasteInfo: {
          properDisposal: "Authorized recycling center required",
          hazardousMaterials: ["Lithium battery", "Rare earth elements"],
          recyclingInstructions: "Remove battery before recycling"
        },
        ...overrides.sustainability
      },
      ...overrides
    };
  }
}