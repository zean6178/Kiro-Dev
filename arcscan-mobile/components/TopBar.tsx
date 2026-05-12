"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ChevronLeft, Wifi, WifiOff } from "lucide-react";
import { useBlockNumber } from "@/lib/hooks";

const TITLES: Record<string, string> = {
  "/":        "ArcScan",
  "/blocks":  "Blocks",
  "/txs":     "Transactions",
  "/search":  "Search",
};

export default function TopBar() {
  const path     = usePathname();
  const router   = useRouter();
  const { data: bn } = useBlockNumber();

  const isDetail = !Object.keys(TITLES).includes(path);
  const title    = TITLES[path] ?? "ArcScan";

  return (
    <header className="sticky top-0 z-50 flex items-center justify-between px-4 py-3"
            style={{ background: "linear-gradient(180deg,var(--bg) 70%,transparent)", backdropFilter: "blur(8px)" }}>
      {/* Left */}
      <div className="flex items-center gap-2">
        {isDetail ? (
          <button onClick={() => router.back()}
                  className="w-8 h-8 rounded-xl flex items-center justify-center"
                  style={{ background: "var(--card)", border: "1px solid var(--border)" }}>
            <ChevronLeft size={18} color="var(--text-2)" />
          </button>
        ) : (
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center"
                 style={{ background: "linear-gradient(135deg,#00d4c8,#7c3aed)" }}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <circle cx="8" cy="8" r="7" stroke="white" strokeWidth="1.5"/>
                <path d="M5 8h6M8 5l3 3-3 3" stroke="white" strokeWidth="1.4" strokeLinecap="round"/>
              </svg>
            </div>
          </Link>
        )}
        <div>
          <span className={isDetail ? "font-semibold text-sm" : "font-bold text-sm grad"}>{title}</span>
          {!isDetail && (
            <div className="flex items-center gap-1">
              <span className="pulse-dot w-1.5 h-1.5 rounded-full inline-block" style={{ background: "var(--teal)" }} />
              <span className="text-[10px]" style={{ color: "var(--text-2)" }}>Arc Testnet</span>
            </div>
          )}
        </div>
      </div>

      {/* Right — block number */}
      <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl"
           style={{ background: "var(--card)", border: "1px solid var(--border)" }}>
        {bn ? (
          <>
            <Box size={12} color="var(--teal)" />
            <span className="text-xs font-mono" style={{ color: "var(--teal)" }}>
              #{bn.toString()}
            </span>
          </>
        ) : (
          <span className="shimmer w-16 h-3 inline-block" />
        )}
      </div>
    </header>
  );
}

import { Box } from "lucide-react";
