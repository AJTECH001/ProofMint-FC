// Deployment Status Configuration
export const DEPLOYMENT_STATUS = {
  // Set to true when contract is deployed
  isDeployed: true,
  
  // Contract address (will be updated after deployment)
  contractAddress: "0xdEDeBDB00a83a0bD09b414Ea5FD876dB40799529",
  
  // Network information
  network: {
    name: "Filecoin Calibration",
    chainId: 314159,
    rpc: "https://api.calibration.node.glif.io/rpc/v1",
    explorer: "https://calibration.filscan.io"
  },
  
  // Deployment information (to be filled after deployment)
  deployment: {
    deployer: "0xa4280dd3f9E1f6Bf1778837AC12447615E1d0317",
    blockNumber: null,
    timestamp: "2025-09-20T17:17:04.809Z",
    transactionHash: null
  },
  
  // Feature flags based on deployment status
  features: {
    realContractIntegration: true, // Enable when deployed
    mockDataFallback: false,       // Disable when deployed
    subscriptionPurchase: true,    // Enable when deployed
    receiptMinting: true          // Enable when deployed
  }
};

export default DEPLOYMENT_STATUS;