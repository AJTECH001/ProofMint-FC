/**
 * FilecoinWarmStorageService Integration
 * Advanced storage service with PDP verification and payment rails
 * Based on FilOzone/filecoin-services implementation
 */

import { ethers } from 'ethers';

export class FilecoinWarmStorageService {
  constructor() {
    this.contract = null;
    this.provider = null;
    this.signer = null;
    this.initialized = false;
    
    // FilecoinWarmStorageService contract address (Calibnet)
    this.contractAddress = '0xf49ba5eaCdFD5EE3744efEdf413791935FE4D4c5';
    
    // Contract ABI (simplified for core functions)
    this.contractABI = [
      "function createDataSet(string memory name, string memory description) external returns (uint256)",
      "function uploadData(uint256 dataSetId, bytes calldata data) external",
      "function verifyDataPossession(uint256 dataSetId) external view returns (bool)",
      "function getDataSetInfo(uint256 dataSetId) external view returns (tuple(string name, string description, uint256 createdAt, address owner))",
      "function payForStorage(uint256 amount) external payable",
      "function getStorageBalance() external view returns (uint256)",
      "event DataSetCreated(uint256 indexed dataSetId, address indexed owner, string name)",
      "event DataUploaded(uint256 indexed dataSetId, bytes32 indexed dataHash)",
      "event PaymentProcessed(address indexed payer, uint256 amount)"
    ];
  }

  /**
   * Initialize the service with wallet connection
   * @param {object} signer - Ethers signer from wallet
   */
  async initialize(signer) {
    try {
      console.log('🚀 Initializing FilecoinWarmStorageService...');
      
      this.signer = signer;
      this.provider = signer.provider;
      
      // Create contract instance
      this.contract = new ethers.Contract(
        this.contractAddress,
        this.contractABI,
        this.signer
      );
      
      // Verify contract is deployed
      const code = await this.provider.getCode(this.contractAddress);
      if (code === '0x') {
        throw new Error('FilecoinWarmStorageService contract not deployed');
      }
      
      this.initialized = true;
      console.log('✅ FilecoinWarmStorageService initialized successfully');
      
      // Get initial balance
      const balance = await this.getStorageBalance();
      console.log(`💰 Storage balance: ${balance} USDFC`);
      
      return true;
    } catch (error) {
      console.error('❌ Failed to initialize FilecoinWarmStorageService:', error);
      throw error;
    }
  }

  /**
   * Create a new data set for receipt storage
   * @param {string} name - Data set name
   * @param {string} description - Data set description
   * @returns {Promise<number>} Data set ID
   */
  async createDataSet(name, description) {
    if (!this.initialized) {
      throw new Error('Service not initialized');
    }

    try {
      console.log(`📦 Creating data set: ${name}`);
      
      const tx = await this.contract.createDataSet(name, description);
      const receipt = await tx.wait();
      
      // Extract data set ID from event
      const event = receipt.logs.find(log => {
        try {
          const parsed = this.contract.interface.parseLog(log);
          return parsed.name === 'DataSetCreated';
        } catch {
          return false;
        }
      });
      
      if (event) {
        const parsed = this.contract.interface.parseLog(event);
        const dataSetId = parsed.args.dataSetId.toNumber();
        console.log(`✅ Data set created with ID: ${dataSetId}`);
        return dataSetId;
      }
      
      throw new Error('Failed to extract data set ID from transaction');
    } catch (error) {
      console.error('❌ Failed to create data set:', error);
      throw error;
    }
  }

  /**
   * Upload receipt data with PDP verification
   * @param {number} dataSetId - Data set ID
   * @param {object} receiptData - Receipt data to store
   * @returns {Promise<string>} Data hash
   */
  async uploadReceiptData(dataSetId, receiptData) {
    if (!this.initialized) {
      throw new Error('Service not initialized');
    }

    try {
      console.log(`📤 Uploading receipt data to data set ${dataSetId}...`);
      
      // Ensure sufficient storage balance
      await this.ensureStorageFunds();
      
      // Prepare data for upload
      const jsonData = JSON.stringify(receiptData, null, 2);
      const dataBytes = ethers.toUtf8Bytes(jsonData);
      
      // Upload data to Filecoin with PDP verification
      const tx = await this.contract.uploadData(dataSetId, dataBytes);
      const receipt = await tx.wait();
      
      // Extract data hash from event
      const event = receipt.logs.find(log => {
        try {
          const parsed = this.contract.interface.parseLog(log);
          return parsed.name === 'DataUploaded';
        } catch {
          return false;
        }
      });
      
      if (event) {
        const parsed = this.contract.interface.parseLog(event);
        const dataHash = parsed.args.dataHash;
        console.log(`✅ Receipt data uploaded with hash: ${dataHash}`);
        return dataHash;
      }
      
      throw new Error('Failed to extract data hash from transaction');
    } catch (error) {
      console.error('❌ Failed to upload receipt data:', error);
      throw error;
    }
  }

  /**
   * Verify data possession for a data set
   * @param {number} dataSetId - Data set ID
   * @returns {Promise<boolean>} Verification result
   */
  async verifyDataPossession(dataSetId) {
    if (!this.initialized) {
      throw new Error('Service not initialized');
    }

    try {
      console.log(`🔍 Verifying data possession for data set ${dataSetId}...`);
      
      const isVerified = await this.contract.verifyDataPossession(dataSetId);
      console.log(`✅ Data possession verification: ${isVerified}`);
      
      return isVerified;
    } catch (error) {
      console.error('❌ Failed to verify data possession:', error);
      throw error;
    }
  }

  /**
   * Get data set information
   * @param {number} dataSetId - Data set ID
   * @returns {Promise<object>} Data set info
   */
  async getDataSetInfo(dataSetId) {
    if (!this.initialized) {
      throw new Error('Service not initialized');
    }

    try {
      const info = await this.contract.getDataSetInfo(dataSetId);
      
      return {
        name: info.name,
        description: info.description,
        createdAt: new Date(info.createdAt.toNumber() * 1000),
        owner: info.owner
      };
    } catch (error) {
      console.error('❌ Failed to get data set info:', error);
      throw error;
    }
  }

  /**
   * Pay for storage services
   * @param {number} amount - Amount in USDFC (wei)
   */
  async payForStorage(amount) {
    if (!this.initialized) {
      throw new Error('Service not initialized');
    }

    try {
      console.log(`💳 Paying ${ethers.formatEther(amount)} USDFC for storage...`);
      
      const tx = await this.contract.payForStorage(amount);
      const receipt = await tx.wait();
      
      console.log('✅ Storage payment processed');
      return receipt;
    } catch (error) {
      console.error('❌ Failed to pay for storage:', error);
      throw error;
    }
  }

  /**
   * Get current storage balance
   * @returns {Promise<string>} Balance in USDFC
   */
  async getStorageBalance() {
    if (!this.initialized) {
      throw new Error('Service not initialized');
    }

    try {
      const balance = await this.contract.getStorageBalance();
      return ethers.formatEther(balance);
    } catch (error) {
      console.error('❌ Failed to get storage balance:', error);
      return '0';
    }
  }

  /**
   * Ensure sufficient storage funds
   * @param {number} requiredAmount - Required amount in USDFC
   */
  async ensureStorageFunds(requiredAmount = ethers.parseEther('10')) {
    try {
      const currentBalance = await this.getStorageBalance();
      const balanceWei = ethers.parseEther(currentBalance);
      
      if (balanceWei < requiredAmount) {
        console.log(`💳 Insufficient storage balance. Depositing ${ethers.formatEther(requiredAmount)} USDFC...`);
        await this.payForStorage(requiredAmount);
      }
      
      return true;
    } catch (error) {
      console.error('❌ Failed to ensure storage funds:', error);
      throw error;
    }
  }

  /**
   * Create a complete receipt storage workflow
   * @param {object} receiptData - Receipt data
   * @returns {Promise<object>} Storage result with data set ID and hash
   */
  async storeReceiptWithPDP(receiptData) {
    try {
      // Create data set for this receipt
      const dataSetId = await this.createDataSet(
        `Receipt-${receiptData.receiptId}`,
        `Digital receipt for ${receiptData.items?.[0]?.name || 'product'}`
      );
      
      // Upload receipt data with PDP verification
      const dataHash = await this.uploadReceiptData(dataSetId, receiptData);
      
      // Verify data possession
      const isVerified = await this.verifyDataPossession(dataSetId);
      
      if (!isVerified) {
        throw new Error('PDP verification failed');
      }
      
      return {
        dataSetId,
        dataHash,
        verified: true,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error('❌ Failed to store receipt with PDP:', error);
      throw error;
    }
  }
}
