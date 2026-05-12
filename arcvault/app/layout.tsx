import type { Metadata, Viewport } from "next";
import { Providers } from "./providers";
import { BottomNav } from "@/components/BottomNav";
import { TopBar } from "@/components/TopBar";
import "./globals.css";

export const metadata: Metadata = {
  title: "ArcVault",
  description: "Arc Testnet Wallet & NFT Marketplace — powered by Circle USDC",
  manifest: "/manifest.json",
  appleWebApp: { capable: true, statusBarStyle: "black-translucent", title: "ArcVault" },
  icons: { icon: "/icon.svg", apple: "/icon.svg" },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#090c12",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen" style={{ background: "var(--arc-bg)" }}>
        <Providers>
          {/* Mobile phone frame — max-w-md centered on desktop */}
          <div className="mx-auto max-w-md min-h-screen flex flex-col relative"
               style={{ background: "var(--arc-bg)" }}>
            <TopBar />
            <main className="flex-1 overflow-y-auto" style={{ paddingBottom: "80px" }}>
              {children}
            </main>
            <BottomNav />
          </div>
        </Providers>
      </body>
    </html>
  );
}
