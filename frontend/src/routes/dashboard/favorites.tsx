import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { EmptyState } from "@/components/common/states";
import { ProductGrid } from "@/components/marketplace/ProductCard";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/services/api";
import { useEffect } from "react";
import { Loader2, Heart } from "lucide-react";
import type { Product } from "@/types";
import { studentLinks } from "@/config/nav";

export const Route = createFileRoute("/dashboard/favorites")({
  component: DashboardFavoritesPage,
});

function DashboardFavoritesPage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) navigate({ to: "/login" });
    else if (user.role === "admin") navigate({ to: "/admin" });
  }, [user, navigate]);

  const { data: favoritesData, isLoading } = useQuery({
    queryKey: ['favorites', user?.id],
    queryFn: api.favorites.list,
    enabled: !!user?.id && user?.role !== "admin",
  });

  if (!user || user.role === "admin") return null;

  const savedProducts: Product[] = favoritesData?.map((f: any) => f.product).filter(Boolean) || [];

  return (
    <DashboardShell links={studentLinks} heading="Student Dashboard">
      <div className="space-y-6">
        <div>
          <h1 className="font-display text-4xl font-bold uppercase tracking-widest text-foreground">Saved Products</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Products you have saved from the marketplace.
          </p>
        </div>

        {isLoading ? (
          <div className="flex h-64 items-center justify-center border border-border bg-card">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : savedProducts.length === 0 ? (
          <EmptyState
            title="No saved products"
            description="Browse the marketplace and save products you are interested in."
            icon={<Heart className="h-8 w-8" />}
            action={
              <Button asChild>
                <Link to="/products">Browse marketplace</Link>
              </Button>
            }
          />
        ) : (
          <>
            <p className="text-sm text-muted-foreground">
              {savedProducts.length} saved product{savedProducts.length !== 1 ? "s" : ""}
            </p>
            <ProductGrid products={savedProducts} />
          </>
        )}
      </div>
    </DashboardShell>
  );
}
