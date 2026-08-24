import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { EmptyState } from "@/components/common/states";
import { StatusBadge } from "@/components/common/StatusBadge";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { mockReports, mockProducts, formatDate, getUser } from "@/lib/mock-data";
import { useEffect, useState } from "react";
import {
  LayoutDashboard,
  Users,
  Package,
  Tag,
  Flag,
  BarChart2,
  CheckCircle,
  ShieldOff,
  Trash2,
} from "lucide-react";
import type { Report } from "@/types";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const adminLinks = [
  { to: "/admin", label: "Dashboard", icon: <LayoutDashboard className="h-4 w-4" /> },
  { to: "/admin/users", label: "Users", icon: <Users className="h-4 w-4" /> },
  { to: "/admin/products", label: "Products", icon: <Package className="h-4 w-4" /> },
  { to: "/admin/categories", label: "Categories", icon: <Tag className="h-4 w-4" /> },
  { to: "/admin/reports", label: "Reports", icon: <Flag className="h-4 w-4" /> },
  { to: "/admin/analytics", label: "Analytics", icon: <BarChart2 className="h-4 w-4" /> },
];

function toneForReportStatus(status: string) {
  return status === "resolved" ? "success" : "warning";
}

export const Route = createFileRoute("/admin/reports")({
  component: AdminReportsPage,
});

function AdminReportsPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [statuses, setStatuses] = useState<Record<number, Report["status"]>>({});
  const [deletedIds, setDeletedIds] = useState<number[]>([]);

  useEffect(() => {
    if (!user) navigate({ to: "/login" });
    else if (user.role !== "admin") navigate({ to: "/dashboard" });
  }, [user, navigate]);

  if (!user || user.role !== "admin") return null;

  const getStatus = (r: Report): Report["status"] => statuses[r.id] ?? r.status;

  const handleResolve = (r: Report) => {
    setStatuses((prev) => ({ ...prev, [r.id]: "resolved" }));
  };

  const handleDelete = (id: number) => {
    setDeletedIds((prev) => [...prev, id]);
  };

  const reports = mockReports.filter((r) => !deletedIds.includes(r.id));

  return (
    <DashboardShell links={adminLinks} heading="Admin Panel">
      <div className="space-y-6">
        <div>
          <h1 className="text-xl font-bold text-foreground">Reports</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Review and resolve reports submitted by students.
          </p>
        </div>

        {reports.length === 0 ? (
          <EmptyState
            title="No reports"
            description="No reports have been submitted yet."
            icon={<Flag className="h-8 w-8" />}
          />
        ) : (
          <div className="space-y-4">
            {reports.map((r) => {
              const reporter = getUser(r.reporter_id);
              const targetLabel =
                r.target_type === "product"
                  ? mockProducts.find((p) => p.id === r.target_id)?.name ?? "Unknown product"
                  : getUser(r.target_id)?.name ?? "Unknown user";
              const status = getStatus(r);
              return (
                <div key={r.id} className="overflow-hidden rounded-xl border border-border bg-card">
                  <div className="flex items-start justify-between gap-4 p-4">
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <StatusBadge tone={toneForReportStatus(status)}>{status}</StatusBadge>
                        <span className="inline-flex rounded-full border border-border px-2 py-0.5 text-xs font-medium text-muted-foreground capitalize">
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
                  <div className="flex flex-wrap gap-2 border-t border-border px-4 py-3">
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
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button size="sm" variant="outline" className="border-destructive/40 text-destructive hover:bg-destructive/10">
                          <Trash2 className="mr-1 h-4 w-4" />
                          Dismiss report
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Dismiss report?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This report will be removed from the list.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDelete(r.id)}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          >
                            Dismiss
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
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
