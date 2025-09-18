import { useState, useEffect } from 'react'
import { useAccount, useWalletClient, useChainId } from 'wagmi'
import { Package, CreditCard, Send, FileText, CheckCircle, AlertCircle, TrendingUp, Users, Calendar, DollarSign, Plus } from 'lucide-react'
import { FilecoinStorage } from '../utils/filecoinStorage'
import { ethers } from 'ethers'

export default function MerchantDashboard() {
  const { address } = useAccount()
  const { data: walletClient } = useWalletClient()
  const chainId = useChainId()
  
  // State management
  const [activeTab, setActiveTab] = useState('overview')
  const [filecoinStorage, setFilecoinStorage] = useState(null)
  const [isProcessing, setIsProcessing] = useState(false)
  
  // Demo merchant data
  const [isVerified] = useState(true)
  const [subscription] = useState({
    tier: 'Premium',
    receiptsUsed: 47,
    receiptsLimit: 500,
    expiresAt: '2024-12-31',
    isActive: true
  })
  
  const [stats] = useState({
    totalReceipts: 247,
    monthlyReceipts: 47,
    revenue: 125000,
    recycledItems: 23
  })
  
  const [recentReceipts] = useState([
    { id: 1247, product: 'iPhone 15 Pro', buyer: '0x1234...5678', amount: 899.99, date: '2024-01-15', status: 'active' },
    { id: 1246, product: 'MacBook Air M2', buyer: '0xabcd...efgh', amount: 1299.99, date: '2024-01-14', status: 'active' },
    { id: 1245, product: 'AirPods Pro', buyer: '0x9876...1234', amount: 249.99, date: '2024-01-13', status: 'recycled' }
  ])
  
  const [receiptForm, setReceiptForm] = useState({
    buyerAddress: '',
    productName: 'iPhone 15 Pro',
    price: '899.99',
    category: 'smartphone',
    serialNumber: '',
    warranty: '12'
  })

  // Initialize Filecoin storage
  useEffect(() => {
    const initStorage = async () => {
      if (walletClient && chainId === 314159 && !filecoinStorage) {
        try {
          // Create EIP-1193 compatible provider wrapper
          const eip1193Provider = {
            request: async ({ method, params }) => {
              if (method === 'eth_requestAccounts') return [address]
              if (method === 'eth_accounts') return [address]
              if (method === 'eth_chainId') return `0x${chainId.toString(16)}`
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
        } catch (error) {
          console.error('Failed to initialize Filecoin storage:', error)
        }
      }
    }
    initStorage()
  }, [walletClient, chainId, address, filecoinStorage])

  const handleIssueReceipt = async () => {
    if (!filecoinStorage || !receiptForm.buyerAddress || !receiptForm.productName) return

    setIsProcessing(true)
    try {
      // Create receipt metadata
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
          serialNumber: receiptForm.serialNumber || `DEMO${Date.now()}`,
          warranty: `${receiptForm.warranty} months`
        }]
      })

      // Store on Filecoin
      const ipfsHash = await filecoinStorage.storeReceiptMetadata(receiptData)
      
      // In a real app, you would call the smart contract here
      console.log(`Receipt NFT would be minted with IPFS hash: ${ipfsHash}`)
      
      // Reset form
      setReceiptForm({
        buyerAddress: '',
        productName: 'iPhone 15 Pro',
        price: '899.99',
        category: 'smartphone',
        serialNumber: '',
        warranty: '12'
      })
      
      alert('Receipt NFT issued successfully!')
      
    } catch (error) {
      console.error('Failed to issue receipt:', error)
      alert('Failed to issue receipt: ' + error.message)
    } finally {
      setIsProcessing(false)
    }
  }

  const subscriptionTiers = [
    { name: 'Basic', price: '$10', limit: '100 receipts', features: ['Basic NFT receipts', 'Filecoin storage', 'Basic analytics'] },
    { name: 'Premium', price: '$50', limit: '500 receipts', features: ['Everything in Basic', 'Priority support', 'Advanced analytics', 'Custom branding'] },
    { name: 'Enterprise', price: '$100', limit: 'Unlimited receipts', features: ['Everything in Premium', 'API access', 'White-label solution', 'Dedicated support'] }
  ]

  const TabButton = ({ id, label, isActive, onClick }) => (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
        isActive
          ? 'bg-blue-100 text-blue-700'
          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
      }`}
    >
      {label}
    </button>
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Merchant Portal</h2>
            <p className="text-gray-600">Manage your digital receipt NFTs</p>
            <div className="flex items-center mt-2">
              {isVerified ? (
                <div className="flex items-center text-green-600">
                  <CheckCircle className="w-4 h-4 mr-1" />
                  <span className="text-sm font-medium">Verified Merchant</span>
                </div>
              ) : (
                <div className="flex items-center text-red-600">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  <span className="text-sm font-medium">Pending Verification</span>
                </div>
              )}
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-600">Wallet Connected</div>
            <div className="font-mono text-sm">{address?.slice(0, 6)}...{address?.slice(-4)}</div>
            <div className={`text-xs px-2 py-1 rounded mt-1 ${
              chainId === 314159 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            }`}>
              {chainId === 314159 ? 'Filecoin Calibration' : 'Wrong Network'}
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white rounded-xl shadow-sm border p-1">
        <div className="flex space-x-1">
          <TabButton
            id="overview"
            label="📊 Overview"
            isActive={activeTab === 'overview'}
            onClick={() => setActiveTab('overview')}
          />
          <TabButton
            id="issue"
            label="🚀 Issue Receipt"
            isActive={activeTab === 'issue'}
            onClick={() => setActiveTab('issue')}
          />
          <TabButton
            id="receipts"
            label="📄 My Receipts"
            isActive={activeTab === 'receipts'}
            onClick={() => setActiveTab('receipts')}
          />
          <TabButton
            id="subscription"
            label="💳 Subscription"
            isActive={activeTab === 'subscription'}
            onClick={() => setActiveTab('subscription')}
          />
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <FileText className="w-6 h-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <div className="text-2xl font-bold text-gray-900">{stats.totalReceipts}</div>
                  <div className="text-sm text-gray-600">Total Receipts</div>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-lg">
                  <TrendingUp className="w-6 h-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <div className="text-2xl font-bold text-gray-900">{stats.monthlyReceipts}</div>
                  <div className="text-sm text-gray-600">This Month</div>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <div className="flex items-center">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <DollarSign className="w-6 h-6 text-purple-600" />
                </div>
                <div className="ml-4">
                  <div className="text-2xl font-bold text-gray-900">${stats.revenue.toLocaleString()}</div>
                  <div className="text-sm text-gray-600">Revenue Tracked</div>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Package className="w-6 h-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <div className="text-2xl font-bold text-gray-900">{stats.recycledItems}</div>
                  <div className="text-sm text-gray-600">Items Recycled</div>
                </div>
              </div>
            </div>
          </div>

          {/* Current Subscription */}
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Current Subscription</h3>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xl font-bold text-purple-600">{subscription.tier} Plan</div>
                <div className="text-sm text-gray-600">
                  {subscription.receiptsUsed} / {subscription.receiptsLimit} receipts used
                </div>
                <div className="text-sm text-gray-600">
                  Expires: {subscription.expiresAt}
                </div>
              </div>
              <div className="text-right">
                <div className={`px-3 py-1 rounded-full text-sm ${
                  subscription.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {subscription.isActive ? 'Active' : 'Inactive'}
                </div>
              </div>
            </div>
            <div className="mt-4">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-purple-600 h-2 rounded-full" 
                  style={{ width: `${(subscription.receiptsUsed / subscription.receiptsLimit) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Receipts</h3>
            <div className="space-y-3">
              {recentReceipts.map(receipt => (
                <div key={receipt.id} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
                  <div className="flex items-center">
                    <div className="p-2 bg-blue-100 rounded-lg mr-3">
                      <Package className="w-4 h-4 text-blue-600" />
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">#{receipt.id}</div>
                      <div className="text-sm text-gray-600">{receipt.product}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium text-gray-900">${receipt.amount}</div>
                    <div className={`text-xs px-2 py-1 rounded ${
                      receipt.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {receipt.status}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'issue' && (
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Issue New Receipt NFT</h3>
          
          {!filecoinStorage ? (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
              <div className="flex items-center">
                <AlertCircle className="w-5 h-5 text-yellow-600 mr-2" />
                <div>
                  <div className="font-medium text-yellow-800">Filecoin Storage Not Ready</div>
                  <div className="text-sm text-yellow-700">
                    {chainId !== 314159 
                      ? 'Please switch to Filecoin Calibration testnet to initialize storage.'
                      : 'Initializing Filecoin storage connection...'
                    }
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
              <div className="flex items-center">
                <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                <div className="text-sm text-green-800">✅ Filecoin storage ready</div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Form */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Buyer Address
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="0x..."
                  value={receiptForm.buyerAddress}
                  onChange={(e) => setReceiptForm(prev => ({ ...prev, buyerAddress: e.target.value }))}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Product Name
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={receiptForm.productName}
                  onChange={(e) => setReceiptForm(prev => ({ ...prev, productName: e.target.value }))}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Price (USD)
                  </label>
                  <input
                    type="number"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={receiptForm.price}
                    onChange={(e) => setReceiptForm(prev => ({ ...prev, price: e.target.value }))}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category
                  </label>
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
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Serial Number (Optional)
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Auto-generated if empty"
                    value={receiptForm.serialNumber}
                    onChange={(e) => setReceiptForm(prev => ({ ...prev, serialNumber: e.target.value }))}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Warranty (Months)
                  </label>
                  <input
                    type="number"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={receiptForm.warranty}
                    onChange={(e) => setReceiptForm(prev => ({ ...prev, warranty: e.target.value }))}
                  />
                </div>
              </div>

              <button
                onClick={handleIssueReceipt}
                disabled={isProcessing || !filecoinStorage || !receiptForm.buyerAddress || !receiptForm.productName}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2"
              >
                {isProcessing ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Storing on Filecoin...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    <span>🚀 Issue Receipt NFT</span>
                  </>
                )}
              </button>
            </div>

            {/* Preview */}
            <div className="bg-gray-50 rounded-lg p-6">
              <h4 className="font-medium text-gray-900 mb-4">Receipt Preview</h4>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Product:</span>
                  <span className="font-medium">{receiptForm.productName || 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Price:</span>
                  <span className="font-medium">${receiptForm.price || '0'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Category:</span>
                  <span className="font-medium capitalize">{receiptForm.category}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Warranty:</span>
                  <span className="font-medium">{receiptForm.warranty} months</span>
                </div>
                <div className="border-t pt-3 mt-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Storage:</span>
                    <span className="font-medium text-blue-600">Filecoin + PDP</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">NFT Standard:</span>
                    <span className="font-medium">ERC-721</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'receipts' && (
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Issued Receipts</h3>
          
          <div className="space-y-4">
            {recentReceipts.map(receipt => (
              <div key={receipt.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="p-2 bg-blue-100 rounded-lg mr-4">
                      <FileText className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">Receipt #{receipt.id}</div>
                      <div className="text-sm text-gray-600">{receipt.product}</div>
                      <div className="text-xs text-gray-500">Buyer: {receipt.buyer}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium text-gray-900">${receipt.amount}</div>
                    <div className="text-sm text-gray-600">{receipt.date}</div>
                    <div className={`text-xs px-2 py-1 rounded ${
                      receipt.status === 'active' 
                        ? 'bg-green-100 text-green-800' 
                        : receipt.status === 'recycled'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {receipt.status}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'subscription' && (
        <div className="space-y-6">
          {/* Current Plan */}
          <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Current Plan</h3>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-purple-600">{subscription.tier}</div>
                <div className="text-gray-600">{subscription.receiptsUsed} / {subscription.receiptsLimit} receipts used</div>
                <div className="text-sm text-gray-500">Expires {subscription.expiresAt}</div>
              </div>
              <div className="text-right">
                <button className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors">
                  Manage Plan
                </button>
              </div>
            </div>
          </div>

          {/* Available Plans */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {subscriptionTiers.map((tier, index) => (
              <div key={tier.name} className={`bg-white rounded-xl shadow-sm border-2 p-6 ${
                tier.name === subscription.tier ? 'border-purple-500' : 'border-gray-200'
              }`}>
                <div className="text-center">
                  <h4 className="text-xl font-bold text-gray-900">{tier.name}</h4>
                  <div className="text-3xl font-bold text-purple-600 mt-2">{tier.price}</div>
                  <div className="text-sm text-gray-600">/month</div>
                  <div className="text-sm text-gray-600 mt-1">{tier.limit}</div>
                </div>
                
                <div className="mt-6 space-y-3">
                  {tier.features.map((feature, idx) => (
                    <div key={idx} className="flex items-center text-sm">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>

                <button 
                  className={`w-full mt-6 py-2 px-4 rounded-lg font-medium transition-colors ${
                    tier.name === subscription.tier
                      ? 'bg-purple-100 text-purple-700 cursor-default'
                      : 'bg-purple-600 text-white hover:bg-purple-700'
                  }`}
                  disabled={tier.name === subscription.tier}
                >
                  {tier.name === subscription.tier ? 'Current Plan' : 'Select Plan'}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}