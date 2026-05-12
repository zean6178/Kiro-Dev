"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Search, ArrowRight, Box, Zap, Wallet, AlertCircle } from "lucide-react";
import { isHash, isAddress, isBlock } from "@/lib/utils";
import { Card } from "@/components/ui";

type ResultType = "tx" | "address" | "block" | "unknown";

function detect(input: string): ResultType {
  const t = input.trim();
  if (isHash(t))    return "tx";
  if (isAddress(t)) return "address";
  if (isBlock(t))   return "block";
  return "unknown";
}

const EXAMPLES = [
  { label: "Tx Hash",     placeholder: "0xabc...def (66 chars)", icon: Zap,    color: "var(--purple)" },
  { label: "Address",     placeholder: "0x123...789 (42 chars)", icon: Wallet, color: "var(--teal)"   },
  { label: "Block #",     placeholder: "e.g. 12345",             icon: Box,    color: "var(--amber)"  },
];

const QUICK_LINKS = [
  { label: "Latest Blocks", href: "/blocks",  icon: Box,            color: "var(--teal)",   external: false },
  { label: "Transactions",  href: "/txs",     icon: Zap,            color: "var(--purple)", external: false },
  { label: "Circle Faucet", href: "https://faucet.circle.com", icon: ArrowRight, color: "var(--green)", external: true },
  { label: "Arc Docs",      href: "https://docs.arc.network",  icon: ArrowRight, color: "var(--amber)", external: true },
];

export default function SearchPage() {
  const [input, setInput] = useState("");
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleSearch = (value = input) => {
    setError("");
    const trimmed = value.trim();
    if (!trimmed) return;

    const type = detect(trimmed);
    startTransition(() => {
      if      (type === "tx")      router.push(`/txs/${trimmed}`);
      else if (type === "address") router.push(`/address/${trimmed}`);
      else if (type === "block")   router.push(`/blocks/${trimmed}`);
      else setError("Could not identify input. Paste a tx hash (0x + 64 chars), address (0x + 40 chars), or block number.");
    });
  };

  const detected = input.trim() ? detect(input.trim()) : null;
  const detectedLabel = detected === "tx" ? "Transaction hash" : detected === "address" ? "Address" : detected === "block" ? "Block number" : null;

  return (
    <div className="px-4 pt-2 pb-6 fade-up flex flex-col gap-6">

      {/* Header */}
      <div>
        <h1 className="text-xl font-bold">Search</h1>
        <p className="text-xs mt-0.5" style={{ color: "var(--text-2)" }}>
          Search by transaction, address, or block number
        </p>
      </div>

      {/* Search box */}
      <div className="flex flex-col gap-2">
        <div className="relative">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2" color="var(--text-2)" />
          <input
            value={input}
            onChange={(e) => { setInput(e.target.value); setError(""); }}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            placeholder="0x hash, address, or block #"
            className="w-full pl-11 pr-4 py-4 rounded-2xl text-sm outline-none mono"
            style={{
              background: "var(--card)", border: `1px solid ${input ? "var(--teal)" : "var(--border)"}`,
              color: "var(--text)",
            }}
            autoFocus
          />
        </div>

        {/* Detected type indicator */}
        {detectedLabel && !error && (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl"
               style={{ background: "var(--teal-dim)" }}>
            <span className="text-xs font-semibold" style={{ color: "var(--teal)" }}>
              ✓ Detected: {detectedLabel}
            </span>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="flex items-start gap-2 px-3 py-2.5 rounded-xl"
               style={{ background: "var(--red-dim)", border: "1px solid #ef444430" }}>
            <AlertCircle size={14} color="var(--red)" className="flex-shrink-0 mt-0.5" />
            <p className="text-xs" style={{ color: "var(--red)" }}>{error}</p>
          </div>
        )}

        <button onClick={() => handleSearch()} disabled={!input.trim() || isPending}
                className="w-full py-3.5 rounded-2xl text-sm font-bold flex items-center justify-center gap-2 transition-all"
                style={{
                  background: input.trim() ? "var(--teal)" : "var(--border)",
                  color:      input.trim() ? "#07090f"    : "var(--text-3)",
                }}>
          {isPending ? "Searching…" : <><Search size={16} /> Search</>}
        </button>
      </div>

      {/* Input format guide */}
      <Card>
        <p className="text-[10px] font-bold uppercase tracking-widest mb-3" style={{ color: "var(--text-3)" }}>
          Supported Inputs
        </p>
        {EXAMPLES.map(({ label, placeholder, icon: Icon, color }) => (
          <div key={label} className="flex items-center gap-3 py-2.5" style={{ borderBottom: "1px solid var(--border)" }}>
            <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
                 style={{ background: `${color}15` }}>
              <Icon size={15} color={color} />
            </div>
            <div>
              <p className="text-xs font-semibold">{label}</p>
              <p className="text-[10px] mono" style={{ color: "var(--text-3)" }}>{placeholder}</p>
            </div>
          </div>
        ))}
      </Card>

      {/* Quick links */}
      <div>
        <p className="text-[10px] font-bold uppercase tracking-widest mb-3" style={{ color: "var(--text-3)" }}>
          Quick Links
        </p>
        <div className="grid grid-cols-2 gap-3">
          {QUICK_LINKS.map(({ label, href, icon: Icon, color, external }) => (
            external ? (
              <a key={label} href={href} target="_blank" rel="noopener noreferrer"
                 className="card-sm p-3 flex items-center gap-2 active:scale-95 transition-transform">
                <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: `${color}15` }}>
                  <Icon size={15} color={color} />
                </div>
                <p className="text-xs font-semibold">{label}</p>
              </a>
            ) : (
              <Link key={label} href={href}
                 className="card-sm p-3 flex items-center gap-2 active:scale-95 transition-transform">
                <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: `${color}15` }}>
                  <Icon size={15} color={color} />
                </div>
                <p className="text-xs font-semibold">{label}</p>
              </Link>
            )
          ))}
        </div>
      </div>

      {/* Paste examples */}
      <Card>
        <p className="text-[10px] font-bold uppercase tracking-widest mb-3" style={{ color: "var(--text-3)" }}>
          Try an example
        </p>
        {[
          { label: "Arc Testnet block #1", value: "1" },
          { label: "Zero address",         value: "0x0000000000000000000000000000000000000000" },
        ].map(({ label, value }) => (
          <button key={label} onClick={() => { setInput(value); handleSearch(value); }}
                  className="w-full flex items-center justify-between py-2.5 text-left"
                  style={{ borderBottom: "1px solid var(--border)" }}>
            <span className="text-xs">{label}</span>
            <span className="text-[10px] mono" style={{ color: "var(--text-3)" }}>{value.slice(0, 20)}…</span>
          </button>
        ))}
      </Card>
    </div>
  );
}
