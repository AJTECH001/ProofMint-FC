import { WagmiConfig, createConfig, configureChains } from 'wagmi'
import { publicProvider } from 'wagmi/providers/public'
import { getDefaultWallets, RainbowKitProvider } from '@rainbow-me/rainbowkit'
import '@rainbow-me/rainbowkit/styles.css'
import Home from './components/Home'
import AdvancedProofMintDemo from './components/AdvancedProofMintDemo'
import PilotDeployment from './components/PilotDeployment'
import MobileReceiptViewer from './components/MobileReceiptViewer'

// Define Filecoin chains
const filecoinCalibration = {
  id: 314159,
  name: 'Filecoin Calibration',
  network: 'filecoin-calibration',
  nativeCurrency: {
    decimals: 18,
    name: 'testnet FIL',
    symbol: 'tFIL',
  },
  rpcUrls: {
    public: { http: ['https://api.calibration.node.glif.io/rpc/v1'] },
    default: { http: ['https://api.calibration.node.glif.io/rpc/v1'] },
  },
  blockExplorers: {
    default: { name: 'FilFox', url: 'https://calibration.filscan.io' },
  },
  testnet: true,
}

const filecoin = {
  id: 314,
  name: 'Filecoin Mainnet',
  network: 'filecoin',
  nativeCurrency: {
    decimals: 18,
    name: 'Filecoin',
    symbol: 'FIL',
  },
  rpcUrls: {
    public: { http: ['https://api.node.glif.io/rpc/v1'] },
    default: { http: ['https://api.node.glif.io/rpc/v1'] },
  },
  blockExplorers: {
    default: { name: 'FilFox', url: 'https://filfox.info' },
  },
}

// Configure chains and providers
const { chains, publicClient, webSocketPublicClient } = configureChains(
  [filecoinCalibration, filecoin],
  [publicProvider()]
)

const { connectors } = getDefaultWallets({
  appName: 'ProofMint MVP',
  projectId: 'c4f79cc821944d9680842e34466bfbd', // Public demo project ID
  chains
})

// Create wagmi config
const wagmiConfig = createConfig({
  autoConnect: true,
  connectors,
  publicClient,
  webSocketPublicClient,
})

function App() {
  return (
    <WagmiConfig config={wagmiConfig}>
      <RainbowKitProvider chains={chains}>
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
          <Home />
        </div>
      </RainbowKitProvider>
    </WagmiConfig>
  )
}

export default App