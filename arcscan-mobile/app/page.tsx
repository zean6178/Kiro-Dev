"use client";

import Link from "next/link";
import { useChainStats, useRecentBlocks, useRecentTxs } from "@/lib/hooks";
import { shortAddr, shortHash, timeAgo, txType, txTypeColor, txTypeBg, formatWei } from "@/lib/utils";
import { Card, Badge, TxDot, Sk, Empty, SectionTitle } from "@/components/ui";
import { Box, ArrowLeftRight, Activity, Zap, ExternalLink, ArrowRight, RefreshCw } from "lucide-react";
import { FAUCET_URL, EXPLORER_URL } from "@/lib/arc-chain";
import type { Transaction } from "viem";

/* ── Stat tile ─────────────────────────────────────────────── */
function StatTile({ label, value, color, loading }: {
  label: string; value?: string; color: string; loading: boolean;
}) {
  return (
    <div className="card p-3 flex flex-col gap-1">
      <p className="text-[10px] font-semibold uppercase tracking-widest" style={{ color: "var(--text-2)" }}>{label}</p>
      {loading ? <Sk h="h-6" w="w-24" /> : (
        <p className="text-lg font-bold truncate" style={{ color }}>{value ?? "—"}</p>
      )}
    </div>
  );
}

/* ── Block row ─────────────────────────────────────────────── */
function BlockRow({ block }: { block: any }) {
  return (
    <Link href={`/blocks/${block.number}`} className="block">
      <div className="flex items-center justify-between py-3" style={{ borderBottom: "1px solid var(--border)" }}>
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: "var(--teal-dim)" }}>
            <Box size={16} color="var(--teal)" />
          </div>
          <div>
            <p className="text-sm font-bold" style={{ color: "var(--teal)" }}>#{block.number.toString()}</p>
            <p className="text-xs" style={{ color: "var(--text-2)" }}>{timeAgo(block.timestamp)}</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-xs font-semibold">{block.transactions.length} txns</p>
          <p className="text-[10px] mono" style={{ color: "var(--text-3)" }}>{shortHash(block.hash)}</p>
        </div>
      </div>
    </Link>
  );
}

/* ── Tx row ─────────────────────────────────────────────────── */
function TxRow({ tx }: { tx: Transaction }) {
  const type = txType({ to: tx.to ?? null, input: tx.input as string });
  return (
    <Link href={`/txs/${tx.hash}`} className="block">
      <div className="flex items-center justify-between py-3" style={{ borderBottom: "1px solid var(--border)" }}>
        <div className="flex items-center gap-3 min-w-0">
          <TxDot type={type} />
          <div className="min-w-0">
            <p className="text-xs mono truncate">{shortHash(tx.hash)}</p>
            <div className="flex items-center gap-1 text-[10px] mt-0.5" style={{ color: "var(--text-2)" }}>
              <span>{shortAddr(tx.from)}</span>
              <ArrowRight size={9} />
              <span>{tx.to ? shortAddr(tx.to) : "Deploy"}</span>
            </div>
          </div>
        </div>
        <div className="text-right flex-shrink-0">
          <p className="text-xs font-semibold">{formatWei(tx.value)} USDC</p>
          <p className="text-[10px] mt-0.5" style={{ color: txTypeColor(type) }}>{type}</p>
        </div>
      </div>
    </Link>
  );
}

/* ── Main ───────────────────────────────────────────────────── */
export default function HomePage() {
  const { data: stats, isLoading: statsLoading, refetch: refetchStats } = useChainStats();
  const { data: blocks = [], isLoading: blocksLoading } = useRecentBlocks(6);
  const { data: txs = [], isLoading: txsLoading } = useRecentTxs(4, 8);

  return (
    <div className="px-4 pt-2 pb-6 fade-up flex flex-col gap-5">

      {/* ── Hero banner ── */}
      <div className="relative rounded-3xl overflow-hidden p-5"
           style={{ background: "linear-gradient(135deg,#07090f 0%,#0a1f1e 50%,#130828 100%)" }}>
        <div className="absolute inset-0 opacity-20" style={{ background: "radial-gradient(circle at 20% 50%,#00d4c8,transparent 60%)" }} />
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-3">
            <span className="pulse-dot w-2 h-2 rounded-full inline-block" style={{ background: "var(--teal)" }} />
            <span className="text-xs font-semibold" style={{ color: "var(--teal)" }}>Live · Arc Testnet</span>
            <button onClick={() => refetchStats()} className="ml-auto p-1 rounded-lg" style={{ background: "var(--card)" }}>
              <RefreshCw size={12} color="var(--text-2)" />
            </button>
          </div>
          <h1 className="text-3xl font-black mb-1"><span className="grad">ArcScan</span></h1>
          <p className="text-xs mb-4" style={{ color: "var(--text-2)" }}>
            Mobile block explorer for Arc Testnet · Chain ID 5042002
          </p>
          <div className="flex gap-2">
            <Link href="/search"
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold"
                  style={{ background: "var(--teal)", color: "#07090f" }}>
              Search <Activity size={12} />
            </Link>
            <a href={FAUCET_URL} target="_blank" rel="noopener noreferrer"
               className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold"
               style={{ background: "var(--card)", border: "1px solid var(--border)" }}>
              Faucet <ExternalLink size={12} />
            </a>
          </div>
        </div>
      </div>

      {/* ── Stats grid ── */}
      <div className="grid grid-cols-2 gap-3">
        <StatTile label="Latest Block"  value={`#${stats?.blockNumber?.toString() ?? ""}`} color="var(--teal)"  loading={statsLoading} />
        <StatTile label="Chain ID"      value="5042002"          color="var(--amber)" loading={false} />
        <StatTile label="Gas Token"     value="USDC"             color="#2775ca"      loading={false} />
        <StatTile label="Finality"      value="< 1 second"       color="var(--green)" loading={false} />
      </div>

      {/* ── Chain info strip ── */}
      <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
        {[
          { label: "EVM Compatible", color: "teal"   as const },
          { label: "Malachite BFT",  color: "purple" as const },
          { label: "10K+ TPS",       color: "green"  as const },
          { label: "Quantum-Safe",   color: "blue"   as const },
          { label: "Circle L1",      color: "amber"  as const },
        ].map(({ label, color }) => (
          <Badge key={label} variant={color} className="flex-shrink-0 py-1 px-3">{label}</Badge>
        ))}
      </div>

      {/* ── Latest Blocks ── */}
      <div>
        <div className="flex items-center justify-between mb-1">
          <SectionTitle>Latest Blocks</SectionTitle>
          <Link href="/blocks" className="text-xs font-semibold" style={{ color: "var(--teal)" }}>View all →</Link>
        </div>
        <Card className="p-0 px-4">
          {blocksLoading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="py-3" style={{ borderBottom: "1px solid var(--border)" }}>
                <Sk h="h-4" w="w-full" />
              </div>
            ))
          ) : blocks.length === 0 ? <Empty label="No blocks" /> : (
            blocks.slice(0, 5).map((b) => <BlockRow key={b.hash} block={b} />)
          )}
        </Card>
      </div>

      {/* ── Latest Transactions ── */}
      <div>
        <div className="flex items-center justify-between mb-1">
          <SectionTitle>Latest Transactions</SectionTitle>
          <Link href="/txs" className="text-xs font-semibold" style={{ color: "var(--teal)" }}>View all →</Link>
        </div>
        <Card className="p-0 px-4">
          {txsLoading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="py-3" style={{ borderBottom: "1px solid var(--border)" }}>
                <Sk h="h-4" w="w-full" />
              </div>
            ))
          ) : txs.length === 0 ? <Empty label="No transactions" /> : (
            (txs as Transaction[]).slice(0, 6).map((tx) => <TxRow key={tx.hash} tx={tx} />)
          )}
        </Card>
      </div>

      {/* ── Network info card ── */}
      <Card>
        <p className="text-xs font-bold mb-3 uppercase tracking-widest" style={{ color: "var(--text-2)" }}>Network Details</p>
        {[
          { label: "RPC",       value: "rpc.testnet.arc.network" },
          { label: "Explorer",  value: "testnet.arcscan.net" },
          { label: "Consensus", value: "Malachite BFT (PoA)" },
          { label: "Native gas","value": "USDC (6 decimals)" },
        ].map(({ label, value }) => (
          <div key={label} className="flex justify-between py-2" style={{ borderBottom: "1px solid var(--border)" }}>
            <span className="text-xs" style={{ color: "var(--text-2)" }}>{label}</span>
            <span className="text-xs mono font-medium">{value}</span>
          </div>
        ))}
        <a href={EXPLORER_URL} target="_blank" rel="noopener noreferrer"
           className="flex items-center justify-center gap-2 mt-4 py-2.5 rounded-xl text-xs font-bold"
           style={{ background: "var(--teal-dim)", color: "var(--teal)", border: "1px solid #00d4c830" }}>
          Open Full Explorer <ExternalLink size={12} />
        </a>
      </Card>
    </div>
  );
}
