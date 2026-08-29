import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { EmptyState } from "@/components/common/states";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import { formatDate } from "@/lib/utils";
import { useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/services/api";
import { Tag, Plus, Edit, Trash2, Loader2 } from "lucide-react";
import type { Category } from "@/types";
import { adminLinks } from "@/config/nav";

export const Route = createFileRoute("/admin/categories")({
  component: AdminCategoriesPage,
});

function AdminCategoriesPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Category | null>(null);
  const [nameInput, setNameInput] = useState("");
  const [nameError, setNameError] = useState("");

  const { data: categories = [], isLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: api.categories.list,
  });

  const createMutation = useMutation({
    mutationFn: api.categories.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      setDialogOpen(false);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) => api.categories.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      setDialogOpen(false);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: api.categories.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    },
  });

  useEffect(() => {
    if (!user) navigate({ to: "/login" });
    else if (user.role !== "admin") navigate({ to: "/dashboard" });
  }, [user, navigate]);

  if (!user || user.role !== "admin") return null;

  const openCreate = () => {
    setEditing(null);
    setNameInput("");
    setNameError("");
    setDialogOpen(true);
  };

  const openEdit = (cat: Category) => {
    setEditing(cat);
    setNameInput(cat.name);
    setNameError("");
    setDialogOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nameInput.trim()) {
      setNameError("Category name is required.");
      return;
    }
    
    if (editing) {
      updateMutation.mutate({ id: editing.id, data: { name: nameInput.trim() } });
    } else {
      createMutation.mutate({ name: nameInput.trim() });
    }
  };

  const handleDelete = (id: number) => {
    deleteMutation.mutate(id);
  };

  return (
    <DashboardShell links={adminLinks} heading="Admin Panel">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-display text-4xl font-bold uppercase tracking-widest text-foreground">Categories</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Manage the product categories available to students.
            </p>
          </div>
          <Button onClick={openCreate} size="sm">
            <Plus className="mr-2 h-4 w-4" aria-hidden="true" />
            Add category
          </Button>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-muted-foreground" /></div>
        ) : categories.length === 0 ? (
          <EmptyState
            title="No categories"
            description="Create categories so students can classify their listings."
            icon={<Tag className="h-8 w-8" />}
            action={<Button onClick={openCreate}>Add category</Button>}
          />
        ) : (
          <div className="overflow-hidden rounded-none border-2 border-border bg-card">
            <div className="divide-y divide-border">
              {categories.map((cat: any) => (
                <div key={cat.id} className="flex items-center justify-between px-4 py-3">
                  <div>
                    <p className="font-medium text-foreground">{cat.name}</p>
                    <p className="text-xs text-muted-foreground">Added {formatDate(cat.created_at)}</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => openEdit(cat)}
                      aria-label={`Edit ${cat.name}`}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-destructive hover:text-destructive"
                          aria-label={`Delete ${cat.name}`}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete category?</AlertDialogTitle>
                          <AlertDialogDescription>
                            Delete &ldquo;{cat.name}&rdquo;? Products using this category will lose their category association.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDelete(cat.id)}
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

      {/* Create/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>{editing ? "Edit category" : "Add category"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSave} noValidate className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="cat-name">Category name</Label>
              <Input
                id="cat-name"
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                placeholder="e.g. Books"
                aria-invalid={!!nameError}
                aria-describedby={nameError ? "cat-name-error" : undefined}
                disabled={createMutation.isPending || updateMutation.isPending}
              />
              {nameError && (
                <p id="cat-name-error" className="text-xs text-destructive">{nameError}</p>
              )}
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)} disabled={createMutation.isPending || updateMutation.isPending}>
                Cancel
              </Button>
              <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending}>
                {createMutation.isPending || updateMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
                    Saving…
                  </>
                ) : editing ? (
                  "Save changes"
                ) : (
                  "Add category"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </DashboardShell>
  );
}
