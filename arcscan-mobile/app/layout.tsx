import type { Metadata, Viewport } from "next";
import Providers  from "./providers";
import TopBar     from "@/components/TopBar";
import BottomNav  from "@/components/BottomNav";
import "./globals.css";

export const metadata: Metadata = {
  title: "ArcScan Mobile",
  description: "Mobile-first block explorer for Arc Testnet — powered by Circle USDC",
  manifest: "/manifest.json",
  appleWebApp: { capable: true, statusBarStyle: "black-translucent", title: "ArcScan" },
  icons: { icon: "/icon.svg", apple: "/icon.svg" },
};
export const viewport: Viewport = {
  width: "device-width", initialScale: 1, maximumScale: 1,
  userScalable: false, themeColor: "#07090f",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body style={{ background: "var(--bg)" }}>
        <Providers>
          <div className="mx-auto max-w-md min-h-screen flex flex-col relative"
               style={{ background: "var(--bg)" }}>
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
