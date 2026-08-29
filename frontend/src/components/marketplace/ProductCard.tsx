import { Link } from "@tanstack/react-router";
import { Heart, MapPin, MoveRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StatusBadge, toneForProductStatus } from "@/components/common/StatusBadge";
import { formatPrice } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";
import type { Product } from "@/types";

export function ProductCard({ product, featured = false }: { product: Product, featured?: boolean }) {
  const { isFavorite, toggleFavorite } = useAuth();
  const saved = isFavorite(product.id);

  return (
    <article className={cn(
      "group relative flex flex-col overflow-hidden bg-background border border-border transition-slow hover:border-foreground",
      featured ? "col-span-1 sm:col-span-2 lg:col-span-2 row-span-2" : ""
    )}>
      <div className={cn(
        "relative overflow-hidden bg-muted",
        featured ? "aspect-[16/10] sm:aspect-[21/9]" : "aspect-[4/5]"
      )}>
        <img
          src={product.image}
          alt={`${product.name} listed by a campus student`}
          loading="lazy"
          className="h-full w-full object-cover transition-all duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] group-hover:scale-110 group-hover:opacity-90"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent opacity-0 transition-medium group-hover:opacity-100" />
        
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            toggleFavorite(product.id);
          }}
          aria-pressed={saved}
          aria-label={saved ? `Unsave ${product.name}` : `Save ${product.name}`}
          className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-background/30 backdrop-blur-md text-foreground transition-all duration-300 hover:bg-foreground hover:text-background focus-visible:outline-none"
        >
          <Heart className={cn("h-4 w-4 transition-transform duration-300", saved ? "fill-current scale-110" : "scale-100 group-hover:scale-110")} />
        </button>
        <div className="absolute left-4 top-4 transition-transform duration-500 group-hover:-translate-y-2 group-hover:opacity-0">
          <StatusBadge tone={toneForProductStatus(product.status)} className="rounded-none border-0 uppercase tracking-widest text-[10px] font-bold shadow-sm">{product.status}</StatusBadge>
        </div>

        {/* Floating CTA that appears on hover */}
        <div className="absolute bottom-4 left-4 right-4 translate-y-8 opacity-0 transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] group-hover:translate-y-0 group-hover:opacity-100">
          <Button asChild className="w-full rounded-none font-display text-sm font-bold uppercase tracking-widest h-12 bg-foreground text-background hover:bg-primary">
            <Link to="/products/$id" params={{ id: String(product.id) }}>
              View Details <MoveRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>

      <div className={cn(
        "flex flex-col border-t border-border bg-background p-5 transition-colors duration-500 group-hover:bg-muted/10",
        featured ? "sm:p-8" : ""
      )}>
        <div className="flex items-start justify-between gap-4">
          <div className="flex flex-col">
            <span className="mb-1 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
              {product.category_name ?? ""}  · {product.condition}
            </span>
            <h3 className={cn(
              "font-display font-bold uppercase tracking-tight text-foreground line-clamp-1",
              featured ? "text-3xl" : "text-xl"
            )}>
              {product.name}
            </h3>
          </div>
          <span className={cn(
            "shrink-0 font-display font-bold text-primary",
            featured ? "text-3xl" : "text-xl"
          )}>
            {formatPrice(product.price)}
          </span>
        </div>
        
        <div className="mt-4 flex items-center justify-between">
          <p className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-wider text-muted-foreground">
            <MapPin className="h-3.5 w-3.5" aria-hidden="true" />
            {product.location}
          </p>
          <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            {product.status}
          </span>
        </div>
      </div>
      
      {/* Clickable overlay for the whole card when CTA is not directly clicked */}
      <Link to="/products/$id" params={{ id: String(product.id) }} className="absolute inset-0 z-0">
        <span className="sr-only">View {product.name}</span>
      </Link>
    </article>
  );
}

export function ProductGrid({ products }: { products: Product[] }) {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {products.map((p, i) => (
        <ProductCard key={p.id} product={p} featured={i === 0 && products.length > 3} />
      ))}
    </div>
  );
}
