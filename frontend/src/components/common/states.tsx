import type { ReactNode } from "react";
import { AlertCircle, Inbox, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

export function LoadingState({ label = "Loading…", rows = 0 }: { label?: string; rows?: number }) {
  if (rows > 0) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3" role="status" aria-live="polite">
        <span className="sr-only">{label}</span>
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="rounded-none border-2 border-border bg-card p-4">
            <Skeleton className="mb-4 h-40 w-full rounded-lg" />
            <Skeleton className="mb-2 h-4 w-3/4" />
            <Skeleton className="h-4 w-1/3" />
          </div>
        ))}
      </div>
    );
  }
  return (
    <div
      className="flex items-center justify-center gap-2 py-12 text-sm text-muted-foreground"
      role="status"
      aria-live="polite"
    >
      <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
      {label}
    </div>
  );
}

export function EmptyState({
  title,
  description,
  action,
  icon,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
  icon?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-none border-2 border-dashed border-border bg-card px-6 py-14 text-center">
      <div className="mb-3 text-muted-foreground" aria-hidden="true">
        {icon ?? <Inbox className="h-8 w-8" />}
      </div>
      <h3 className="font-display text-2xl font-bold uppercase tracking-wider text-foreground">{title}</h3>
      {description && <p className="mt-1 max-w-sm text-sm text-muted-foreground">{description}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}

export function ErrorState({
  title = "Something went wrong",
  description = "We could not load this content. Please try again.",
  onRetry,
}: {
  title?: string;
  description?: string;
  onRetry?: () => void;
}) {
  return (
    <div
      className="flex flex-col items-center justify-center rounded-none border-2 border-destructive/30 bg-destructive/5 px-6 py-12 text-center"
    >
      <AlertCircle className="mb-3 h-7 w-7 text-destructive" aria-hidden="true" />
      <h3 className="font-display text-2xl font-bold uppercase tracking-wider text-foreground">{title}</h3>
      <p className="mt-1 max-w-sm text-sm text-muted-foreground">{description}</p>
      {onRetry && (
        <Button className="mt-5" variant="outline" onClick={onRetry}>
          Try again
        </Button>
      )}
    </div>
  );
}

export function PageHeader({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 className="font-display text-4xl font-bold uppercase tracking-widest text-foreground sm:text-5xl">{title}</h1>
        {description && <p className="mt-1 text-sm text-muted-foreground">{description}</p>}
      </div>
      {action}
    </div>
  );
}
