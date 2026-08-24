import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { EmptyState } from "@/components/common/states";
import { StatusBadge, toneForRequestStatus } from "@/components/common/StatusBadge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import {
  mockProducts,
  mockRequests,
  formatDate,
  getUser,
} from "@/lib/mock-data";
import { useEffect, useState } from "react";
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Heart,
  MessageSquare,
  User,
  Check,
  X,
} from "lucide-react";
import type { PurchaseRequest } from "@/types";

const studentLinks = [
  { to: "/dashboard", label: "Overview", icon: <LayoutDashboard className="h-4 w-4" /> },
  { to: "/dashboard/listings", label: "My Listings", icon: <Package className="h-4 w-4" /> },
  { to: "/dashboard/requests", label: "Requests", icon: <ShoppingBag className="h-4 w-4" /> },
  { to: "/dashboard/favorites", label: "Favorites", icon: <Heart className="h-4 w-4" /> },
  { to: "/dashboard/messages", label: "Messages", icon: <MessageSquare className="h-4 w-4" /> },
  { to: "/dashboard/profile", label: "Profile", icon: <User className="h-4 w-4" /> },
];

export const Route = createFileRoute("/dashboard/requests")({
  component: DashboardRequestsPage,
});

function DashboardRequestsPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  // Local state to simulate accept/reject mutations
  const [statuses, setStatuses] = useState<Record<number, string>>({});

  useEffect(() => {
    if (!user) navigate({ to: "/login" });
    else if (user.role === "admin") navigate({ to: "/admin" });
  }, [user, navigate]);

  if (!user || user.role === "admin") return null;

  const sentRequests = mockRequests.filter((r) => r.buyer_id === user.id);
  const receivedRequests = mockRequests.filter((r) => r.seller_id === user.id);

  const getStatus = (r: PurchaseRequest) => statuses[r.id] ?? r.status;

  const handleAccept = (r: PurchaseRequest) => {
    setStatuses((prev) => ({ ...prev, [r.id]: "accepted" }));
  };
  const handleReject = (r: PurchaseRequest) => {
    setStatuses((prev) => ({ ...prev, [r.id]: "rejected" }));
  };

  const RequestRow = ({ r, showActions }: { r: PurchaseRequest; showActions: boolean }) => {
    const prod = mockProducts.find((p) => p.id === r.product_id);
    const buyer = getUser(r.buyer_id);
    const seller = getUser(r.seller_id);
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
          <h1 className="text-xl font-bold text-foreground">Requests</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage purchase requests you have sent and received.
          </p>
        </div>

        <Tabs defaultValue="received">
          <TabsList>
            <TabsTrigger value="received">
              Received
              {receivedRequests.filter((r) => getStatus(r) === "pending").length > 0 && (
                <span className="ml-2 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                  {receivedRequests.filter((r) => getStatus(r) === "pending").length}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger value="sent">Sent</TabsTrigger>
          </TabsList>

          <TabsContent value="received" className="mt-4">
            {receivedRequests.length === 0 ? (
              <EmptyState
                title="No received requests"
                description="When buyers request your products, they will appear here."
                icon={<ShoppingBag className="h-8 w-8" />}
              />
            ) : (
              <div className="overflow-hidden rounded-xl border border-border bg-card">
                <div className="divide-y divide-border">
                  {receivedRequests.map((r) => (
                    <RequestRow key={r.id} r={r} showActions={true} />
                  ))}
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="sent" className="mt-4">
            {sentRequests.length === 0 ? (
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
              <div className="overflow-hidden rounded-xl border border-border bg-card">
                <div className="divide-y divide-border">
                  {sentRequests.map((r) => (
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
