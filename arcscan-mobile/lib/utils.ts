export function shortAddr(addr: string, pre = 6, suf = 4) {
  if (!addr) return "";
  return `${addr.slice(0, pre)}...${addr.slice(-suf)}`;
}

export function shortHash(hash: string) {
  if (!hash) return "";
  return `${hash.slice(0, 10)}...${hash.slice(-8)}`;
}

export function formatUsdc(raw: bigint, decimals = 6): string {
  const n = Number(raw) / 10 ** decimals;
  return n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 6 });
}

export function formatWei(raw: bigint): string {
  // On Arc USDC is native (6 dec) but gas values come as raw bigint
  return formatUsdc(raw, 6);
}

export function timeAgo(ts: bigint | number): string {
  const seconds = Math.floor(Date.now() / 1000) - Number(ts);
  if (seconds < 60)  return `${seconds}s ago`;
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  return `${Math.floor(seconds / 86400)}d ago`;
}

export function formatTs(ts: bigint | number): string {
  return new Date(Number(ts) * 1000).toLocaleString("en-US", {
    month: "short", day: "numeric",
    hour: "2-digit", minute: "2-digit", second: "2-digit",
  });
}

export function txType(tx: { to: string | null; input: `0x${string}` | string }): "deploy" | "contract" | "transfer" {
  if (!tx.to) return "deploy";
  if (tx.input && tx.input.length > 2) return "contract";
  return "transfer";
}

export function txTypeColor(type: "deploy" | "contract" | "transfer") {
  return type === "deploy"   ? "#a78bfa"
       : type === "contract" ? "#00d4c8"
       :                       "#f59e0b";
}
export function txTypeBg(type: "deploy" | "contract" | "transfer") {
  return type === "deploy"   ? "#a78bfa20"
       : type === "contract" ? "#00d4c820"
       :                       "#f59e0b20";
}

export function explorerTx(hash: string)    { return `https://testnet.arcscan.net/tx/${hash}`; }
export function explorerAddr(addr: string)  { return `https://testnet.arcscan.net/address/${addr}`; }
export function explorerBlock(n: string | number | bigint) { return `https://testnet.arcscan.net/block/${n}`; }

export function cn(...classes: (string | undefined | false | null)[]): string {
  return classes.filter(Boolean).join(" ");
}

export function isHash(s: string)    { return /^0x[0-9a-fA-F]{64}$/.test(s); }
export function isAddress(s: string) { return /^0x[0-9a-fA-F]{40}$/.test(s); }
export function isBlock(s: string)   { return /^\d+$/.test(s); }
