import { cn } from "@/lib/utils";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  glow?: "teal" | "amber" | "none";
  onClick?: () => void;
}

export function Card({ children, className, glow = "none", onClick }: CardProps) {
  return (
    <div
      onClick={onClick}
      className={cn(
        "glass rounded-2xl p-4",
        glow === "teal" && "glow-teal",
        glow === "amber" && "glow-amber",
        onClick && "cursor-pointer active:scale-95 transition-transform",
        className
      )}
    >
      {children}
    </div>
  );
}

export function SkeletonCard({ className }: { className?: string }) {
  return (
    <div className={cn("shimmer rounded-2xl", className)} style={{ minHeight: "80px" }} />
  );
}
