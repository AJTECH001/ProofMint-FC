# ProofMint AI - Filecoin Onchain Cloud Architecture

## System Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    ProofMint AI Frontend                    │
│                     (React Dashboard )                
└─────────────────────┬───────────────────────────────────────┘
                      │ Synapse SDK Integration
┌─────────────────────▼───────────────────────────────────────┐
│                Filecoin Onchain Cloud Layer               │
├─────────────────────┬───────────┬─────────────────┬─────────┤
│  FilecoinWarmStorage│FilecoinPay│    FilCDN      │Synapse  │
│     Service         │  Contracts│   Retrieval    │   SDK   │
└─────────────────────┼───────────┼─────────────────┼─────────┘
                      │           │                 │
┌─────────────────────▼───────────▼─────────────────▼─────────┐
│              ProofMint AI Smart Contracts                  │
│        (Receipt NFTs, Escrow Logic, Reward Distribution)   │
└─────────────────────────────────────────────────────────────┘
```

## Component Integration Details

### 1. FilecoinWarmStorageService Integration
- **Receipt Metadata Storage**: All NFT receipt data (purchase details, sustainability metrics, carbon footprint) stored with PDP verification
- **Recycling Lifecycle Tracking**: Immutable record of product journey from purchase to recycling
- **AI Training Data**: Historical sustainability data for ML model improvement

### 2. Filecoin Pay Integration
- **Escrow Mechanism**: Buyers lock FIL/ERC-20 tokens, released after receipt verification
- **Streaming Recycling Rewards**: Continuous payments to recyclers based on verified milestones
- **Merchant Settlement Rails**: Instant payments for sustainability-verified transactions

### 3. FilCDN Integration
- **Real-time Dashboard**: Fast retrieval of sustainability metrics and recycling progress
- **Mobile App Performance**: Low-latency access to receipt data for consumer verification
- **Global POS Integration**: Edge-cached receipt verification for merchant systems

### 4. Synapse SDK Integration
- **Unified API**: Single interface for all Filecoin services
- **Frontend Abstraction**: Simplified React components for developers
- **Cross-chain Compatibility**: Support for ERC-20 and FIL payments
```