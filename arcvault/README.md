# ArcVault

> Mobile-first Arc Testnet Wallet & NFT Marketplace — built on Circle's Layer-1 blockchain.

![Arc Testnet](https://img.shields.io/badge/Arc-Testnet-00d4c8?style=flat-square)
![Next.js](https://img.shields.io/badge/Next.js-16-black?style=flat-square)
![wagmi](https://img.shields.io/badge/wagmi-v2-blue?style=flat-square)
![Chain ID](https://img.shields.io/badge/Chain%20ID-5042002-purple?style=flat-square)

## Features

| Tab | Feature |
|-----|---------|
| 💳 **Wallet** | Connect wallet, view USDC & EURC balances, send tokens, receive address copy, faucet link |
| 🏪 **Market** | Browse NFTs, mint ERC-721 on-chain, search & filter by collection/rarity |
| 📡 **Explorer** | Live block & transaction feed from Arc RPC, search by tx/address/block, faucet card |
| 🧭 **Discover** | Arc tokenomics, ecosystem links, testnet farming guide, why Arc matters |

## Stack

- **Next.js 16** — App Router, TypeScript, Turbopack
- **Tailwind CSS v4** — utility styling
- **wagmi v2 + viem** — wallet & contract interaction
- **RainbowKit** — connect wallet modal
- **lucide-react** — icons

## Arc Testnet Config

| Field | Value |
|-------|-------|
| Chain ID | `5042002` |
| RPC URL | `https://rpc.testnet.arc.network` |
| Gas Token | `USDC` |
| Explorer | `https://testnet.arcscan.net` |

## Quick Start

```bash
# 1. Clone & install
git clone https://github.com/zean6178/Kiro-Dev.git
cd arcvault
npm install

# 2. Set env
cp .env.example .env.local
# Add your WalletConnect Project ID from https://cloud.walletconnect.com

# 3. Run
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) on mobile browser or resize to ~390px width.

## Deploy to Vercel (free)

```bash
npm install -g vercel
vercel --prod
```

Add `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID` in Vercel environment variables.

## Project Structure

```
arcvault/
├── app/
│   ├── page.tsx          # Wallet Dashboard
│   ├── market/page.tsx   # NFT Marketplace
│   ├── explorer/page.tsx # Block Explorer
│   ├── discover/page.tsx # Arc Ecosystem
│   ├── layout.tsx        # Root layout + mobile shell
│   ├── providers.tsx     # wagmi + RainbowKit providers
│   └── globals.css       # Dark teal-noir theme
├── components/
│   ├── TopBar.tsx        # Header + connect button
│   ├── BottomNav.tsx     # Mobile bottom navigation
│   ├── Card.tsx          # Glass card + skeleton
│   └── Badge.tsx         # Rarity/status badges
├── lib/
│   ├── arc-chain.ts      # Arc testnet chain config
│   ├── wagmi-config.ts   # RainbowKit + wagmi config
│   ├── erc721-abi.ts     # ERC-721 & ERC-20 ABIs
│   └── utils.ts          # Helpers (format, shorten, etc.)
└── public/
    ├── icon.svg          # PWA icon
    └── manifest.json     # PWA manifest
```

## About Arc Network

Arc is Circle's Layer-1 blockchain — the "Economic Operating System" for the internet.

- **$222M raised** at $3B FDV (BlackRock, a16z, Apollo, ICE)
- **USDC as gas token** — stable, predictable fees
- **Sub-second finality** via Malachite consensus
- **EVM compatible** — deploy any Solidity contract
- **60% of 10B ARC tokens** allocated to ecosystem (airdrops, grants, builders)
- **Mainnet: Summer 2026**

→ [arc.network](https://arc.network) · [docs.arc.network](https://docs.arc.network)

---

Built with ❤️ for the Arc ecosystem. Open source.
