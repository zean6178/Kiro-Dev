"use client";

import { use } from "react";
import Link from "next/link";
import { useBlockDetail } from "@/lib/hooks";
import { Card, Row, SectionTitle, TxDot, Badge, Sk, Empty, CopyBtn } from "@/components/ui";
import { shortHash, shortAddr, timeAgo, formatTs, txType, formatWei } from "@/lib/utils";
import { Box, ExternalLink, ArrowRight } from "lucide-react";
import { EXPLORER_URL } from "@/lib/arc-chain";
import type { Transaction } from "viem";

export default function BlockDetailPage({ params }: { params: Promise<{ number: string }> }) {
  const { number } = use(params);
  const bn = BigInt(number);
  const { data: block, isLoading } = useBlockDetail(bn);

  if (isLoading) return (
    <div className="px-4 pt-2 pb-6 flex flex-col gap-4 fade-up">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="card p-4"><Sk h="h-4" w="w-full" /></div>
      ))}
    </div>
  );

  if (!block) return (
    <div className="px-4 pt-10 text-center" style={{ color: "var(--text-2)" }}>Block not found</div>
  );

  const txs = block.transactions as Transaction[];

  return (
    <div className="px-4 pt-2 pb-6 fade-up flex flex-col gap-5">

      {/* Hero */}
      <div className="card p-5" style={{ background: "linear-gradient(135deg,#07090f,#0a1f1e)" }}>
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center"
               style={{ background: "var(--teal-dim)" }}>
            <Box size={22} color="var(--teal)" />
          </div>
          <div>
            <p className="text-xl font-black" style={{ color: "var(--teal)" }}>
              Block #{block.number?.toString()}
            </p>
            <p className="text-xs" style={{ color: "var(--text-2)" }}>{timeAgo(block.timestamp)}</p>
          </div>
        </div>
        <a href={`${EXPLORER_URL}/block/${block.number}`} target="_blank" rel="noopener noreferrer"
           className="flex items-center gap-1.5 text-xs font-semibold"
           style={{ color: "var(--teal)" }}>
          View on ArcScan <ExternalLink size={12} />
        </a>
      </div>

      {/* Block info */}
      <Card>
        <SectionTitle>Block Info</SectionTitle>
        <Row label="Block Number" value={<>#{block.number?.toString()}<CopyBtn text={block.number?.toString() ?? ""} /></>} />
        <Row label="Timestamp"    value={formatTs(block.timestamp)} />
        <Row label="Transactions" value={<Badge variant="teal">{txs.length} txns</Badge>} />
        <Row label="Gas Used"     value={block.gasUsed?.toString()} />
        <Row label="Gas Limit"    value={block.gasLimit?.toString()} />
        <Row label="Hash"         value={<>{shortHash(block.hash ?? "")}<CopyBtn text={block.hash ?? ""} /></>} mono />
        <Row label="Parent Hash"  value={shortHash(block.parentHash)} mono />
        <Row label="Miner"        value={<Link href={`/address/${block.miner}`} style={{ color: "var(--teal)" }}>{shortAddr(block.miner)}</Link>} mono />
        <Row label="Extra Data"   value={block.extraData ? (block.extraData as string).slice(0, 20) + "…" : "—"} mono />
      </Card>

      {/* Transactions */}
      <div>
        <SectionTitle>Transactions ({txs.length})</SectionTitle>
        {txs.length === 0 ? <Empty label="No transactions in this block" /> : (
          <div className="flex flex-col gap-2">
            {txs.map((tx) => {
              const type = txType({ to: tx.to ?? null, input: tx.input as string });
              return (
                <Link key={tx.hash} href={`/txs/${tx.hash}`}>
                  <Card className="active:scale-[.98] transition-transform">
                    <div className="flex items-center gap-3">
                      <TxDot type={type} />
                      <div className="min-w-0 flex-1">
                        <p className="text-xs mono truncate">{shortHash(tx.hash)}</p>
                        <div className="flex items-center gap-1 text-[10px] mt-0.5" style={{ color: "var(--text-2)" }}>
                          <span>{shortAddr(tx.from)}</span>
                          <ArrowRight size={9} />
                          <span>{tx.to ? shortAddr(tx.to) : "Deploy"}</span>
                        </div>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="text-xs font-semibold">{formatWei(tx.value)}</p>
                        <p className="text-[10px]" style={{ color: "var(--text-2)" }}>USDC</p>
                      </div>
                    </div>
                  </Card>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
