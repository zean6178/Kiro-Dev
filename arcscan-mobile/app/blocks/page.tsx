"use client";

import { useState } from "react";
import Link from "next/link";
import { useRecentBlocks } from "@/lib/hooks";
import { Card, Sk, Empty, SectionTitle } from "@/components/ui";
import { Box, ChevronRight, RefreshCw, Clock } from "lucide-react";
import { shortHash, timeAgo, formatTs } from "@/lib/utils";
import type { Block } from "viem";

function BlockCard({ block }: { block: Block }) {
  return (
    <Link href={`/blocks/${block.number}`}>
      <Card className="active:scale-[.98] transition-transform hover:border-[#00d4c840]">
        <div className="flex items-center justify-between">
          {/* Left */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl flex items-center justify-center"
                 style={{ background: "var(--teal-dim)" }}>
              <Box size={18} color="var(--teal)" />
            </div>
            <div>
              <p className="font-bold text-sm" style={{ color: "var(--teal)" }}>
                Block #{block.number?.toString()}
              </p>
              <div className="flex items-center gap-1 mt-0.5">
                <Clock size={10} color="var(--text-2)" />
                <p className="text-[10px]" style={{ color: "var(--text-2)" }}>
                  {timeAgo(block.timestamp)}
                </p>
              </div>
            </div>
          </div>
          {/* Right */}
          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-sm font-bold">{block.transactions.length}</p>
              <p className="text-[10px]" style={{ color: "var(--text-2)" }}>txns</p>
            </div>
            <ChevronRight size={16} color="var(--text-3)" />
          </div>
        </div>

        {/* Hash row */}
        <div className="mt-3 pt-3 flex items-center justify-between" style={{ borderTop: "1px solid var(--border)" }}>
          <span className="text-[10px]" style={{ color: "var(--text-3)" }}>Hash</span>
          <span className="text-[10px] mono" style={{ color: "var(--text-2)" }}>{shortHash(block.hash ?? "")}</span>
        </div>
      </Card>
    </Link>
  );
}

export default function BlocksPage() {
  const [count, setCount] = useState(15);
  const { data: blocks = [], isLoading, refetch, isFetching } = useRecentBlocks(count);

  return (
    <div className="px-4 pt-2 pb-6 fade-up flex flex-col gap-4">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold">Blocks</h1>
          <p className="text-xs" style={{ color: "var(--text-2)" }}>
            Latest {count} blocks · Arc Testnet
          </p>
        </div>
        <button onClick={() => refetch()} disabled={isFetching}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold"
                style={{ background: "var(--card)", border: "1px solid var(--border)" }}>
          <RefreshCw size={13} className={isFetching ? "animate-spin" : ""} color="var(--text-2)" />
          Refresh
        </button>
      </div>

      {/* Live indicator */}
      <div className="flex items-center gap-2 px-3 py-2 rounded-xl"
           style={{ background: "var(--teal-dim)", border: "1px solid #00d4c830" }}>
        <span className="pulse-dot w-1.5 h-1.5 rounded-full inline-block" style={{ background: "var(--teal)" }} />
        <p className="text-xs font-semibold" style={{ color: "var(--teal)" }}>
          Auto-refreshing every 8 seconds
        </p>
      </div>

      {/* Block list */}
      <div className="flex flex-col gap-3">
        {isLoading
          ? Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="card p-4 flex flex-col gap-2">
                <Sk h="h-5" w="w-32" />
                <Sk h="h-3" w="w-full" />
              </div>
            ))
          : blocks.length === 0
          ? <Empty label="No blocks found" />
          : blocks.map((b) => <BlockCard key={b.hash} block={b} />)
        }
      </div>

      {/* Load more */}
      {!isLoading && blocks.length > 0 && (
        <button onClick={() => setCount((c) => c + 10)}
                className="py-3 rounded-2xl text-sm font-semibold w-full"
                style={{ background: "var(--card)", border: "1px solid var(--border)", color: "var(--text-2)" }}>
          Load 10 more
        </button>
      )}
    </div>
  );
}
