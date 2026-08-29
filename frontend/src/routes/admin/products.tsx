import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { EmptyState } from "@/components/common/states";
import { StatusBadge, toneForProductStatus } from "@/components/common/StatusBadge";
import { Button } from "@/components/ui/button";
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
import { useAuth } from "@/contexts/AuthContext";
import { formatDate, formatPrice } from "@/lib/utils";
import { useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/services/api";
import { Package, Eye, Trash2, Loader2 } from "lucide-react";
import { adminLinks } from "@/config/nav";

export const Route = createFileRoute("/admin/products")({
  component: AdminProductsPage,
});

function AdminProductsPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!user) navigate({ to: "/login" });
    else if (user.role !== "admin") navigate({ to: "/dashboard" });
  }, [user, navigate]);

  const { data: products = [], isLoading } = useQuery({
    queryKey: ['admin', 'products'],
    queryFn: api.admin.products,
    enabled: !!user?.id && user?.role === "admin",
  });

  const deleteMutation = useMutation({
    mutationFn: api.admin.deleteProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'products'] });
    },
  });

  if (!user || user.role !== "admin") return null;

  return (
    <DashboardShell links={adminLinks} heading="Admin Panel">
      <div className="space-y-6">
        <div>
          <h1 className="font-display text-4xl font-bold uppercase tracking-widest text-foreground">Products</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Review and manage all marketplace listings.
          </p>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-muted-foreground" /></div>
        ) : products.length === 0 ? (
          <EmptyState
            title="No products"
            description="There are no products listed on the marketplace."
            icon={<Package className="h-8 w-8" />}
          />
        ) : (
          <>
            {/* Desktop table */}
            <div className="hidden overflow-hidden rounded-none border-2 border-border bg-card md:block">
              <table className="w-full text-sm">
                <thead className="border-b-2 border-border bg-muted/40 uppercase tracking-wider text-xs">
                  <tr>
                    <th className="px-4 py-3 text-left font-medium text-muted-foreground">Product</th>
                    <th className="px-4 py-3 text-left font-medium text-muted-foreground">Seller</th>
                    <th className="px-4 py-3 text-left font-medium text-muted-foreground">Category</th>
                    <th className="px-4 py-3 text-left font-medium text-muted-foreground">Price</th>
                    <th className="px-4 py-3 text-left font-medium text-muted-foreground">Status</th>
                    <th className="px-4 py-3 text-left font-medium text-muted-foreground">Date</th>
                    <th className="px-4 py-3 text-left font-medium text-muted-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {products.map((p: any) => {
                    const seller = p.user;
                    return (
                      <tr key={p.id} className="hover:bg-muted/20">
                        <td className="px-4 py-3">
                          <p className="font-medium text-foreground line-clamp-1">{p.name}</p>
                        </td>
                        <td className="px-4 py-3 text-muted-foreground">{seller?.name ?? "Unknown"}</td>
                        <td className="px-4 py-3 text-muted-foreground">{p.category_name ?? "—"}</td>
                        <td className="px-4 py-3 font-medium">{formatPrice(p.price)}</td>
                        <td className="px-4 py-3">
                          <StatusBadge tone={toneForProductStatus(p.status)}>{p.status}</StatusBadge>
                        </td>
                        <td className="px-4 py-3 text-muted-foreground">{formatDate(p.created_at)}</td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1">
                            <Button asChild variant="ghost" size="icon" aria-label={`View ${p.name}`}>
                              <Link to="/products/$id" params={{ id: String(p.id) }}>
                                <Eye className="h-4 w-4" />
                              </Link>
                            </Button>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive" aria-label={`Delete ${p.name}`}>
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Delete product?</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Delete &ldquo;{p.name}&rdquo;? This cannot be undone.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => deleteMutation.mutate(p.id)}
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
              {products.map((p: any) => {
                const seller = p.user;
                return (
                  <div key={p.id} className="overflow-hidden rounded-none border-2 border-border bg-card p-4">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="font-medium text-foreground line-clamp-1">{p.name}</p>
                        <p className="text-xs text-muted-foreground">{seller?.name ?? "Unknown"} · {p.category_name ?? "—"}</p>
                        <p className="text-xs font-semibold text-primary">{formatPrice(p.price)}</p>
                      </div>
                      <StatusBadge tone={toneForProductStatus(p.status)}>{p.status}</StatusBadge>
                    </div>
                    <div className="mt-3 flex gap-2">
                      <Button asChild variant="outline" size="sm">
                        <Link to="/products/$id" params={{ id: String(p.id) }}>View</Link>
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="outline" size="sm" className="text-destructive border-destructive/30">Delete</Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete product?</AlertDialogTitle>
                            <AlertDialogDescription>Delete &ldquo;{p.name}&rdquo;?</AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => deleteMutation.mutate(p.id)}
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
    </DashboardShell>
  );
}
