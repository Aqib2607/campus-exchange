import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { AppLayout } from "@/components/layout/AppLayout";
import { PageHeader, EmptyState } from "@/components/common/states";
import { ProductGrid } from "@/components/marketplace/ProductCard";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { mockProducts } from "@/lib/mock-data";
import { useEffect } from "react";
import { Heart } from "lucide-react";

export const Route = createFileRoute("/favorites")({
  component: FavoritesPage,
});

function FavoritesPage() {
  const { user, favorites } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate({ to: "/login" });
    }
  }, [user, navigate]);

  if (!user) return null;

  const savedProducts = mockProducts.filter((p) => favorites.includes(p.id));

  return (
    <AppLayout>
      <PageHeader
        title="Saved products"
        description="Products you have saved for later"
      />

      {savedProducts.length === 0 ? (
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
