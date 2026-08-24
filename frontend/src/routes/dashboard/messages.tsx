import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { EmptyState } from "@/components/common/states";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import {
  mockConversations,
  mockMessages,
  mockProducts,
  formatDate,
  formatTime,
  getUser,
} from "@/lib/mock-data";
import { useEffect, useRef, useState } from "react";
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Heart,
  MessageSquare,
  User,
  Send,
  ArrowLeft,
} from "lucide-react";
import type { Conversation, Message } from "@/types";
import { cn } from "@/lib/utils";

const studentLinks = [
  { to: "/dashboard", label: "Overview", icon: <LayoutDashboard className="h-4 w-4" /> },
  { to: "/dashboard/listings", label: "My Listings", icon: <Package className="h-4 w-4" /> },
  { to: "/dashboard/requests", label: "Requests", icon: <ShoppingBag className="h-4 w-4" /> },
  { to: "/dashboard/favorites", label: "Favorites", icon: <Heart className="h-4 w-4" /> },
  { to: "/dashboard/messages", label: "Messages", icon: <MessageSquare className="h-4 w-4" /> },
  { to: "/dashboard/profile", label: "Profile", icon: <User className="h-4 w-4" /> },
];

export const Route = createFileRoute("/dashboard/messages")({
  component: DashboardMessagesPage,
});

function DashboardMessagesPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [selectedConv, setSelectedConv] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [nextId, setNextId] = useState(100);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!user) navigate({ to: "/login" });
    else if (user.role === "admin") navigate({ to: "/admin" });
  }, [user, navigate]);

  useEffect(() => {
    if (selectedConv) {
      setMessages(mockMessages.filter((m) => m.conversation_id === selectedConv.id));
    }
  }, [selectedConv]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (!user || user.role === "admin") return null;

  const myConversations = mockConversations.filter((c) => c.participant_ids.includes(user.id));

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !selectedConv) return;
    const newMsg: Message = {
      id: nextId,
      conversation_id: selectedConv.id,
      sender_id: user.id,
      body: input.trim(),
      created_at: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, newMsg]);
    setNextId((n) => n + 1);
    setInput("");
  };

  const ConversationList = () => (
    <div className="flex h-full flex-col bg-card">
      <div className="border-b border-border p-6">
        <h2 className="font-display text-2xl font-bold uppercase tracking-tight text-foreground">Inbox</h2>
      </div>
      {myConversations.length === 0 ? (
        <div className="flex flex-1 items-center justify-center p-6 text-center text-sm font-medium uppercase tracking-widest text-muted-foreground">
          No conversations
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto divide-y divide-border">
          {myConversations.map((c) => {
            const prod = mockProducts.find((p) => p.id === c.product_id);
            const otherId = c.participant_ids.find((id) => id !== user.id);
            const other = otherId ? getUser(otherId) : null;
            const isSelected = selectedConv?.id === c.id;
            return (
              <button
                key={c.id}
                type="button"
                onClick={() => setSelectedConv(c)}
                className={cn(
                  "flex w-full items-center gap-4 px-6 py-5 text-left transition-colors hover:bg-muted/50",
                  isSelected && "bg-muted/80 border-l-4 border-l-primary",
                  !isSelected && "border-l-4 border-l-transparent"
                )}
                aria-pressed={isSelected}
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-none bg-foreground text-lg font-bold text-background uppercase">
                  {other?.name?.[0] ?? "?"}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <p className="truncate font-display text-lg font-bold uppercase tracking-tight text-foreground">{other?.name ?? "Unknown"}</p>
                    <span className="shrink-0 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                      {formatDate(c.last_message_at)}
                    </span>
                  </div>
                  <p className="truncate text-xs font-medium text-muted-foreground">{prod?.name ?? "Unknown product"}</p>
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );

  const MessageThread = () => {
    if (!selectedConv) {
      return (
        <div className="flex h-full flex-col items-center justify-center bg-muted/20">
          <MessageSquare className="mb-4 h-12 w-12 text-muted-foreground/30" />
          <h2 className="font-display text-xl font-bold uppercase tracking-tight text-muted-foreground">Select a conversation</h2>
        </div>
      );
    }

    const prod = mockProducts.find((p) => p.id === selectedConv.product_id);
    const otherId = selectedConv.participant_ids.find((id) => id !== user.id);
    const other = otherId ? getUser(otherId) : null;

    return (
      <div className="flex h-full flex-col bg-background">
        {/* Thread header */}
        <div className="flex items-center gap-4 border-b border-border bg-card p-6">
          <button
            type="button"
            onClick={() => setSelectedConv(null)}
            className="md:hidden"
            aria-label="Back to conversations"
          >
            <ArrowLeft className="h-5 w-5 text-muted-foreground" />
          </button>
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-none bg-foreground text-lg font-bold text-background uppercase">
            {other?.name?.[0] ?? "?"}
          </div>
          <div>
            <p className="font-display text-lg font-bold uppercase tracking-tight text-foreground">{other?.name ?? "Unknown"}</p>
            <p className="text-xs font-medium text-muted-foreground">{prod?.name ?? "Unknown product"}</p>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto space-y-6 p-6">
          {messages.length === 0 ? (
            <p className="text-center text-xs font-bold uppercase tracking-widest text-muted-foreground">No messages yet. Start the conversation.</p>
          ) : (
            messages.map((m) => {
              const isMe = m.sender_id === user.id;
              return (
                <div key={m.id} className={cn("flex", isMe ? "justify-end" : "justify-start")}>
                  <div
                    className={cn(
                      "max-w-md rounded-none px-6 py-4 text-sm",
                      isMe
                        ? "bg-foreground text-background"
                        : "bg-muted text-foreground",
                    )}
                  >
                    <p className="leading-relaxed">{m.body}</p>
                    <p
                      className={cn(
                        "mt-2 text-right text-[10px] font-bold uppercase tracking-widest",
                        isMe ? "text-background/50" : "text-muted-foreground",
                      )}
                    >
                      {formatTime(m.created_at)}
                    </p>
                  </div>
                </div>
              );
            })
          )}
          <div ref={bottomRef} />
        </div>

        {/* Message input */}
        <form onSubmit={handleSend} className="border-t border-border bg-card p-4">
          <div className="flex items-center gap-4">
            <Label htmlFor="message-input" className="sr-only">
              Message
            </Label>
            <Input
              id="message-input"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message…"
              autoComplete="off"
              className="h-14 flex-1 rounded-none border-border bg-background px-4 font-medium focus-visible:ring-1 focus-visible:ring-foreground"
            />
            <Button type="submit" disabled={!input.trim()} className="h-14 rounded-none bg-foreground px-8 font-display text-sm font-bold uppercase tracking-widest text-background transition-medium hover:bg-primary">
              Send <Send className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </form>
      </div>
    );
  };

  return (
    <DashboardShell links={studentLinks} heading="Workspace">
      <div className="overflow-hidden rounded-none border border-border bg-card" style={{ height: "calc(100vh - 200px)", minHeight: "500px" }}>
        {/* Two-panel layout for desktop, single panel for mobile */}
        <div className="flex h-full">
          {/* Conversation list — always visible on desktop, hidden on mobile when conversation selected */}
          <div
            className={cn(
              "h-full w-full border-r border-border md:w-80 md:shrink-0",
              selectedConv ? "hidden md:block" : "block",
            )}
          >
            <ConversationList />
          </div>

          {/* Message thread — takes full width on mobile when conversation selected */}
          <div className={cn("h-full flex-1 bg-muted/10", !selectedConv && "hidden md:flex items-center justify-center")}>
            <MessageThread />
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}
