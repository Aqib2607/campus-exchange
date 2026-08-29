import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { EmptyState } from "@/components/common/states";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { formatDate, formatTime } from "@/lib/utils";
import { useEffect, useRef, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/services/api";
import { MessageSquare, Send, ArrowLeft, Loader2 } from "lucide-react";
import type { Conversation, Message } from "@/types";
import { cn } from "@/lib/utils";
import { studentLinks } from "@/config/nav";

export const Route = createFileRoute("/dashboard/messages")({
  component: DashboardMessagesPage,
});

function DashboardMessagesPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [selectedConvId, setSelectedConvId] = useState<number | null>(null);
  const [input, setInput] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!user) navigate({ to: "/login" });
    else if (user.role === "admin") navigate({ to: "/admin" });
  }, [user, navigate]);

  const { data: myConversations = [], isLoading: isLoadingConversations } = useQuery({
    queryKey: ['conversations', user?.id],
    queryFn: api.conversations.list,
    enabled: !!user?.id && user?.role !== "admin",
  });

  const { data: messages = [], isLoading: isLoadingMessages } = useQuery({
    queryKey: ['conversations', selectedConvId, 'messages'],
    queryFn: () => api.conversations.messages(selectedConvId!),
    enabled: !!selectedConvId,
    refetchInterval: 5000,
  });

  const sendMessageMutation = useMutation({
    mutationFn: (message: string) => api.conversations.sendMessage(selectedConvId!, { message }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['conversations', selectedConvId, 'messages'] });
      queryClient.invalidateQueries({ queryKey: ['conversations', user?.id] });
    },
  });

  const selectedConv = myConversations.find((c: any) => c.id === selectedConvId);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (!user || user.role === "admin") return null;

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !selectedConv) return;
    sendMessageMutation.mutate(input.trim());
    setInput("");
  };

  const ConversationList = () => (
    <div className="flex h-full flex-col bg-card">
      <div className="border-b border-border p-6">
        <h2 className="font-display text-2xl font-bold uppercase tracking-tight text-foreground">Inbox</h2>
      </div>
      {isLoadingConversations ? (
        <div className="flex flex-1 items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : myConversations.length === 0 ? (
        <div className="flex flex-1 items-center justify-center p-6 text-center text-sm font-medium uppercase tracking-widest text-muted-foreground">
          No conversations
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto divide-y divide-border">
          {myConversations.map((c: any) => {
            const prod = c.product;
            const other = c.userOne?.id === user.id ? c.userTwo : c.userOne;
            const isSelected = selectedConv?.id === c.id;
            return (
              <button
                key={c.id}
                type="button"
                onClick={() => setSelectedConvId(c.id)}
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

    const prod = selectedConv.product;
    const other = selectedConv.userOne?.id === user.id ? selectedConv.userTwo : selectedConv.userOne;

    return (
      <div className="flex h-full flex-col bg-background">
        {/* Thread header */}
        <div className="flex items-center gap-4 border-b border-border bg-card p-6">
          <button
            type="button"
            onClick={() => setSelectedConvId(null)}
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
          {isLoadingMessages ? (
            <div className="flex h-full items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : messages.length === 0 ? (
            <p className="text-center text-xs font-bold uppercase tracking-widest text-muted-foreground">No messages yet. Start the conversation.</p>
          ) : (
            messages.map((m: any) => {
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
            <Button type="submit" disabled={!input.trim() || sendMessageMutation.isPending} className="h-14 rounded-none bg-foreground px-8 font-display text-sm font-bold uppercase tracking-widest text-background transition-medium hover:bg-primary">
              {sendMessageMutation.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Send <Send className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </form>
      </div>
    );
  };

  return (
    <DashboardShell links={studentLinks} heading="Workspace">
      <div className="overflow-hidden rounded-none border-2 border-border bg-card" style={{ height: "calc(100vh - 200px)", minHeight: "500px" }}>
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
