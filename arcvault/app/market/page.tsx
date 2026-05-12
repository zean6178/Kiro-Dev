"use client";

import { useState, useCallback } from "react";
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { isAddress } from "viem";
import { Card } from "@/components/Card";
import { Badge } from "@/components/Badge";
import { arcTestnet } from "@/lib/arc-chain";
import { ERC721_ABI } from "@/lib/erc721-abi";
import { shortAddress, explorerTx } from "@/lib/utils";
import {
  Sparkles, ExternalLink, Loader2, CheckCircle, AlertCircle,
  Image as ImageIcon, Zap, Plus, Search,
} from "lucide-react";

/* ─── Mock NFT data (testnet display) ──────────────────── */
const DEMO_NFTS = [
  {
    id: "1", name: "Arc Genesis #001", collection: "Arc Genesis",
    price: "10.00", currency: "USDC", image: "🗡️",
    rarity: "Legendary", owner: "0x1234...abcd",
    description: "First-ever NFT minted on Arc Testnet.",
    gradient: "linear-gradient(135deg, #1a0533, #0d1f3c)",
    accent: "#a78bfa",
  },
  {
    id: "2", name: "Ronin Spirit #042", collection: "Ronin Universe",
    price: "5.00", currency: "USDC", image: "⛩️",
    rarity: "Epic", owner: "0xabcd...ef01",
    description: "A lone spirit from the destroyed village.",
    gradient: "linear-gradient(135deg, #0c1f1e, #0f1420)",
    accent: "#00d4c8",
  },
  {
    id: "3", name: "USDC Samurai #007", collection: "Arc Warriors",
    price: "2.50", currency: "USDC", image: "⚔️",
    rarity: "Rare", owner: "0x5678...9012",
    description: "Guardian of stablecoin rails.",
    gradient: "linear-gradient(135deg, #1a1200, #0f1420)",
    accent: "#f59e0b",
  },
  {
    id: "4", name: "Ghost Reflection #013", collection: "Ronin Universe",
    price: "8.00", currency: "USDC", image: "👻",
    rarity: "Legendary", owner: "0x9012...3456",
    description: "The mirror that holds two souls.",
    gradient: "linear-gradient(135deg, #0f0f1a, #1a0f2e)",
    accent: "#e879f9",
  },
  {
    id: "5", name: "Arc Validator #001", collection: "Arc Nodes",
    price: "50.00", currency: "USDC", image: "🔷",
    rarity: "Mythic", owner: "0x3456...7890",
    description: "Early validator commemorative NFT.",
    gradient: "linear-gradient(135deg, #001a2c, #0c2a1a)",
    accent: "#22c55e",
  },
  {
    id: "6", name: "Rain & Blade #088", collection: "Ronin Universe",
    price: "3.00", currency: "USDC", image: "🌧️",
    rarity: "Common", owner: "0x7890...abcd",
    description: "The storm that never ends.",
    gradient: "linear-gradient(135deg, #0a1628, #0f1a24)",
    accent: "#60a5fa",
  },
];

const RARITY_COLORS: Record<string, "teal" | "amber" | "red" | "green" | "muted"> = {
  Mythic: "red",
  Legendary: "amber",
  Epic: "teal",
  Rare: "green",
  Common: "muted",
};

/* ─── Mint Modal ─────────────────────────────────────────── */
function MintModal({ onClose }: { onClose: () => void }) {
  const { address } = useAccount();
  const [contractAddr, setContractAddr] = useState("");
  const [tokenId, setTokenId] = useState("1");
  const [error, setError] = useState("");

  const { writeContract, data: hash, isPending, error: writeError } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  const handleMint = useCallback(() => {
    setError("");
    if (!address) { setError("Connect wallet first"); return; }
    if (!isAddress(contractAddr)) { setError("Invalid contract address"); return; }
    writeContract({
      address: contractAddr as `0x${string}`,
      abi: ERC721_ABI,
      functionName: "mint",
      args: [address, BigInt(tokenId)],
      chainId: arcTestnet.id,
    });
  }, [address, contractAddr, tokenId, writeContract]);

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center"
         style={{ background: "rgba(9,12,18,0.85)", backdropFilter: "blur(8px)" }}>
      <div className="w-full max-w-md rounded-t-3xl p-6 pb-10 fade-up"
           style={{ background: "var(--arc-surface)", border: "1px solid var(--arc-border)" }}>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Sparkles size={20} color="var(--arc-teal)" />
            <h2 className="text-lg font-bold">Mint NFT</h2>
          </div>
          <button onClick={onClose} className="text-sm px-3 py-1 rounded-xl"
                  style={{ background: "var(--arc-card)", color: "var(--arc-text-dim)" }}>
            Cancel
          </button>
        </div>

        {isSuccess ? (
          <div className="flex flex-col items-center gap-4 py-8">
            <CheckCircle size={48} color="var(--arc-green)" />
            <p className="font-semibold text-lg">NFT Minted!</p>
            <a href={explorerTx(hash!)} target="_blank" rel="noopener noreferrer"
               className="flex items-center gap-1 text-sm" style={{ color: "var(--arc-teal)" }}>
              View on ArcScan <ExternalLink size={12} />
            </a>
            <button onClick={onClose} className="w-full py-3 rounded-2xl font-semibold mt-2"
                    style={{ background: "var(--arc-teal)", color: "var(--arc-bg)" }}>
              Done
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            <div className="rounded-2xl p-3 text-sm" style={{ background: "var(--arc-teal-dim)", color: "var(--arc-teal)" }}>
              💡 Deploy an ERC-721 contract first, then paste its address below to mint.
            </div>
            <div>
              <label className="text-xs font-medium mb-1 block" style={{ color: "var(--arc-text-dim)" }}>
                NFT Contract Address
              </label>
              <input value={contractAddr} onChange={(e) => setContractAddr(e.target.value)}
                     placeholder="0x... (ERC-721 contract)" className="w-full px-4 py-3 rounded-xl text-sm outline-none"
                     style={{ background: "var(--arc-card)", border: "1px solid var(--arc-border)", color: "var(--arc-text)" }} />
            </div>
            <div>
              <label className="text-xs font-medium mb-1 block" style={{ color: "var(--arc-text-dim)" }}>
                Token ID
              </label>
              <input value={tokenId} onChange={(e) => setTokenId(e.target.value)}
                     type="number" min="1" className="w-full px-4 py-3 rounded-xl text-sm outline-none"
                     style={{ background: "var(--arc-card)", border: "1px solid var(--arc-border)", color: "var(--arc-text)" }} />
            </div>

            {(error || writeError) && (
              <div className="flex items-center gap-2 text-sm px-3 py-2 rounded-xl"
                   style={{ background: "#ef444420", color: "#ef4444" }}>
                <AlertCircle size={14} />
                {error || writeError?.message?.slice(0, 100)}
              </div>
            )}

            <button onClick={handleMint} disabled={isPending || isConfirming}
                    className="w-full py-3 rounded-2xl font-semibold flex items-center justify-center gap-2"
                    style={{ background: "var(--arc-teal)", color: "var(--arc-bg)", opacity: (isPending || isConfirming) ? 0.7 : 1 }}>
              {(isPending || isConfirming) ? (
                <><Loader2 size={16} className="animate-spin" /> Minting...</>
              ) : (
                <><Sparkles size={16} /> Mint NFT</>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

/* ─── NFT Card ───────────────────────────────────────────── */
function NFTCard({ nft }: { nft: typeof DEMO_NFTS[0] }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <Card onClick={() => setExpanded(!expanded)} className="overflow-hidden p-0">
      {/* Image area */}
      <div className="relative h-44 flex items-center justify-center text-6xl"
           style={{ background: nft.gradient }}>
        <span style={{ filter: "drop-shadow(0 0 20px rgba(0,0,0,0.5))" }}>{nft.image}</span>
        <div className="absolute top-3 right-3">
          <Badge variant={RARITY_COLORS[nft.rarity] ?? "muted"}>{nft.rarity}</Badge>
        </div>
        <div className="absolute bottom-3 left-3">
          <span className="text-xs px-2 py-1 rounded-lg font-medium"
                style={{ background: "rgba(9,12,18,0.7)", color: "var(--arc-text-dim)" }}>
            {nft.collection}
          </span>
        </div>
      </div>

      {/* Info */}
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <p className="font-bold text-sm">{nft.name}</p>
          <div className="flex items-center gap-1">
            <span className="text-xs font-bold" style={{ color: nft.accent }}>
              {nft.price}
            </span>
            <span className="text-xs" style={{ color: "var(--arc-text-dim)" }}>
              {nft.currency}
            </span>
          </div>
        </div>

        {expanded && (
          <div className="mt-3 pt-3 fade-up" style={{ borderTop: "1px solid var(--arc-border)" }}>
            <p className="text-xs mb-2" style={{ color: "var(--arc-text-dim)" }}>{nft.description}</p>
            <div className="flex items-center justify-between">
              <span className="text-xs" style={{ color: "var(--arc-text-dim)" }}>
                Owner: {nft.owner}
              </span>
              <button className="text-xs px-3 py-1.5 rounded-xl font-semibold"
                      style={{ background: `${nft.accent}20`, color: nft.accent, border: `1px solid ${nft.accent}40` }}>
                Buy
              </button>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}

/* ─── Main Page ──────────────────────────────────────────── */
export default function MarketPage() {
  const [showMint, setShowMint] = useState(false);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");

  const filters = ["All", "Ronin Universe", "Arc Genesis", "Arc Nodes"];

  const filtered = DEMO_NFTS.filter((n) => {
    const matchSearch = n.name.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === "All" || n.collection === filter;
    return matchSearch && matchFilter;
  });

  return (
    <div className="px-4 pt-2 pb-6 fade-up flex flex-col gap-5">

      {/* ── Header ── */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold">NFT Market</h1>
          <p className="text-xs" style={{ color: "var(--arc-text-dim)" }}>
            Arc Testnet · ERC-721
          </p>
        </div>
        <button onClick={() => setShowMint(true)}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold"
                style={{ background: "var(--arc-teal)", color: "var(--arc-bg)" }}>
          <Plus size={16} /> Mint
        </button>
      </div>

      {/* ── Stats banner ── */}
      <div className="grid grid-cols-3 gap-2">
        {[
          { label: "Floor", value: "2.50 USDC" },
          { label: "Volume", value: "1.2K USDC" },
          { label: "Items", value: DEMO_NFTS.length.toString() },
        ].map(({ label, value }) => (
          <div key={label} className="glass rounded-2xl p-3 text-center">
            <p className="text-xs mb-1" style={{ color: "var(--arc-text-dim)" }}>{label}</p>
            <p className="text-sm font-bold" style={{ color: "var(--arc-teal)" }}>{value}</p>
          </div>
        ))}
      </div>

      {/* ── Search ── */}
      <div className="relative">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2"
                color="var(--arc-text-dim)" />
        <input value={search} onChange={(e) => setSearch(e.target.value)}
               placeholder="Search NFTs..." className="w-full pl-10 pr-4 py-3 rounded-xl text-sm outline-none"
               style={{ background: "var(--arc-card)", border: "1px solid var(--arc-border)", color: "var(--arc-text)" }} />
      </div>

      {/* ── Filter tabs ── */}
      <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
        {filters.map((f) => (
          <button key={f} onClick={() => setFilter(f)}
                  className="flex-shrink-0 px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap"
                  style={{
                    background: filter === f ? "var(--arc-teal)" : "var(--arc-card)",
                    color: filter === f ? "var(--arc-bg)" : "var(--arc-text-dim)",
                    border: "1px solid var(--arc-border)",
                  }}>
            {f}
          </button>
        ))}
      </div>

      {/* ── NFT Grid ── */}
      <div className="grid grid-cols-2 gap-3">
        {filtered.map((nft) => (
          <NFTCard key={nft.id} nft={nft} />
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="flex flex-col items-center gap-3 py-12">
          <ImageIcon size={40} color="var(--arc-muted)" />
          <p style={{ color: "var(--arc-text-dim)" }}>No NFTs found</p>
        </div>
      )}

      {/* ── Deploy guide ── */}
      <Card>
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
               style={{ background: "var(--arc-teal-dim)" }}>
            <Zap size={18} color="var(--arc-teal)" />
          </div>
          <div>
            <p className="font-semibold text-sm mb-1">Deploy your own NFT</p>
            <p className="text-xs mb-3" style={{ color: "var(--arc-text-dim)" }}>
              Arc supports ERC-721, ERC-1155, and Airdrop contracts. Deploy via Circle Contracts or Hardhat.
            </p>
            <a href="https://docs.arc.network/arc/tutorials/deploy-contracts"
               target="_blank" rel="noopener noreferrer"
               className="flex items-center gap-1 text-xs font-medium"
               style={{ color: "var(--arc-teal)" }}>
              View deploy guide <ExternalLink size={12} />
            </a>
          </div>
        </div>
      </Card>

      {showMint && <MintModal onClose={() => setShowMint(false)} />}
    </div>
  );
}
