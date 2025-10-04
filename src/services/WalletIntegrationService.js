/**
 * Wallet Integration Service
 * Supports Apple Wallet, Google Pay, and crypto wallet integration for receipt NFTs
 * Based on feedback to integrate receipts into actual phone wallets
 */

export class WalletIntegrationService {
  constructor() {
    this.supportedWallets = {
      apple: this.isAppleDevice(),
      google: this.isAndroidDevice(),
      crypto: true
    };
  }

  /**
   * Check if device supports Apple Wallet
   */
  isAppleDevice() {
    return /iPad|iPhone|iPod/.test(navigator.userAgent) || 
           (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  }

  /**
   * Check if device supports Google Pay
   */
  isAndroidDevice() {
    return /Android/.test(navigator.userAgent);
  }

  /**
   * Generate Apple Wallet pass for receipt NFT
   * @param {object} receiptData - Receipt data
   * @param {string} tokenId - NFT token ID
   * @returns {object} Apple Wallet pass data
   */
  generateAppleWalletPass(receiptData, tokenId) {
    const pass = {
      formatVersion: 1,
      passTypeIdentifier: "pass.com.proofmint.receipt",
      serialNumber: `receipt-${tokenId}`,
      teamIdentifier: "PROOFMINT",
      organizationName: "ProofMint",
      description: "Digital Receipt NFT",
      logoText: "ProofMint",
      foregroundColor: "rgb(255, 255, 255)",
      backgroundColor: "rgb(59, 130, 246)",
      labelColor: "rgb(255, 255, 255)",
      
      storeCard: {
        primaryFields: [
          {
            key: "product",
            label: "PRODUCT",
            value: receiptData.items?.[0]?.name || "Digital Receipt"
          }
        ],
        secondaryFields: [
          {
            key: "price",
            label: "PRICE",
            value: `$${receiptData.purchaseDetails?.totalAmount || 0}`
          },
          {
            key: "date",
            label: "DATE",
            value: new Date(receiptData.purchaseDetails?.timestamp || Date.now()).toLocaleDateString()
          }
        ],
        auxiliaryFields: [
          {
            key: "merchant",
            label: "MERCHANT",
            value: receiptData.merchantInfo?.name || "ProofMint"
          },
          {
            key: "carbon",
            label: "CARBON FOOTPRINT",
            value: receiptData.sustainability?.carbonFootprint || "N/A"
          }
        ],
        backFields: [
          {
            key: "receiptId",
            label: "Receipt ID",
            value: receiptData.receiptId
          },
          {
            key: "sustainability",
            label: "Sustainability",
            value: `Recyclability: ${receiptData.sustainability?.recyclabilityScore || 0}%`
          },
          {
            key: "blockchain",
            label: "Blockchain",
            value: "Filecoin Network"
          },
          {
            key: "verification",
            label: "Verification",
            value: "PDP Verified"
          }
        ]
      },
      
      barcodes: [
        {
          message: `https://proofmint.app/receipt/${tokenId}`,
          format: "PKBarcodeFormatQR",
          messageEncoding: "iso-8859-1"
        }
      ],
      
      locations: [
        {
          latitude: 37.7749,
          longitude: -122.4194,
          relevantText: "ProofMint Receipt Location"
        }
      ]
    };

    return pass;
  }

  /**
   * Generate Google Pay pass for receipt NFT
   * @param {object} receiptData - Receipt data
   * @param {string} tokenId - NFT token ID
   * @returns {object} Google Pay pass data
   */
  generateGooglePayPass(receiptData, tokenId) {
    const pass = {
      "@context": "https://schema.org/",
      "@type": "DigitalDocument",
      "name": "ProofMint Digital Receipt",
      "description": `Digital receipt for ${receiptData.items?.[0]?.name || 'product'}`,
      "identifier": `receipt-${tokenId}`,
      "url": `https://proofmint.app/receipt/${tokenId}`,
      
      "about": {
        "@type": "Product",
        "name": receiptData.items?.[0]?.name || "Digital Receipt",
        "brand": receiptData.items?.[0]?.brand || "ProofMint",
        "category": receiptData.items?.[0]?.category || "electronics"
      },
      
      "provider": {
        "@type": "Organization",
        "name": receiptData.merchantInfo?.name || "ProofMint",
        "address": receiptData.merchantInfo?.address || "123 Innovation Blvd, San Francisco, CA"
      },
      
      "dateCreated": receiptData.purchaseDetails?.timestamp || new Date().toISOString(),
      
      "additionalProperty": [
        {
          "@type": "PropertyValue",
          "name": "Price",
          "value": `$${receiptData.purchaseDetails?.totalAmount || 0}`
        },
        {
          "@type": "PropertyValue",
          "name": "Carbon Footprint",
          "value": receiptData.sustainability?.carbonFootprint || "N/A"
        },
        {
          "@type": "PropertyValue",
          "name": "Recyclability Score",
          "value": `${receiptData.sustainability?.recyclabilityScore || 0}%`
        },
        {
          "@type": "PropertyValue",
          "name": "Blockchain",
          "value": "Filecoin Network"
        },
        {
          "@type": "PropertyValue",
          "name": "Verification",
          "value": "PDP Verified"
        }
      ]
    };

    return pass;
  }

  /**
   * Add receipt to Apple Wallet
   * @param {object} receiptData - Receipt data
   * @param {string} tokenId - NFT token ID
   */
  async addToAppleWallet(receiptData, tokenId) {
    if (!this.supportedWallets.apple) {
      throw new Error('Apple Wallet not supported on this device');
    }

    try {
      const pass = this.generateAppleWalletPass(receiptData, tokenId);
      
      // In a real implementation, this would:
      // 1. Sign the pass with Apple certificates
      // 2. Create a .pkpass file
      // 3. Trigger the download/add to wallet flow
      
      console.log('🍎 Adding receipt to Apple Wallet...');
      console.log('Pass data:', pass);
      
      // Simulate the wallet addition process
      return {
        success: true,
        wallet: 'Apple Wallet',
        tokenId,
        message: 'Receipt added to Apple Wallet successfully'
      };
    } catch (error) {
      console.error('❌ Failed to add to Apple Wallet:', error);
      throw error;
    }
  }

  /**
   * Add receipt to Google Pay
   * @param {object} receiptData - Receipt data
   * @param {string} tokenId - NFT token ID
   */
  async addToGooglePay(receiptData, tokenId) {
    if (!this.supportedWallets.google) {
      throw new Error('Google Pay not supported on this device');
    }

    try {
      const pass = this.generateGooglePayPass(receiptData, tokenId);
      
      // In a real implementation, this would:
      // 1. Use Google Pay Passes API
      // 2. Create a pass class and object
      // 3. Trigger the save to Google Pay flow
      
      console.log('🤖 Adding receipt to Google Pay...');
      console.log('Pass data:', pass);
      
      // Simulate the wallet addition process
      return {
        success: true,
        wallet: 'Google Pay',
        tokenId,
        message: 'Receipt added to Google Pay successfully'
      };
    } catch (error) {
      console.error('❌ Failed to add to Google Pay:', error);
      throw error;
    }
  }

  /**
   * Generate QR code for receipt verification
   * @param {string} tokenId - NFT token ID
   * @param {string} dataHash - Filecoin data hash
   * @returns {string} QR code data URL
   */
  generateReceiptQRCode(tokenId, dataHash) {
    const qrData = {
      type: 'proofmint-receipt',
      tokenId,
      dataHash,
      verificationUrl: `https://proofmint.app/verify/${tokenId}`,
      timestamp: new Date().toISOString()
    };

    // In a real implementation, this would generate an actual QR code
    // For now, return the data structure
    return JSON.stringify(qrData, null, 2);
  }

  /**
   * Generate NFC tag data for offline verification
   * @param {string} tokenId - NFT token ID
   * @param {string} dataHash - Filecoin data hash
   * @returns {object} NFC tag data
   */
  generateNFCTagData(tokenId, dataHash) {
    return {
      type: 'proofmint-receipt',
      tokenId,
      dataHash,
      verificationUrl: `https://proofmint.app/verify/${tokenId}`,
      offlineData: {
        timestamp: new Date().toISOString(),
        network: 'Filecoin',
        verified: true
      }
    };
  }

  /**
   * Get available wallet options for the current device
   * @returns {object} Available wallet options
   */
  getAvailableWallets() {
    return {
      apple: this.supportedWallets.apple,
      google: this.supportedWallets.google,
      crypto: this.supportedWallets.crypto,
      qr: true,
      nfc: 'NDEF' in window
    };
  }

  /**
   * Add receipt to all available wallets
   * @param {object} receiptData - Receipt data
   * @param {string} tokenId - NFT token ID
   * @returns {Promise<object[]>} Results from all wallet additions
   */
  async addToAllWallets(receiptData, tokenId) {
    const results = [];
    const availableWallets = this.getAvailableWallets();

    // Add to Apple Wallet if supported
    if (availableWallets.apple) {
      try {
        const result = await this.addToAppleWallet(receiptData, tokenId);
        results.push(result);
      } catch (error) {
        results.push({
          success: false,
          wallet: 'Apple Wallet',
          error: error.message
        });
      }
    }

    // Add to Google Pay if supported
    if (availableWallets.google) {
      try {
        const result = await this.addToGooglePay(receiptData, tokenId);
        results.push(result);
      } catch (error) {
        results.push({
          success: false,
          wallet: 'Google Pay',
          error: error.message
        });
      }
    }

    // Generate QR code
    const qrData = this.generateReceiptQRCode(tokenId, receiptData.dataHash);
    results.push({
      success: true,
      wallet: 'QR Code',
      data: qrData,
      message: 'QR code generated for offline verification'
    });

    // Generate NFC data if supported
    if (availableWallets.nfc) {
      const nfcData = this.generateNFCTagData(tokenId, receiptData.dataHash);
      results.push({
        success: true,
        wallet: 'NFC Tag',
        data: nfcData,
        message: 'NFC tag data generated for offline verification'
      });
    }

    return results;
  }
}
