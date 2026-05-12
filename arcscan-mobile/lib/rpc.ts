/**
 * Lightweight RPC helpers — no wagmi dependency,
 * so they can be called from server components & client hooks alike.
 */
import { createPublicClient, http, type Block, type Transaction } from "viem";
import { arcTestnet, RPC_URL } from "./arc-chain";

export const publicClient = createPublicClient({
  chain: arcTestnet,
  transport: http(RPC_URL),
});

// ── Block helpers ──────────────────────────────────────────

export async function getLatestBlockNumber(): Promise<bigint> {
  return publicClient.getBlockNumber();
}

export async function getBlock(blockNumber: bigint, includeTxs = false) {
  return publicClient.getBlock({ blockNumber, includeTransactions: includeTxs });
}

export async function getBlockByHash(hash: `0x${string}`, includeTxs = false) {
  return publicClient.getBlock({ blockHash: hash, includeTransactions: includeTxs });
}

/** Fetch `count` most recent blocks (no txs, fast) */
export async function getRecentBlocks(count = 10): Promise<Block[]> {
  const latest = await publicClient.getBlockNumber();
  const nums: bigint[] = [];
  for (let i = 0n; i < BigInt(count); i++) {
    const n = latest - i;
    if (n >= 0n) nums.push(n);
  }
  return Promise.all(nums.map((n) => publicClient.getBlock({ blockNumber: n, includeTransactions: false })));
}

// ── Transaction helpers ────────────────────────────────────

export async function getTx(hash: `0x${string}`) {
  return publicClient.getTransaction({ hash });
}

export async function getTxReceipt(hash: `0x${string}`) {
  return publicClient.getTransactionReceipt({ hash });
}

/** Fetch transactions from the latest `blockCount` blocks, up to `limit` total */
export async function getRecentTxs(blockCount = 5, limit = 20) {
  const latest = await publicClient.getBlockNumber();
  const blocks = await Promise.all(
    Array.from({ length: blockCount }, (_, i) =>
      publicClient.getBlock({ blockNumber: latest - BigInt(i), includeTransactions: true })
    )
  );
  const txs: Transaction[] = [];
  for (const b of blocks) {
    for (const tx of b.transactions as Transaction[]) {
      txs.push(tx);
      if (txs.length >= limit) return txs;
    }
  }
  return txs;
}

// ── Address helpers ────────────────────────────────────────

export async function getBalance(address: `0x${string}`): Promise<bigint> {
  return publicClient.getBalance({ address });
}

// ── Chain stats ────────────────────────────────────────────

export async function getChainStats() {
  const [blockNumber, gasPrice] = await Promise.all([
    publicClient.getBlockNumber(),
    publicClient.getGasPrice().catch(() => 0n),
  ]);
  return { blockNumber, gasPrice };
}
