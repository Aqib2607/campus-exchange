import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { DashboardShell } from "@/components/layout/DashboardShell";

import { useAuth } from "@/contexts/AuthContext";
import { useEffect } from "react";
import { formatDate, formatPrice } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/services/api";
import { ArrowRight, Loader2 } from "lucide-react";
import { studentLinks } from "@/config/nav";

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

  const { data: myListings = [], isLoading: isLoadingListings } = useQuery({
    queryKey: ['myListings', user?.id],
    queryFn: () => api.products.mine(),
    enabled: !!user?.id && user?.role !== "admin",
  });

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

  const { data: myConversations = [], isLoading: isLoadingConversations } = useQuery({
    queryKey: ['conversations', user?.id],
    queryFn: api.conversations.list,
    enabled: !!user?.id && user?.role !== "admin",
  });

  if (!user || user.role === "admin") return null;

  const pendingReceived = receivedRequests.filter((r: any) => r.status === "pending");

  const isLoading = isLoadingListings || isLoadingSent || isLoadingReceived || isLoadingConversations;

  const stats = [
    { label: "My Listings", value: myListings.length, href: "/dashboard/listings" },
    { label: "Pending Requests", value: pendingReceived.length, href: "/dashboard/requests" },
    {
      label: "Accepted",
      value: sentRequests.filter((r: any) => r.status === "accepted").length,
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
              <p className="mt-4 font-display text-6xl font-bold text-foreground transition-transform duration-300 group-hover:scale-110 sm:text-7xl group-hover:text-primary origin-left">
                {isLoading ? <Loader2 className="h-12 w-12 animate-spin mt-4" /> : s.value}
              </p>
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
                {isLoadingListings ? (
                  <div className="flex justify-center p-4"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>
                ) : myListings.slice(0, 3).map((p: any) => (
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
                {isLoadingSent ? (
                  <div className="flex justify-center p-4"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>
                ) : sentRequests.slice(0, 3).map((r: any) => {
                  const prod = r.product;
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
                {isLoadingConversations ? (
                  <div className="col-span-full flex justify-center p-4"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>
                ) : myConversations.slice(0, 3).map((c: any) => {
                  const prod = c.product;
                  const other = c.userOne?.id === user.id ? c.userTwo : c.userOne;
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
