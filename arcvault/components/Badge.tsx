import { cn } from "@/lib/utils";

type BadgeVariant = "teal" | "amber" | "red" | "green" | "muted";

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  className?: string;
}

const variantStyles: Record<BadgeVariant, string> = {
  teal: "bg-[#00d4c820] text-[#00d4c8] border-[#00d4c840]",
  amber: "bg-[#f59e0b20] text-[#f59e0b] border-[#f59e0b40]",
  red: "bg-[#ef444420] text-[#ef4444] border-[#ef444440]",
  green: "bg-[#22c55e20] text-[#22c55e] border-[#22c55e40]",
  muted: "bg-[#1e284080] text-[#718096] border-[#1e2840]",
};

export function Badge({ children, variant = "muted", className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border",
        variantStyles[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
