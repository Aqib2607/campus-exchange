import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect } from "react";
import {
  mockProducts,
  mockRequests,
  mockConversations,
  formatDate,
  formatPrice,
  getUser,
} from "@/lib/mock-data";
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Heart,
  MessageSquare,
  User,
  ArrowRight,
} from "lucide-react";

const studentLinks = [
  { to: "/dashboard", label: "Overview", icon: <LayoutDashboard className="h-4 w-4" /> },
  { to: "/dashboard/listings", label: "My Listings", icon: <Package className="h-4 w-4" /> },
  { to: "/dashboard/requests", label: "Requests", icon: <ShoppingBag className="h-4 w-4" /> },
  { to: "/dashboard/favorites", label: "Favorites", icon: <Heart className="h-4 w-4" /> },
  { to: "/dashboard/messages", label: "Messages", icon: <MessageSquare className="h-4 w-4" /> },
  { to: "/dashboard/profile", label: "Profile", icon: <User className="h-4 w-4" /> },
];

export { studentLinks };

export const Route = createFileRoute("/dashboard/")({
  component: DashboardPage,
});

function DashboardPage() {
  const { user, favorites } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) navigate({ to: "/login" });
    else if (user.role === "admin") navigate({ to: "/admin" });
  }, [user, navigate]);

  if (!user || user.role === "admin") return null;

  const myListings = mockProducts.filter((p) => p.user_id === user.id);
  const sentRequests = mockRequests.filter((r) => r.buyer_id === user.id);
  const receivedRequests = mockRequests.filter((r) => r.seller_id === user.id);
  const pendingReceived = receivedRequests.filter((r) => r.status === "pending");
  const myConversations = mockConversations.filter((c) => c.participant_ids.includes(user.id));

  const stats = [
    { label: "My Listings", value: myListings.length, href: "/dashboard/listings" },
    { label: "Pending Requests", value: pendingReceived.length, href: "/dashboard/requests" },
    {
      label: "Accepted",
      value: sentRequests.filter((r) => r.status === "accepted").length,
      href: "/dashboard/requests",
    },
    { label: "Saved Items", value: favorites.length, href: "/dashboard/favorites" },
  ];

  return (
    <DashboardShell links={studentLinks} heading="Workspace">
      <div className="space-y-12">
        <div className="border-b border-border pb-8">
          <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Student Workspace</p>
          <h1 className="font-display text-5xl font-bold uppercase tracking-tight text-foreground md:text-7xl">
            Welcome, <br className="hidden md:block" /> {user.name.split(" ")[0]}
          </h1>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-px bg-border sm:grid-cols-4">
          {stats.map((s) => (
            <Link
              key={s.label}
              to={s.href as never}
              className="group flex flex-col justify-between bg-card p-6 sm:p-8 transition-colors hover:bg-muted/30"
            >
              <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{s.label}</p>
              <p className="mt-4 font-display text-6xl font-bold text-foreground transition-transform duration-300 group-hover:scale-110 sm:text-7xl group-hover:text-primary origin-left">{s.value}</p>
            </Link>
          ))}
        </div>

        <div className="grid gap-12 lg:grid-cols-2">
          {/* Recent Listings */}
          {myListings.length > 0 && (
            <section>
              <div className="mb-6 flex items-end justify-between border-b border-border pb-4">
                <h2 className="font-display text-2xl font-bold uppercase tracking-tight text-foreground">Recent Listings</h2>
                <Link to="/dashboard/listings" className="group flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-muted-foreground hover:text-foreground">
                  All <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
              <div className="flex flex-col gap-4">
                {myListings.slice(0, 3).map((p) => (
                  <div key={p.id} className="group flex items-center justify-between border border-border bg-card p-4 transition-colors hover:border-foreground">
                    <div className="flex flex-col">
                      <Link
                        to="/products/$id"
                        params={{ id: String(p.id) }}
                        className="font-display text-lg font-bold uppercase tracking-tight text-foreground group-hover:text-primary line-clamp-1"
                      >
                        {p.name}
                      </Link>
                      <span className="mt-1 text-xs font-medium text-muted-foreground">{formatPrice(p.price)}</span>
                    </div>
                    <span
                      className={`shrink-0 border px-3 py-1 text-[10px] font-bold uppercase tracking-widest ${
                        p.status === "available"
                          ? "border-success/30 text-success"
                          : "border-muted text-muted-foreground"
                      }`}
                    >
                      {p.status}
                    </span>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Recent Requests */}
          {sentRequests.length > 0 && (
            <section>
              <div className="mb-6 flex items-end justify-between border-b border-border pb-4">
                <h2 className="font-display text-2xl font-bold uppercase tracking-tight text-foreground">Recent Requests</h2>
                <Link to="/dashboard/requests" className="group flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-muted-foreground hover:text-foreground">
                  All <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
              <div className="flex flex-col gap-4">
                {sentRequests.slice(0, 3).map((r) => {
                  const prod = mockProducts.find((p) => p.id === r.product_id);
                  return (
                    <div key={r.id} className="group flex items-center justify-between border border-border bg-card p-4 transition-colors hover:border-foreground">
                      <div className="flex flex-col">
                        {prod ? (
                          <Link
                            to="/products/$id"
                            params={{ id: String(prod.id) }}
                            className="font-display text-lg font-bold uppercase tracking-tight text-foreground group-hover:text-primary line-clamp-1"
                          >
                            {prod.name}
                          </Link>
                        ) : (
                          <span className="font-display text-lg font-bold uppercase tracking-tight text-muted-foreground">Unknown</span>
                        )}
                        <span className="mt-1 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                          {formatDate(r.created_at)}
                        </span>
                      </div>
                      <span
                        className={`shrink-0 border px-3 py-1 text-[10px] font-bold uppercase tracking-widest ${
                          r.status === "accepted"
                            ? "border-success/30 text-success"
                            : r.status === "rejected"
                              ? "border-destructive/30 text-destructive"
                              : "border-warning/30 text-warning-foreground"
                        }`}
                      >
                        {r.status}
                      </span>
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          {/* Recent Messages */}
          {myConversations.length > 0 && (
            <section className="lg:col-span-2">
              <div className="mb-6 flex items-end justify-between border-b border-border pb-4">
                <h2 className="font-display text-2xl font-bold uppercase tracking-tight text-foreground">Active Conversations</h2>
                <Link to="/dashboard/messages" className="group flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-muted-foreground hover:text-foreground">
                  All <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {myConversations.slice(0, 3).map((c) => {
                  const prod = mockProducts.find((p) => p.id === c.product_id);
                  const otherId = c.participant_ids.find((id) => id !== user.id);
                  const other = otherId ? getUser(otherId) : null;
                  return (
                    <Link
                      key={c.id}
                      to="/dashboard/messages"
                      className="group flex flex-col justify-between border border-border bg-card p-6 transition-colors hover:border-foreground hover:bg-muted/10"
                    >
                      <div className="flex items-center gap-4 mb-6">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-foreground text-background font-display text-xl font-bold uppercase transition-transform group-hover:scale-110">
                          {other?.name?.[0] ?? "?"}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="truncate font-display text-lg font-bold uppercase tracking-tight text-foreground">
                            {other?.name ?? "Unknown"}
                          </p>
                          <p className="truncate text-xs font-medium text-muted-foreground line-clamp-1">
                            {prod?.name ?? "Unknown product"}
                          </p>
                        </div>
                      </div>
                      <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                        {formatDate(c.last_message_at)}
                      </span>
                    </Link>
                  );
                })}
              </div>
            </section>
          )}
        </div>
      </div>
    </DashboardShell>
  );
}
