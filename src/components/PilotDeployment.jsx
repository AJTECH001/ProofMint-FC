import { useState, useEffect } from 'react'
import { useAccount, useWalletClient, useChainId } from 'wagmi'
import { 
  Building2, Users, TrendingUp, CheckCircle, 
  Star, Globe, CreditCard, Shield, FileText,
  ArrowRight, ExternalLink
} from 'lucide-react'

export default function PilotDeployment() {
  const { address, isConnected } = useAccount()
  const chainId = useChainId()
  const { data: walletClient } = useWalletClient()
  
  const [selectedPilot, setSelectedPilot] = useState(null)
  const [onboardingStep, setOnboardingStep] = useState(0)
  const [merchantForm, setMerchantForm] = useState({
    businessName: '',
    businessType: '',
    monthlyTransactions: '',
    sustainabilityGoals: '',
    contactEmail: '',
    website: ''
  })

  // Pilot merchant programs
  const pilotPrograms = [
    {
      id: 'electronics-retailers',
      title: 'Electronics Retailers Pilot',
      description: 'Partner with major electronics retailers to implement digital receipt NFTs',
      icon: Building2,
      status: 'active',
      merchants: 12,
      receipts: 15420,
      co2Saved: '2.3T',
      features: [
        'Digital receipt NFTs with PDP verification',
        'Apple Wallet & Google Pay integration',
        'Automated recycling rewards',
        'Real-time sustainability tracking',
        'Payment escrow with FilecoinPay'
      ],
      requirements: [
        'Minimum 1000 monthly transactions',
        'Sustainability commitment',
        'Technical integration capability',
        'Filecoin Calibration testnet setup'
      ],
      benefits: [
        'Reduced payment disputes by 85%',
        'Increased customer retention by 23%',
        'Automated sustainability reporting',
        'Enhanced brand reputation'
      ]
    },
    {
      id: 'fashion-brands',
      title: 'Fashion Brands Pilot',
      description: 'Sustainable fashion brands implementing circular economy receipts',
      icon: Users,
      status: 'upcoming',
      merchants: 8,
      receipts: 8930,
      co2Saved: '1.7T',
      features: [
        'Circular economy tracking',
        'Material composition verification',
        'Second-hand marketplace integration',
        'Carbon footprint calculation',
        'Supply chain transparency'
      ],
      requirements: [
        'Sustainable fashion certification',
        'Minimum 500 monthly transactions',
        'Material traceability system',
        'Environmental impact reporting'
      ],
      benefits: [
        'Improved supply chain transparency',
        'Enhanced customer trust',
        'Automated sustainability metrics',
        'Access to eco-conscious consumers'
      ]
    },
    {
      id: 'b2b-recycling',
      title: 'B2B Recycling Networks',
      description: 'Enterprise recycling networks with automated reward processing',
      icon: TrendingUp,
      status: 'planning',
      merchants: 5,
      receipts: 2340,
      co2Saved: '0.8T',
      features: [
        'Automated recycling verification',
        'Material recovery tracking',
        'Enterprise payment processing',
        'Compliance reporting',
        'IoT device integration'
      ],
      requirements: [
        'Certified recycling facility',
        'Minimum 1000 items processed monthly',
        'Environmental compliance',
        'Technical integration capability'
      ],
      benefits: [
        'Streamlined payment processing',
        'Automated compliance reporting',
        'Enhanced material recovery',
        'Improved operational efficiency'
      ]
    }
  ]

  const onboardingSteps = [
    {
      title: 'Business Information',
      description: 'Tell us about your business and sustainability goals',
      fields: ['businessName', 'businessType', 'monthlyTransactions', 'sustainabilityGoals']
    },
    {
      title: 'Contact & Integration',
      description: 'Provide contact information and technical requirements',
      fields: ['contactEmail', 'website']
    },
    {
      title: 'Pilot Selection',
      description: 'Choose the pilot program that best fits your business',
      fields: []
    },
    {
      title: 'Technical Setup',
      description: 'Configure Filecoin integration and payment processing',
      fields: []
    },
    {
      title: 'Go Live',
      description: 'Start issuing digital receipt NFTs with full Filecoin stack',
      fields: []
    }
  ]

  const handleFormChange = (field, value) => {
    setMerchantForm(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const nextStep = () => {
    if (onboardingStep < onboardingSteps.length - 1) {
      setOnboardingStep(prev => prev + 1)
    }
  }

  const prevStep = () => {
    if (onboardingStep > 0) {
      setOnboardingStep(prev => prev - 1)
    }
  }

  const submitPilotApplication = () => {
    // In a real implementation, this would submit to backend
    console.log('Pilot application submitted:', {
      merchantForm,
      selectedPilot,
      walletAddress: address
    })
    
    alert('Pilot application submitted successfully! We\'ll contact you within 24 hours.')
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">ProofMint Pilot Deployment</h2>
            <p className="text-gray-600 mt-1">
              Join our pilot programs and be among the first to implement digital receipt NFTs
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-sm text-gray-600">Pilot Programs Active</span>
          </div>
        </div>
      </div>

      {/* Pilot Programs Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {pilotPrograms.map((pilot) => (
          <div key={pilot.id} className="bg-white rounded-xl shadow-sm border p-6">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                <pilot.icon className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{pilot.title}</h3>
                <div className="flex items-center space-x-2">
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                    pilot.status === 'active' ? 'bg-green-100 text-green-800' :
                    pilot.status === 'upcoming' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {pilot.status}
                  </span>
                  <Star className="w-4 h-4 text-yellow-500" />
                </div>
              </div>
            </div>
            
            <p className="text-gray-600 mb-4">{pilot.description}</p>
            
            <div className="grid grid-cols-3 gap-4 mb-4">
              <div className="text-center">
                <div className="text-lg font-bold text-gray-900">{pilot.merchants}</div>
                <div className="text-xs text-gray-600">Merchants</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-gray-900">{pilot.receipts.toLocaleString()}</div>
                <div className="text-xs text-gray-600">Receipts</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-green-600">{pilot.co2Saved}</div>
                <div className="text-xs text-gray-600">CO2 Saved</div>
              </div>
            </div>
            
            <button
              onClick={() => setSelectedPilot(pilot)}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2"
            >
              <span>Join Pilot</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>

      {/* Selected Pilot Details */}
      {selectedPilot && (
        <div className="bg-white rounded-xl shadow-sm border p-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                <selectedPilot.icon className="w-8 h-8 text-blue-600" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900">{selectedPilot.title}</h3>
                <p className="text-gray-600">{selectedPilot.description}</p>
              </div>
            </div>
            <button
              onClick={() => setSelectedPilot(null)}
              className="text-gray-400 hover:text-gray-600"
            >
              ×
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div>
              <h4 className="text-lg font-semibold text-gray-900 mb-4">Features</h4>
              <ul className="space-y-2">
                {selectedPilot.features.map((feature, index) => (
                  <li key={index} className="flex items-center text-sm text-gray-600">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold text-gray-900 mb-4">Requirements</h4>
              <ul className="space-y-2">
                {selectedPilot.requirements.map((requirement, index) => (
                  <li key={index} className="flex items-center text-sm text-gray-600">
                    <Shield className="w-4 h-4 text-blue-500 mr-2 flex-shrink-0" />
                    {requirement}
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold text-gray-900 mb-4">Benefits</h4>
              <ul className="space-y-2">
                {selectedPilot.benefits.map((benefit, index) => (
                  <li key={index} className="flex items-center text-sm text-gray-600">
                    <TrendingUp className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                    {benefit}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t">
            <button
              onClick={() => setOnboardingStep(0)}
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors flex items-center space-x-2"
            >
              <span>Start Onboarding Process</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      {/* Onboarding Process */}
      {selectedPilot && onboardingStep >= 0 && (
        <div className="bg-white rounded-xl shadow-sm border p-8">
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-gray-900">Merchant Onboarding</h3>
              <span className="text-sm text-gray-500">
                Step {onboardingStep + 1} of {onboardingSteps.length}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${((onboardingStep + 1) / onboardingSteps.length) * 100}%` }}
              ></div>
            </div>
          </div>

          <div className="mb-6">
            <h4 className="text-lg font-medium text-gray-900 mb-2">
              {onboardingSteps[onboardingStep].title}
            </h4>
            <p className="text-gray-600">{onboardingSteps[onboardingStep].description}</p>
          </div>

          {/* Step Content */}
          {onboardingStep === 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Business Name</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={merchantForm.businessName}
                  onChange={(e) => handleFormChange('businessName', e.target.value)}
                  placeholder="Your business name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Business Type</label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={merchantForm.businessType}
                  onChange={(e) => handleFormChange('businessType', e.target.value)}
                >
                  <option value="">Select business type</option>
                  <option value="electronics-retailer">Electronics Retailer</option>
                  <option value="fashion-brand">Fashion Brand</option>
                  <option value="recycling-center">Recycling Center</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Monthly Transactions</label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={merchantForm.monthlyTransactions}
                  onChange={(e) => handleFormChange('monthlyTransactions', e.target.value)}
                >
                  <option value="">Select range</option>
                  <option value="100-500">100-500</option>
                  <option value="500-1000">500-1,000</option>
                  <option value="1000-5000">1,000-5,000</option>
                  <option value="5000+">5,000+</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Sustainability Goals</label>
                <textarea
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={merchantForm.sustainabilityGoals}
                  onChange={(e) => handleFormChange('sustainabilityGoals', e.target.value)}
                  placeholder="Describe your sustainability goals..."
                  rows={3}
                />
              </div>
            </div>
          )}

          {onboardingStep === 1 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Contact Email</label>
                <input
                  type="email"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={merchantForm.contactEmail}
                  onChange={(e) => handleFormChange('contactEmail', e.target.value)}
                  placeholder="contact@yourbusiness.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Website</label>
                <input
                  type="url"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={merchantForm.website}
                  onChange={(e) => handleFormChange('website', e.target.value)}
                  placeholder="https://yourbusiness.com"
                />
              </div>
            </div>
          )}

          {onboardingStep === 2 && (
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <h4 className="text-lg font-medium text-gray-900 mb-2">Selected Pilot Program</h4>
              <p className="text-gray-600 mb-4">{selectedPilot.title}</p>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-blue-800 text-sm">
                  You've selected the {selectedPilot.title}. This program includes all the features, 
                  requirements, and benefits listed above.
                </p>
              </div>
            </div>
          )}

          {onboardingStep === 3 && (
            <div className="space-y-6">
              <div className="bg-gray-50 rounded-lg p-6">
                <h4 className="text-lg font-medium text-gray-900 mb-4">Technical Setup Requirements</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center space-x-3">
                    <Globe className="w-5 h-5 text-blue-600" />
                    <span className="text-sm">Filecoin Calibration testnet connection</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CreditCard className="w-5 h-5 text-blue-600" />
                    <span className="text-sm">USDFC token setup for payments</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Shield className="w-5 h-5 text-blue-600" />
                    <span className="text-sm">PDP verification configuration</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <FileText className="w-5 h-5 text-blue-600" />
                    <span className="text-sm">Receipt NFT contract integration</span>
                  </div>
                </div>
              </div>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-blue-800 text-sm">
                  Our technical team will provide detailed setup instructions and support during the integration process.
                </p>
              </div>
            </div>
          )}

          {onboardingStep === 4 && (
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <h4 className="text-lg font-medium text-gray-900 mb-2">Ready to Go Live!</h4>
              <p className="text-gray-600 mb-6">
                Your merchant account has been configured and you're ready to start issuing digital receipt NFTs.
              </p>
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                <p className="text-green-800 text-sm">
                  You'll receive your merchant credentials and integration guide within 24 hours.
                </p>
              </div>
              <button
                onClick={submitPilotApplication}
                className="bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-6 rounded-lg transition-colors flex items-center space-x-2 mx-auto"
              >
                <span>Submit Application</span>
                <ExternalLink className="w-5 h-5" />
              </button>
            </div>
          )}

          {/* Navigation */}
          <div className="flex justify-between mt-8 pt-6 border-t">
            <button
              onClick={prevStep}
              disabled={onboardingStep === 0}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <button
              onClick={nextStep}
              disabled={onboardingStep === onboardingSteps.length - 1}
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {onboardingStep === onboardingSteps.length - 1 ? 'Complete' : 'Next'}
            </button>
          </div>
        </div>
      )}

      {/* Success Stories */}
      <div className="bg-white rounded-xl shadow-sm border p-8">
        <h3 className="text-xl font-semibold text-gray-900 mb-6">Pilot Success Stories</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Building2 className="w-8 h-8 text-blue-600" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">TechHub Electronics</h4>
            <p className="text-sm text-gray-600 mb-4">
              "Reduced payment disputes by 85% and increased customer satisfaction with digital receipts."
            </p>
            <div className="text-lg font-bold text-green-600">+23% Revenue</div>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="w-8 h-8 text-green-600" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">EcoFashion Co.</h4>
            <p className="text-sm text-gray-600 mb-4">
              "Enhanced supply chain transparency and attracted eco-conscious customers."
            </p>
            <div className="text-lg font-bold text-green-600">+35% Engagement</div>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <TrendingUp className="w-8 h-8 text-purple-600" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">GreenCycle Solutions</h4>
            <p className="text-sm text-gray-600 mb-4">
              "Streamlined recycling verification and automated reward processing."
            </p>
            <div className="text-lg font-bold text-green-600">+40% Efficiency</div>
          </div>
        </div>
      </div>
    </div>
  )
}
