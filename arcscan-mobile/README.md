# ArcScan Mobile

> Mobile-first block explorer for **Arc Testnet** — Circle's Layer-1 blockchain.

![Arc Testnet](https://img.shields.io/badge/Arc-Testnet-00d4c8?style=flat-square)
![Next.js](https://img.shields.io/badge/Next.js-16-black?style=flat-square)
![Chain ID](https://img.shields.io/badge/Chain%20ID-5042002-purple?style=flat-square)
![PWA](https://img.shields.io/badge/PWA-ready-green?style=flat-square)

## Pages

| Route | Description |
|-------|-------------|
| `/` | Home — live stats, latest blocks & transactions feed |
| `/blocks` | Paginated block list, auto-refreshes every 8s |
| `/blocks/[number]` | Block detail — full info + all transactions |
| `/txs` | Transaction list with type filter (all/transfer/contract/deploy) |
| `/txs/[hash]` | Transaction detail — value, gas, logs, input data |
| `/search` | Universal search — auto-detects tx hash / address / block number |
| `/address/[addr]` | Address detail — USDC balance + tx history (in/out) |

## Stack

- **Next.js 16** — App Router, TypeScript, Turbopack
- **viem** — direct RPC calls, no wallet needed (read-only explorer)
- **@tanstack/react-query** — data fetching, polling, caching
- **Tailwind CSS v4** — utility styling
- **lucide-react** — icons

## Arc Testnet Config

| Field | Value |
|-------|-------|
| Chain ID | `5042002` |
| RPC URL | `https://rpc.testnet.arc.network` |
| Gas Token | `USDC (6 decimals)` |
| Explorer | `https://testnet.arcscan.net` |

## Quick Start

```bash
git clone https://github.com/zean6178/Kiro-Dev.git
cd arcscan-mobile
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — resize to ~390px for mobile view.

## Deploy to Vercel

```bash
npx vercel --prod
```

No environment variables required. Works out of the box.

## Project Structure

```
arcscan-mobile/
├── app/
│   ├── page.tsx                    # Home: stats + live feeds
│   ├── blocks/
│   │   ├── page.tsx                # Block list
│   │   └── [number]/page.tsx       # Block detail
│   ├── txs/
│   │   ├── page.tsx                # Tx list + filter
│   │   └── [hash]/page.tsx         # Tx detail + logs
│   ├── address/
│   │   └── [addr]/page.tsx         # Address + balance + history
│   ├── search/page.tsx             # Universal search
│   ├── layout.tsx                  # Mobile shell
│   ├── providers.tsx               # QueryClient provider
│   └── globals.css                 # Dark theme + CSS vars
├── components/
│   ├── TopBar.tsx                  # Header + live block number
│   ├── BottomNav.tsx               # 4-tab navigation
│   └── ui.tsx                      # Card, Badge, Row, Sk, etc.
└── lib/
    ├── arc-chain.ts                # Chain config + constants
    ├── rpc.ts                      # publicClient + async fetchers
    ├── hooks.ts                    # React Query hooks
    └── utils.ts                    # Format, detect, shorten helpers
```

## Key Differences vs ArcVault

| | ArcScan Mobile | ArcVault |
|--|--|--|
| Purpose | Read-only block explorer | Wallet + NFT marketplace |
| Auth | No wallet needed | RainbowKit connect |
| Live data | Direct viem RPC | wagmi hooks |
| Detail pages | Block / Tx / Address drill-down | Dashboard only |
| Deploy | Zero env vars | WalletConnect project ID |

---

Built for the Arc ecosystem. Open source.
