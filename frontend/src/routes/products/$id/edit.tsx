import { useState, useEffect } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { AppLayout } from "@/components/layout/AppLayout";
import { PageHeader, LoadingState, ErrorState } from "@/components/common/states";
import { ProductForm } from "@/components/marketplace/ProductForm";
import { useAuth } from "@/contexts/AuthContext";
import { api } from "@/services/api";
import type { Product } from "@/types";

export const Route = createFileRoute("/products/$id/edit")({
  component: EditProductPage,
});

function EditProductPage() {
  const { id } = Route.useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate({ to: "/login" });
      return;
    }
    api.products
      .get(Number(id))
      .then((p) => {
        if (!p || p.user_id !== user.id) {
          navigate({ to: "/dashboard/listings" });
          return;
        }
        setProduct(p);
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [id, user, navigate]);

  if (!user) return null;

  if (loading) return <AppLayout><LoadingState label="Loading listing…" /></AppLayout>;
  if (error || !product)
    return (
      <AppLayout>
        <ErrorState
          title="Listing not found"
          description="This listing does not exist or you do not have permission to edit it."
        />
      </AppLayout>
    );

  return (
    <AppLayout>
      <div className="mx-auto max-w-2xl">
        <PageHeader
          title="Edit listing"
          description="Update the details of your listing below."
        />
        <div className="rounded-none border-2 border-border bg-card p-6 sm:p-8">
          <ProductForm mode="edit" product={product} />
        </div>
      </div>
    </AppLayout>
  );
}
