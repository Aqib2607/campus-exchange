import { useState, useEffect } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { AppLayout } from "@/components/layout/AppLayout";
import { LoadingState, EmptyState, ErrorState } from "@/components/common/states";
import { ProductGrid } from "@/components/marketplace/ProductCard";
import {
  SearchBar,
  SortSelect,
  FilterPanel,
  MobileFilters,
  emptyFilters,
  type FilterValues,
} from "@/components/marketplace/Filters";
import { Button } from "@/components/ui/button";
import { api } from "@/services/api";
import { useAuth } from "@/contexts/AuthContext";
import type { Product } from "@/types";
import { Plus, LayoutGrid } from "lucide-react";

export const Route = createFileRoute("/products/")({
  component: ProductsPage,
});

function applyFilters(products: Product[], search: string, filters: FilterValues, sort: string): Product[] {
  let result = [...products];

  if (search.trim()) {
    const q = search.toLowerCase();
    result = result.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.location.toLowerCase().includes(q),
    );
  }

  if (filters.category !== "all") {
    result = result.filter((p) => String(p.category_id) === filters.category);
  }
  if (filters.condition !== "all") {
    result = result.filter((p) => p.condition === filters.condition);
  }
  if (filters.location !== "all") {
    result = result.filter((p) => p.location === filters.location);
  }
  if (filters.minPrice) {
    result = result.filter((p) => p.price >= Number(filters.minPrice));
  }
  if (filters.maxPrice) {
    result = result.filter((p) => p.price <= Number(filters.maxPrice));
  }

  switch (sort) {
    case "oldest":
      result.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
      break;
    case "price-asc":
      result.sort((a, b) => a.price - b.price);
      break;
    case "price-desc":
      result.sort((a, b) => b.price - a.price);
      break;
    default: // newest
      result.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  }

  return result;
}

function ProductsPage() {
  const { user } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState<FilterValues>(emptyFilters);
  const [sort, setSort] = useState("newest");

  const load = () => {
    setLoading(true);
    setError(false);
    api.products
      .list()
      .then(setProducts)
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  const displayed = loading ? [] : applyFilters(products, search, filters, sort);

  return (
    <AppLayout>
      <div className="bg-background min-h-screen">
        {/* EDITORIAL HEADER */}
        <div className="w-full border-b border-border bg-card">
          <div className="container-page py-16 md:py-24">
            <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
              <div>
                <div className="mb-4 flex items-center gap-2">
                  <LayoutGrid className="h-4 w-4 text-primary" />
                  <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">The Catalog</span>
                </div>
                <h1 className="font-display text-5xl font-bold uppercase tracking-tight md:text-8xl">
                  Marketplace
                </h1>
              </div>
              
              {user && (
                <div className="shrink-0 animate-in fade-in slide-in-from-right-8 duration-700">
                  <Button asChild className="h-14 rounded-none bg-foreground px-8 font-display text-lg font-bold uppercase tracking-widest text-background transition-medium hover:scale-105 hover:bg-primary">
                    <Link to="/products/create">
                      <Plus className="mr-3 h-5 w-5" aria-hidden="true" />
                      List Item
                    </Link>
                  </Button>
                </div>
              )}
            </div>
            
            <p className="mt-8 max-w-2xl text-lg font-medium text-muted-foreground">
              Browse products listed by verified university students. From textbooks to electronics, find exactly what you need on campus.
            </p>
          </div>
        </div>

        <div className="container-page py-12">
          {/* SEARCH & SORT BAR */}
          <div className="mb-10 flex flex-col items-center justify-between gap-4 border-b border-border pb-6 sm:flex-row">
            <div className="w-full sm:w-96">
              <SearchBar value={search} onChange={setSearch} />
            </div>
            <div className="w-full sm:w-auto flex items-center gap-4">
              <span className="hidden text-xs font-bold uppercase tracking-widest text-muted-foreground md:inline-block">
                {displayed.length} Result{displayed.length !== 1 ? "s" : ""}
              </span>
              <SortSelect value={sort} onChange={setSort} />
            </div>
          </div>

          {/* Mobile filters trigger */}
          <div className="mb-8 lg:hidden">
            <MobileFilters values={filters} onChange={setFilters} onReset={() => setFilters(emptyFilters)} />
          </div>

          <div className="flex flex-col gap-10 lg:flex-row">
            {/* Desktop sidebar filters */}
            <aside className="hidden w-64 shrink-0 lg:block" aria-label="Product filters">
              <div className="sticky top-28 rounded-none border border-border bg-card p-6 shadow-sm">
                <h2 className="mb-6 font-display text-xl font-bold uppercase tracking-tight text-foreground">Filter Catalog</h2>
                <FilterPanel
                  values={filters}
                  onChange={setFilters}
                  onReset={() => setFilters(emptyFilters)}
                />
              </div>
            </aside>

            {/* Product grid */}
            <div className="min-w-0 flex-1">
              {loading ? (
                <LoadingState label="Loading catalog…" rows={6} />
              ) : error ? (
                <ErrorState onRetry={load} />
              ) : displayed.length === 0 ? (
                <EmptyState
                  title="No items found"
                  description={
                    search || filters !== emptyFilters
                      ? "Your search yielded no results. Try adjusting the filters above."
                      : "The catalog is currently empty. Be the first to list an item."
                  }
                  action={
                    user ? (
                      <Button asChild className="rounded-none font-display uppercase tracking-widest">
                        <Link to="/products/create">List an item</Link>
                      </Button>
                    ) : (
                      <Button asChild variant="outline" className="rounded-none font-display uppercase tracking-widest border-2">
                        <Link to="/login">Sign in to list</Link>
                      </Button>
                    )
                  }
                />
              ) : (
                <div className="animate-in fade-in slide-in-from-bottom-8 duration-700">
                  <ProductGrid products={displayed} />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
