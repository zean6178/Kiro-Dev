"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Box, ArrowLeftRight, Search, Compass } from "lucide-react";

const NAV = [
  { href: "/",       icon: Home,            label: "Home"    },
  { href: "/blocks", icon: Box,             label: "Blocks"  },
  { href: "/txs",    icon: ArrowLeftRight,  label: "Txns"    },
  { href: "/search", icon: Search,          label: "Search"  },
];

export default function BottomNav() {
  const path = usePathname();
  const active = (href: string) =>
    href === "/" ? path === "/" : path.startsWith(href);

  return (
    <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md z-50 pb-safe"
         style={{ background: "var(--surface)", borderTop: "1px solid var(--border)", backdropFilter: "blur(16px)" }}>
      <div className="flex items-center justify-around px-2 pt-2 pb-1">
        {NAV.map(({ href, icon: Icon, label }) => {
          const on = active(href);
          return (
            <Link key={href} href={href}
                  className="flex flex-col items-center gap-1 px-4 py-1.5 rounded-xl transition-all min-w-[60px]"
                  style={{ color: on ? "var(--teal)" : "var(--text-2)", background: on ? "var(--teal-dim)" : "transparent" }}>
              <Icon size={19} strokeWidth={on ? 2.5 : 1.6} />
              <span className="text-[10px] font-semibold">{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
