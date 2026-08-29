import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { AppLayout } from "@/components/layout/AppLayout";
import { PageHeader } from "@/components/common/states";
import { ProductForm } from "@/components/marketplace/ProductForm";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect } from "react";

export const Route = createFileRoute("/products/create")({
  component: CreateProductPage,
});

function CreateProductPage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate({ to: "/login" });
    }
  }, [user, navigate]);

  if (!user) return null;

  return (
    <AppLayout>
      <div className="mx-auto max-w-2xl">
        <PageHeader
          title="Create listing"
          description="Fill in the details below to list your product on the Campus Exchange marketplace."
        />
        <div className="rounded-none border-2 border-border bg-card p-6 sm:p-8">
          <ProductForm mode="create" />
        </div>
      </div>
    </AppLayout>
  );
}
