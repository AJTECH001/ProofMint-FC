import { useState } from 'react'
import { useAccount, useChainId } from 'wagmi'
import { 
  Users, Settings, TrendingUp, Shield, AlertTriangle, CheckCircle, 
  FileText, Package, Recycle, DollarSign, Calendar, Eye, UserPlus,
  Ban, Award, BarChart3, PieChart, Activity, X
} from 'lucide-react'
import { useProofMintContract } from '../hooks/useProofMintContract'

export default function AdminDashboard() {
  const { address } = useAccount()
  const chainId = useChainId()
  const contract = useProofMintContract()
  
  const [activeTab, setActiveTab] = useState('overview')
  const [selectedMerchant, setSelectedMerchant] = useState(null)
  const [showAddMerchantModal, setShowAddMerchantModal] = useState(false)
  const [addMerchantForm, setAddMerchantForm] = useState({
    name: '',
    email: '',
    address: ''
  })
  const [isAddingMerchant, setIsAddingMerchant] = useState(false)
  
  // Demo admin data
  const [platformStats] = useState({
    totalMerchants: 89,
    totalReceipts: 1247,
    totalRevenue: 125000,
    recycledItems: 432,
    monthlyGrowth: 12.5,
    storageUsed: '2.4TB',
    networkHealth: 98.5
  })

  const [merchants] = useState([
    {
      id: 1,
      name: 'Demo Electronics Store',
      address: '0xabcd...1234',
      email: 'demo@electronics.com',
      status: 'verified',
      tier: 'Premium',
      receiptsIssued: 247,
      joinedDate: '2023-10-15',
      lastActive: '2024-01-15',
      revenue: 45000,
      recyclingRate: 23
    },
    {
      id: 2,
      name: 'Tech World Store',
      address: '0x1234...abcd',
      email: 'info@techworld.com',
      status: 'verified',
      tier: 'Enterprise',
      receiptsIssued: 189,
      joinedDate: '2023-11-20',
      lastActive: '2024-01-14',
      revenue: 38000,
      recyclingRate: 18
    },
    {
      id: 3,
      name: 'Audio Paradise',
      address: '0x5678...efgh',
      email: 'sales@audioparadise.com',
      status: 'pending',
      tier: 'Basic',
      receiptsIssued: 67,
      joinedDate: '2024-01-05',
      lastActive: '2024-01-12',
      revenue: 12000,
      recyclingRate: 8
    }
  ])

  const [recentActivity] = useState([
    { type: 'merchant_verified', merchant: 'Audio Paradise', timestamp: '2024-01-15 14:30', details: 'Merchant verification completed' },
    { type: 'receipt_issued', merchant: 'Demo Electronics Store', timestamp: '2024-01-15 13:45', details: 'Receipt NFT #1247 issued' },
    { type: 'recycling', merchant: 'Tech World Store', timestamp: '2024-01-15 12:20', details: 'Item recycled: MacBook Pro 2019' },
    { type: 'subscription', merchant: 'Audio Paradise', timestamp: '2024-01-15 11:15', details: 'Upgraded to Premium plan' },
    { type: 'issue_reported', merchant: 'Demo Electronics Store', timestamp: '2024-01-15 10:30', details: 'Item reported stolen: iPhone 14' }
  ])

  const [systemHealth] = useState([
    { component: 'Filecoin Storage', status: 'healthy', uptime: '99.8%', lastCheck: '5 mins ago' },
    { component: 'Synapse SDK', status: 'healthy', uptime: '99.2%', lastCheck: '2 mins ago' },
    { component: 'Smart Contracts', status: 'healthy', uptime: '100%', lastCheck: '1 min ago' },
    { component: 'IPFS Gateway', status: 'warning', uptime: '97.5%', lastCheck: '3 mins ago' },
    { component: 'Database', status: 'healthy', uptime: '99.9%', lastCheck: '1 min ago' }
  ])

  const getStatusColor = (status) => {
    switch (status) {
      case 'verified': return 'bg-green-100 text-green-800'
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'suspended': return 'bg-red-100 text-red-800'
      case 'healthy': return 'bg-green-100 text-green-800'
      case 'warning': return 'bg-yellow-100 text-yellow-800'
      case 'error': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const addMerchant = async () => {
    if (!addMerchantForm.address || !contract.isConnected) {
      alert('Please connect wallet and provide merchant address')
      return
    }

    // Validate Ethereum address format
    if (!addMerchantForm.address.match(/^0x[a-fA-F0-9]{40}$/)) {
      alert('Please provide a valid Ethereum address')
      return
    }

    setIsAddingMerchant(true)
    
    try {
      // Check if contract is deployed
      if (!contract.contractAddress || contract.contractAddress === "0x0000000000000000000000000000000000000000") {
        alert('Smart contract not deployed yet. Please deploy the contract first.')
        setIsAddingMerchant(false)
        return
      }

      // Check if already a verified merchant
      const isAlreadyVerified = await contract.isVerifiedMerchant(addMerchantForm.address)
      if (isAlreadyVerified) {
        alert('This address is already a verified merchant')
        setIsAddingMerchant(false)
        return
      }

      console.log('Adding merchant:', addMerchantForm.address)
      
      // Call the smart contract addMerchant function
      const hash = await contract.addMerchant(addMerchantForm.address)
      
      console.log('Transaction hash:', hash)
      alert(`Merchant being added! Transaction: ${hash}`)
      
      // Reset form
      setAddMerchantForm({ name: '', email: '', address: '' })
      setShowAddMerchantModal(false)
      
      // Wait for confirmation
      setTimeout(() => {
        alert('Merchant added successfully! They can now purchase subscriptions.')
      }, 3000)
      
    } catch (error) {
      console.error('Error adding merchant:', error)
      
      if (error.message.includes('OnlyAdmin')) {
        alert('Only the contract owner can add merchants')
      } else if (error.message.includes('rejected')) {
        alert('Transaction was rejected')
      } else {
        alert(`Error adding merchant: ${error.message}`)
      }
    } finally {
      setIsAddingMerchant(false)
    }
  }

  const getActivityIcon = (type) => {
    switch (type) {
      case 'merchant_verified': return <CheckCircle className="w-4 h-4 text-green-600" />
      case 'receipt_issued': return <FileText className="w-4 h-4 text-blue-600" />
      case 'recycling': return <Recycle className="w-4 h-4 text-green-600" />
      case 'subscription': return <Award className="w-4 h-4 text-purple-600" />
      case 'issue_reported': return <AlertTriangle className="w-4 h-4 text-red-600" />
      default: return <Activity className="w-4 h-4 text-gray-600" />
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

  const MerchantModal = ({ merchant, isOpen, onClose }) => {
    if (!isOpen || !merchant) return null

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-96 overflow-y-auto">
          <div className="p-6">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="text-xl font-bold text-gray-900">{merchant.name}</h3>
                <p className="text-gray-600">Merchant Details & Management</p>
              </div>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 text-xl"
              >
                ×
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Merchant Info */}
              <div className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Status:</span>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(merchant.status)}`}>
                      {merchant.status}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tier:</span>
                    <span className="font-medium">{merchant.tier}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Address:</span>
                    <span className="font-mono text-sm">{merchant.address}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Email:</span>
                    <span className="text-sm">{merchant.email}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Joined:</span>
                    <span className="text-sm">{merchant.joinedDate}</span>
                  </div>
                </div>
              </div>

              {/* Performance Stats */}
              <div className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Receipts Issued:</span>
                    <span className="font-medium">{merchant.receiptsIssued}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Revenue:</span>
                    <span className="font-medium">${merchant.revenue.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Recycling Rate:</span>
                    <span className="font-medium">{merchant.recyclingRate}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Last Active:</span>
                    <span className="text-sm">{merchant.lastActive}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              {merchant.status === 'pending' && (
                <button className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center">
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Verify Merchant
                </button>
              )}
              {merchant.status === 'verified' && (
                <button className="flex-1 bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center">
                  <Ban className="w-4 h-4 mr-2" />
                  Suspend Merchant
                </button>
              )}
              <button className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center">
                <Eye className="w-4 h-4 mr-2" />
                View Details
              </button>
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
            <h2 className="text-2xl font-bold text-gray-900">Admin Panel</h2>
            <p className="text-gray-600">Platform management and analytics</p>
            <div className="flex items-center mt-2">
              <div className="flex items-center text-blue-600">
                <Shield className="w-4 h-4 mr-1" />
                <span className="text-sm font-medium">Administrator Access</span>
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-600">Admin Wallet</div>
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
            id="merchants"
            label="🏪 Merchants"
            isActive={activeTab === 'merchants'}
            onClick={() => setActiveTab('merchants')}
          />
          <TabButton
            id="analytics"
            label="📈 Analytics"
            isActive={activeTab === 'analytics'}
            onClick={() => setActiveTab('analytics')}
          />
          <TabButton
            id="system"
            label="⚙️ System Health"
            isActive={activeTab === 'system'}
            onClick={() => setActiveTab('system')}
          />
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Platform Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <div className="text-2xl font-bold text-gray-900">{platformStats.totalMerchants}</div>
                  <div className="text-sm text-gray-600">Total Merchants</div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border p-6">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-lg">
                  <FileText className="w-6 h-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <div className="text-2xl font-bold text-gray-900">{platformStats.totalReceipts.toLocaleString()}</div>
                  <div className="text-sm text-gray-600">Total Receipts</div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border p-6">
              <div className="flex items-center">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <DollarSign className="w-6 h-6 text-purple-600" />
                </div>
                <div className="ml-4">
                  <div className="text-2xl font-bold text-gray-900">${platformStats.totalRevenue.toLocaleString()}</div>
                  <div className="text-sm text-gray-600">Platform Revenue</div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border p-6">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Recycle className="w-6 h-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <div className="text-2xl font-bold text-gray-900">{platformStats.recycledItems}</div>
                  <div className="text-sm text-gray-600">Items Recycled</div>
                </div>
              </div>
            </div>
          </div>

          {/* Growth Metrics */}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">📈 Platform Growth</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">+{platformStats.monthlyGrowth}%</div>
                <div className="text-sm text-gray-600">Monthly Growth</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">{platformStats.storageUsed}</div>
                <div className="text-sm text-gray-600">Storage Used</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{platformStats.networkHealth}%</div>
                <div className="text-sm text-gray-600">Network Health</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">18.2s</div>
                <div className="text-sm text-gray-600">Avg Response Time</div>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Recent Platform Activity</h3>
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                  <div className="flex-shrink-0 mt-0.5">
                    {getActivityIcon(activity.type)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <div className="font-medium text-gray-900">{activity.merchant}</div>
                      <div className="text-xs text-gray-500">{activity.timestamp}</div>
                    </div>
                    <div className="text-sm text-gray-600">{activity.details}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'merchants' && (
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Merchant Management</h3>
            <button 
              onClick={() => setShowAddMerchantModal(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
            >
              <UserPlus className="w-4 h-4 mr-2" />
              Add Merchant
            </button>
          </div>
          
          <div className="space-y-4">
            {merchants.map(merchant => (
              <div key={merchant.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="p-2 bg-blue-100 rounded-lg mr-4">
                      <Users className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">{merchant.name}</div>
                      <div className="text-sm text-gray-600">{merchant.email}</div>
                      <div className="text-xs text-gray-500 font-mono">{merchant.address}</div>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className={`text-xs px-2 py-1 rounded mb-1 ${getStatusColor(merchant.status)}`}>
                      {merchant.status}
                    </div>
                    <div className="text-sm font-medium text-gray-900">{merchant.tier}</div>
                    <div className="text-xs text-gray-600">{merchant.receiptsIssued} receipts</div>
                  </div>
                </div>
                
                <div className="mt-3 flex items-center justify-between">
                  <div className="flex items-center text-sm text-gray-600">
                    <Calendar className="w-3 h-3 mr-1" />
                    Joined {merchant.joinedDate}
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => setSelectedMerchant(merchant)}
                      className="text-blue-600 hover:text-blue-800 text-sm flex items-center"
                    >
                      <Eye className="w-3 h-3 mr-1" />
                      View
                    </button>
                    {merchant.status === 'pending' && (
                      <button className="text-green-600 hover:text-green-800 text-sm flex items-center">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Verify
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'analytics' && (
        <div className="space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-gray-900">847</div>
                  <div className="text-sm text-gray-600">Active Users</div>
                </div>
                <BarChart3 className="w-8 h-8 text-blue-600" />
              </div>
              <div className="mt-2 text-sm text-green-600">↑ 12.5% from last month</div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border p-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-gray-900">$47.2K</div>
                  <div className="text-sm text-gray-600">Monthly Revenue</div>
                </div>
                <PieChart className="w-8 h-8 text-green-600" />
              </div>
              <div className="mt-2 text-sm text-green-600">↑ 8.3% from last month</div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border p-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-gray-900">94.8%</div>
                  <div className="text-sm text-gray-600">Satisfaction Rate</div>
                </div>
                <TrendingUp className="w-8 h-8 text-purple-600" />
              </div>
              <div className="mt-2 text-sm text-green-600">↑ 2.1% from last month</div>
            </div>
          </div>

          {/* Category Breakdown */}
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Receipt Categories</h3>
            <div className="space-y-4">
              {[
                { category: 'Electronics', count: 647, percentage: 52, revenue: 78500 },
                { category: 'Smartphones', count: 423, percentage: 34, revenue: 52300 },
                { category: 'Laptops', count: 177, percentage: 14, revenue: 34200 }
              ].map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-4 h-4 bg-blue-500 rounded mr-3"></div>
                    <div>
                      <div className="font-medium text-gray-900">{item.category}</div>
                      <div className="text-sm text-gray-600">{item.count} receipts</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium text-gray-900">${item.revenue.toLocaleString()}</div>
                    <div className="text-sm text-gray-600">{item.percentage}%</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Geographic Distribution */}
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Geographic Distribution</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                {[
                  { location: 'California', merchants: 23, receipts: 456 },
                  { location: 'New York', merchants: 18, receipts: 342 },
                  { location: 'Texas', merchants: 15, receipts: 289 },
                  { location: 'Florida', merchants: 12, receipts: 234 }
                ].map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                    <div>
                      <div className="font-medium text-gray-900">{item.location}</div>
                      <div className="text-sm text-gray-600">{item.merchants} merchants</div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium text-gray-900">{item.receipts}</div>
                      <div className="text-xs text-gray-600">receipts</div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex items-center justify-center bg-gray-100 rounded-lg">
                <div className="text-gray-500">Map visualization would go here</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'system' && (
        <div className="space-y-6">
          {/* System Health */}
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">System Health Monitor</h3>
            <div className="space-y-4">
              {systemHealth.map((component, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center">
                    <div className={`w-3 h-3 rounded-full mr-3 ${
                      component.status === 'healthy' ? 'bg-green-500' : 
                      component.status === 'warning' ? 'bg-yellow-500' : 'bg-red-500'
                    }`}></div>
                    <div>
                      <div className="font-medium text-gray-900">{component.component}</div>
                      <div className="text-sm text-gray-600">Uptime: {component.uptime}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`text-xs px-2 py-1 rounded ${getStatusColor(component.status)}`}>
                      {component.status}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">{component.lastCheck}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Storage & Performance */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Storage Usage</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Filecoin Storage</span>
                    <span>2.4TB / 10TB</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-blue-600 h-2 rounded-full" style={{ width: '24%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Database</span>
                    <span>1.8GB / 5GB</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-green-600 h-2 rounded-full" style={{ width: '36%' }}></div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Metrics</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">API Response Time</span>
                  <span className="font-medium">142ms</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Storage Latency</span>
                  <span className="font-medium">2.3s</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Error Rate</span>
                  <span className="font-medium">0.02%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Active Connections</span>
                  <span className="font-medium">1,247</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Merchant Modal */}
      <MerchantModal
        merchant={selectedMerchant}
        isOpen={!!selectedMerchant}
        onClose={() => setSelectedMerchant(null)}
      />

      {/* Add Merchant Modal */}
      {showAddMerchantModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Add New Merchant</h3>
              <button
                onClick={() => setShowAddMerchantModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Merchant Wallet Address *
                </label>
                <input
                  type="text"
                  value={addMerchantForm.address}
                  onChange={(e) => setAddMerchantForm(prev => ({ ...prev, address: e.target.value }))}
                  placeholder="0x..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Business Name (Optional)
                </label>
                <input
                  type="text"
                  value={addMerchantForm.name}
                  onChange={(e) => setAddMerchantForm(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="e.g. Demo Electronics Store"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email (Optional)
                </label>
                <input
                  type="email"
                  value={addMerchantForm.email}
                  onChange={(e) => setAddMerchantForm(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="merchant@example.com"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {!contract.isConnected && (
                <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-yellow-800 text-sm">
                    ⚠️ Please connect your wallet to add merchants
                  </p>
                </div>
              )}

              {contract.contractAddress === "" && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-800 text-sm">
                    ⚠️ Smart contract not deployed yet. Please deploy first.
                  </p>
                </div>
              )}

              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setShowAddMerchantModal(false)}
                  className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={addMerchant}
                  disabled={!addMerchantForm.address || !contract.isConnected || isAddingMerchant}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition-colors flex items-center justify-center"
                >
                  {isAddingMerchant ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      Adding...
                    </>
                  ) : (
                    <>
                      <UserPlus className="w-4 h-4 mr-2" />
                      Add Merchant
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}