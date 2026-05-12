"use client";

import { useAccount, useBalance, useReadContract, useSendTransaction, useWaitForTransactionReceipt } from "wagmi";
import { parseUnits, isAddress } from "viem";
import { useState, useCallback } from "react";
import { Card, SkeletonCard } from "@/components/Card";
import { Badge } from "@/components/Badge";
import { ARC_CONTRACTS, EXPLORER_URL, FAUCET_URL, arcTestnet } from "@/lib/arc-chain";
import { ERC20_ABI } from "@/lib/erc721-abi";
import { shortAddress, formatUSDC, explorerTx, explorerAddress } from "@/lib/utils";
import {
  ArrowUpRight, ArrowDownLeft, Copy, ExternalLink,
  Droplets, Send, CheckCircle, AlertCircle, Loader2,
  TrendingUp, Shield, Zap,
} from "lucide-react";
import { useWriteContract } from "wagmi";

/* ─── Hooks ─────────────────────────────────────────────── */
function useUSDCBalance(address?: `0x${string}`) {
  return useReadContract({
    address: ARC_CONTRACTS.USDC,
    abi: ERC20_ABI,
    functionName: "balanceOf",
    args: address ? [address] : undefined,
    query: { enabled: !!address, refetchInterval: 8000 },
    chainId: arcTestnet.id,
  });
}

function useEURCBalance(address?: `0x${string}`) {
  return useReadContract({
    address: ARC_CONTRACTS.EURC,
    abi: ERC20_ABI,
    functionName: "balanceOf",
    args: address ? [address] : undefined,
    query: { enabled: !!address, refetchInterval: 8000 },
    chainId: arcTestnet.id,
  });
}

/* ─── Send Modal ─────────────────────────────────────────── */
function SendModal({ onClose }: { onClose: () => void }) {
  const { address } = useAccount();
  const [to, setTo] = useState("");
  const [amount, setAmount] = useState("");
  const [token, setToken] = useState<"USDC" | "EURC">("USDC");
  const [error, setError] = useState("");

  const { writeContract, data: hash, isPending, error: writeError } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  const contractAddr = token === "USDC" ? ARC_CONTRACTS.USDC : ARC_CONTRACTS.EURC;

  const handleSend = useCallback(() => {
    setError("");
    if (!isAddress(to)) { setError("Invalid address"); return; }
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) { setError("Invalid amount"); return; }
    writeContract({
      address: contractAddr,
      abi: ERC20_ABI,
      functionName: "transfer",
      args: [to as `0x${string}`, parseUnits(amount, 6)],
      chainId: arcTestnet.id,
    });
  }, [to, amount, contractAddr, writeContract]);

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center"
         style={{ background: "rgba(9,12,18,0.85)", backdropFilter: "blur(8px)" }}>
      <div className="w-full max-w-md rounded-t-3xl p-6 pb-10 fade-up"
           style={{ background: "var(--arc-surface)", border: "1px solid var(--arc-border)" }}>
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold">Send Tokens</h2>
          <button onClick={onClose} className="text-sm px-3 py-1 rounded-xl"
                  style={{ background: "var(--arc-card)", color: "var(--arc-text-dim)" }}>
            Cancel
          </button>
        </div>

        {isSuccess ? (
          <div className="flex flex-col items-center gap-4 py-8">
            <CheckCircle size={48} color="var(--arc-green)" />
            <p className="font-semibold text-lg">Transaction sent!</p>
            <a href={explorerTx(hash!)} target="_blank" rel="noopener noreferrer"
               className="flex items-center gap-1 text-sm"
               style={{ color: "var(--arc-teal)" }}>
              View on ArcScan <ExternalLink size={12} />
            </a>
            <button onClick={onClose} className="mt-2 w-full py-3 rounded-2xl font-semibold"
                    style={{ background: "var(--arc-teal)", color: "var(--arc-bg)" }}>
              Done
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {/* Token selector */}
            <div className="flex gap-2">
              {(["USDC", "EURC"] as const).map((t) => (
                <button key={t} onClick={() => setToken(t)}
                        className="flex-1 py-2 rounded-xl text-sm font-semibold transition-all"
                        style={{
                          background: token === t ? "var(--arc-teal)" : "var(--arc-card)",
                          color: token === t ? "var(--arc-bg)" : "var(--arc-text-dim)",
                          border: "1px solid var(--arc-border)",
                        }}>
                  {t}
                </button>
              ))}
            </div>

            {/* To address */}
            <div>
              <label className="text-xs font-medium mb-1 block" style={{ color: "var(--arc-text-dim)" }}>
                Recipient Address
              </label>
              <input
                value={to} onChange={(e) => setTo(e.target.value)}
                placeholder="0x..."
                className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all"
                style={{
                  background: "var(--arc-card)", border: "1px solid var(--arc-border)",
                  color: "var(--arc-text)",
                }}
              />
            </div>

            {/* Amount */}
            <div>
              <label className="text-xs font-medium mb-1 block" style={{ color: "var(--arc-text-dim)" }}>
                Amount ({token})
              </label>
              <input
                value={amount} onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00" type="number" min="0"
                className="w-full px-4 py-3 rounded-xl text-sm outline-none"
                style={{
                  background: "var(--arc-card)", border: "1px solid var(--arc-border)",
                  color: "var(--arc-text)",
                }}
              />
            </div>

            {(error || writeError) && (
              <div className="flex items-center gap-2 text-sm px-3 py-2 rounded-xl"
                   style={{ background: "var(--arc-red)20", color: "var(--arc-red)" }}>
                <AlertCircle size={14} />
                {error || writeError?.message?.slice(0, 80)}
              </div>
            )}

            <button onClick={handleSend} disabled={isPending || isConfirming}
                    className="w-full py-3 rounded-2xl font-semibold flex items-center justify-center gap-2 transition-all"
                    style={{
                      background: "var(--arc-teal)", color: "var(--arc-bg)",
                      opacity: (isPending || isConfirming) ? 0.7 : 1,
                    }}>
              {(isPending || isConfirming) ? (
                <><Loader2 size={16} className="animate-spin" /> Sending...</>
              ) : (
                <><Send size={16} /> Send {token}</>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

/* ─── Main Page ──────────────────────────────────────────── */
export default function WalletPage() {
  const { address, isConnected } = useAccount();
  const [showSend, setShowSend] = useState(false);
  const [copied, setCopied] = useState(false);

  const { data: usdcRaw, isLoading: loadingUSDC } = useUSDCBalance(address);
  const { data: eurcRaw, isLoading: loadingEURC } = useEURCBalance(address);

  const usdcBalance = usdcRaw ? formatUSDC(usdcRaw as bigint) : "0.00";
  const eurcBalance = eurcRaw ? formatUSDC(eurcRaw as bigint) : "0.00";

  const copyAddress = () => {
    if (!address) return;
    navigator.clipboard.writeText(address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!isConnected) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] gap-6 px-6 fade-up">
        <div className="w-20 h-20 rounded-3xl flex items-center justify-center glow-teal"
             style={{ background: "linear-gradient(135deg, #00d4c820, #7c3aed20)", border: "1px solid var(--arc-border)" }}>
          <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
            <path d="M20 4L34 11.5V28.5L20 36L6 28.5V11.5L20 4Z" stroke="#00d4c8" strokeWidth="1.5" fill="none"/>
            <path d="M20 13L27 17V25L20 29L13 25V17L20 13Z" fill="#00d4c8" fillOpacity="0.3"/>
          </svg>
        </div>
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">ArcVault</h1>
          <p className="text-sm" style={{ color: "var(--arc-text-dim)" }}>
            Your Arc Testnet wallet.<br />Connect to manage USDC, EURC & NFTs.
          </p>
        </div>
        <div className="w-full flex flex-col gap-3">
          {[
            { icon: Shield, label: "Non-custodial", desc: "Your keys, your coins" },
            { icon: Zap, label: "Sub-second finality", desc: "Arc testnet speed" },
            { icon: TrendingUp, label: "USDC gas", desc: "Stable fees, no volatility" },
          ].map(({ icon: Icon, label, desc }) => (
            <div key={label} className="glass flex items-center gap-3 p-3 rounded-2xl">
              <div className="w-8 h-8 rounded-xl flex items-center justify-center"
                   style={{ background: "var(--arc-teal-dim)" }}>
                <Icon size={16} color="var(--arc-teal)" />
              </div>
              <div>
                <p className="text-sm font-semibold">{label}</p>
                <p className="text-xs" style={{ color: "var(--arc-text-dim)" }}>{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 pt-2 pb-6 fade-up flex flex-col gap-5">

      {/* ── Balance Hero Card ── */}
      <Card glow="teal" className="relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 opacity-10"
             style={{ background: "radial-gradient(circle at 80% 20%, #00d4c8, transparent 60%)" }} />
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-xs font-medium mb-1" style={{ color: "var(--arc-text-dim)" }}>
                Total Balance
              </p>
              {loadingUSDC ? (
                <div className="shimmer h-9 w-36 rounded-lg" />
              ) : (
                <p className="text-4xl font-bold tracking-tight">
                  <span className="gradient-text">${usdcBalance}</span>
                </p>
              )}
            </div>
            <Badge variant="teal">Arc Testnet</Badge>
          </div>

          {/* Address row */}
          <button onClick={copyAddress}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-xl transition-all w-fit"
                  style={{ background: "var(--arc-bg)80", border: "1px solid var(--arc-border)" }}>
            <span className="text-xs font-mono" style={{ color: "var(--arc-text-dim)" }}>
              {shortAddress(address!)}
            </span>
            {copied ? (
              <CheckCircle size={12} color="var(--arc-green)" />
            ) : (
              <Copy size={12} color="var(--arc-text-dim)" />
            )}
          </button>
        </div>
      </Card>

      {/* ── Quick Actions ── */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { icon: Send, label: "Send", action: () => setShowSend(true), color: "var(--arc-teal)" },
          {
            icon: ArrowDownLeft, label: "Receive", color: "var(--arc-amber)",
            action: () => copyAddress(),
          },
          {
            icon: Droplets, label: "Faucet", color: "#a78bfa",
            action: () => window.open(FAUCET_URL, "_blank"),
          },
        ].map(({ icon: Icon, label, action, color }) => (
          <button key={label} onClick={action}
                  className="glass flex flex-col items-center gap-2 py-4 rounded-2xl transition-all active:scale-95">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                 style={{ background: `${color}20` }}>
              <Icon size={20} color={color} />
            </div>
            <span className="text-xs font-medium">{label}</span>
          </button>
        ))}
      </div>

      {/* ── Token Balances ── */}
      <div>
        <h3 className="text-sm font-semibold mb-3" style={{ color: "var(--arc-text-dim)" }}>
          TOKENS
        </h3>
        <div className="flex flex-col gap-3">
          {/* USDC */}
          <Card>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm"
                     style={{ background: "#2775ca20", color: "#2775ca", border: "1px solid #2775ca40" }}>
                  $
                </div>
                <div>
                  <p className="font-semibold text-sm">USD Coin</p>
                  <p className="text-xs" style={{ color: "var(--arc-text-dim)" }}>USDC · Gas token</p>
                </div>
              </div>
              <div className="text-right">
                {loadingUSDC ? (
                  <div className="shimmer h-5 w-20 rounded" />
                ) : (
                  <p className="font-semibold">{usdcBalance}</p>
                )}
                <p className="text-xs" style={{ color: "var(--arc-text-dim)" }}>≈ ${usdcBalance}</p>
              </div>
            </div>
          </Card>

          {/* EURC */}
          <Card>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm"
                     style={{ background: "#0a6dd020", color: "#0a6dd0", border: "1px solid #0a6dd040" }}>
                  €
                </div>
                <div>
                  <p className="font-semibold text-sm">Euro Coin</p>
                  <p className="text-xs" style={{ color: "var(--arc-text-dim)" }}>EURC</p>
                </div>
              </div>
              <div className="text-right">
                {loadingEURC ? (
                  <div className="shimmer h-5 w-20 rounded" />
                ) : (
                  <p className="font-semibold">{eurcBalance}</p>
                )}
                <p className="text-xs" style={{ color: "var(--arc-text-dim)" }}>EURC</p>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* ── Network Info ── */}
      <Card>
        <h3 className="text-xs font-semibold mb-3 uppercase tracking-wider"
            style={{ color: "var(--arc-text-dim)" }}>
          Network
        </h3>
        <div className="grid grid-cols-2 gap-3">
          {[
            { label: "Chain ID", value: "5042002" },
            { label: "Gas Token", value: "USDC" },
            { label: "Finality", value: "< 1 second" },
            { label: "Network", value: "Testnet" },
          ].map(({ label, value }) => (
            <div key={label} className="rounded-xl p-3"
                 style={{ background: "var(--arc-bg)", border: "1px solid var(--arc-border)" }}>
              <p className="text-xs mb-1" style={{ color: "var(--arc-text-dim)" }}>{label}</p>
              <p className="text-sm font-semibold" style={{ color: "var(--arc-teal)" }}>{value}</p>
            </div>
          ))}
        </div>
        <a href={explorerAddress(address!)} target="_blank" rel="noopener noreferrer"
           className="flex items-center justify-center gap-2 mt-3 py-2 rounded-xl text-sm font-medium"
           style={{ background: "var(--arc-bg)", border: "1px solid var(--arc-border)", color: "var(--arc-teal)" }}>
          View on ArcScan <ExternalLink size={14} />
        </a>
      </Card>

      {showSend && <SendModal onClose={() => setShowSend(false)} />}
    </div>
  );
}
