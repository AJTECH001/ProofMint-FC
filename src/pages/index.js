import Head from 'next/head'
import { useState, useEffect } from 'react'
import { useAccount } from 'wagmi'
import { Package, ShoppingCart, Recycle, Users, TrendingUp, FileText } from 'lucide-react'
import dynamic from 'next/dynamic'
import ProofMintDemo from '../components/ProofMintDemo'
import MerchantDashboard from '../components/MerchantDashboard'
import ConsumerDashboard from '../components/ConsumerDashboard'
import AdminDashboard from '../components/AdminDashboard'

// Client-side only ConnectButton to prevent hydration issues
const ClientConnectButton = dynamic(() => 
  import('@rainbow-me/rainbowkit').then(mod => ({ default: mod.ConnectButton })), 
  { ssr: false }
)

export default function Home() {
  const { address, isConnected } = useAccount()
  const [activeTab, setActiveTab] = useState('demo')
  
  // Prevent hydration mismatch
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  // Demo stats
  const stats = [
    { icon: FileText, label: 'Receipts Issued', value: '1,247', change: '+12%' },
    { icon: Users, label: 'Active Merchants', value: '89', change: '+5%' },
    { icon: Recycle, label: 'Items Recycled', value: '432', change: '+18%' },
    { icon: TrendingUp, label: 'CO2 Offset', value: '2.1T', change: '+25%' },
  ]

  const features = [
    {
      icon: Package,
      title: 'Digital Receipt NFTs',
      description: 'Issue immutable digital receipts stored on Filecoin with PDP verification'
    },
    {
      icon: ShoppingCart,
      title: 'Merchant Integration',
      description: 'Easy integration for retailers with subscription-based receipt issuance'
    },
    {
      icon: Recycle,
      title: 'Lifecycle Tracking',
      description: 'Track gadgets from purchase through recycling with transparent verification'
    }
  ]

  return (
    <div className="min-h-screen">
      <Head>
        <title>ProofMint MVP - Digital Receipts on Filecoin</title>
        <meta name="description" content="Revolutionary digital receipt system with gadget lifecycle tracking on Filecoin" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <h1 className="text-2xl font-bold text-gray-900">
                  Proof<span className="text-blue-600">Mint</span>
                  <span className="text-sm font-normal text-gray-500 ml-2">MVP</span>
                </h1>
              </div>
              <div className="ml-6 text-sm text-gray-600">
                Powered by <span className="font-semibold text-blue-600">Filecoin</span> + Synapse SDK
              </div>
            </div>
            <div className="flex items-center space-x-4">
              {mounted && <ClientConnectButton />}
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
                Revolutionizing Digital Receipts with 
                <span className="text-blue-600"> Filecoin Storage</span>
              </h2>
              <p className="text-xl text-gray-600 mb-8">
                Issue NFT receipts, track gadget lifecycles, and verify recycling with 
                immutable proof stored on Filecoin using PDP (Proof of Data Possession)
              </p>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
                <p className="text-blue-800">
                  🚀 <strong>Wave 2 MVP Demo:</strong> This working prototype demonstrates real-world 
                  Filecoin storage utility for sustainable commerce and e-waste tracking.
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

            {/* Technology Stack */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4 text-center">
                Built with Filecoin Onchain Cloud
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="font-semibold text-blue-900">Synapse SDK</div>
                  <div className="text-sm text-blue-700">Storage & Retrieval</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="font-semibold text-green-900">PDP Verification</div>
                  <div className="text-sm text-green-700">Data Integrity</div>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <div className="font-semibold text-purple-900">FilCDN</div>
                  <div className="text-sm text-purple-700">Fast Retrieval</div>
                </div>
                <div className="text-center p-4 bg-orange-50 rounded-lg">
                  <div className="font-semibold text-orange-900">Smart Contracts</div>
                  <div className="text-sm text-orange-700">NFT Receipts</div>
                </div>
              </div>
            </div>

            <div className="text-center">
              <p className="text-gray-600 mb-4">Connect your wallet to Filecoin Calibration testnet to try the live demo</p>
              {mounted && <ClientConnectButton />}
            </div>
          </div>
        ) : (
          <div>
            {/* Navigation Tabs */}
            <div className="flex space-x-1 mb-8 bg-gray-100 p-1 rounded-lg">
              <button
                onClick={() => setActiveTab('demo')}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                  activeTab === 'demo'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                🚀 Live Demo
              </button>
              <button
                onClick={() => setActiveTab('merchant')}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                  activeTab === 'merchant'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Merchant Portal
              </button>
              <button
                onClick={() => setActiveTab('consumer')}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                  activeTab === 'consumer'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                My Receipts
              </button>
              <button
                onClick={() => setActiveTab('admin')}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                  activeTab === 'admin'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Admin Panel
              </button>
            </div>

            {/* Tab Content */}
            <div className="fade-in">
              {activeTab === 'demo' && <ProofMintDemo />}
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
            <p>🚀 ProofMint MVP - Built for Filecoin OC Wave 2</p>
            <p className="text-sm mt-2">Demonstrating real-world utility of decentralized storage for sustainable commerce</p>
          </div>
        </div>
      </footer>
    </div>
  )
}