import { Link } from "@tanstack/react-router";
import { Heart, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StatusBadge, toneForProductStatus } from "@/components/common/StatusBadge";
import { formatPrice, getCategoryName } from "@/lib/mock-data";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";
import type { Product } from "@/types";

export function ProductCard({ product }: { product: Product }) {
  const { isFavorite, toggleFavorite } = useAuth();
  const saved = isFavorite(product.id);

  return (
    <article className="group flex flex-col overflow-hidden rounded-xl border border-border bg-card transition-shadow hover:shadow-md">
      <div className="relative aspect-4/3 overflow-hidden bg-muted">
        <img
          src={product.image}
          alt={`${product.name} listed by a campus student`}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-200 group-hover:scale-[1.02]"
        />
        <button
          type="button"
          onClick={() => toggleFavorite(product.id)}
          aria-pressed={saved}
          aria-label={saved ? `Unsave ${product.name}` : `Save ${product.name}`}
          className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-card/90 text-muted-foreground shadow-sm transition-colors hover:text-destructive focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
        >
          <Heart className={cn("h-4 w-4", saved && "fill-destructive text-destructive")} />
        </button>
        <div className="absolute left-3 top-3">
          <StatusBadge tone={toneForProductStatus(product.status)}>{product.status}</StatusBadge>
        </div>
      </div>

      <div className="flex flex-1 flex-col p-4">
        <div className="flex items-start justify-between gap-3">
          <h3 className="line-clamp-2 text-sm font-semibold text-foreground">{product.name}</h3>
          <span className="shrink-0 text-sm font-bold text-primary">{formatPrice(product.price)}</span>
        </div>
        <p className="mt-2 text-xs text-muted-foreground">
          {getCategoryName(product.category_id)} · {product.condition}
        </p>
        <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
          <MapPin className="h-3 w-3" aria-hidden="true" />
          {product.location}
        </p>
        <div className="mt-4 flex-1" />
        <Button asChild variant="outline" size="sm" className="w-full">
          <Link to="/products/$id" params={{ id: String(product.id) }}>
            View product
          </Link>
        </Button>
      </div>
    </article>
  );
}

export function ProductGrid({ products }: { products: Product[] }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {products.map((p) => (
        <ProductCard key={p.id} product={p} />
      ))}
    </div>
  );
}
