import { useAccount, usePublicClient, useWalletClient } from 'wagmi'
import { PROOFMINT_ABI, PROOFMINT_CONFIG } from '../contracts/ProofMintABI'

export function useProofMintContract() {
  const { address, isConnected } = useAccount()
  const publicClient = usePublicClient()
  const { data: walletClient } = useWalletClient()

  // Contract address - this will be updated after deployment
  const contractAddress = PROOFMINT_CONFIG.ADDRESS || "0x0000000000000000000000000000000000000000"

  // Helper function to call smart contract write functions
  const writeContract = async (functionName, args = [], value = undefined) => {
    if (!walletClient) throw new Error('Wallet not connected')
    
    return await walletClient.writeContract({
      address: contractAddress,
      abi: PROOFMINT_ABI,
      functionName,
      args,
      ...(value && { value })
    })
  }

  // Helper function to call smart contract read functions
  const readContract = async (functionName, args = []) => {
    if (!publicClient) throw new Error('Public client not available')
    
    return await publicClient.readContract({
      address: contractAddress,
      abi: PROOFMINT_ABI,
      functionName,
      args,
    })
  }

  // Contract interaction methods
  const issueReceipt = async (buyer, ipfsHash) => {
    return await writeContract('issueReceipt', [buyer, ipfsHash])
  }

  const purchaseSubscription = async (tier, durationMonths, paymentAmount) => {
    return await writeContract('purchaseSubscription', [tier, durationMonths], paymentAmount)
  }

  const getSubscription = async (merchantAddress) => {
    return await readContract('getSubscription', [merchantAddress])
  }

  const isVerifiedMerchant = async (merchantAddress) => {
    return await readContract('isVerifiedMerchant', [merchantAddress])
  }

  const addMerchant = async (merchantAddress) => {
    return await writeContract('addMerchant', [merchantAddress])
  }

  const getUserReceipts = async (userAddress) => {
    return await readContract('getUserReceipts', [userAddress])
  }

  const getReceipt = async (receiptId) => {
    return await readContract('getReceipt', [receiptId])
  }

  const getMerchantReceipts = async (merchantAddress) => {
    return await readContract('getMerchantReceipts', [merchantAddress])
  }

  const getTotalStats = async () => {
    return await readContract('getTotalStats')
  }

  const getSubscriptionPricing = async () => {
    return await readContract('getSubscriptionPricing')
  }

  const canIssueReceipts = async (merchantAddress) => {
    return await readContract('canIssueReceipts', [merchantAddress])
  }

  const flagGadget = async (receiptId, status) => {
    return await writeContract('flagGadget', [receiptId, status])
  }

  return {
    contractAddress,
    isConnected,
    address,
    walletClient,
    publicClient,
    // Contract methods
    issueReceipt,
    purchaseSubscription,
    getSubscription,
    isVerifiedMerchant,
    addMerchant,
    getUserReceipts,
    getReceipt,
    getMerchantReceipts,
    getTotalStats,
    getSubscriptionPricing,
    canIssueReceipts,
    flagGadget,
  }
}

export default useProofMintContract;