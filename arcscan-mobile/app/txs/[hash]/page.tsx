"use client";

import { use } from "react";
import Link from "next/link";
import { useTxDetail } from "@/lib/hooks";
import { Card, Row, SectionTitle, TxTypeBadge, StatusBadge, Badge, Sk, CopyBtn } from "@/components/ui";
import { shortAddr, shortHash, txType, formatWei, formatTs, timeAgo } from "@/lib/utils";
import { ExternalLink, ArrowRight, Zap } from "lucide-react";
import { EXPLORER_URL } from "@/lib/arc-chain";

export default function TxDetailPage({ params }: { params: Promise<{ hash: string }> }) {
  const { hash } = use(params);
  const { data, isLoading } = useTxDetail(hash as `0x${string}`);

  if (isLoading) return (
    <div className="px-4 pt-2 pb-6 flex flex-col gap-4 fade-up">
      {Array.from({ length: 7 }).map((_, i) => (
        <div key={i} className="card p-4"><Sk h="h-4" w="w-full" /></div>
      ))}
    </div>
  );

  if (!data?.tx) return (
    <div className="px-4 pt-10 text-center" style={{ color: "var(--text-2)" }}>Transaction not found</div>
  );

  const { tx, receipt } = data;
  const type    = txType({ to: tx.to ?? null, input: tx.input as string });
  const status  = receipt ? (receipt.status === "success" ? "success" : "failed") : "pending";
  const gasUsed = receipt?.gasUsed;

  return (
    <div className="px-4 pt-2 pb-6 fade-up flex flex-col gap-5">

      {/* Hero */}
      <div className="card p-5" style={{ background: "linear-gradient(135deg,#07090f,#130828)" }}>
        <div className="flex items-center gap-3 mb-3">
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center"
               style={{ background: "#a78bfa15" }}>
            <Zap size={22} color="#a78bfa" />
          </div>
          <div>
            <p className="text-sm font-bold mb-1">Transaction</p>
            <div className="flex gap-2">
              <TxTypeBadge type={type} />
              <StatusBadge status={status} />
            </div>
          </div>
        </div>
        <p className="text-[10px] mono break-all mb-3" style={{ color: "var(--text-2)" }}>{tx.hash}</p>
        <a href={`${EXPLORER_URL}/tx/${tx.hash}`} target="_blank" rel="noopener noreferrer"
           className="flex items-center gap-1.5 text-xs font-semibold"
           style={{ color: "var(--teal)" }}>
          View on ArcScan <ExternalLink size={12} />
        </a>
      </div>

      {/* Value & fee */}
      <div className="grid grid-cols-2 gap-3">
        <div className="card p-4">
          <p className="text-[10px] mb-1" style={{ color: "var(--text-2)" }}>Value</p>
          <p className="text-xl font-black" style={{ color: "var(--amber)" }}>{formatWei(tx.value)}</p>
          <p className="text-xs" style={{ color: "var(--text-2)" }}>USDC</p>
        </div>
        <div className="card p-4">
          <p className="text-[10px] mb-1" style={{ color: "var(--text-2)" }}>Gas Used</p>
          <p className="text-xl font-black" style={{ color: "var(--teal)" }}>
            {gasUsed ? gasUsed.toString() : "—"}
          </p>
          <p className="text-xs" style={{ color: "var(--text-2)" }}>units</p>
        </div>
      </div>

      {/* Main info */}
      <Card>
        <SectionTitle>Transaction Details</SectionTitle>
        <Row label="Hash"          value={<>{shortHash(tx.hash)}<CopyBtn text={tx.hash} /></>} mono />
        <Row label="Status"        value={<StatusBadge status={status} />} />
        <Row label="Block"
             value={
               <Link href={`/blocks/${tx.blockNumber}`} style={{ color: "var(--teal)" }}>
                 #{tx.blockNumber?.toString()}
               </Link>
             } />
        <Row label="From"
             value={
               <Link href={`/address/${tx.from}`} style={{ color: "var(--teal)" }}>
                 {shortAddr(tx.from)}<CopyBtn text={tx.from} />
               </Link>
             } mono />
        <Row label="To"
             value={
               tx.to ? (
                 <Link href={`/address/${tx.to}`} style={{ color: "var(--teal)" }}>
                   {shortAddr(tx.to)}<CopyBtn text={tx.to} />
                 </Link>
               ) : <Badge variant="purple">Contract Deploy</Badge>
             } mono />
        <Row label="Nonce"         value={tx.nonce?.toString()} />
        <Row label="Gas Price"     value={tx.gasPrice ? `${tx.gasPrice.toString()} wei` : "—"} mono />
        <Row label="Gas Limit"     value={tx.gas?.toString()} />
        <Row label="Type"          value={`${tx.type ?? 0} (${type})`} />
      </Card>

      {/* Input data */}
      {tx.input && tx.input !== "0x" && (
        <Card>
          <SectionTitle>Input Data</SectionTitle>
          <div className="relative">
            <p className="text-[10px] mono break-all p-3 rounded-xl leading-5"
               style={{ background: "var(--surface)", color: "var(--text-2)", maxHeight: "160px", overflow: "hidden" }}>
              {(tx.input as string).slice(0, 300)}…
            </p>
            <CopyBtn text={tx.input as string} />
          </div>
        </Card>
      )}

      {/* Receipt logs */}
      {receipt && receipt.logs.length > 0 && (
        <Card>
          <SectionTitle>Event Logs ({receipt.logs.length})</SectionTitle>
          {receipt.logs.map((log, i) => (
            <div key={i} className="py-2.5" style={{ borderBottom: "1px solid var(--border)" }}>
              <p className="text-[10px] mono" style={{ color: "var(--text-2)" }}>
                Log #{i} · {shortAddr(log.address)}
              </p>
              {log.topics.slice(0, 2).map((t, j) => (
                <p key={j} className="text-[9px] mono truncate mt-0.5" style={{ color: "var(--text-3)" }}>{t}</p>
              ))}
            </div>
          ))}
        </Card>
      )}
    </div>
  );
}
