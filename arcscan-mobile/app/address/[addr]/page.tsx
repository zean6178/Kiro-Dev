"use client";

import { use } from "react";
import Link from "next/link";
import { useAddressDetail } from "@/lib/hooks";
import { Card, Row, SectionTitle, TxDot, TxTypeBadge, Sk, Empty, Badge, CopyBtn } from "@/components/ui";
import { shortAddr, shortHash, txType, formatUsdc, formatWei, timeAgo } from "@/lib/utils";
import { ExternalLink, ArrowRight, Wallet } from "lucide-react";
import { EXPLORER_URL } from "@/lib/arc-chain";
import type { Transaction } from "viem";

export default function AddressPage({ params }: { params: Promise<{ addr: string }> }) {
  const { addr } = use(params);
  const address  = addr as `0x${string}`;
  const { data, isLoading } = useAddressDetail(address);

  if (isLoading) return (
    <div className="px-4 pt-2 pb-6 flex flex-col gap-4 fade-up">
      <div className="card p-5"><Sk h="h-16" w="w-full" /></div>
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="card p-4"><Sk h="h-4" w="w-full" /></div>
      ))}
    </div>
  );

  const balance = data?.balance ?? 0n;
  const txs     = (data?.txs ?? []) as Transaction[];

  // Count sent vs received
  const sent     = txs.filter((t) => t.from?.toLowerCase() === address.toLowerCase()).length;
  const received = txs.filter((t) => t.to?.toLowerCase()   === address.toLowerCase()).length;

  return (
    <div className="px-4 pt-2 pb-6 fade-up flex flex-col gap-5">

      {/* Hero */}
      <div className="card p-5" style={{ background: "linear-gradient(135deg,#07090f,#0a1f1e)" }}>
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center"
               style={{ background: "var(--teal-dim)" }}>
            <Wallet size={22} color="var(--teal)" />
          </div>
          <div>
            <p className="text-xs font-semibold mb-1" style={{ color: "var(--text-2)" }}>Address</p>
            <p className="text-sm font-bold mono">{shortAddr(address, 8, 6)}</p>
          </div>
        </div>
        <p className="text-[10px] mono break-all mb-3" style={{ color: "var(--text-2)" }}>
          {address}<CopyBtn text={address} />
        </p>
        <a href={`${EXPLORER_URL}/address/${address}`} target="_blank" rel="noopener noreferrer"
           className="flex items-center gap-1.5 text-xs font-semibold"
           style={{ color: "var(--teal)" }}>
          View on ArcScan <ExternalLink size={12} />
        </a>
      </div>

      {/* Balance + stats */}
      <div className="grid grid-cols-3 gap-3">
        <div className="card p-3 col-span-1">
          <p className="text-[10px] mb-1" style={{ color: "var(--text-2)" }}>Balance</p>
          <p className="text-lg font-black" style={{ color: "#2775ca" }}>{formatUsdc(balance)}</p>
          <p className="text-[10px]" style={{ color: "var(--text-2)" }}>USDC</p>
        </div>
        <div className="card p-3">
          <p className="text-[10px] mb-1" style={{ color: "var(--text-2)" }}>Sent</p>
          <p className="text-lg font-black" style={{ color: "var(--amber)" }}>{sent}</p>
          <p className="text-[10px]" style={{ color: "var(--text-2)" }}>txns</p>
        </div>
        <div className="card p-3">
          <p className="text-[10px] mb-1" style={{ color: "var(--text-2)" }}>Received</p>
          <p className="text-lg font-black" style={{ color: "var(--green)" }}>{received}</p>
          <p className="text-[10px]" style={{ color: "var(--text-2)" }}>txns</p>
        </div>
      </div>

      {/* Info */}
      <Card>
        <SectionTitle>Address Info</SectionTitle>
        <Row label="Address"     value={<>{shortAddr(address)}<CopyBtn text={address} /></>} mono />
        <Row label="USDC Balance" value={`${formatUsdc(balance)} USDC`} color="#2775ca" />
        <Row label="Txn Count"    value={`${txs.length} (${sent} out, ${received} in)`} />
        <Row label="Network"      value="Arc Testnet" />
        <Row label="Chain ID"     value="5042002" />
      </Card>

      {/* Transaction history */}
      <div>
        <SectionTitle>Transaction History ({txs.length})</SectionTitle>
        {txs.length === 0 ? (
          <Empty label="No transactions found for this address" />
        ) : (
          <div className="flex flex-col gap-2">
            {txs.map((tx) => {
              const type      = txType({ to: tx.to ?? null, input: tx.input as string });
              const isSender  = tx.from?.toLowerCase() === address.toLowerCase();
              const direction = isSender ? "out" : "in";
              return (
                <Link key={tx.hash} href={`/txs/${tx.hash}`}>
                  <Card className="active:scale-[.98] transition-transform">
                    <div className="flex items-center gap-3">
                      <TxDot type={type} />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 mb-0.5">
                          <p className="text-xs mono truncate">{shortHash(tx.hash)}</p>
                          <Badge variant={direction === "out" ? "amber" : "green"}>
                            {direction}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-1 text-[10px]" style={{ color: "var(--text-2)" }}>
                          <span className="mono">{shortAddr(tx.from)}</span>
                          <ArrowRight size={9} />
                          <span className="mono">{tx.to ? shortAddr(tx.to) : "Deploy"}</span>
                        </div>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="text-xs font-bold">{formatWei(tx.value)}</p>
                        <TxTypeBadge type={type} />
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
