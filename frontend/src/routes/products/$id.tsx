import { useState, useEffect } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { AppLayout } from "@/components/layout/AppLayout";
import { LoadingState, ErrorState } from "@/components/common/states";
import { StatusBadge, toneForProductStatus, toneForRequestStatus } from "@/components/common/StatusBadge";
import { ReportModal } from "@/components/marketplace/ReportModal";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { api } from "@/services/api";
import { useAuth } from "@/contexts/AuthContext";
import {
  formatPrice,
  getCategoryName,
  formatDate,
  getUser,
  mockRequests,
} from "@/lib/mock-data";
import type { Product } from "@/types";
import { Heart, MapPin, Phone, Flag, Edit, MessageSquare, Loader2, ArrowLeft, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/products/$id")({
  component: ProductDetailPage,
});

function ProductDetailPage() {
  const { id } = Route.useParams();
  const { user, isFavorite, toggleFavorite } = useAuth();
  const navigate = useNavigate();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [requestStatus, setRequestStatus] = useState<"idle" | "loading" | "sent" | "error">("idle");
  const [reportOpen, setReportOpen] = useState(false);

  const load = () => {
    setLoading(true);
    setError(false);
    api.products
      .get(Number(id))
      .then((p) => {
        if (p) {
          setProduct(p);
        } else {
          setError(true);
        }
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, [id]);

  if (loading) return <AppLayout><LoadingState label="Loading product details…" /></AppLayout>;
  if (error || !product)
    return (
      <AppLayout>
        <ErrorState
          title="Product not found"
          description="This listing may have been removed or does not exist."
          onRetry={load}
        />
      </AppLayout>
    );

  const seller = getUser(product.user_id);
  const saved = isFavorite(product.id);
  const isOwner = user?.id === product.user_id;
  const isSold = product.status === "sold";

  // Check if the current user already sent a request for this product
  const existingRequest = user
    ? mockRequests.find((r) => r.product_id === product.id && r.buyer_id === user.id)
    : null;

  const handleRequest = async () => {
    if (!user) {
      navigate({ to: "/login" });
      return;
    }
    setRequestStatus("loading");
    await new Promise((r) => setTimeout(r, 700));
    setRequestStatus("sent");
  };

  const handleMessage = () => {
    if (!user) {
      navigate({ to: "/login" });
      return;
    }
    navigate({ to: "/dashboard/messages" });
  };

  const canRequest = !isOwner && !isSold && !existingRequest;

  return (
    <AppLayout>
      <div className="bg-background">
        {/* Navigation Bar */}
        <div className="container-page py-6 border-b border-border">
          <Link to="/products" className="group inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-muted-foreground transition-colors hover:text-foreground">
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" /> Back to Catalog
          </Link>
        </div>

        {/* Hero Section */}
        <div className="container-page py-12">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-20">
            
            {/* Left Column: Image Anchor */}
            <div className="lg:col-span-7">
              <div className="group relative aspect-[4/5] sm:aspect-square w-full overflow-hidden bg-muted border border-border">
                <img
                  src={product.image}
                  alt={product.name}
                  className="h-full w-full object-cover transition-slow group-hover:scale-105"
                />
                <button
                  type="button"
                  onClick={() => toggleFavorite(product.id)}
                  aria-pressed={saved}
                  aria-label={saved ? `Unsave ${product.name}` : `Save ${product.name}`}
                  className="absolute right-6 top-6 flex h-12 w-12 items-center justify-center rounded-full bg-background/50 backdrop-blur-md text-foreground transition-all duration-300 hover:bg-foreground hover:text-background focus-visible:outline-none"
                >
                  <Heart className={cn("h-5 w-5 transition-transform", saved ? "fill-current scale-110" : "scale-100 group-hover:scale-110")} />
                </button>
              </div>
            </div>

            {/* Right Column: Details & Actions */}
            <div className="flex flex-col lg:col-span-5 lg:pt-8">
              
              <div className="mb-8">
                <div className="mb-4 flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                    {getCategoryName(product.category_id)}
                  </span>
                  <StatusBadge tone={toneForProductStatus(product.status)} className="rounded-none border-0 text-[10px] font-bold uppercase tracking-widest">
                    {product.status}
                  </StatusBadge>
                </div>
                
                <h1 className="font-display text-4xl font-bold uppercase leading-[0.9] tracking-tight text-foreground md:text-6xl">
                  {product.name}
                </h1>
                
                <p className="mt-6 font-display text-5xl font-bold text-primary md:text-6xl">
                  {formatPrice(product.price)}
                </p>
              </div>

              {/* Action Area */}
              <div className="mb-10 flex flex-col gap-4 border-b border-t border-border py-8">
                {/* Action feedback */}
                {requestStatus === "sent" && (
                  <Alert className="rounded-none border-success/40 bg-success/10 mb-4">
                    <AlertDescription className="text-success font-medium">
                      Request sent! The seller will be in touch.
                    </AlertDescription>
                  </Alert>
                )}
                {existingRequest && requestStatus !== "sent" && (
                  <Alert className={`rounded-none border-${toneForRequestStatus(existingRequest.status)}/40 mb-4`}>
                    <AlertDescription>
                      You already have a{" "}
                      <StatusBadge tone={toneForRequestStatus(existingRequest.status)} className="rounded-none">
                        {existingRequest.status}
                      </StatusBadge>{" "}
                      request for this product.
                    </AlertDescription>
                  </Alert>
                )}

                {/* Actions */}
                <div className="flex flex-col gap-4 sm:flex-row">
                  {isOwner ? (
                    <Button asChild className="h-14 flex-1 rounded-none bg-foreground font-display text-lg uppercase tracking-widest text-background hover:bg-primary">
                      <Link to="/products/$id/edit" params={{ id: String(product.id) }}>
                        <Edit className="mr-2 h-5 w-5" aria-hidden="true" />
                        Edit Listing
                      </Link>
                    </Button>
                  ) : (
                    <>
                      {canRequest && (
                        <Button 
                          onClick={handleRequest} 
                          disabled={requestStatus === "loading"}
                          className="h-14 flex-1 rounded-none bg-foreground font-display text-lg uppercase tracking-widest text-background transition-medium hover:scale-[1.02] hover:bg-primary"
                        >
                          {requestStatus === "loading" ? (
                            <>
                              <Loader2 className="mr-2 h-5 w-5 animate-spin" aria-hidden="true" />
                              Sending…
                            </>
                          ) : (
                            "Request to Buy"
                          )}
                        </Button>
                      )}

                      {isSold && (
                        <Button disabled className="h-14 flex-1 rounded-none bg-muted font-display text-lg uppercase tracking-widest text-muted-foreground">
                          Item Sold
                        </Button>
                      )}

                      <Button 
                        variant="outline" 
                        onClick={handleMessage}
                        className="h-14 flex-1 rounded-none border-2 font-display text-lg uppercase tracking-widest transition-medium hover:bg-foreground hover:text-background"
                      >
                        <MessageSquare className="mr-2 h-5 w-5" aria-hidden="true" />
                        Message
                      </Button>
                    </>
                  )}
                </div>
              </div>

              {/* Specs Grid */}
              <div className="mb-10 grid grid-cols-2 gap-x-8 gap-y-6">
                <div>
                  <p className="mb-1 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Condition</p>
                  <p className="font-medium text-foreground">{product.condition}</p>
                </div>
                <div>
                  <p className="mb-1 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Location</p>
                  <p className="flex items-center gap-1 font-medium text-foreground">
                    <MapPin className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                    {product.location}
                  </p>
                </div>
                {product.contact_information && (
                  <div className="col-span-2">
                    <p className="mb-1 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Contact</p>
                    <p className="flex items-center gap-1 font-medium text-foreground">
                      <Phone className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                      {product.contact_information}
                    </p>
                  </div>
                )}
                <div className="col-span-2">
                  <p className="mb-1 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Listed On</p>
                  <p className="font-medium text-foreground">{formatDate(product.created_at)}</p>
                </div>
              </div>

              {/* Seller Block */}
              {seller && (
                <div className="mb-10 flex items-center justify-between border border-border bg-muted/20 p-6">
                  <div>
                    <p className="mb-1 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Seller</p>
                    <p className="font-display text-xl font-bold uppercase tracking-tight text-foreground">{seller.name}</p>
                  </div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-foreground text-background">
                    <span className="font-display text-lg font-bold uppercase">{seller.name.charAt(0)}</span>
                  </div>
                </div>
              )}

              {/* Description */}
              <div className="mb-10">
                <h2 className="mb-4 font-display text-2xl font-bold uppercase tracking-tight text-foreground">About this item</h2>
                <div className="prose prose-neutral dark:prose-invert">
                  <p className="whitespace-pre-line text-base leading-relaxed text-muted-foreground">
                    {product.description}
                  </p>
                </div>
              </div>

              {/* Report Action */}
              {user && !isOwner && (
                <div className="mt-auto pt-8 border-t border-border">
                  <button
                    onClick={() => setReportOpen(true)}
                    className="group flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-muted-foreground transition-colors hover:text-foreground"
                  >
                    <Flag className="h-4 w-4 transition-transform group-hover:scale-110" aria-hidden="true" />
                    Report this listing
                  </button>
                </div>
              )}

            </div>
          </div>
        </div>
      </div>

      {/* Report modal */}
      <ReportModal
        open={reportOpen}
        onOpenChange={setReportOpen}
        targetType="product"
        targetLabel={product.name}
      />
    </AppLayout>
  );
}
