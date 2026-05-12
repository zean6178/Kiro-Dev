"use client";
import React, { useState } from "react";
import { cn, txTypeColor, txTypeBg } from "@/lib/utils";

/* ── Card ── */
export function Card({ children, className, onClick }: {
  children: React.ReactNode; className?: string; onClick?: () => void;
}) {
  return (
    <div onClick={onClick}
         className={cn("card p-4", onClick && "cursor-pointer active:scale-[.98] transition-transform", className)}>
      {children}
    </div>
  );
}

/* ── Skeleton ── */
export function Sk({ w = "w-full", h = "h-4", className = "" }: { w?: string; h?: string; className?: string }) {
  return <div className={cn("shimmer", h, w, className)} />;
}

/* ── Badge ── */
type BadgeVariant = "teal"|"amber"|"green"|"red"|"purple"|"blue"|"muted";
const BADGE: Record<BadgeVariant, string> = {
  teal:   "bg-[#00d4c815] text-[#00d4c8] border-[#00d4c830]",
  amber:  "bg-[#f59e0b15] text-[#f59e0b] border-[#f59e0b30]",
  green:  "bg-[#22c55e15] text-[#22c55e] border-[#22c55e30]",
  red:    "bg-[#ef444415] text-[#ef4444] border-[#ef444430]",
  purple: "bg-[#a78bfa15] text-[#a78bfa] border-[#a78bfa30]",
  blue:   "bg-[#3b82f615] text-[#3b82f6] border-[#3b82f630]",
  muted:  "bg-[#1f293780] text-[#94a3b8] border-[#1f2937]",
};
export function Badge({ children, variant = "muted", className }: {
  children: React.ReactNode; variant?: BadgeVariant; className?: string;
}) {
  return (
    <span className={cn("inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold border uppercase tracking-wide", BADGE[variant], className)}>
      {children}
    </span>
  );
}

/* ── TxType badge ── */
export function TxTypeBadge({ type }: { type: "deploy"|"contract"|"transfer" }) {
  const variant: BadgeVariant = type === "deploy" ? "purple" : type === "contract" ? "teal" : "amber";
  return <Badge variant={variant}>{type}</Badge>;
}

/* ── StatusBadge ── */
export function StatusBadge({ status }: { status: "success"|"failed"|"pending" }) {
  const v: BadgeVariant = status === "success" ? "green" : status === "failed" ? "red" : "muted";
  return <Badge variant={v}>{status}</Badge>;
}

/* ── Divider ── */
export function Divider() {
  return <div className="h-px" style={{ background: "var(--border)" }} />;
}

/* ── Row (label + value) ── */
export function Row({ label, value, mono = false, color }: {
  label: string; value: React.ReactNode; mono?: boolean; color?: string;
}) {
  return (
    <div className="flex items-start justify-between gap-4 py-2.5" style={{ borderBottom: "1px solid var(--border)" }}>
      <span className="text-xs flex-shrink-0" style={{ color: "var(--text-2)" }}>{label}</span>
      <span className={cn("text-xs text-right break-all", mono && "mono")} style={{ color: color || "var(--text)" }}>{value}</span>
    </div>
  );
}

/* ── Section header ── */
export function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[10px] font-bold uppercase tracking-widest mb-2" style={{ color: "var(--text-3)" }}>
      {children}
    </p>
  );
}

/* ── Tx type dot ── */
export function TxDot({ type }: { type: "deploy"|"contract"|"transfer" }) {
  return (
    <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
         style={{ background: txTypeBg(type) }}>
      <div className="w-2.5 h-2.5 rounded-full" style={{ background: txTypeColor(type) }} />
    </div>
  );
}

/* ── Empty state ── */
export function Empty({ label = "No data" }: { label?: string }) {
  return (
    <div className="flex flex-col items-center gap-3 py-14">
      <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ background: "var(--card)" }}>
        <span className="text-2xl">📭</span>
      </div>
      <p className="text-sm" style={{ color: "var(--text-2)" }}>{label}</p>
    </div>
  );
}

/* ── Copy button ── */
export function CopyBtn({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };
  return (
    <button onClick={copy} className="text-[10px] px-2 py-0.5 rounded-lg ml-1 transition-colors"
            style={{ background: copied ? "var(--teal-dim)" : "var(--border)", color: copied ? "var(--teal)" : "var(--text-2)" }}>
      {copied ? "✓" : "copy"}
    </button>
  );
}


