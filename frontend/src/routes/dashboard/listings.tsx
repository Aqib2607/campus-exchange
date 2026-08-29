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
import { Package, Edit, Trash2, Eye, Plus, Loader2 } from "lucide-react";
import { studentLinks } from "@/config/nav";

export const Route = createFileRoute("/dashboard/listings")({
  component: DashboardListingsPage,
});

function DashboardListingsPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!user) navigate({ to: "/login" });
    else if (user.role === "admin") navigate({ to: "/admin" });
  }, [user, navigate]);

  const { data: myListings = [], isLoading } = useQuery({
    queryKey: ['myListings', user?.id],
    queryFn: () => api.products.mine(),
    enabled: !!user?.id && user?.role !== "admin",
  });

  const deleteMutation = useMutation({
    mutationFn: api.products.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myListings', user?.id] });
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });

  if (!user || user.role === "admin") return null;

  const handleDelete = (id: number) => {
    deleteMutation.mutate(id);
  };

  return (
    <DashboardShell links={studentLinks} heading="Student Dashboard">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-display text-4xl font-bold uppercase tracking-widest text-foreground">My Listings</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Manage the products you have listed on the marketplace.
            </p>
          </div>
          <Button asChild size="sm">
            <Link to="/products/create">
              <Plus className="mr-2 h-4 w-4" aria-hidden="true" />
              New listing
            </Link>
          </Button>
        </div>

        {isLoading ? (
          <div className="flex h-64 items-center justify-center border border-border bg-card">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : myListings.length === 0 ? (
          <EmptyState
            title="No listings yet"
            description="You haven't listed any products. Create your first listing to start selling."
            icon={<Package className="h-8 w-8" />}
            action={
              <Button asChild>
                <Link to="/products/create">Create listing</Link>
              </Button>
            }
          />
        ) : (
          <div className="overflow-hidden rounded-none border-2 border-border bg-card">
            {/* Desktop table */}
            <div className="hidden md:block">
              <table className="w-full text-sm">
                <thead className="border-b-2 border-border bg-muted/40 uppercase tracking-wider text-xs">
                  <tr>
                    <th className="px-4 py-3 text-left font-medium text-muted-foreground">Product</th>
                    <th className="px-4 py-3 text-left font-medium text-muted-foreground">Category</th>
                    <th className="px-4 py-3 text-left font-medium text-muted-foreground">Price</th>
                    <th className="px-4 py-3 text-left font-medium text-muted-foreground">Status</th>
                    <th className="px-4 py-3 text-left font-medium text-muted-foreground">Listed</th>
                    <th className="px-4 py-3 text-left font-medium text-muted-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {myListings.map((p: any) => (
                    <tr key={p.id} className="hover:bg-muted/20">
                      <td className="px-4 py-3">
                        <p className="font-medium text-foreground line-clamp-1">{p.name}</p>
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">{p.category_name ?? "—"}</td>
                      <td className="px-4 py-3 font-medium text-foreground">{formatPrice(p.price)}</td>
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
                          <Button asChild variant="ghost" size="icon" aria-label={`Edit ${p.name}`}>
                            <Link to="/products/$id/edit" params={{ id: String(p.id) }}>
                              <Edit className="h-4 w-4" />
                            </Link>
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="ghost" size="icon" aria-label={`Delete ${p.name}`} className="text-destructive hover:text-destructive">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Delete listing?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to delete &ldquo;{p.name}&rdquo;? This action cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDelete(p.id)}
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
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile cards */}
            <div className="divide-y divide-border md:hidden">
              {myListings.map((p: any) => (
                <div key={p.id} className="p-4">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="font-medium text-foreground line-clamp-1">{p.name}</p>
                      <p className="text-xs text-muted-foreground">{p.category_name ?? "—"} · {formatDate(p.created_at)}</p>
                    </div>
                    <StatusBadge tone={toneForProductStatus(p.status)}>{p.status}</StatusBadge>
                  </div>
                  <p className="mt-1 font-semibold text-primary">{formatPrice(p.price)}</p>
                  <div className="mt-3 flex gap-2">
                    <Button asChild variant="outline" size="sm">
                      <Link to="/products/$id" params={{ id: String(p.id) }}>View</Link>
                    </Button>
                    <Button asChild variant="outline" size="sm">
                      <Link to="/products/$id/edit" params={{ id: String(p.id) }}>Edit</Link>
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="outline" size="sm" className="text-destructive border-destructive/30">Delete</Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete listing?</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete &ldquo;{p.name}&rdquo;?
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDelete(p.id)}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </DashboardShell>
  );
}
