import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { EmptyState } from "@/components/common/states";
import { StatusBadge, toneForRequestStatus } from "@/components/common/StatusBadge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import { formatDate } from "@/lib/utils";
import { useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/services/api";
import { ShoppingBag, Check, X, Loader2 } from "lucide-react";
import type { PurchaseRequest } from "@/types";
import { studentLinks } from "@/config/nav";

export const Route = createFileRoute("/dashboard/requests")({
  component: DashboardRequestsPage,
});

function DashboardRequestsPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!user) navigate({ to: "/login" });
    else if (user.role === "admin") navigate({ to: "/admin" });
  }, [user, navigate]);

  const { data: sentRequests = [], isLoading: isLoadingSent } = useQuery({
    queryKey: ['requests', 'sent', user?.id],
    queryFn: api.requests.sent,
    enabled: !!user?.id && user?.role !== "admin",
  });

  const { data: receivedRequests = [], isLoading: isLoadingReceived } = useQuery({
    queryKey: ['requests', 'received', user?.id],
    queryFn: api.requests.received,
    enabled: !!user?.id && user?.role !== "admin",
  });

  const acceptMutation = useMutation({
    mutationFn: api.requests.accept,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['requests', 'received', user?.id] });
      queryClient.invalidateQueries({ queryKey: ['myListings', user?.id] });
    },
  });

  const rejectMutation = useMutation({
    mutationFn: api.requests.reject,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['requests', 'received', user?.id] });
    },
  });

  if (!user || user.role === "admin") return null;

  const getStatus = (r: PurchaseRequest) => r.status;

  const handleAccept = (r: PurchaseRequest) => {
    acceptMutation.mutate(r.id);
  };
  const handleReject = (r: PurchaseRequest) => {
    rejectMutation.mutate(r.id);
  };

  const RequestRow = ({ r, showActions }: { r: any; showActions: boolean }) => {
    const prod = r.product;
    const buyer = r.buyer;
    const seller = r.seller;
    const status = getStatus(r);
    return (
      <div className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <p className="font-medium text-foreground">
            {prod ? (
              <Link to="/products/$id" params={{ id: String(prod.id) }} className="hover:text-primary">
                {prod.name}
              </Link>
            ) : (
              "Unknown product"
            )}
          </p>
          <p className="text-xs text-muted-foreground">
            {showActions ? `Buyer: ${buyer?.name ?? "Unknown"}` : `Seller: ${seller?.name ?? "Unknown"}`}
            {" · "}
            {formatDate(r.created_at)}
          </p>
          {r.message && (
            <p className="mt-1 text-xs italic text-muted-foreground">&ldquo;{r.message}&rdquo;</p>
          )}
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <StatusBadge tone={toneForRequestStatus(status)}>{status}</StatusBadge>
          {showActions && status === "pending" && (
            <>
              <Button
                size="sm"
                onClick={() => handleAccept(r)}
                className="bg-success text-success-foreground hover:bg-success/90"
                aria-label="Accept request"
              >
                <Check className="h-4 w-4" />
                Accept
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleReject(r)}
                className="border-destructive/40 text-destructive hover:bg-destructive/10"
                aria-label="Reject request"
              >
                <X className="h-4 w-4" />
                Reject
              </Button>
            </>
          )}
        </div>
      </div>
    );
  };

  return (
    <DashboardShell links={studentLinks} heading="Student Dashboard">
      <div className="space-y-6">
        <div>
          <h1 className="font-display text-4xl font-bold uppercase tracking-widest text-foreground">Requests</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage purchase requests you have sent and received.
          </p>
        </div>

        <Tabs defaultValue="received">
          <TabsList>
            <TabsTrigger value="received">
              Received
              {receivedRequests.filter((r: any) => getStatus(r) === "pending").length > 0 && (
                <span className="ml-2 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                  {receivedRequests.filter((r: any) => getStatus(r) === "pending").length}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger value="sent">Sent</TabsTrigger>
          </TabsList>

          <TabsContent value="received" className="mt-4">
            {isLoadingReceived ? (
              <div className="flex h-64 items-center justify-center border border-border bg-card">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : receivedRequests.length === 0 ? (
              <EmptyState
                title="No received requests"
                description="When buyers request your products, they will appear here."
                icon={<ShoppingBag className="h-8 w-8" />}
              />
            ) : (
              <div className="overflow-hidden rounded-none border-2 border-border bg-card">
                <div className="divide-y divide-border">
                  {receivedRequests.map((r: any) => (
                    <RequestRow key={r.id} r={r} showActions={true} />
                  ))}
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="sent" className="mt-4">
            {isLoadingSent ? (
              <div className="flex h-64 items-center justify-center border border-border bg-card">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : sentRequests.length === 0 ? (
              <EmptyState
                title="No sent requests"
                description="You haven't requested any products yet. Browse the marketplace to find something you like."
                icon={<ShoppingBag className="h-8 w-8" />}
                action={
                  <Button asChild>
                    <Link to="/products">Browse marketplace</Link>
                  </Button>
                }
              />
            ) : (
              <div className="overflow-hidden rounded-none border-2 border-border bg-card">
                <div className="divide-y divide-border">
                  {sentRequests.map((r: PurchaseRequest) => (
                    <RequestRow key={r.id} r={r} showActions={false} />
                  ))}
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </DashboardShell>
  );
}
