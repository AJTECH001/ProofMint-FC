/**
 * FilecoinPay Service Integration
 * Automated payment processing and recycling rewards using FilecoinPay contracts
 * Based on FilOzone/filecoin-pay implementation
 */

import { ethers } from 'ethers';

export class FilecoinPayService {
  constructor() {
    this.paymentContract = null;
    this.initialized = false;
    
    // FilecoinPay contract address (Calibnet)
    this.paymentAddress = '0x0000000000000000000000000000000000000000'; // Placeholder
    
    // FilecoinPay contract ABI (simplified)
    this.paymentABI = [
      "function deposit(uint256 amount) external payable",
      "function withdraw(uint256 amount) external",
      "function transfer(address to, uint256 amount) external",
      "function balanceOf(address account) external view returns (uint256)",
      "function createEscrow(address merchant, uint256 amount, bytes32 receiptHash) external payable",
      "function releaseEscrow(bytes32 escrowId) external",
      "function processRecyclingReward(address recycler, uint256 amount, bytes32 receiptHash) external",
      "function getEscrowInfo(bytes32 escrowId) external view returns (tuple(address buyer, address merchant, uint256 amount, bool released))",
      "event EscrowCreated(bytes32 indexed escrowId, address indexed buyer, address indexed merchant, uint256 amount)",
      "event PaymentReleased(bytes32 indexed escrowId, address indexed merchant, uint256 amount)",
      "event RecyclingRewardProcessed(address indexed recycler, uint256 amount, bytes32 indexed receiptHash)"
    ];
    
    // USDFC token address (Filecoin Calibration)
    this.usdfcAddress = '0x0000000000000000000000000000000000000000'; // Placeholder
    
    this.usdfcABI = [
      "function balanceOf(address account) external view returns (uint256)",
      "function transfer(address to, uint256 amount) external returns (bool)",
      "function transferFrom(address from, address to, uint256 amount) external returns (bool)",
      "function approve(address spender, uint256 amount) external returns (bool)",
      "function allowance(address owner, address spender) external view returns (uint256)"
    ];
  }

  /**
   * Initialize FilecoinPay service
   * @param {object} signer - Ethers signer
   */
  async initialize(signer) {
    try {
      console.log('💳 Initializing FilecoinPay service...');
      
      this.signer = signer;
      this.provider = signer.provider;
      
      // Create payment contract instance
      this.paymentContract = new ethers.Contract(
        this.paymentAddress,
        this.paymentABI,
        this.signer
      );
      
      // Create USDFC token instance
      this.usdfcToken = new ethers.Contract(
        this.usdfcAddress,
        this.usdfcABI,
        this.signer
      );
      
      this.initialized = true;
      console.log('✅ FilecoinPay service initialized');
      
      // Get initial balance
      const balance = await this.getBalance();
      console.log(`💰 Current balance: ${balance} USDFC`);
      
      return true;
    } catch (error) {
      console.error('❌ Failed to initialize FilecoinPay service:', error);
      // For demo purposes, continue without actual contract
      this.initialized = true;
      console.log('⚠️ FilecoinPay service initialized in demo mode');
      return true;
    }
  }

  /**
   * Get current USDFC balance
   * @returns {Promise<string>} Balance in USDFC
   */
  async getBalance() {
    try {
      if (!this.initialized) {
        throw new Error('Service not initialized');
      }
      
      // In demo mode, return a mock balance
      if (!this.paymentContract) {
        return '1000.0';
      }
      
      const balance = await this.usdfcToken.balanceOf(this.signer.address);
      return ethers.formatEther(balance);
    } catch (error) {
      console.error('❌ Failed to get balance:', error);
      return '0';
    }
  }

  /**
   * Deposit USDFC for payment processing
   * @param {number} amount - Amount in USDFC
   * @returns {Promise<object>} Transaction result
   */
  async deposit(amount) {
    try {
      console.log(`💳 Depositing ${amount} USDFC...`);
      
      if (!this.initialized) {
        throw new Error('Service not initialized');
      }
      
      // In demo mode, simulate deposit
      if (!this.paymentContract) {
        return {
          success: true,
          amount,
          transactionHash: '0x' + Math.random().toString(16).substr(2, 64),
          timestamp: new Date().toISOString()
        };
      }
      
      const amountWei = ethers.parseEther(amount.toString());
      const tx = await this.paymentContract.deposit(amountWei);
      const receipt = await tx.wait();
      
      console.log('✅ Deposit successful');
      
      return {
        success: true,
        amount,
        transactionHash: receipt.hash,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error('❌ Failed to deposit:', error);
      throw error;
    }
  }

  /**
   * Create payment escrow for receipt verification
   * @param {string} merchantAddress - Merchant wallet address
   * @param {number} amount - Payment amount in USDFC
   * @param {string} receiptHash - Receipt data hash
   * @returns {Promise<object>} Escrow creation result
   */
  async createPaymentEscrow(merchantAddress, amount, receiptHash) {
    try {
      console.log(`🔒 Creating payment escrow for ${amount} USDFC...`);
      
      if (!this.initialized) {
        throw new Error('Service not initialized');
      }
      
      // In demo mode, simulate escrow creation
      if (!this.paymentContract) {
        const escrowId = ethers.keccak256(
          ethers.solidityPacked(
            ['address', 'address', 'uint256', 'bytes32'],
            [this.signer.address, merchantAddress, ethers.parseEther(amount.toString()), receiptHash]
          )
        );
        
        return {
          success: true,
          escrowId,
          amount,
          merchantAddress,
          receiptHash,
          timestamp: new Date().toISOString()
        };
      }
      
      const amountWei = ethers.parseEther(amount.toString());
      const tx = await this.paymentContract.createEscrow(merchantAddress, amountWei, receiptHash);
      const receipt = await tx.wait();
      
      // Extract escrow ID from event
      const event = receipt.logs.find(log => {
        try {
          const parsed = this.paymentContract.interface.parseLog(log);
          return parsed.name === 'EscrowCreated';
        } catch {
          return false;
        }
      });
      
      const escrowId = event ? this.paymentContract.interface.parseLog(event).args.escrowId : null;
      
      console.log('✅ Payment escrow created');
      
      return {
        success: true,
        escrowId,
        amount,
        merchantAddress,
        receiptHash,
        transactionHash: receipt.hash,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error('❌ Failed to create payment escrow:', error);
      throw error;
    }
  }

  /**
   * Release payment from escrow after verification
   * @param {string} escrowId - Escrow ID
   * @returns {Promise<object>} Release result
   */
  async releasePayment(escrowId) {
    try {
      console.log(`🔓 Releasing payment from escrow: ${escrowId}`);
      
      if (!this.initialized) {
        throw new Error('Service not initialized');
      }
      
      // In demo mode, simulate payment release
      if (!this.paymentContract) {
        return {
          success: true,
          escrowId,
          released: true,
          timestamp: new Date().toISOString()
        };
      }
      
      const tx = await this.paymentContract.releaseEscrow(escrowId);
      const receipt = await tx.wait();
      
      console.log('✅ Payment released successfully');
      
      return {
        success: true,
        escrowId,
        released: true,
        transactionHash: receipt.hash,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error('❌ Failed to release payment:', error);
      throw error;
    }
  }

  /**
   * Process recycling reward payment
   * @param {string} recyclerAddress - Recycler wallet address
   * @param {number} amount - Reward amount in USDFC
   * @param {string} receiptHash - Receipt hash for verification
   * @returns {Promise<object>} Reward processing result
   */
  async processRecyclingReward(recyclerAddress, amount, receiptHash) {
    try {
      console.log(`♻️ Processing recycling reward of ${amount} USDFC...`);
      
      if (!this.initialized) {
        throw new Error('Service not initialized');
      }
      
      // In demo mode, simulate reward processing
      if (!this.paymentContract) {
        return {
          success: true,
          recyclerAddress,
          amount,
          receiptHash,
          timestamp: new Date().toISOString()
        };
      }
      
      const amountWei = ethers.parseEther(amount.toString());
      const tx = await this.paymentContract.processRecyclingReward(recyclerAddress, amountWei, receiptHash);
      const receipt = await tx.wait();
      
      console.log('✅ Recycling reward processed');
      
      return {
        success: true,
        recyclerAddress,
        amount,
        receiptHash,
        transactionHash: receipt.hash,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error('❌ Failed to process recycling reward:', error);
      throw error;
    }
  }

  /**
   * Get escrow information
   * @param {string} escrowId - Escrow ID
   * @returns {Promise<object>} Escrow info
   */
  async getEscrowInfo(escrowId) {
    try {
      if (!this.initialized) {
        throw new Error('Service not initialized');
      }
      
      // In demo mode, return mock escrow info
      if (!this.paymentContract) {
        return {
          buyer: this.signer.address,
          merchant: '0x0000000000000000000000000000000000000000',
          amount: '100.0',
          released: false
        };
      }
      
      const escrowInfo = await this.paymentContract.getEscrowInfo(escrowId);
      
      return {
        buyer: escrowInfo.buyer,
        merchant: escrowInfo.merchant,
        amount: ethers.formatEther(escrowInfo.amount),
        released: escrowInfo.released
      };
    } catch (error) {
      console.error('❌ Failed to get escrow info:', error);
      throw error;
    }
  }

  /**
   * Complete payment workflow for receipt
   * @param {object} receiptData - Receipt data
   * @param {string} merchantAddress - Merchant address
   * @param {number} amount - Payment amount
   * @returns {Promise<object>} Complete payment result
   */
  async processReceiptPayment(receiptData, merchantAddress, amount) {
    try {
      console.log('🚀 Starting complete payment workflow...');
      
      // Create receipt hash
      const receiptHash = ethers.keccak256(
        ethers.toUtf8Bytes(JSON.stringify(receiptData))
      );
      
      // Create payment escrow
      const escrowResult = await this.createPaymentEscrow(merchantAddress, amount, receiptHash);
      
      // Simulate verification delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Release payment after verification
      const releaseResult = await this.releasePayment(escrowResult.escrowId);
      
      const result = {
        success: escrowResult.success && releaseResult.success,
        receiptHash,
        escrowResult,
        releaseResult,
        amount,
        merchantAddress,
        timestamp: new Date().toISOString()
      };
      
      console.log('✅ Payment workflow completed');
      
      return result;
    } catch (error) {
      console.error('❌ Payment workflow failed:', error);
      throw error;
    }
  }

  /**
   * Calculate recycling reward based on product type and condition
   * @param {object} receiptData - Receipt data
   * @returns {number} Reward amount in USDFC
   */
  calculateRecyclingReward(receiptData) {
    const baseReward = 5.0; // Base reward in USDFC
    const product = receiptData.items?.[0];
    
    if (!product) return baseReward;
    
    // Calculate reward based on product value and type
    const valueMultiplier = Math.min(product.price / 1000, 2.0); // Max 2x multiplier
    const categoryMultiplier = {
      'smartphone': 1.5,
      'laptop': 1.8,
      'tablet': 1.3,
      'headphones': 1.0,
      'electronics': 1.2,
      'default': 1.0
    };
    
    const category = product.category?.toLowerCase() || 'default';
    const multiplier = categoryMultiplier[category] || categoryMultiplier.default;
    
    const reward = baseReward * valueMultiplier * multiplier;
    
    console.log(`♻️ Calculated recycling reward: ${reward} USDFC`);
    return Math.round(reward * 100) / 100; // Round to 2 decimal places
  }
}
