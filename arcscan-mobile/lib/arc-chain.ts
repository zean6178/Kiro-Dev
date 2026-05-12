import { defineChain } from "viem";

export const arcTestnet = defineChain({
  id: 5042002,
  name: "Arc Testnet",
  nativeCurrency: { decimals: 6, name: "USD Coin", symbol: "USDC" },
  rpcUrls: {
    default: { http: ["https://rpc.testnet.arc.network"] },
    public:  { http: ["https://rpc.testnet.arc.network"] },
  },
  blockExplorers: {
    default: { name: "ArcScan", url: "https://testnet.arcscan.net" },
  },
  testnet: true,
});

export const RPC_URL      = "https://rpc.testnet.arc.network";
export const EXPLORER_URL = "https://testnet.arcscan.net";
export const FAUCET_URL   = "https://faucet.circle.com/";
export const CHAIN_ID     = 5042002;

export const USDC_ADDRESS = "0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238" as `0x${string}`;
export const EURC_ADDRESS = "0x08210F9170F89Ab7658F0B5E3fF39b0E03C594D4" as `0x${string}`;
