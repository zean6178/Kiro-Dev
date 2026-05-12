import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { arcTestnet } from "./arc-chain";

export const wagmiConfig = getDefaultConfig({
  appName: "ArcVault",
  projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || "arcvault-demo",
  chains: [arcTestnet],
  ssr: true,
});
