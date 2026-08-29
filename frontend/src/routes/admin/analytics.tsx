import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { useAuth } from "@/contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/services/api";
import { useEffect } from "react";
import { TrendingUp, ShoppingBag, Users, Package, Flag } from "lucide-react";
import { adminLinks } from "@/config/nav";

export const Route = createFileRoute("/admin/analytics")({
  component: AdminAnalyticsPage,
});

function AdminAnalyticsPage() {
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

  const { data: categories = [], isLoading: isCategoriesLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: api.categories.list,
  });

  const { data: reports = [], isLoading: isReportsLoading } = useQuery({
    queryKey: ['admin', 'reports'],
    queryFn: api.reports.list,
    enabled: !!user?.id && user?.role === "admin",
  });

  if (!user || user.role !== "admin") return null;

  const isLoading = isStatsLoading || isProductsLoading || isCategoriesLoading || isReportsLoading;

  // Category distribution
  const categoryDistribution = categories.map((cat: any) => ({
    name: cat.name,
    count: products.filter((p: any) => p.category_id === cat.id).length,
  })).sort((a: any, b: any) => b.count - a.count);

  const maxCategoryCount = Math.max(...categoryDistribution.map((c: any) => c.count), 1);

  // Product status distribution
  const availableCount = products.filter((p: any) => p.status === "available").length;
  const soldCount = products.filter((p: any) => p.status === "sold").length;
  const total = products.length || 1;

  // Report distribution
  const pendingReports = reports.filter((r: any) => r.status === "pending").length;
  const resolvedReports = reports.filter((r: any) => r.status === "resolved").length;

  return (
    <DashboardShell links={adminLinks} heading="Admin Panel">
      <div className="space-y-8">
        <div>
          <h1 className="font-display text-4xl font-bold uppercase tracking-widest text-foreground">Analytics</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Basic platform statistics and activity overview.
          </p>
        </div>

        {/* Summary stat cards */}
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {[
            { label: "Users", value: statsData?.total_users || 0, icon: <Users className="h-4 w-4" /> },
            { label: "Products", value: statsData?.total_products || 0, icon: <Package className="h-4 w-4" /> },
            { label: "Requests", value: statsData?.total_requests || 0, icon: <ShoppingBag className="h-4 w-4" /> },
            { label: "Reports", value: statsData?.total_reports || 0, icon: <Flag className="h-4 w-4" /> },
          ].map((item) => (
            <div key={item.label} className="rounded-none border-2 border-border bg-card p-4">
              <div className="flex items-center gap-2 text-muted-foreground">
                {item.icon}
                <span className="text-sm">{item.label}</span>
              </div>
              <p className="mt-2 text-3xl font-bold text-foreground">{isLoading ? "..." : item.value}</p>
            </div>
          ))}
        </div>

        {/* Product status breakdown */}
        <section>
          <h2 className="mb-4 font-display text-2xl font-bold uppercase tracking-tight text-foreground">Product Status</h2>
          <div className="overflow-hidden rounded-none border-2 border-border bg-card p-6">
            <div className="grid grid-cols-2 gap-6 md:grid-cols-3">
              <div className="text-center">
                <p className="text-4xl font-bold text-success">{availableCount}</p>
                <p className="mt-1 text-sm text-muted-foreground">Available</p>
              </div>
              <div className="text-center">
                <p className="text-4xl font-bold text-muted-foreground">{soldCount}</p>
                <p className="mt-1 text-sm text-muted-foreground">Sold</p>
              </div>
              <div className="col-span-2 md:col-span-1 text-center">
                <p className="text-4xl font-bold text-primary">{Math.round((soldCount / total) * 100)}%</p>
                <p className="mt-1 text-sm text-muted-foreground">Sold rate</p>
              </div>
            </div>

            {/* Progress bar */}
            <div className="mt-6">
              <div className="flex justify-between text-xs text-muted-foreground mb-1">
                <span>Available ({availableCount})</span>
                <span>Sold ({soldCount})</span>
              </div>
              <div className="h-3 overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-success transition-all"
                  style={{ width: `${(availableCount / total) * 100}%` }}
                  role="progressbar"
                  aria-valuenow={availableCount}
                  aria-valuemax={total}
                  aria-label="Available products percentage"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Category distribution */}
        <section>
          <h2 className="mb-4 font-display text-2xl font-bold uppercase tracking-tight text-foreground">Products by Category</h2>
          <div className="overflow-hidden rounded-none border-2 border-border bg-card p-6 space-y-4">
            {categoryDistribution.map((cat: any) => (
              <div key={cat.name}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="font-medium text-foreground">{cat.name}</span>
                  <span className="text-muted-foreground">{cat.count} product{cat.count !== 1 ? "s" : ""}</span>
                </div>
                <div className="h-2.5 overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full bg-primary transition-all"
                    style={{ width: `${(cat.count / maxCategoryCount) * 100}%` }}
                    role="progressbar"
                    aria-valuenow={cat.count}
                    aria-valuemax={maxCategoryCount}
                    aria-label={`${cat.name} products`}
                  />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Reports breakdown */}
        <section>
          <h2 className="mb-4 font-display text-2xl font-bold uppercase tracking-tight text-foreground">Report Status</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-none border-2 border-border bg-card p-4 text-center">
              <p className="text-3xl font-bold text-warning-foreground">{pendingReports}</p>
              <p className="mt-1 text-sm text-muted-foreground">Pending</p>
            </div>
            <div className="rounded-none border-2 border-border bg-card p-4 text-center">
              <p className="text-3xl font-bold text-success">{resolvedReports}</p>
              <p className="mt-1 text-sm text-muted-foreground">Resolved</p>
            </div>
          </div>
        </section>
      </div>
    </DashboardShell>
  );
}
