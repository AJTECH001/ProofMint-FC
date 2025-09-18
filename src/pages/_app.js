import '../styles/globals.css'
import { WagmiConfig, createConfig, configureChains } from 'wagmi'
import { publicProvider } from 'wagmi/providers/public'
import { getDefaultWallets, RainbowKitProvider } from '@rainbow-me/rainbowkit'
import '@rainbow-me/rainbowkit/styles.css'

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
  projectId: 'f3b5b1c5d8a7e2f9c4d6a8b3e5f7g9h1j3k5l7m9', // Demo project ID
  chains
})

// Create wagmi config
const wagmiConfig = createConfig({
  autoConnect: true,
  connectors,
  publicClient,
  webSocketPublicClient,
})

function MyApp({ Component, pageProps }) {
  return (
    <WagmiConfig config={wagmiConfig}>
      <RainbowKitProvider chains={chains}>
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
          <Component {...pageProps} />
        </div>
      </RainbowKitProvider>
    </WagmiConfig>
  )
}

export default MyApp