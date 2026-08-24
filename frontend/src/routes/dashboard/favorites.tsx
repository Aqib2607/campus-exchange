import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { EmptyState } from "@/components/common/states";
import { ProductGrid } from "@/components/marketplace/ProductCard";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { mockProducts } from "@/lib/mock-data";
import { useEffect } from "react";
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Heart,
  MessageSquare,
  User,
} from "lucide-react";

const studentLinks = [
  { to: "/dashboard", label: "Overview", icon: <LayoutDashboard className="h-4 w-4" /> },
  { to: "/dashboard/listings", label: "My Listings", icon: <Package className="h-4 w-4" /> },
  { to: "/dashboard/requests", label: "Requests", icon: <ShoppingBag className="h-4 w-4" /> },
  { to: "/dashboard/favorites", label: "Favorites", icon: <Heart className="h-4 w-4" /> },
  { to: "/dashboard/messages", label: "Messages", icon: <MessageSquare className="h-4 w-4" /> },
  { to: "/dashboard/profile", label: "Profile", icon: <User className="h-4 w-4" /> },
];

export const Route = createFileRoute("/dashboard/favorites")({
  component: DashboardFavoritesPage,
});

function DashboardFavoritesPage() {
  const { user, favorites } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) navigate({ to: "/login" });
    else if (user.role === "admin") navigate({ to: "/admin" });
  }, [user, navigate]);

  if (!user || user.role === "admin") return null;

  const savedProducts = mockProducts.filter((p) => favorites.includes(p.id));

  return (
    <DashboardShell links={studentLinks} heading="Student Dashboard">
      <div className="space-y-6">
        <div>
          <h1 className="text-xl font-bold text-foreground">Saved Products</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Products you have saved from the marketplace.
          </p>
        </div>

        {savedProducts.length === 0 ? (
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
