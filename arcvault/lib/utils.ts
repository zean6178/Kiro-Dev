export function shortAddress(address: string): string {
  if (!address) return "";
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

export function formatUSDC(raw: bigint, decimals = 6): string {
  const val = Number(raw) / 10 ** decimals;
  return val.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export function formatTimestamp(ts: number): string {
  const d = new Date(ts * 1000);
  return d.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function explorerTx(hash: string): string {
  return `https://testnet.arcscan.net/tx/${hash}`;
}

export function explorerAddress(addr: string): string {
  return `https://testnet.arcscan.net/address/${addr}`;
}

export function cn(...classes: (string | undefined | false | null)[]): string {
  return classes.filter(Boolean).join(" ");
}
