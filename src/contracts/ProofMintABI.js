// ProofMint Contract ABI and Configuration
export const PROOFMINT_ABI = [
  // ... (the rest of the ABI remains the same)
];

// Contract Configuration
export const PROOFMINT_CONFIG = {
  // Contract address will be updated after deployment
  ADDRESS: import.meta.env.VITE_CONTRACT_ADDRESS || "0xdEDeBDB00a83a0bD09b414Ea5FD876dB40799529",
  
  // Subscription Tiers
  SUBSCRIPTION_TIERS: {
    BASIC: 0,
    PREMIUM: 1, 
    ENTERPRISE: 2
  },
  
  // Gadget Status
  GADGET_STATUS: {
    ACTIVE: 0,
    STOLEN: 1,
    MISPLACED: 2,
    RECYCLED: 3
  },
  
  // Network Configuration
  NETWORK: {
    CALIBRATION: {
      chainId: 314159,
      name: 'Filecoin Calibration',
      rpcUrl: 'https://api.calibration.node.glif.io/rpc/v1',
      blockExplorer: 'https://calibration.filscan.io'
    },
    MAINNET: {
      chainId: 314,
      name: 'Filecoin Mainnet', 
      rpcUrl: 'https://api.node.glif.io/rpc/v1',
      blockExplorer: 'https://filfox.info'
    }
  }
};

export default PROOFMINT_ABI;