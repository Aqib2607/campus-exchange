import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { AppLayout } from "@/components/layout/AppLayout";
import { PageHeader, EmptyState } from "@/components/common/states";
import { ProductGrid } from "@/components/marketplace/ProductCard";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/services/api";
import { useEffect } from "react";
import { Heart, Loader2 } from "lucide-react";
import type { Product } from "@/types";

export const Route = createFileRoute("/favorites")({
  component: FavoritesPage,
});

function FavoritesPage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate({ to: "/login" });
    }
  }, [user, navigate]);

  const { data: favoritesData, isLoading } = useQuery({
    queryKey: ['favorites', user?.id],
    queryFn: api.favorites.list,
    enabled: !!user?.id,
  });

  if (!user) return null;

  const savedProducts: Product[] = favoritesData?.map((f: any) => f.product).filter(Boolean) || [];

  return (
    <AppLayout>
      <PageHeader
        title="Saved products"
        description="Products you have saved for later"
      />

      {isLoading ? (
        <div className="flex h-64 items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : savedProducts.length === 0 ? (
        <EmptyState
          title="No saved products yet"
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
          <p className="mb-4 text-sm text-muted-foreground">
            {savedProducts.length} saved product{savedProducts.length !== 1 ? "s" : ""}
          </p>
          <ProductGrid products={savedProducts} />
        </>
      )}
    </AppLayout>
  );
}

