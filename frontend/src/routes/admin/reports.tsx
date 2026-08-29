import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { EmptyState } from "@/components/common/states";
import { StatusBadge } from "@/components/common/StatusBadge";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { formatDate } from "@/lib/utils";
import { useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/services/api";
import { Flag, CheckCircle, ShieldOff, Trash2, Loader2 } from "lucide-react";
import type { Report } from "@/types";
import { adminLinks } from "@/config/nav";

function toneForReportStatus(status: string) {
  return status === "resolved" ? "success" : "warning";
}

export const Route = createFileRoute("/admin/reports")({
  component: AdminReportsPage,
});

function AdminReportsPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!user) navigate({ to: "/login" });
    else if (user.role !== "admin") navigate({ to: "/dashboard" });
  }, [user, navigate]);

  const { data: reports = [], isLoading } = useQuery({
    queryKey: ['admin', 'reports'],
    queryFn: api.reports.list,
    enabled: !!user?.id && user?.role === "admin",
  });

  const resolveMutation = useMutation({
    mutationFn: api.reports.resolve,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'reports'] });
    },
  });

  if (!user || user.role !== "admin") return null;

  const handleResolve = (r: Report) => {
    resolveMutation.mutate(r.id);
  };

  // We do not have an API endpoint to delete/dismiss a report. 
  // Let's assume we can just leave it as resolved, or maybe the admin needs to just dismiss the report.
  // Actually, wait, let's look at `AdminController.php`. We don't have a deleteReport endpoint.
  // We can just omit the dismiss functionality if it's not supported by API. Or we can hide it.
  const handleDelete = (id: number) => {
    // deleteMutation.mutate(id);
  };

  return (
    <DashboardShell links={adminLinks} heading="Admin Panel">
      <div className="space-y-6">
        <div>
          <h1 className="font-display text-4xl font-bold uppercase tracking-widest text-foreground">Reports</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Review and resolve reports submitted by students.
          </p>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-muted-foreground" /></div>
        ) : reports.length === 0 ? (
          <EmptyState
            title="No reports"
            description="No reports have been submitted yet."
            icon={<Flag className="h-8 w-8" />}
          />
        ) : (
          <div className="space-y-4">
            {reports.map((r: any) => {
              const reporter = r.reporter;
              const targetLabel =
                r.target_type === "product"
                  ? r.product?.name ?? "Unknown product"
                  : r.reportedUser?.name ?? "Unknown user";
              const status = r.status;
              return (
                <div key={r.id} className="overflow-hidden rounded-none border-2 border-border bg-card">
                  <div className="flex items-start justify-between gap-4 p-4">
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <StatusBadge tone={toneForReportStatus(status)}>{status}</StatusBadge>
                        <span className="inline-flex rounded-none border-2 border-border px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                          {r.target_type}
                        </span>
                      </div>
                      <p className="mt-2 font-medium text-foreground">{r.reason}</p>
                      <p className="text-sm text-muted-foreground">
                        <span className="font-medium">Target:</span> {targetLabel}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        <span className="font-medium">Reported by:</span> {reporter?.name ?? "Unknown"}
                      </p>
                      <p className="mt-1 text-sm text-muted-foreground">{r.description}</p>
                      <p className="mt-1 text-xs text-muted-foreground">{formatDate(r.created_at)}</p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2 border-t-2 border-border px-4 py-3">
                    {status === "pending" && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleResolve(r)}
                        className="border-success/40 text-success hover:bg-success/10"
                      >
                        <CheckCircle className="mr-1 h-4 w-4" />
                        Mark resolved
                      </Button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </DashboardShell>
  );
}
