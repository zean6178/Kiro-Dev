"use client";

import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount } from "wagmi";
import { shortAddress } from "@/lib/utils";

export function TopBar() {
  const { address, isConnected } = useAccount();

  return (
    <header
      className="sticky top-0 z-50 flex items-center justify-between px-4 py-3"
      style={{
        background: "linear-gradient(180deg, var(--arc-bg) 60%, transparent)",
        backdropFilter: "blur(8px)",
      }}
    >
      {/* Logo */}
      <div className="flex items-center gap-2">
        <div
          className="w-8 h-8 rounded-xl flex items-center justify-center glow-teal"
          style={{ background: "linear-gradient(135deg, #00d4c8, #7c3aed)" }}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M8 1L14 4.5V11.5L8 15L2 11.5V4.5L8 1Z" fill="white" fillOpacity="0.9" />
            <path d="M8 5L11 6.75V10.25L8 12L5 10.25V6.75L8 5Z" fill="white" fillOpacity="0.4" />
          </svg>
        </div>
        <div>
          <span className="font-bold text-sm gradient-text">ArcVault</span>
          <div className="flex items-center gap-1">
            <span className="pulse-dot w-1.5 h-1.5 rounded-full inline-block"
                  style={{ background: "var(--arc-teal)" }} />
            <span className="text-xs" style={{ color: "var(--arc-text-dim)" }}>
              Arc Testnet
            </span>
          </div>
        </div>
      </div>

      {/* Connect Button */}
      <ConnectButton.Custom>
        {({ account, chain, openAccountModal, openChainModal, openConnectModal, mounted }) => {
          if (!mounted) return null;
          const connected = mounted && account && chain;
          return (
            <button
              onClick={connected ? openAccountModal : openConnectModal}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-medium transition-all"
              style={{
                background: connected ? "var(--arc-card)" : "var(--arc-teal)",
                border: "1px solid var(--arc-border)",
                color: connected ? "var(--arc-text)" : "var(--arc-bg)",
              }}
            >
              {connected ? (
                <>
                  <span
                    className="w-2 h-2 rounded-full"
                    style={{ background: "var(--arc-green)" }}
                  />
                  {shortAddress(account.address)}
                </>
              ) : (
                "Connect"
              )}
            </button>
          );
        }}
      </ConnectButton.Custom>
    </header>
  );
}
