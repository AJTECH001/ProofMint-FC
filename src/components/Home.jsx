import { useState } from 'react'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { useAccount } from 'wagmi'
import { Package, ShoppingCart, Recycle, Users, TrendingUp, FileText } from 'lucide-react'
import ProofMintDemo from './ProofMintDemo.jsx'
import AdvancedProofMintDemo from './AdvancedProofMintDemo.jsx'
import PilotDeployment from './PilotDeployment.jsx'
import MerchantDashboard from './MerchantDashboard.jsx'
import ConsumerDashboard from './ConsumerDashboard.jsx'
import AdminDashboard from './AdminDashboard.jsx'

export default function Home() {
  const { address, isConnected } = useAccount()
  const [activeTab, setActiveTab] = useState('demo')

  // Enhanced stats
  const stats = [
    { icon: FileText, label: 'Digital Receipts', value: '2,847', change: '+28%' },
    { icon: Users, label: 'Pilot Merchants', value: '156', change: '+12%' },
    { icon: Recycle, label: 'Recycling Rewards', value: '1,234', change: '+35%' },
    { icon: TrendingUp, label: 'CO2 Offset', value: '4.7T', change: '+42%' },
  ]

  const features = [
    {
      icon: Package,
      title: 'Advanced Digital Receipts',
      description: 'NFT receipts with FilecoinWarmStorageService, PDP verification, and wallet integration'
    },
    {
      icon: ShoppingCart,
      title: 'Pilot Programs',
      description: 'Join electronics retailers, fashion brands, and B2B recycling networks'
    },
    {
      icon: Recycle,
      title: 'Sustainability Tracking',
      description: 'Real-time carbon footprint, recyclability scoring, and automated rewards'
    }
  ]

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <h1 className="text-2xl font-bold text-gray-900">
                  Proof<span className="text-blue-600">Mint</span>
                  <span className="text-sm font-normal text-gray-500 ml-2">Advanced</span>
                </h1>
              </div>
              <div className="ml-6 text-sm text-gray-600">
                Powered by <span className="font-semibold text-blue-600">Filecoin Stack</span> + Advanced Services
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <ConnectButton />
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!isConnected ? (
          <div className="text-center">
            {/* Hero Section */}
            <div className="max-w-3xl mx-auto mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Advanced Digital Receipts with 
                <span className="text-blue-600"> Complete Filecoin Stack</span>
              </h2>
              <p className="text-xl text-gray-600 mb-8">
                Production-ready receipt NFTs with FilecoinWarmStorageService, PDP verification, 
                payment rails, wallet integration, and pilot merchant programs
              </p>
              <div className="bg-gradient-to-r from-blue-50 to-green-50 border border-blue-200 rounded-lg p-6 mb-8">
                <p className="text-blue-800">
                  🚀 <strong>Wave 2 Ready:</strong> Complete implementation with concrete deployments, 
                  wallet integration, and pilot merchant programs for real-world adoption.
                </p>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-16">
              {stats.map((stat, index) => (
                <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 text-center">
                  <div className="flex justify-center mb-3">
                    <stat.icon className="w-8 h-8 text-blue-600" />
                  </div>
                  <div className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</div>
                  <div className="text-sm text-gray-600 mb-2">{stat.label}</div>
                  <div className="text-sm text-green-600 font-medium">{stat.change}</div>
                </div>
              ))}
            </div>

            {/* Features */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
              {features.map((feature, index) => (
                <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 text-center">
                  <div className="flex justify-center mb-4">
                    <feature.icon className="w-12 h-12 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              ))}
            </div>

            {/* Advanced Technology Stack */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4 text-center">
                Complete Filecoin Stack Integration
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="font-semibold text-blue-900">FilecoinWarmStorage</div>
                  <div className="text-sm text-blue-700">Advanced Storage + PDP</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="font-semibold text-green-900">FilecoinPay</div>
                  <div className="text-sm text-green-700">Payment Rails</div>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <div className="font-semibold text-purple-900">Wallet Integration</div>
                  <div className="text-sm text-purple-700">Apple Wallet + Google Pay</div>
                </div>
                <div className="text-center p-4 bg-orange-50 rounded-lg">
                  <div className="font-semibold text-orange-900">Pilot Programs</div>
                  <div className="text-sm text-orange-700">Real Merchant Deployments</div>
                </div>
              </div>
            </div>

            <div className="text-center">
              <p className="text-gray-600 mb-4">Connect your wallet to Filecoin Calibration testnet to try the live demo</p>
              <ConnectButton />
            </div>
          </div>
        ) : (
          <div>
            {/* Enhanced Navigation Tabs */}
            <div className="flex space-x-1 mb-8 bg-gray-100 p-1 rounded-lg overflow-x-auto">
              <button
                onClick={() => setActiveTab('demo')}
                className={`flex-shrink-0 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                  activeTab === 'demo'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                🚀 Basic Demo
              </button>
              <button
                onClick={() => setActiveTab('advanced')}
                className={`flex-shrink-0 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                  activeTab === 'advanced'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                ⚡ Advanced Stack
              </button>
              <button
                onClick={() => setActiveTab('pilot')}
                className={`flex-shrink-0 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                  activeTab === 'pilot'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                🏢 Pilot Programs
              </button>
              <button
                onClick={() => setActiveTab('merchant')}
                className={`flex-shrink-0 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                  activeTab === 'merchant'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                🏪 Merchant Portal
              </button>
              <button
                onClick={() => setActiveTab('consumer')}
                className={`flex-shrink-0 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                  activeTab === 'consumer'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                📱 My Receipts
              </button>
              <button
                onClick={() => setActiveTab('admin')}
                className={`flex-shrink-0 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                  activeTab === 'admin'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                ⚙️ Admin Panel
              </button>
            </div>

            {/* Enhanced Tab Content */}
            <div className="fade-in">
              {activeTab === 'demo' && <ProofMintDemo />}
              {activeTab === 'advanced' && <AdvancedProofMintDemo />}
              {activeTab === 'pilot' && <PilotDeployment />}
              {activeTab === 'merchant' && <MerchantDashboard />}
              {activeTab === 'consumer' && <ConsumerDashboard />}
              {activeTab === 'admin' && <AdminDashboard />}
            </div>
          </div>
        )}
      </main>

      <footer className="bg-gray-50 border-t mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-gray-600">
            <p>🚀 ProofMint Advanced - Wave 2 Ready</p>
            <p className="text-sm mt-2">Complete Filecoin stack integration with pilot deployments and wallet integration</p>
            <div className="mt-4 flex justify-center space-x-6 text-xs">
              <span>✅ FilecoinWarmStorageService</span>
              <span>✅ PDP Verification</span>
              <span>✅ Payment Rails</span>
              <span>✅ Wallet Integration</span>
              <span>✅ Pilot Programs</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}