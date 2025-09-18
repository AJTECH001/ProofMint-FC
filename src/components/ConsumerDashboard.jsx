import { useState, useEffect } from 'react'
import { useAccount, useChainId } from 'wagmi'
import { Package, FileText, CheckCircle, AlertCircle, Eye, Download, Recycle, Shield, Calendar, DollarSign, MapPin } from 'lucide-react'

export default function ConsumerDashboard() {
  const { address } = useAccount()
  const chainId = useChainId()
  
  const [activeTab, setActiveTab] = useState('receipts')
  const [selectedReceipt, setSelectedReceipt] = useState(null)
  
  // Demo consumer receipts
  const [myReceipts] = useState([
    {
      id: 1247,
      tokenId: 1247,
      product: 'iPhone 15 Pro',
      merchant: 'Demo Electronics Store',
      merchantAddress: '0xabcd...1234',
      amount: 899.99,
      date: '2024-01-15',
      status: 'active',
      category: 'smartphone',
      warranty: '12 months',
      serialNumber: 'DEMO1705123456',
      ipfsHash: 'bafkzcibcd4bdomn3tgwgrh3g532zopskstnbrd2n3sxfqbze7rxt7vqn7veigmy',
      carbonFootprint: '4.2kg CO2eq',
      recyclabilityScore: 85,
      purchaseLocation: 'San Francisco, CA',
      image: '📱'
    },
    {
      id: 1234,
      tokenId: 1234,
      product: 'MacBook Air M2',
      merchant: 'Tech World Store',
      merchantAddress: '0x1234...abcd',
      amount: 1299.99,
      date: '2024-01-10',
      status: 'active',
      category: 'laptop',
      warranty: '24 months',
      serialNumber: 'MBA2024001',
      ipfsHash: 'bafkzcibcd4bdomn3tgwgrh3g532zopskstnbrd2n3sxfqbze7rxt7vqn7veigmy',
      carbonFootprint: '6.8kg CO2eq',
      recyclabilityScore: 78,
      purchaseLocation: 'New York, NY',
      image: '💻'
    },
    {
      id: 1198,
      tokenId: 1198,
      product: 'AirPods Pro',
      merchant: 'Audio Paradise',
      merchantAddress: '0x5678...efgh',
      amount: 249.99,
      date: '2023-12-20',
      status: 'recycled',
      category: 'headphones',
      warranty: '12 months',
      serialNumber: 'APP2023456',
      ipfsHash: 'bafkzcibcd4bdomn3tgwgrh3g532zopskstnbrd2n3sxfqbze7rxt7vqn7veigmy',
      carbonFootprint: '1.8kg CO2eq',
      recyclabilityScore: 65,
      purchaseLocation: 'Los Angeles, CA',
      image: '🎧',
      recycledDate: '2024-01-05',
      recycleLocation: 'EcoRecycle Center'
    }
  ])

  const [stats] = useState({
    totalReceipts: 3,
    totalValue: 2449.97,
    activeItems: 2,
    recycledItems: 1,
    totalCarbonSaved: 2.3
  })

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800'
      case 'recycled': return 'bg-blue-100 text-blue-800'
      case 'stolen': return 'bg-red-100 text-red-800'
      case 'lost': return 'bg-yellow-100 text-yellow-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

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

  const ReceiptModal = ({ receipt, isOpen, onClose }) => {
    if (!isOpen || !receipt) return null

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-96 overflow-y-auto">
          <div className="p-6">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="text-xl font-bold text-gray-900">Receipt #{receipt.tokenId}</h3>
                <p className="text-gray-600">Digital Receipt NFT Details</p>
              </div>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 text-xl"
              >
                ×
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Product Info */}
              <div className="space-y-4">
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-6xl mb-2">{receipt.image}</div>
                  <div className="font-medium text-gray-900">{receipt.product}</div>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Price:</span>
                    <span className="font-medium">${receipt.amount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Category:</span>
                    <span className="font-medium capitalize">{receipt.category}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Warranty:</span>
                    <span className="font-medium">{receipt.warranty}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Serial:</span>
                    <span className="font-medium font-mono text-sm">{receipt.serialNumber}</span>
                  </div>
                </div>
              </div>

              {/* Purchase & Status Info */}
              <div className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Merchant:</span>
                    <span className="font-medium">{receipt.merchant}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Purchase Date:</span>
                    <span className="font-medium">{receipt.date}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Location:</span>
                    <span className="font-medium">{receipt.purchaseLocation}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Status:</span>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(receipt.status)}`}>
                      {receipt.status}
                    </span>
                  </div>
                  
                  {receipt.status === 'recycled' && (
                    <>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Recycled Date:</span>
                        <span className="font-medium">{receipt.recycledDate}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Recycle Center:</span>
                        <span className="font-medium">{receipt.recycleLocation}</span>
                      </div>
                    </>
                  )}
                </div>

                {/* Sustainability Info */}
                <div className="bg-green-50 p-4 rounded-lg">
                  <h4 className="font-medium text-green-900 mb-2">🌱 Sustainability</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-green-700">Carbon Footprint:</span>
                      <span className="font-medium">{receipt.carbonFootprint}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-green-700">Recyclability:</span>
                      <span className="font-medium">{receipt.recyclabilityScore}%</span>
                    </div>
                  </div>
                </div>

                {/* Blockchain Info */}
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-medium text-blue-900 mb-2">🔗 Blockchain</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-blue-700">Token ID:</span>
                      <span className="font-medium">#{receipt.tokenId}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-blue-700">Storage:</span>
                      <span className="font-medium">Filecoin</span>
                    </div>
                    <div>
                      <span className="text-blue-700">IPFS Hash:</span>
                      <div className="font-mono text-xs mt-1 break-all bg-white p-2 rounded">
                        {receipt.ipfsHash}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center">
                <Download className="w-4 h-4 mr-2" />
                Download Receipt
              </button>
              {receipt.status === 'active' && (
                <button className="flex-1 bg-orange-600 text-white py-2 px-4 rounded-lg hover:bg-orange-700 transition-colors flex items-center justify-center">
                  <AlertCircle className="w-4 h-4 mr-2" />
                  Report Issue
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">My Receipts</h2>
            <p className="text-gray-600">Manage your digital receipt NFTs</p>
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
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <div className="text-2xl font-bold text-gray-900">${stats.totalValue.toLocaleString()}</div>
              <div className="text-sm text-gray-600">Total Value</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border p-6">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Package className="w-6 h-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <div className="text-2xl font-bold text-gray-900">{stats.activeItems}</div>
              <div className="text-sm text-gray-600">Active Items</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <Recycle className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <div className="text-2xl font-bold text-gray-900">{stats.recycledItems}</div>
              <div className="text-sm text-gray-600">Recycled</div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white rounded-xl shadow-sm border p-1">
        <div className="flex space-x-1">
          <TabButton
            id="receipts"
            label="📄 All Receipts"
            isActive={activeTab === 'receipts'}
            onClick={() => setActiveTab('receipts')}
          />
          <TabButton
            id="active"
            label="✅ Active Items"
            isActive={activeTab === 'active'}
            onClick={() => setActiveTab('active')}
          />
          <TabButton
            id="recycled"
            label="♻️ Recycled Items"
            isActive={activeTab === 'recycled'}
            onClick={() => setActiveTab('recycled')}
          />
          <TabButton
            id="sustainability"
            label="🌱 Sustainability"
            isActive={activeTab === 'sustainability'}
            onClick={() => setActiveTab('sustainability')}
          />
        </div>
      </div>

      {/* Tab Content */}
      {(activeTab === 'receipts' || activeTab === 'active' || activeTab === 'recycled') && (
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">
            {activeTab === 'receipts' ? 'All Receipts' : 
             activeTab === 'active' ? 'Active Items' : 'Recycled Items'}
          </h3>
          
          <div className="space-y-4">
            {myReceipts
              .filter(receipt => {
                if (activeTab === 'active') return receipt.status === 'active'
                if (activeTab === 'recycled') return receipt.status === 'recycled'
                return true
              })
              .map(receipt => (
                <div key={receipt.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="text-3xl mr-4">{receipt.image}</div>
                      <div>
                        <div className="font-medium text-gray-900">{receipt.product}</div>
                        <div className="text-sm text-gray-600">{receipt.merchant}</div>
                        <div className="text-xs text-gray-500 flex items-center mt-1">
                          <Calendar className="w-3 h-3 mr-1" />
                          {receipt.date}
                          <MapPin className="w-3 h-3 ml-3 mr-1" />
                          {receipt.purchaseLocation}
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="font-medium text-gray-900">${receipt.amount}</div>
                      <div className={`text-xs px-2 py-1 rounded mt-1 ${getStatusColor(receipt.status)}`}>
                        {receipt.status}
                      </div>
                      <div className="flex gap-2 mt-2">
                        <button 
                          onClick={() => setSelectedReceipt(receipt)}
                          className="text-blue-600 hover:text-blue-800 text-sm flex items-center"
                        >
                          <Eye className="w-3 h-3 mr-1" />
                          View
                        </button>
                        <button className="text-gray-600 hover:text-gray-800 text-sm flex items-center">
                          <Download className="w-3 h-3 mr-1" />
                          Export
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Sustainability indicators */}
                  <div className="mt-3 flex items-center text-xs text-gray-600">
                    <div className="flex items-center mr-4">
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-1"></div>
                      {receipt.carbonFootprint}
                    </div>
                    <div className="flex items-center">
                      <Recycle className="w-3 h-3 mr-1" />
                      {receipt.recyclabilityScore}% recyclable
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {activeTab === 'sustainability' && (
        <div className="space-y-6">
          {/* Impact Overview */}
          <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">🌱 Your Environmental Impact</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600">12.8kg</div>
                <div className="text-sm text-gray-600">CO₂ Footprint Tracked</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">2.3kg</div>
                <div className="text-sm text-gray-600">CO₂ Saved by Recycling</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600">76%</div>
                <div className="text-sm text-gray-600">Avg. Recyclability</div>
              </div>
            </div>
          </div>

          {/* Items by Category */}
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Items by Category</h3>
            <div className="space-y-4">
              {[
                { category: 'Electronics', count: 3, footprint: '12.8kg CO₂eq', recyclability: 76 },
                { category: 'Smartphones', count: 1, footprint: '4.2kg CO₂eq', recyclability: 85 },
                { category: 'Laptops', count: 1, footprint: '6.8kg CO₂eq', recyclability: 78 }
              ].map((item, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <div className="font-medium text-gray-900">{item.category}</div>
                    <div className="text-sm text-gray-600">{item.count} items</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-gray-900">{item.footprint}</div>
                    <div className="text-xs text-green-600">{item.recyclability}% recyclable</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recycling Tips */}
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">♻️ Recycling Recommendations</h3>
            <div className="space-y-4">
              {[
                { tip: "Your iPhone 15 Pro is ready for recycling - trade it in for eco credits!", urgent: true },
                { tip: "MacBook Air M2 still has high resale value - consider selling instead of recycling", urgent: false },
                { tip: "Electronics contain valuable materials - always use certified recycling centers", urgent: false }
              ].map((item, index) => (
                <div key={index} className={`p-4 rounded-lg border-l-4 ${
                  item.urgent ? 'bg-orange-50 border-orange-400' : 'bg-blue-50 border-blue-400'
                }`}>
                  <div className="flex items-center">
                    {item.urgent ? (
                      <AlertCircle className="w-5 h-5 text-orange-600 mr-3" />
                    ) : (
                      <CheckCircle className="w-5 h-5 text-blue-600 mr-3" />
                    )}
                    <span className="text-sm">{item.tip}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Receipt Modal */}
      <ReceiptModal
        receipt={selectedReceipt}
        isOpen={!!selectedReceipt}
        onClose={() => setSelectedReceipt(null)}
      />
    </div>
  )
}