import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { useAuth } from "@/contexts/AuthContext";
import { mockStatistics, mockProducts, mockCategories, mockReports, getCategoryName } from "@/lib/mock-data";
import { useEffect } from "react";
import {
  LayoutDashboard,
  Users,
  Package,
  Tag,
  Flag,
  BarChart2,
  TrendingUp,
  ShoppingBag,
} from "lucide-react";

const adminLinks = [
  { to: "/admin", label: "Dashboard", icon: <LayoutDashboard className="h-4 w-4" /> },
  { to: "/admin/users", label: "Users", icon: <Users className="h-4 w-4" /> },
  { to: "/admin/products", label: "Products", icon: <Package className="h-4 w-4" /> },
  { to: "/admin/categories", label: "Categories", icon: <Tag className="h-4 w-4" /> },
  { to: "/admin/reports", label: "Reports", icon: <Flag className="h-4 w-4" /> },
  { to: "/admin/analytics", label: "Analytics", icon: <BarChart2 className="h-4 w-4" /> },
];

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

  if (!user || user.role !== "admin") return null;

  const s = mockStatistics;

  // Category distribution
  const categoryDistribution = mockCategories.map((cat) => ({
    name: cat.name,
    count: mockProducts.filter((p) => p.category_id === cat.id).length,
  })).sort((a, b) => b.count - a.count);

  const maxCategoryCount = Math.max(...categoryDistribution.map((c) => c.count), 1);

  // Product status distribution
  const availableCount = mockProducts.filter((p) => p.status === "available").length;
  const soldCount = mockProducts.filter((p) => p.status === "sold").length;
  const total = mockProducts.length || 1;

  // Report distribution
  const pendingReports = mockReports.filter((r) => r.status === "pending").length;
  const resolvedReports = mockReports.filter((r) => r.status === "resolved").length;

  return (
    <DashboardShell links={adminLinks} heading="Admin Panel">
      <div className="space-y-8">
        <div>
          <h1 className="text-xl font-bold text-foreground">Analytics</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Basic platform statistics and activity overview.
          </p>
        </div>

        {/* Summary stat cards */}
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {[
            { label: "Users", value: s.total_users, icon: <Users className="h-4 w-4" /> },
            { label: "Products", value: s.total_products, icon: <Package className="h-4 w-4" /> },
            { label: "Requests", value: s.total_requests, icon: <ShoppingBag className="h-4 w-4" /> },
            { label: "Reports", value: s.total_reports, icon: <Flag className="h-4 w-4" /> },
          ].map((item) => (
            <div key={item.label} className="rounded-xl border border-border bg-card p-4">
              <div className="flex items-center gap-2 text-muted-foreground">
                {item.icon}
                <span className="text-sm">{item.label}</span>
              </div>
              <p className="mt-2 text-3xl font-bold text-foreground">{item.value}</p>
            </div>
          ))}
        </div>

        {/* Product status breakdown */}
        <section>
          <h2 className="mb-4 text-base font-semibold text-foreground">Product Status</h2>
          <div className="overflow-hidden rounded-xl border border-border bg-card p-6">
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
          <h2 className="mb-4 text-base font-semibold text-foreground">Products by Category</h2>
          <div className="overflow-hidden rounded-xl border border-border bg-card p-6 space-y-4">
            {categoryDistribution.map((cat) => (
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
          <h2 className="mb-4 text-base font-semibold text-foreground">Report Status</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-xl border border-border bg-card p-4 text-center">
              <p className="text-3xl font-bold text-warning-foreground">{pendingReports}</p>
              <p className="mt-1 text-sm text-muted-foreground">Pending</p>
            </div>
            <div className="rounded-xl border border-border bg-card p-4 text-center">
              <p className="text-3xl font-bold text-success">{resolvedReports}</p>
              <p className="mt-1 text-sm text-muted-foreground">Resolved</p>
            </div>
          </div>
        </section>
      </div>
    </DashboardShell>
  );
}
