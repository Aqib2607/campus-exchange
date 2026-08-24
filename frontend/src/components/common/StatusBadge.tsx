import { cn } from "@/lib/utils";

type Tone = "success" | "warning" | "error" | "neutral" | "info";

const toneClass: Record<Tone, string> = {
  success: "bg-success/10 text-success border-success/30",
  warning: "bg-warning/15 text-warning-foreground border-warning/40",
  error: "bg-destructive/10 text-destructive border-destructive/30",
  info: "bg-primary/10 text-primary border-primary/30",
  neutral: "bg-muted text-muted-foreground border-border",
};

export function StatusBadge({
  children,
  tone = "neutral",
  className,
}: {
  children: React.ReactNode;
  tone?: Tone;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium capitalize",
        toneClass[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}

export function toneForRequestStatus(status: string): Tone {
  if (status === "accepted") return "success";
  if (status === "rejected") return "error";
  return "warning";
}

export function toneForProductStatus(status: string): Tone {
  return status === "sold" ? "neutral" : "success";
}
