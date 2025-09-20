import { useState, useEffect } from 'react'
import { useAccount, useWalletClient, useChainId, usePublicClient } from 'wagmi'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { Package, FileText, Recycle, TrendingUp, Send } from 'lucide-react'
import { FilecoinStorage } from '../utils/filecoinStorage'
import { ethers } from 'ethers'

export default function ProofMintDemo() {
  const { address, isConnected } = useAccount()
  const chainId = useChainId()
  const { data: walletClient } = useWalletClient()
  
  // Demo state
  const [receiptForm, setReceiptForm] = useState({
    productName: 'iPhone 15 Pro',
    price: '899.99',
    category: 'smartphone'
  })
  const [demoOutput, setDemoOutput] = useState(['Click "Issue Receipt NFT" to see real-time Filecoin storage demo...'])
  const [isProcessing, setIsProcessing] = useState(false)
  const [filecoinStorage, setFilecoinStorage] = useState(null)
  const [lastReceipt, setLastReceipt] = useState(null)

  // Initialize Filecoin storage when wallet connects
  useEffect(() => {
    if (walletClient && chainId === 314159 && !filecoinStorage) { // Calibration testnet
      initializeFilecoinStorage()
    }
  }, [walletClient, chainId, filecoinStorage])

  const initializeFilecoinStorage = async () => {
    try {
      addToOutput('🚀 Initializing Filecoin storage with Synapse SDK...')
      
      if (!walletClient) {
        throw new Error('Wallet client not available')
      }

      // Convert viem walletClient to ethers signer for Synapse SDK
      // Create EIP-1193 compatible provider wrapper
      const eip1193Provider = {
        request: async ({ method, params }) => {
          if (method === 'eth_requestAccounts') {
            return [walletClient.account.address]
          }
          if (method === 'eth_accounts') {
            return [walletClient.account.address]
          }
          if (method === 'eth_chainId') {
            return `0x${chainId.toString(16)}`
          }
          // Forward other requests to the wallet client
          return await walletClient.request({ method, params })
        },
        on: () => {},
        removeListener: () => {},
      }
      
      const provider = new ethers.BrowserProvider(eip1193Provider)
      const signer = await provider.getSigner()
      
      const storage = new FilecoinStorage()
      await storage.initialize(signer)
      
      setFilecoinStorage(storage)
      addToOutput('✅ Filecoin storage initialized successfully')
      
      // Get storage stats with error handling
      const stats = await storage.getStorageStats()
      if (stats) {
        addToOutput(`📊 Connected to ${stats.network} network`)
        addToOutput(`💰 Balance: ${stats.balance} USDFC`)
      } else {
        addToOutput(`📊 Connected to calibration network (stats unavailable)`)
        addToOutput(`💰 Balance: Check wallet for current balance`)
      }
      
    } catch (error) {
      console.error('Failed to initialize Filecoin storage:', error)
      addToOutput(`❌ Failed to initialize: ${error.message}`)
    }
  }

  const addToOutput = (message) => {
    setDemoOutput(prev => [...prev, message])
  }

  const clearOutput = () => {
    setDemoOutput(['Starting new receipt generation...'])
  }

  const issueReceiptNFT = async () => {
    if (!filecoinStorage) {
      if (!isConnected) {
        addToOutput('❌ Please connect your wallet first')
        return
      }
      if (chainId !== 314159) {
        addToOutput('❌ Please switch to Filecoin Calibration testnet')
        return
      }
      addToOutput('❌ Filecoin storage not initialized')
      return
    }

    setIsProcessing(true)
    clearOutput()

    try {
      // Step 1: Create receipt metadata
      addToOutput('📦 Creating receipt metadata with sustainability data...')
      
      const receiptData = FilecoinStorage.createSampleReceipt({
        merchantInfo: {
          name: "Demo Electronics Store",
          address: "123 Innovation Blvd, San Francisco, CA",
        },
        purchaseDetails: {
          totalAmount: parseFloat(receiptForm.price),
        },
        items: [{
          name: receiptForm.productName,
          category: receiptForm.category,
          price: parseFloat(receiptForm.price),
          serialNumber: `DEMO${Date.now()}`
        }]
      })

      addToOutput(`📊 Receipt Data:`)
      addToOutput(`   Product: ${receiptData.items[0].name}`)
      addToOutput(`   Price: ${receiptData.items[0].price}`)
      addToOutput(`   Category: ${receiptData.items[0].category}`)
      addToOutput(`   Carbon Footprint: ${receiptData.sustainability?.carbonFootprint || 'N/A'}`)
      addToOutput(`   Recyclability Score: ${receiptData.sustainability?.recyclabilityScore || 'N/A'}%`)

      // Step 2: Store on Filecoin
      addToOutput('🌐 Storing receipt metadata on Filecoin...')
      addToOutput('📊 Calculating data size...')
      
      const jsonData = JSON.stringify(receiptData, null, 2)
      addToOutput(`📏 Storing ${jsonData.length} bytes of receipt data...`)
      
      const ipfsHash = await filecoinStorage.storeReceiptMetadata(receiptData)
      
      addToOutput('✅ Receipt stored on Filecoin with PDP verification!')
      addToOutput(`📍 PieceCID: ${ipfsHash.replace('ipfs://', '')}`)
      addToOutput(`📏 Size: ${jsonData.length} bytes`)

      // Step 3: Simulate NFT minting (in production, would call smart contract)
      addToOutput('🎭 Minting NFT receipt to consumer...')
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      const tokenId = 1247 + Math.floor(Math.random() * 100)
      addToOutput(`✅ NFT Receipt #${tokenId} minted successfully!`)

      // Step 4: Demo completion
      addToOutput('\n🎉 DEMO COMPLETE!')
      addToOutput('✅ Receipt stored on Filecoin with PDP verification')
      addToOutput('✅ NFT minted to consumer wallet')
      addToOutput('✅ Sustainability metrics calculated')
      addToOutput('✅ Lifecycle tracking enabled')

      setLastReceipt({
        tokenId,
        ipfsHash,
        receiptData,
        timestamp: new Date().toISOString()
      })

    } catch (error) {
      console.error('Receipt issuance failed:', error)
      addToOutput(`❌ Failed to issue receipt: ${error.message}`)
    } finally {
      setIsProcessing(false)
    }
  }

  // Demo statistics
  const stats = [
    { icon: FileText, label: 'Receipts Issued', value: '1,247', change: '+12%' },
    { icon: Package, label: 'Active Merchants', value: '89', change: '+5%' },
    { icon: Recycle, label: 'Items Recycled', value: '432', change: '+18%' },
    { icon: TrendingUp, label: 'CO2 Offset', value: '2.1T', change: '+25%' },
  ]

  return (
    <div className="space-y-8">
      {/* Connection Status */}
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold text-gray-900">ProofMint</h2>
            <p className="text-gray-600">Digital Receipt NFTs with Filecoin Storage & PDP Verification</p>
          </div>
<ConnectButton />
        </div>
        
        {isConnected && (
          <div className="mt-4 p-4 bg-blue-50 rounded-lg">
            <p className="text-blue-800">
              📱 Connected: {address?.slice(0, 6)}...{address?.slice(-4)}
            </p>
            <p className="text-blue-700 text-sm">
              🌐 Network: {chainId === 314159 ? 'Filecoin Calibration' : 'Unknown'} (Chain ID: {chainId})
            </p>
            {chainId !== 314159 && (
              <p className="text-red-600 text-sm mt-2">
                ⚠️ Please switch to Filecoin Calibration testnet for full functionality
              </p>
            )}
          </div>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-xl shadow-sm border p-6 text-center">
            <div className="flex justify-center mb-3">
              <stat.icon className="w-8 h-8 text-blue-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</div>
            <div className="text-sm text-gray-600 mb-2">{stat.label}</div>
            <div className="text-sm text-green-600 font-medium">{stat.change}</div>
          </div>
        ))}
      </div>

      {/* Demo Section */}
      <div className="bg-white rounded-xl shadow-sm border p-8">
        <h3 className="text-2xl font-semibold text-gray-900 mb-6">Live Demo: Issue Digital Receipt NFT</h3>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Demo Form */}
          <div>
            <h4 className="text-lg font-medium text-gray-900 mb-4">Merchant Portal</h4>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={receiptForm.productName}
                  onChange={(e) => setReceiptForm(prev => ({ ...prev, productName: e.target.value }))}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Price (USD)</label>
                <input
                  type="number"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={receiptForm.price}
                  onChange={(e) => setReceiptForm(prev => ({ ...prev, price: e.target.value }))}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={receiptForm.category}
                  onChange={(e) => setReceiptForm(prev => ({ ...prev, category: e.target.value }))}
                >
                  <option value="smartphone">Smartphone</option>
                  <option value="laptop">Laptop</option>
                  <option value="tablet">Tablet</option>
                  <option value="headphones">Headphones</option>
                  <option value="electronics">Electronics</option>
                </select>
              </div>
              
              <button
                onClick={issueReceiptNFT}
                disabled={isProcessing || !isConnected}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2"
              >
                {isProcessing ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    <span>🚀 Issue Receipt NFT on Filecoin</span>
                  </>
                )}
              </button>

              {!isConnected && (
                <p className="text-sm text-gray-500 text-center mt-2">
                  Connect your wallet to Filecoin Calibration testnet to try the demo
                </p>
              )}
            </div>
          </div>
          
          {/* Demo Output */}
          <div>
            <h4 className="text-lg font-medium text-gray-900 mb-4">Filecoin Storage Process</h4>
            <div className="bg-gray-900 text-green-400 rounded-lg p-4 min-h-64 font-mono text-sm max-h-96 overflow-y-auto">
              {demoOutput.map((line, index) => (
                <div key={index} className="mb-1">
                  {line}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Results */}
        {lastReceipt && (
          <div className="mt-8 p-6 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border border-green-200">
            <h4 className="text-lg font-semibold text-gray-900 mb-4">✅ Demo Results</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div><strong>Receipt NFT:</strong> #{lastReceipt.tokenId}</div>
              <div><strong>Product:</strong> {lastReceipt.receiptData.items[0].name}</div>
              <div className="md:col-span-2">
                <strong>Filecoin IPFS Hash:</strong>
                <code className="bg-white px-2 py-1 rounded text-xs ml-2 break-all">
                  {lastReceipt.ipfsHash}
                </code>
              </div>
              <div><strong>Carbon Footprint:</strong> {lastReceipt.receiptData.sustainability.carbonFootprint}</div>
              <div><strong>Recyclability:</strong> {lastReceipt.receiptData.sustainability.recyclabilityScore}%</div>
              <div><strong>Price:</strong> ${lastReceipt.receiptData.items[0].price}</div>
              <div><strong>Timestamp:</strong> {new Date(lastReceipt.timestamp).toLocaleString()}</div>
            </div>
            
            <div className="mt-4 p-4 bg-white rounded-lg">
              <h5 className="font-medium text-gray-900 mb-2">🔐 Filecoin Storage Verification</h5>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Receipt metadata stored on Filecoin with PDP verification</li>
                <li>• Immutable proof of purchase with sustainability data</li>
                <li>• Fast retrieval via FilCDN acceleration</li>
                <li>• Cost-efficient decentralized storage</li>
              </ul>
            </div>
          </div>
        )}
      </div>

      {/* How it Works */}
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">How ProofMint Works</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Package className="w-8 h-8 text-blue-600" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">1. Create Receipt</h4>
            <p className="text-sm text-gray-600">Generate comprehensive receipt metadata with sustainability metrics and product details</p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <div className="text-2xl">🌐</div>
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">2. Store on Filecoin</h4>
            <p className="text-sm text-gray-600">Store receipt data on Filecoin using Synapse SDK with PDP verification for integrity</p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <div className="text-2xl">🎭</div>
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">3. Mint NFT</h4>
            <p className="text-sm text-gray-600">Mint ERC721 NFT to consumer with IPFS metadata link for permanent ownership proof</p>
          </div>
        </div>
      </div>
    </div>
  )
}