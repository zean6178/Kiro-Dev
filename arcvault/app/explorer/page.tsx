"use client";

import { useState, useEffect, useCallback } from "react";
import { usePublicClient } from "wagmi";
import { Card, SkeletonCard } from "@/components/Card";
import { Badge } from "@/components/Badge";
import { arcTestnet, EXPLORER_URL, FAUCET_URL, RPC_URL } from "@/lib/arc-chain";
import { shortAddress, formatTimestamp, explorerTx, explorerAddress } from "@/lib/utils";
import {
  Activity, ExternalLink, RefreshCw, Droplets,
  Box, Hash, ArrowRight, Wifi, WifiOff,
} from "lucide-react";

interface TxInfo {
  hash: string;
  from: string;
  to: string | null;
  value: string;
  blockNumber: string;
  timeAgo: string;
  type: "transfer" | "contract" | "deploy";
}

interface BlockInfo {
  number: bigint;
  hash: string;
  timestamp: bigint;
  transactions: readonly `0x${string}`[];
  gasUsed: bigint;
}

/* ─── Block & Tx fetcher via public client ─────────────── */
function useLatestBlocks() {
  const client = usePublicClient({ chainId: arcTestnet.id });
  const [blocks, setBlocks] = useState<BlockInfo[]>([]);
  const [txs, setTxs] = useState<TxInfo[]>([]);
  const [blockNumber, setBlockNumber] = useState<bigint | null>(null);
  const [loading, setLoading] = useState(true);
  const [connected, setConnected] = useState(false);
  const [lastRefresh, setLastRefresh] = useState(Date.now());

  const fetchData = useCallback(async () => {
    if (!client) return;
    try {
      const bn = await client.getBlockNumber();
      setBlockNumber(bn);
      setConnected(true);

      // Fetch last 5 blocks
      const blockNums = [bn, bn - 1n, bn - 2n, bn - 3n, bn - 4n].filter((n) => n >= 0n);
      const blockData = await Promise.all(
        blockNums.map((n) => client.getBlock({ blockNumber: n, includeTransactions: false }))
      );
      setBlocks(blockData as BlockInfo[]);

      // Fetch txs from latest block
      const latestWithTxs = await client.getBlock({ blockNumber: bn, includeTransactions: true });
      const rawTxs = (latestWithTxs.transactions as any[]).slice(0, 10);
      const formatted: TxInfo[] = rawTxs.map((tx: any) => ({
        hash: tx.hash,
        from: tx.from,
        to: tx.to,
        value: tx.value?.toString() ?? "0",
        blockNumber: tx.blockNumber?.toString() ?? "",
        timeAgo: formatTimestamp(Number(latestWithTxs.timestamp)),
        type: !tx.to ? "deploy" : tx.input && tx.input.length > 2 ? "contract" : "transfer",
      }));
      setTxs(formatted);
    } catch {
      setConnected(false);
    } finally {
      setLoading(false);
    }
  }, [client]);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 10000);
    return () => clearInterval(interval);
  }, [fetchData]);

  const refresh = () => {
    setLoading(true);
    setLastRefresh(Date.now());
    fetchData();
  };

  return { blocks, txs, blockNumber, loading, connected, refresh };
}

/* ─── Main Page ──────────────────────────────────────────── */
export default function ExplorerPage() {
  const { blocks, txs, blockNumber, loading, connected, refresh } = useLatestBlocks();
  const [tab, setTab] = useState<"blocks" | "txs">("blocks");
  const [searchInput, setSearchInput] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchInput) return;
    const trimmed = searchInput.trim();
    // Route to ArcScan based on input type
    if (trimmed.startsWith("0x") && trimmed.length === 66) {
      window.open(`${EXPLORER_URL}/tx/${trimmed}`, "_blank");
    } else if (trimmed.startsWith("0x") && trimmed.length === 42) {
      window.open(`${EXPLORER_URL}/address/${trimmed}`, "_blank");
    } else {
      window.open(`${EXPLORER_URL}/block/${trimmed}`, "_blank");
    }
  };

  return (
    <div className="px-4 pt-2 pb-6 fade-up flex flex-col gap-5">

      {/* ── Header ── */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold">Explorer</h1>
          <div className="flex items-center gap-2 mt-0.5">
            {connected ? (
              <><Wifi size={12} color="var(--arc-green)" />
                <span className="text-xs" style={{ color: "var(--arc-green)" }}>Live</span></>
            ) : (
              <><WifiOff size={12} color="var(--arc-red)" />
                <span className="text-xs" style={{ color: "var(--arc-red)" }}>Disconnected</span></>
            )}
          </div>
        </div>
        <button onClick={refresh} disabled={loading}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm"
                style={{ background: "var(--arc-card)", border: "1px solid var(--arc-border)", color: "var(--arc-text-dim)" }}>
          <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
          Refresh
        </button>
      </div>

      {/* ── Chain Stats ── */}
      <div className="grid grid-cols-2 gap-3">
        <Card>
          <p className="text-xs mb-1" style={{ color: "var(--arc-text-dim)" }}>Latest Block</p>
          {loading ? (
            <div className="shimmer h-7 w-24 rounded" />
          ) : (
            <p className="text-2xl font-bold" style={{ color: "var(--arc-teal)" }}>
              #{blockNumber?.toString() ?? "—"}
            </p>
          )}
        </Card>
        <Card>
          <p className="text-xs mb-1" style={{ color: "var(--arc-text-dim)" }}>Chain ID</p>
          <p className="text-2xl font-bold" style={{ color: "var(--arc-amber)" }}>5042002</p>
        </Card>
        <Card>
          <p className="text-xs mb-1" style={{ color: "var(--arc-text-dim)" }}>Network</p>
          <p className="text-sm font-bold">Arc Testnet</p>
          <Badge variant="teal" className="mt-1">EVM</Badge>
        </Card>
        <Card>
          <p className="text-xs mb-1" style={{ color: "var(--arc-text-dim)" }}>Gas Token</p>
          <p className="text-2xl font-bold" style={{ color: "#2775ca" }}>USDC</p>
        </Card>
      </div>

      {/* ── Search ── */}
      <form onSubmit={handleSearch}>
        <div className="relative">
          <Hash size={16} className="absolute left-3 top-1/2 -translate-y-1/2" color="var(--arc-text-dim)" />
          <input value={searchInput} onChange={(e) => setSearchInput(e.target.value)}
                 placeholder="Search tx hash, address, block..."
                 className="w-full pl-10 pr-24 py-3 rounded-xl text-sm outline-none"
                 style={{ background: "var(--arc-card)", border: "1px solid var(--arc-border)", color: "var(--arc-text)" }} />
          <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 px-3 py-1.5 rounded-lg text-xs font-medium"
                  style={{ background: "var(--arc-teal)", color: "var(--arc-bg)" }}>
            Search
          </button>
        </div>
      </form>

      {/* ── Tabs ── */}
      <div className="flex gap-2">
        {(["blocks", "txs"] as const).map((t) => (
          <button key={t} onClick={() => setTab(t)}
                  className="flex-1 py-2 rounded-xl text-sm font-semibold capitalize"
                  style={{
                    background: tab === t ? "var(--arc-teal)" : "var(--arc-card)",
                    color: tab === t ? "var(--arc-bg)" : "var(--arc-text-dim)",
                    border: "1px solid var(--arc-border)",
                  }}>
            {t === "blocks" ? "Blocks" : "Transactions"}
          </button>
        ))}
      </div>

      {/* ── Blocks list ── */}
      {tab === "blocks" && (
        <div className="flex flex-col gap-3">
          {loading ? (
            Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)
          ) : blocks.length === 0 ? (
            <div className="flex flex-col items-center gap-3 py-10">
              <Activity size={36} color="var(--arc-muted)" />
              <p style={{ color: "var(--arc-text-dim)" }}>No blocks yet</p>
            </div>
          ) : (
            blocks.map((block) => (
              <a key={block.hash} href={`${EXPLORER_URL}/block/${block.number}`}
                 target="_blank" rel="noopener noreferrer" className="block">
                <Card className="hover:border-[#00d4c840] transition-all">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                           style={{ background: "var(--arc-teal-dim)" }}>
                        <Box size={18} color="var(--arc-teal)" />
                      </div>
                      <div>
                        <p className="font-semibold text-sm">
                          Block #{block.number.toString()}
                        </p>
                        <p className="text-xs" style={{ color: "var(--arc-text-dim)" }}>
                          {block.transactions.length} txns
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-mono" style={{ color: "var(--arc-text-dim)" }}>
                        {shortAddress(block.hash)}
                      </p>
                      <ExternalLink size={12} color="var(--arc-text-dim)" className="ml-auto mt-1" />
                    </div>
                  </div>
                </Card>
              </a>
            ))
          )}
        </div>
      )}

      {/* ── Transactions list ── */}
      {tab === "txs" && (
        <div className="flex flex-col gap-3">
          {loading ? (
            Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)
          ) : txs.length === 0 ? (
            <div className="flex flex-col items-center gap-3 py-10">
              <Activity size={36} color="var(--arc-muted)" />
              <p style={{ color: "var(--arc-text-dim)" }}>No transactions in latest block</p>
            </div>
          ) : (
            txs.map((tx) => (
              <a key={tx.hash} href={explorerTx(tx.hash)}
                 target="_blank" rel="noopener noreferrer" className="block">
                <Card className="hover:border-[#00d4c840] transition-all">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
                           style={{
                             background: tx.type === "deploy" ? "#a78bfa20"
                               : tx.type === "contract" ? "var(--arc-teal-dim)" : "var(--arc-amber-dim)",
                           }}>
                        <Activity size={14} color={
                          tx.type === "deploy" ? "#a78bfa"
                            : tx.type === "contract" ? "var(--arc-teal)" : "var(--arc-amber)"
                        } />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-mono text-xs truncate">{shortAddress(tx.hash)}</p>
                          <Badge variant={tx.type === "deploy" ? "muted" : tx.type === "contract" ? "teal" : "amber"}>
                            {tx.type}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-1 text-xs" style={{ color: "var(--arc-text-dim)" }}>
                          <span>{shortAddress(tx.from)}</span>
                          <ArrowRight size={10} />
                          <span>{tx.to ? shortAddress(tx.to) : "New Contract"}</span>
                        </div>
                      </div>
                    </div>
                    <ExternalLink size={14} color="var(--arc-text-dim)" className="flex-shrink-0 mt-1" />
                  </div>
                </Card>
              </a>
            ))
          )}
        </div>
      )}

      {/* ── Faucet Card ── */}
      <Card glow="teal">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center glow-teal"
               style={{ background: "var(--arc-teal-dim)" }}>
            <Droplets size={22} color="var(--arc-teal)" />
          </div>
          <div className="flex-1">
            <p className="font-bold mb-0.5">Need Testnet USDC?</p>
            <p className="text-xs" style={{ color: "var(--arc-text-dim)" }}>
              Get free USDC & EURC for Arc testnet from Circle Faucet.
            </p>
          </div>
        </div>
        <a href={FAUCET_URL} target="_blank" rel="noopener noreferrer"
           className="flex items-center justify-center gap-2 mt-4 py-3 rounded-2xl text-sm font-semibold"
           style={{ background: "var(--arc-teal)", color: "var(--arc-bg)" }}>
          <Droplets size={16} /> Open Faucet
        </a>
      </Card>

      {/* ── External links ── */}
      <div className="grid grid-cols-2 gap-3">
        {[
          { label: "ArcScan", desc: "Full block explorer", url: EXPLORER_URL, icon: "🔍" },
          { label: "Arc Docs", desc: "Developer docs", url: "https://docs.arc.network", icon: "📄" },
          { label: "Circle Faucet", desc: "Get testnet USDC", url: FAUCET_URL, icon: "💧" },
          { label: "RPC Endpoint", desc: RPC_URL.replace("https://", ""), url: RPC_URL, icon: "⚡" },
        ].map(({ label, desc, url, icon }) => (
          <a key={label} href={url} target="_blank" rel="noopener noreferrer"
             className="glass rounded-2xl p-3 flex items-start gap-2 active:scale-95 transition-transform">
            <span className="text-2xl">{icon}</span>
            <div>
              <p className="text-sm font-semibold">{label}</p>
              <p className="text-xs" style={{ color: "var(--arc-text-dim)" }}>{desc}</p>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
