import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/services/api";
import { ShoppingBag, ArrowRight, Loader2 } from "lucide-react";
import { adminLinks } from "@/config/nav";

export const Route = createFileRoute("/admin/")({
  component: AdminDashboardPage,
});

function AdminDashboardPage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) navigate({ to: "/login" });
    else if (user.role !== "admin") navigate({ to: "/dashboard" });
  }, [user, navigate]);

  const { data: statsData, isLoading: isStatsLoading } = useQuery({
    queryKey: ['admin', 'stats'],
    queryFn: api.admin.statistics,
    enabled: !!user?.id && user?.role === "admin",
  });

  const { data: products = [], isLoading: isProductsLoading } = useQuery({
    queryKey: ['admin', 'products'],
    queryFn: api.admin.products,
    enabled: !!user?.id && user?.role === "admin",
  });

  const { data: reports = [], isLoading: isReportsLoading } = useQuery({
    queryKey: ['admin', 'reports'],
    queryFn: api.reports.list,
    enabled: !!user?.id && user?.role === "admin",
  });

  if (!user || user.role !== "admin") return null;

  const stats = [
    { label: "Total Users", value: statsData?.total_users || 0, href: "/admin/users" },
    { label: "Total Products", value: statsData?.total_products || 0, href: "/admin/products" },
    { label: "Available", value: statsData?.available_products || 0, href: "/admin/products" },
    { label: "Sold", value: statsData?.sold_products || 0, href: "/admin/products" },
    { label: "Total Requests", value: statsData?.total_requests || 0, href: "/admin/products" },
    { label: "Pending Reports", value: reports.filter((r: any) => r.status === "pending").length, href: "/admin/reports" },
  ];

  const recentProducts = products.slice(0, 5);
  const pendingReports = reports.filter((r: any) => r.status === "pending").slice(0, 5);

  const isLoading = isStatsLoading || isProductsLoading || isReportsLoading;

  return (
    <DashboardShell links={adminLinks} heading="Admin Control">
      <div className="space-y-12">
        <div className="border-b border-border pb-8">
          <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">System Administration</p>
          <h1 className="font-display text-5xl font-bold uppercase tracking-tight text-foreground md:text-7xl">
            Command Center
          </h1>
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-2 gap-px bg-border sm:grid-cols-3">
          {stats.map((s) => (
            <Link
              key={s.label}
              to={s.href as never}
              className="group flex flex-col justify-between bg-card p-6 sm:p-8 transition-colors hover:bg-muted/30"
            >
              <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{s.label}</p>
              <p className="mt-4 font-display text-5xl font-bold text-foreground transition-transform duration-300 group-hover:scale-110 sm:text-6xl group-hover:text-primary origin-left">
                {isStatsLoading || isReportsLoading ? <Loader2 className="h-10 w-10 animate-spin mt-4" /> : s.value}
              </p>
            </Link>
          ))}
        </div>

        <div className="grid gap-12 lg:grid-cols-2">
          {/* Recent products */}
          <section>
            <div className="mb-6 flex items-end justify-between border-b border-border pb-4">
              <h2 className="font-display text-2xl font-bold uppercase tracking-tight text-foreground">Recent Listings</h2>
              <Link to="/admin/products" className="group flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-muted-foreground hover:text-foreground">
                All <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
            <div className="flex flex-col gap-4">
              {isProductsLoading ? (
                <div className="flex justify-center p-4"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>
              ) : recentProducts.map((p: any) => (
                <div key={p.id} className="group flex items-center justify-between border border-border bg-card p-4 transition-colors hover:border-foreground">
                  <div className="flex flex-col">
                    <span className="font-display text-lg font-bold uppercase tracking-tight text-foreground line-clamp-1">{p.name}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className={`shrink-0 border px-3 py-1 text-[10px] font-bold uppercase tracking-widest ${p.status === "available" ? "border-success/30 text-success" : "border-muted text-muted-foreground"}`}>
                      {p.status}
                    </span>
                    <Link to="/products/$id" params={{ id: String(p.id) }} className="text-xs font-bold uppercase tracking-widest text-primary hover:underline">
                      View
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Pending reports */}
          {pendingReports.length > 0 && (
            <section>
              <div className="mb-6 flex items-end justify-between border-b border-border pb-4">
                <h2 className="font-display text-2xl font-bold uppercase tracking-tight text-foreground">Pending Reports</h2>
                <Link to="/admin/reports" className="group flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-muted-foreground hover:text-foreground">
                  All <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
              <div className="flex flex-col gap-4">
                {isReportsLoading ? (
                  <div className="flex justify-center p-4"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>
                ) : pendingReports.map((r: any) => (
                  <div key={r.id} className="group flex items-center justify-between border border-border bg-card p-4 transition-colors hover:border-foreground">
                    <div className="flex flex-col">
                      <p className="font-display text-lg font-bold uppercase tracking-tight text-foreground">
                        {r.reason}
                      </p>
                      <p className="mt-1 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                        {r.target_type} · {r.description.slice(0, 40)}…
                      </p>
                    </div>
                    <span className="shrink-0 border border-warning/30 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-warning-foreground">
                      Pending
                    </span>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </DashboardShell>
  );
}
