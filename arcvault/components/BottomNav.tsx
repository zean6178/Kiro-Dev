"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Wallet, Store, Activity, Compass } from "lucide-react";

const NAV = [
  { href: "/", icon: Wallet, label: "Wallet" },
  { href: "/market", icon: Store, label: "Market" },
  { href: "/explorer", icon: Activity, label: "Explorer" },
  { href: "/discover", icon: Compass, label: "Discover" },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav
      className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md z-50 pb-safe"
      style={{
        background: "var(--arc-surface)",
        borderTop: "1px solid var(--arc-border)",
        backdropFilter: "blur(16px)",
      }}
    >
      <div className="flex items-center justify-around px-2 pt-2 pb-1">
        {NAV.map(({ href, icon: Icon, label }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className="flex flex-col items-center gap-1 px-4 py-1.5 rounded-xl transition-all"
              style={{
                color: active ? "var(--arc-teal)" : "var(--arc-text-dim)",
                background: active ? "var(--arc-teal-dim)" : "transparent",
                minWidth: "60px",
              }}
            >
              <Icon size={20} strokeWidth={active ? 2.5 : 1.5} />
              <span className="text-xs font-medium">{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
