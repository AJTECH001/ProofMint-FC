// Deployment Status Configuration
export const DEPLOYMENT_STATUS = {
  // Set to true when contract is deployed
  isDeployed: false,
  
  // Contract address (will be updated after deployment)
  contractAddress: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || "",
  
  // Network information
  network: {
    name: "Filecoin Calibration",
    chainId: 314159,
    rpc: "https://api.calibration.node.glif.io/rpc/v1",
    explorer: "https://calibration.filscan.io"
  },
  
  // Deployment information (to be filled after deployment)
  deployment: {
    deployer: null,
    blockNumber: null,
    timestamp: null,
    transactionHash: null
  },
  
  // Feature flags based on deployment status
  features: {
    realContractIntegration: false, // Enable when deployed
    mockDataFallback: true,        // Disable when deployed
    subscriptionPurchase: false,   // Enable when deployed
    receiptMinting: false         // Enable when deployed
  }
};

export default DEPLOYMENT_STATUS;