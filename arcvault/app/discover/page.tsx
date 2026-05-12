"use client";

import { Card } from "@/components/Card";
import { Badge } from "@/components/Badge";
import { ExternalLink, BookOpen, Code2, Coins, Globe, Zap, Shield, ArrowUpRight } from "lucide-react";

const ECOSYSTEM = [
  {
    name: "Circle Faucet",
    desc: "Get testnet USDC & EURC to start building on Arc.",
    url: "https://faucet.circle.com",
    icon: "💧", tag: "Tools", tagVariant: "teal" as const,
  },
  {
    name: "Arc Docs",
    desc: "Official developer documentation, tutorials & API reference.",
    url: "https://docs.arc.network",
    icon: "📄", tag: "Docs", tagVariant: "muted" as const,
  },
  {
    name: "ArcScan Explorer",
    desc: "Browse all blocks, transactions and contracts on Arc testnet.",
    url: "https://testnet.arcscan.net",
    icon: "🔍", tag: "Explorer", tagVariant: "amber" as const,
  },
  {
    name: "Circle Contracts",
    desc: "Deploy pre-audited ERC-20, ERC-721, ERC-1155 contracts with one click.",
    url: "https://docs.arc.network/arc/tutorials/deploy-contracts",
    icon: "📜", tag: "Deploy", tagVariant: "green" as const,
  },
  {
    name: "QuickNode Arc RPC",
    desc: "Managed RPC infrastructure with enhanced APIs for Arc.",
    url: "https://www.quicknode.com/docs/arc",
    icon: "⚡", tag: "Infrastructure", tagVariant: "teal" as const,
  },
  {
    name: "CCTP Bridge",
    desc: "Cross-Chain Transfer Protocol — bridge USDC to/from Arc.",
    url: "https://www.circle.com/cross-chain-transfer-protocol",
    icon: "🌉", tag: "Bridge", tagVariant: "amber" as const,
  },
  {
    name: "ETHGlobal Arc Track",
    desc: "Hackathon winners building on Arc testnet — get inspired.",
    url: "https://www.arc.network/blog/meet-the-arc-track-winners-from-ethglobal-cannes-hackathon-and-what-we-learned",
    icon: "🏆", tag: "Community", tagVariant: "muted" as const,
  },
  {
    name: "Arc Whitepaper",
    desc: "ARC token economics, governance & network design.",
    url: "https://www.arc.network/blog/introducing-the-arc-token-whitepaper",
    icon: "📑", tag: "Research", tagVariant: "muted" as const,
  },
];

const WHY_ARC = [
  {
    icon: Coins, title: "USDC as Gas",
    desc: "Pay fees in USDC — no volatile native token needed. Predictable costs for enterprises.",
    color: "#2775ca",
  },
  {
    icon: Zap, title: "Sub-second Finality",
    desc: "Malachite consensus delivers deterministic settlement in under 1 second.",
    color: "var(--arc-teal)",
  },
  {
    icon: Code2, title: "EVM Compatible",
    desc: "Deploy any Solidity contract. Use familiar Hardhat, Foundry, ethers.js tooling.",
    color: "var(--arc-amber)",
  },
  {
    icon: Shield, title: "Quantum-Resistant",
    desc: "Built with post-quantum cryptography from day one. Ready for the future.",
    color: "#a78bfa",
  },
  {
    icon: Globe, title: "Institutional Grade",
    desc: "BlackRock, a16z, Apollo and ICE back Arc — built for real financial rails.",
    color: "#22c55e",
  },
  {
    icon: BookOpen, title: "60% Ecosystem Tokens",
    desc: "60% of 10B ARC allocated to builders, users & early adopters via grants & airdrops.",
    color: "#e879f9",
  },
];

export default function DiscoverPage() {
  return (
    <div className="px-4 pt-2 pb-6 fade-up flex flex-col gap-6">

      {/* ── Header ── */}
      <div>
        <h1 className="text-xl font-bold">Discover Arc</h1>
        <p className="text-xs mt-0.5" style={{ color: "var(--arc-text-dim)" }}>
          The Economic OS for the internet
        </p>
      </div>

      {/* ── Hero banner ── */}
      <div className="relative rounded-3xl overflow-hidden p-5"
           style={{ background: "linear-gradient(135deg, #0a1628 0%, #0c1f1e 50%, #1a0533 100%)" }}>
        <div className="absolute inset-0 opacity-20"
             style={{ background: "radial-gradient(circle at 30% 50%, #00d4c8, transparent 60%)" }} />
        <div className="relative z-10">
          <Badge variant="teal" className="mb-3">Mainnet · Summer 2026</Badge>
          <h2 className="text-2xl font-bold mb-2 leading-tight">
            Arc Network
            <br />
            <span className="gradient-text">$3B valuation.</span>
          </h2>
          <p className="text-sm mb-4" style={{ color: "var(--arc-text-dim)" }}>
            $222M raised from BlackRock, a16z, Apollo & ICE.
            60% of 10B $ARC tokens go to ecosystem participants.
          </p>
          <div className="flex gap-3">
            <a href="https://arc.network" target="_blank" rel="noopener noreferrer"
               className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold"
               style={{ background: "var(--arc-teal)", color: "var(--arc-bg)" }}>
              arc.network <ExternalLink size={14} />
            </a>
            <a href="https://docs.arc.network" target="_blank" rel="noopener noreferrer"
               className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold"
               style={{ background: "var(--arc-card)", border: "1px solid var(--arc-border)" }}>
              Docs <BookOpen size={14} />
            </a>
          </div>
        </div>
      </div>

      {/* ── Token stats ── */}
      <div>
        <h3 className="text-xs font-semibold uppercase tracking-wider mb-3"
            style={{ color: "var(--arc-text-dim)" }}>
          $ARC Tokenomics
        </h3>
        <div className="flex flex-col gap-2">
          {[
            { label: "Total Supply", value: "10 Billion ARC", color: "var(--arc-teal)" },
            { label: "Ecosystem (grants, airdrops, builders)", value: "60%", color: "var(--arc-teal)" },
            { label: "Circle (validators + staking)", value: "25%", color: "var(--arc-amber)" },
            { label: "Long-term Reserve", value: "15%", color: "#a78bfa" },
            { label: "Presale Raise", value: "$222M @ $3B FDV", color: "#22c55e" },
            { label: "Lead Investor", value: "a16z crypto ($75M)", color: "#e879f9" },
          ].map(({ label, value, color }) => (
            <div key={label} className="flex items-center justify-between py-2 px-1"
                 style={{ borderBottom: "1px solid var(--arc-border)" }}>
              <span className="text-xs" style={{ color: "var(--arc-text-dim)" }}>{label}</span>
              <span className="text-sm font-bold" style={{ color }}>{value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Why Arc ── */}
      <div>
        <h3 className="text-xs font-semibold uppercase tracking-wider mb-3"
            style={{ color: "var(--arc-text-dim)" }}>
          Why Arc
        </h3>
        <div className="grid grid-cols-2 gap-3">
          {WHY_ARC.map(({ icon: Icon, title, desc, color }) => (
            <Card key={title} className="flex flex-col gap-2">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center"
                   style={{ background: `${color}20` }}>
                <Icon size={18} color={color} />
              </div>
              <p className="font-semibold text-sm">{title}</p>
              <p className="text-xs leading-relaxed" style={{ color: "var(--arc-text-dim)" }}>{desc}</p>
            </Card>
          ))}
        </div>
      </div>

      {/* ── Testnet farming guide ── */}
      <Card glow="amber">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-xl">🎯</span>
          <h3 className="font-bold">Farm Testnet Points</h3>
        </div>
        <p className="text-xs mb-4" style={{ color: "var(--arc-text-dim)" }}>
          Arc has 5 community tiers. Highest tier: 90,000 points. 
          Points may convert to $ARC tokens at mainnet launch.
        </p>
        <div className="flex flex-col gap-2 mb-4">
          {[
            "Daily login on arc.network",
            "Complete profile",
            "Read articles & watch videos",
            "Register for community events",
            "Interact with Arc testnet contracts",
          ].map((step, i) => (
            <div key={step} className="flex items-center gap-3">
              <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                   style={{ background: "var(--arc-amber-dim)", color: "var(--arc-amber)" }}>
                {i + 1}
              </div>
              <span className="text-sm">{step}</span>
            </div>
          ))}
        </div>
        <a href="https://arc.network" target="_blank" rel="noopener noreferrer"
           className="flex items-center justify-center gap-2 py-3 rounded-2xl text-sm font-semibold"
           style={{ background: "var(--arc-amber)", color: "var(--arc-bg)" }}>
          Start Farming <ArrowUpRight size={16} />
        </a>
      </Card>

      {/* ── Ecosystem links ── */}
      <div>
        <h3 className="text-xs font-semibold uppercase tracking-wider mb-3"
            style={{ color: "var(--arc-text-dim)" }}>
          Ecosystem
        </h3>
        <div className="flex flex-col gap-3">
          {ECOSYSTEM.map(({ name, desc, url, icon, tag, tagVariant }) => (
            <a key={name} href={url} target="_blank" rel="noopener noreferrer"
               className="glass rounded-2xl p-4 flex items-center gap-4 active:scale-95 transition-transform">
              <span className="text-3xl flex-shrink-0">{icon}</span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <p className="font-semibold text-sm">{name}</p>
                  <Badge variant={tagVariant}>{tag}</Badge>
                </div>
                <p className="text-xs truncate" style={{ color: "var(--arc-text-dim)" }}>{desc}</p>
              </div>
              <ExternalLink size={16} color="var(--arc-text-dim)" className="flex-shrink-0" />
            </a>
          ))}
        </div>
      </div>

      {/* ── ArcVault info ── */}
      <Card>
        <div className="text-center">
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-3 glow-teal"
               style={{ background: "linear-gradient(135deg, #00d4c8, #7c3aed)" }}>
            <svg width="24" height="24" viewBox="0 0 16 16" fill="none">
              <path d="M8 1L14 4.5V11.5L8 15L2 11.5V4.5L8 1Z" fill="white" fillOpacity="0.9" />
              <path d="M8 5L11 6.75V10.25L8 12L5 10.25V6.75L8 5Z" fill="white" fillOpacity="0.4" />
            </svg>
          </div>
          <h3 className="font-bold mb-1">ArcVault</h3>
          <p className="text-xs" style={{ color: "var(--arc-text-dim)" }}>
            Mobile-first Arc testnet explorer & NFT marketplace.
            Open source. Built for Arc ecosystem builders.
          </p>
        </div>
      </Card>
    </div>
  );
}
