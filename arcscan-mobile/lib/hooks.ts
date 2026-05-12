"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getRecentBlocks, getRecentTxs, getBlock, getTx,
  getTxReceipt, getBalance, getChainStats, getLatestBlockNumber,
} from "./rpc";
import { publicClient } from "./rpc";

const POLL = 8_000; // ms

// ── Chain stats (home) ──────────────────────────────────────
export function useChainStats() {
  return useQuery({
    queryKey: ["chainStats"],
    queryFn: getChainStats,
    refetchInterval: POLL,
    staleTime: 4_000,
  });
}

// ── Recent blocks (home + blocks page) ─────────────────────
export function useRecentBlocks(count = 10) {
  return useQuery({
    queryKey: ["recentBlocks", count],
    queryFn: () => getRecentBlocks(count),
    refetchInterval: POLL,
    staleTime: 4_000,
  });
}

// ── Recent transactions (home + txs page) ──────────────────
export function useRecentTxs(blockCount = 5, limit = 20) {
  return useQuery({
    queryKey: ["recentTxs", blockCount, limit],
    queryFn: () => getRecentTxs(blockCount, limit),
    refetchInterval: POLL,
    staleTime: 4_000,
  });
}

// ── Block detail ───────────────────────────────────────────
export function useBlockDetail(blockNumber: bigint | null) {
  return useQuery({
    queryKey: ["block", blockNumber?.toString()],
    queryFn: () => getBlock(blockNumber!, true),
    enabled: blockNumber !== null,
    staleTime: 30_000,
  });
}

// ── Transaction detail ─────────────────────────────────────
export function useTxDetail(hash: `0x${string}` | null) {
  return useQuery({
    queryKey: ["tx", hash],
    queryFn: async () => {
      const [tx, receipt] = await Promise.all([
        getTx(hash!),
        getTxReceipt(hash!).catch(() => null),
      ]);
      return { tx, receipt };
    },
    enabled: !!hash,
    staleTime: 30_000,
  });
}

// ── Address detail ─────────────────────────────────────────
export function useAddressDetail(address: `0x${string}` | null) {
  return useQuery({
    queryKey: ["address", address],
    queryFn: async () => {
      const balance = await getBalance(address!);
      // Fetch txs mentioning this address from recent blocks
      const txs = await getRecentTxs(10, 50);
      const related = txs.filter(
        (tx) =>
          tx.from?.toLowerCase() === address!.toLowerCase() ||
          tx.to?.toLowerCase()   === address!.toLowerCase()
      );
      return { balance, txs: related };
    },
    enabled: !!address,
    staleTime: 10_000,
    refetchInterval: 15_000,
  });
}

// ── Latest block number (lightweight) ──────────────────────
export function useBlockNumber() {
  return useQuery({
    queryKey: ["blockNumber"],
    queryFn: getLatestBlockNumber,
    refetchInterval: 5_000,
    staleTime: 2_000,
  });
}

// ── Txs from a specific block ───────────────────────────────
export function useBlockTxs(blockNumber: bigint | null) {
  return useQuery({
    queryKey: ["blockTxs", blockNumber?.toString()],
    queryFn: async () => {
      const b = await getBlock(blockNumber!, true);
      return b.transactions as import("viem").Transaction[];
    },
    enabled: blockNumber !== null,
    staleTime: 30_000,
  });
}
