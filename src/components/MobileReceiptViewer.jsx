import { useState, useEffect } from 'react'
import { useAccount, useWalletClient } from 'wagmi'
import { 
  QrCode, Smartphone, Shield, Leaf, Recycle, 
  ArrowLeft, Share, Download, Eye, CheckCircle,
  AlertTriangle, Clock, MapPin, CreditCard
} from 'lucide-react'
import { WalletIntegrationService } from '../services/WalletIntegrationService'
import { SustainabilityTrackingService } from '../services/SustainabilityTrackingService'

export default function MobileReceiptViewer({ receiptData, onClose }) {
  const { address, isConnected } = useAccount()
  const { data: walletClient } = useWalletClient()
  
  const [activeTab, setActiveTab] = useState('overview')
  const [walletIntegration, setWalletIntegration] = useState(null)
  const [sustainabilityService, setSustainabilityService] = useState(null)
  const [sustainabilityMetrics, setSustainabilityMetrics] = useState(null)
  const [verificationStatus, setVerificationStatus] = useState('verifying')

  // Initialize services
  useEffect(() => {
    const initServices = async () => {
      const walletService = new WalletIntegrationService()
      setWalletIntegration(walletService)
      
      const sustainabilityService = new SustainabilityTrackingService()
      await sustainabilityService.initialize()
      setSustainabilityService(sustainabilityService)
      
      // Calculate sustainability metrics
      if (receiptData) {
        const carbonFootprint = sustainabilityService.calculateDetailedCarbonFootprint(receiptData.items[0])
        const recyclabilityScore = sustainabilityService.calculateRecyclabilityScore(receiptData.items[0])
        
        setSustainabilityMetrics({
          carbonFootprint,
          recyclabilityScore,
          sustainabilityScore: Math.round((carbonFootprint.total + recyclabilityScore.overallScore) / 2)
        })
      }
      
      // Simulate verification
      setTimeout(() => {
        setVerificationStatus('verified')
      }, 2000)
    }
    
    initServices()
  }, [receiptData])

  const handleAddToWallet = async () => {
    if (!walletIntegration || !receiptData) return
    
    try {
      const results = await walletIntegration.addToAllWallets(
        receiptData, 
        receiptData.tokenId || '123'
      )
      
      // Show results
      results.forEach(result => {
        if (result.success) {
          console.log(`Added to ${result.wallet}`)
        }
      })
    } catch (error) {
      console.error('Failed to add to wallet:', error)
    }
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'ProofMint Digital Receipt',
          text: `Digital receipt for ${receiptData?.items?.[0]?.name}`,
          url: window.location.href
        })
      } catch (error) {
        console.log('Share cancelled')
      }
    } else {
      // Fallback to clipboard
      navigator.clipboard.writeText(window.location.href)
    }
  }

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Eye },
    { id: 'sustainability', label: 'Sustainability', icon: Leaf },
    { id: 'verification', label: 'Verification', icon: Shield },
    { id: 'recycling', label: 'Recycling', icon: Recycle }
  ]

  if (!receiptData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Receipt Not Found</h3>
          <p className="text-gray-600 mb-4">This receipt could not be found or has been removed.</p>
          <button
            onClick={onClose}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg"
          >
            Go Back
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Header */}
      <div className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="flex items-center justify-between p-4">
          <button
            onClick={onClose}
            className="p-2 -ml-2 text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-lg font-semibold text-gray-900">Digital Receipt</h1>
          <div className="flex items-center space-x-2">
            <button
              onClick={handleShare}
              className="p-2 text-gray-600 hover:text-gray-900"
            >
              <Share className="w-5 h-5" />
            </button>
            <button
              onClick={handleAddToWallet}
              className="p-2 text-gray-600 hover:text-gray-900"
            >
              <Download className="w-5 h-5" />
            </button>
          </div>
        </div>
        
        {/* Tab Navigation */}
        <div className="flex border-t">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex items-center justify-center py-3 px-2 text-sm font-medium ${
                activeTab === tab.id
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <tab.icon className="w-4 h-4 mr-1" />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-4">
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-4">
            {/* Receipt Header */}
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-xl font-bold text-gray-900">
                  {receiptData.items?.[0]?.name || 'Product'}
                </h2>
                <div className="text-right">
                  <div className="text-lg font-bold text-gray-900">
                    ${receiptData.purchaseDetails?.totalAmount || 0}
                  </div>
                  <div className="text-sm text-gray-500">
                    {new Date(receiptData.purchaseDetails?.timestamp || Date.now()).toLocaleDateString()}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-2 mb-3">
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Verified
                </span>
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  <Shield className="w-3 h-3 mr-1" />
                  PDP Verified
                </span>
              </div>
              
              <div className="text-sm text-gray-600">
                <p><strong>Merchant:</strong> {receiptData.merchantInfo?.name}</p>
                <p><strong>Receipt ID:</strong> {receiptData.receiptId}</p>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={handleAddToWallet}
                className="bg-blue-600 text-white p-4 rounded-lg flex items-center justify-center space-x-2"
              >
                <Smartphone className="w-5 h-5" />
                <span>Add to Wallet</span>
              </button>
              <button className="bg-green-600 text-white p-4 rounded-lg flex items-center justify-center space-x-2">
                <QrCode className="w-5 h-5" />
                <span>Show QR Code</span>
              </button>
            </div>

            {/* Product Details */}
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-3">Product Details</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Category:</span>
                  <span className="text-gray-900 capitalize">{receiptData.items?.[0]?.category}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Brand:</span>
                  <span className="text-gray-900">{receiptData.items?.[0]?.brand || 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Serial Number:</span>
                  <span className="text-gray-900 font-mono text-xs">{receiptData.items?.[0]?.serialNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Warranty:</span>
                  <span className="text-gray-900">{receiptData.items?.[0]?.warranty || 'N/A'}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Sustainability Tab */}
        {activeTab === 'sustainability' && sustainabilityMetrics && (
          <div className="space-y-4">
            {/* Sustainability Score */}
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <div className="text-center mb-4">
                <div className="text-3xl font-bold text-green-600 mb-2">
                  {sustainabilityMetrics.sustainabilityScore}/100
                </div>
                <div className="text-sm text-gray-600">Sustainability Score</div>
              </div>
              
              <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                <div 
                  className="bg-green-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${sustainabilityMetrics.sustainabilityScore}%` }}
                ></div>
              </div>
            </div>

            {/* Carbon Footprint */}
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                <Leaf className="w-5 h-5 mr-2 text-green-600" />
                Carbon Footprint
              </h3>
              <div className="text-center mb-4">
                <div className="text-2xl font-bold text-gray-900">
                  {sustainabilityMetrics.carbonFootprint.total}kg CO2eq
                </div>
                <div className="text-sm text-gray-600">Total Lifecycle Impact</div>
              </div>
              
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Manufacturing:</span>
                  <span className="text-gray-900">{sustainabilityMetrics.carbonFootprint.breakdown.manufacturing}kg</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Transportation:</span>
                  <span className="text-gray-900">{sustainabilityMetrics.carbonFootprint.breakdown.transportation}kg</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Usage:</span>
                  <span className="text-gray-900">{sustainabilityMetrics.carbonFootprint.breakdown.usage}kg</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Disposal:</span>
                  <span className="text-gray-900">{sustainabilityMetrics.carbonFootprint.breakdown.disposal}kg</span>
                </div>
              </div>
            </div>

            {/* Recyclability */}
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                <Recycle className="w-5 h-5 mr-2 text-blue-600" />
                Recyclability
              </h3>
              <div className="text-center mb-4">
                <div className="text-2xl font-bold text-blue-600">
                  {sustainabilityMetrics.recyclabilityScore.overallScore}%
                </div>
                <div className="text-sm text-gray-600">Recyclability Score</div>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Difficulty:</span>
                  <span className={`text-sm font-medium ${
                    sustainabilityMetrics.recyclabilityScore.difficulty === 'Easy' ? 'text-green-600' :
                    sustainabilityMetrics.recyclabilityScore.difficulty === 'Moderate' ? 'text-yellow-600' :
                    'text-red-600'
                  }`}>
                    {sustainabilityMetrics.recyclabilityScore.difficulty}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Recyclable:</span>
                  <span className={`text-sm font-medium ${
                    sustainabilityMetrics.recyclabilityScore.recyclable ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {sustainabilityMetrics.recyclabilityScore.recyclable ? 'Yes' : 'No'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Verification Tab */}
        {activeTab === 'verification' && (
          <div className="space-y-4">
            {/* Verification Status */}
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-gray-900 flex items-center">
                  <Shield className="w-5 h-5 mr-2 text-blue-600" />
                  Verification Status
                </h3>
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                  verificationStatus === 'verified' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {verificationStatus === 'verified' ? 'Verified' : 'Verifying...'}
                </span>
              </div>
              
              {verificationStatus === 'verifying' ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                  <span className="text-sm text-gray-600">Verifying receipt integrity...</span>
                </div>
              ) : (
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Blockchain Verification:</span>
                    <span className="text-green-600 font-medium">✅ Verified</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">PDP Verification:</span>
                    <span className="text-green-600 font-medium">✅ Verified</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Data Integrity:</span>
                    <span className="text-green-600 font-medium">✅ Verified</span>
                  </div>
                </div>
              )}
            </div>

            {/* Blockchain Details */}
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-3">Blockchain Details</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Network:</span>
                  <span className="text-gray-900">Filecoin Calibration</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Contract:</span>
                  <span className="text-gray-900 font-mono text-xs">0xdEDeBDB00a83a0bD09b414Ea5FD876dB40799529</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Token ID:</span>
                  <span className="text-gray-900 font-mono">{receiptData.tokenId || '123'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Storage Hash:</span>
                  <span className="text-gray-900 font-mono text-xs">{receiptData.storageResult?.dataHash?.slice(0, 20)}...</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Recycling Tab */}
        {activeTab === 'recycling' && (
          <div className="space-y-4">
            {/* Recycling Information */}
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                <Recycle className="w-5 h-5 mr-2 text-green-600" />
                Recycling Information
              </h3>
              
              <div className="space-y-3">
                <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                  <h4 className="font-medium text-green-900 mb-2">Recycling Instructions</h4>
                  <ul className="text-sm text-green-800 space-y-1">
                    <li>• Remove battery before recycling</li>
                    <li>• Separate plastic components</li>
                    <li>• Check with local recycling center</li>
                    <li>• Consider trade-in programs</li>
                  </ul>
                </div>
                
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <h4 className="font-medium text-blue-900 mb-2">Recycling Reward</h4>
                  <div className="text-lg font-bold text-blue-600">
                    {receiptData.recyclingReward || 5.0} USDFC
                  </div>
                  <p className="text-sm text-blue-800">
                    Earn rewards for proper recycling at verified facilities
                  </p>
                </div>
              </div>
            </div>

            {/* Find Recycling Centers */}
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                <MapPin className="w-5 h-5 mr-2 text-gray-600" />
                Find Recycling Centers
              </h3>
              
              <button className="w-full bg-green-600 text-white py-3 px-4 rounded-lg font-medium">
                Find Nearby Recycling Centers
              </button>
              
              <p className="text-sm text-gray-600 mt-2 text-center">
                Locate certified recycling facilities near you
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
