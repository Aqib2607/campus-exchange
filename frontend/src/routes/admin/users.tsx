import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { EmptyState } from "@/components/common/states";
import { StatusBadge } from "@/components/common/StatusBadge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { ReportModal } from "@/components/marketplace/ReportModal";
import { useAuth } from "@/contexts/AuthContext";
import { mockUsers, formatDate } from "@/lib/mock-data";
import { useEffect, useState } from "react";
import {
  LayoutDashboard,
  Users,
  Package,
  Tag,
  Flag,
  BarChart2,
  Search,
  ShieldOff,
  Trash2,
} from "lucide-react";
import type { User } from "@/types";

const adminLinks = [
  { to: "/admin", label: "Dashboard", icon: <LayoutDashboard className="h-4 w-4" /> },
  { to: "/admin/users", label: "Users", icon: <Users className="h-4 w-4" /> },
  { to: "/admin/products", label: "Products", icon: <Package className="h-4 w-4" /> },
  { to: "/admin/categories", label: "Categories", icon: <Tag className="h-4 w-4" /> },
  { to: "/admin/reports", label: "Reports", icon: <Flag className="h-4 w-4" /> },
  { to: "/admin/analytics", label: "Analytics", icon: <BarChart2 className="h-4 w-4" /> },
];

export const Route = createFileRoute("/admin/users")({
  component: AdminUsersPage,
});

function toneForUserStatus(status: string) {
  return status === "active" ? "success" : "error";
}

function AdminUsersPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [statuses, setStatuses] = useState<Record<number, User["status"]>>({});
  const [deletedIds, setDeletedIds] = useState<number[]>([]);
  const [reportTarget, setReportTarget] = useState<User | null>(null);

  useEffect(() => {
    if (!user) navigate({ to: "/login" });
    else if (user.role !== "admin") navigate({ to: "/dashboard" });
  }, [user, navigate]);

  if (!user || user.role !== "admin") return null;

  const getStatus = (u: User): User["status"] => statuses[u.id] ?? u.status;

  const handleBlock = (u: User) => {
    setStatuses((prev) => ({
      ...prev,
      [u.id]: getStatus(u) === "active" ? "blocked" : "active",
    }));
  };

  const handleDelete = (id: number) => {
    setDeletedIds((prev) => [...prev, id]);
  };

  const visibleUsers = mockUsers
    .filter((u) => u.role !== "admin" && !deletedIds.includes(u.id))
    .filter(
      (u) =>
        !search.trim() ||
        u.name.toLowerCase().includes(search.toLowerCase()) ||
        u.email.toLowerCase().includes(search.toLowerCase()),
    );

  return (
    <DashboardShell links={adminLinks} heading="Admin Panel">
      <div className="space-y-6">
        <div>
          <h1 className="text-xl font-bold text-foreground">Users</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage registered student accounts.
          </p>
        </div>

        {/* Search */}
        <div className="relative max-w-sm">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
          <Input
            type="search"
            placeholder="Search by name or email…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
            aria-label="Search users"
          />
        </div>

        {visibleUsers.length === 0 ? (
          <EmptyState
            title="No users found"
            description={search ? "No users match your search." : "No students registered yet."}
            icon={<Users className="h-8 w-8" />}
          />
        ) : (
          <>
            {/* Desktop table */}
            <div className="hidden overflow-hidden rounded-xl border border-border bg-card md:block">
              <table className="w-full text-sm">
                <thead className="border-b border-border bg-muted/40">
                  <tr>
                    <th className="px-4 py-3 text-left font-medium text-muted-foreground">Name</th>
                    <th className="px-4 py-3 text-left font-medium text-muted-foreground">Email</th>
                    <th className="px-4 py-3 text-left font-medium text-muted-foreground">Role</th>
                    <th className="px-4 py-3 text-left font-medium text-muted-foreground">Status</th>
                    <th className="px-4 py-3 text-left font-medium text-muted-foreground">Joined</th>
                    <th className="px-4 py-3 text-left font-medium text-muted-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {visibleUsers.map((u) => {
                    const status = getStatus(u);
                    return (
                      <tr key={u.id} className="hover:bg-muted/20">
                        <td className="px-4 py-3 font-medium text-foreground">{u.name}</td>
                        <td className="px-4 py-3 text-muted-foreground">{u.email}</td>
                        <td className="px-4 py-3 capitalize text-muted-foreground">{u.role}</td>
                        <td className="px-4 py-3">
                          <StatusBadge tone={toneForUserStatus(status)}>{status}</StatusBadge>
                        </td>
                        <td className="px-4 py-3 text-muted-foreground">{formatDate(u.created_at)}</td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleBlock(u)}
                              className={status === "blocked" ? "text-success" : "text-warning-foreground"}
                            >
                              <ShieldOff className="mr-1 h-4 w-4" />
                              {status === "blocked" ? "Unblock" : "Block"}
                            </Button>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive" aria-label={`Delete ${u.name}`}>
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Delete user?</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Delete &ldquo;{u.name}&rdquo;? This cannot be undone.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => handleDelete(u.id)}
                                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                  >
                                    Delete
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobile cards */}
            <div className="space-y-3 md:hidden">
              {visibleUsers.map((u) => {
                const status = getStatus(u);
                return (
                  <div key={u.id} className="overflow-hidden rounded-xl border border-border bg-card p-4">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="font-medium text-foreground">{u.name}</p>
                        <p className="text-xs text-muted-foreground">{u.email}</p>
                        <p className="text-xs text-muted-foreground">Joined {formatDate(u.created_at)}</p>
                      </div>
                      <StatusBadge tone={toneForUserStatus(status)}>{status}</StatusBadge>
                    </div>
                    <div className="mt-3 flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => handleBlock(u)}>
                        {status === "blocked" ? "Unblock" : "Block"}
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="outline" size="sm" className="text-destructive border-destructive/30">
                            Delete
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete user?</AlertDialogTitle>
                            <AlertDialogDescription>Delete &ldquo;{u.name}&rdquo;?</AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDelete(u.id)}
                              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>

      {reportTarget && (
        <ReportModal
          open={!!reportTarget}
          onOpenChange={(o) => !o && setReportTarget(null)}
          targetType="user"
          targetLabel={reportTarget.name}
        />
      )}
    </DashboardShell>
  );
}
