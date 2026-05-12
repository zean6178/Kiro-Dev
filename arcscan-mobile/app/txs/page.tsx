"use client";

import { useState } from "react";
import Link from "next/link";
import { useRecentTxs } from "@/lib/hooks";
import { Card, Sk, Empty, TxTypeBadge, TxDot } from "@/components/ui";
import { shortAddr, shortHash, txType, formatWei, timeAgo } from "@/lib/utils";
import { RefreshCw, ArrowRight, Filter } from "lucide-react";
import type { Transaction } from "viem";

type FilterType = "all" | "transfer" | "contract" | "deploy";

function TxCard({ tx }: { tx: Transaction }) {
  const type = txType({ to: tx.to ?? null, input: tx.input as string });
  return (
    <Link href={`/txs/${tx.hash}`}>
      <Card className="active:scale-[.98] transition-transform hover:border-[#00d4c840]">
        <div className="flex items-center gap-3">
          <TxDot type={type} />
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 mb-0.5">
              <p className="text-xs mono truncate">{shortHash(tx.hash)}</p>
              <TxTypeBadge type={type} />
            </div>
            <div className="flex items-center gap-1 text-[10px]" style={{ color: "var(--text-2)" }}>
              <span className="font-mono">{shortAddr(tx.from)}</span>
              <ArrowRight size={9} />
              <span className="font-mono">{tx.to ? shortAddr(tx.to) : "New Contract"}</span>
            </div>
          </div>
          <div className="text-right flex-shrink-0 ml-2">
            <p className="text-xs font-bold">{formatWei(tx.value)}</p>
            <p className="text-[10px]" style={{ color: "var(--text-2)" }}>USDC</p>
          </div>
        </div>
        <div className="flex items-center justify-between mt-2 pt-2" style={{ borderTop: "1px solid var(--border)" }}>
          <p className="text-[10px] mono" style={{ color: "var(--text-3)" }}>
            Block #{tx.blockNumber?.toString()}
          </p>
          <p className="text-[10px]" style={{ color: "var(--text-3)" }}>
            Nonce: {tx.nonce}
          </p>
        </div>
      </Card>
    </Link>
  );
}

export default function TxsPage() {
  const [filterType, setFilterType] = useState<FilterType>("all");
  const [blockCount, setBlockCount] = useState(5);
  const { data: allTxs = [], isLoading, refetch, isFetching } = useRecentTxs(blockCount, 50);

  const txs = (allTxs as Transaction[]).filter((tx) => {
    if (filterType === "all") return true;
    return txType({ to: tx.to ?? null, input: tx.input as string }) === filterType;
  });

  const FILTERS: { label: string; value: FilterType }[] = [
    { label: "All",      value: "all"      },
    { label: "Transfer", value: "transfer" },
    { label: "Contract", value: "contract" },
    { label: "Deploy",   value: "deploy"   },
  ];

  return (
    <div className="px-4 pt-2 pb-6 fade-up flex flex-col gap-4">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold">Transactions</h1>
          <p className="text-xs" style={{ color: "var(--text-2)" }}>
            {txs.length} txns from last {blockCount} blocks
          </p>
        </div>
        <button onClick={() => refetch()} disabled={isFetching}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold"
                style={{ background: "var(--card)", border: "1px solid var(--border)" }}>
          <RefreshCw size={13} className={isFetching ? "animate-spin" : ""} color="var(--text-2)" />
          Refresh
        </button>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 overflow-x-auto no-scrollbar">
        {FILTERS.map(({ label, value }) => (
          <button key={value} onClick={() => setFilterType(value)}
                  className="flex-shrink-0 px-3 py-1.5 rounded-xl text-xs font-semibold"
                  style={{
                    background: filterType === value ? "var(--teal)" : "var(--card)",
                    color:      filterType === value ? "#07090f"     : "var(--text-2)",
                    border: "1px solid var(--border)",
                  }}>
            {label}
          </button>
        ))}
      </div>

      {/* Tx list */}
      <div className="flex flex-col gap-3">
        {isLoading
          ? Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="card p-4 flex flex-col gap-2">
                <Sk h="h-4" w="w-3/4" />
                <Sk h="h-3" w="w-full" />
              </div>
            ))
          : txs.length === 0
          ? <Empty label="No transactions found" />
          : txs.map((tx) => <TxCard key={tx.hash} tx={tx as Transaction} />)
        }
      </div>

      {/* Load more blocks */}
      {!isLoading && (
        <button onClick={() => setBlockCount((c) => c + 5)}
                className="py-3 rounded-2xl text-sm font-semibold w-full"
                style={{ background: "var(--card)", border: "1px solid var(--border)", color: "var(--text-2)" }}>
          Load 5 more blocks
        </button>
      )}
    </div>
  );
}
