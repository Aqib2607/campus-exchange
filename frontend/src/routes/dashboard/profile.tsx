import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useAuth } from "@/contexts/AuthContext";
import { formatDate } from "@/lib/utils";
import { useEffect, useState } from "react";
import { Loader2, CheckCircle } from "lucide-react";
import { ReportModal } from "@/components/marketplace/ReportModal";
import { api } from "@/services/api";
import { studentLinks } from "@/config/nav";

export const Route = createFileRoute("/dashboard/profile")({
  component: DashboardProfilePage,
});

function DashboardProfilePage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ name: "", contact: "" });
  const [saveStatus, setSaveStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [reportOpen, setReportOpen] = useState(false);

  useEffect(() => {
    if (!user) navigate({ to: "/login" });
    else if (user.role === "admin") navigate({ to: "/admin" });
    else setForm({ name: user.name, contact: user.contact_information });
  }, [user, navigate]);

  if (!user || user.role === "admin") return null;

  const set = (patch: Partial<typeof form>) => setForm((v) => ({ ...v, ...patch }));

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaveStatus("loading");
    try {
      await api.auth.updateProfile(form);
      setSaveStatus("success");
      setEditing(false);
      setTimeout(() => setSaveStatus("idle"), 3000);
    } catch {
      setSaveStatus("error"); // Assuming error handling exists or will show up
    }
  };

  return (
    <DashboardShell links={studentLinks} heading="Student Dashboard">
      <div className="max-w-lg space-y-6">
        <div>
          <h1 className="font-display text-4xl font-bold uppercase tracking-widest text-foreground">Profile</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            View and update your account information.
          </p>
        </div>

        {saveStatus === "success" && (
          <Alert className="border-success/40 bg-success/10">
            <CheckCircle className="h-4 w-4 text-success" aria-hidden="true" />
            <AlertDescription className="text-success">Profile updated successfully.</AlertDescription>
          </Alert>
        )}

        <div className="overflow-hidden rounded-none border-2 border-border bg-card">
          {/* Avatar area */}
          <div className="flex items-center gap-4 border-b border-border bg-muted/30 p-6">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-none bg-primary font-display text-3xl font-bold uppercase text-primary-foreground">
              {user.name[0]}
            </div>
            <div>
              <p className="font-semibold text-foreground">{user.name}</p>
              <p className="text-sm text-muted-foreground">{user.email}</p>
              <p className="mt-1 text-xs text-muted-foreground">
                Member since {formatDate(user.created_at)}
              </p>
            </div>
          </div>

          <div className="p-6">
            {editing ? (
              <form onSubmit={handleSave} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="profile-name">Full name</Label>
                  <Input
                    id="profile-name"
                    value={form.name}
                    onChange={(e) => set({ name: e.target.value })}
                    disabled={saveStatus === "loading"}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="profile-contact">Contact information</Label>
                  <Input
                    id="profile-contact"
                    value={form.contact}
                    onChange={(e) => set({ contact: e.target.value })}
                    placeholder="Phone number or email"
                    disabled={saveStatus === "loading"}
                  />
                </div>
                <div className="flex gap-2">
                  <Button type="submit" disabled={saveStatus === "loading"}>
                    {saveStatus === "loading" ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
                        Saving…
                      </>
                    ) : (
                      "Save changes"
                    )}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setEditing(false);
                      setForm({ name: user.name, contact: user.contact_information });
                    }}
                    disabled={saveStatus === "loading"}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            ) : (
              <div className="space-y-4">
                <div className="space-y-1">
                  <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    Full name
                  </p>
                  <p className="text-sm text-foreground">{user.name}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    Email
                  </p>
                  <p className="text-sm text-foreground">{user.email}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    Contact information
                  </p>
                  <p className="text-sm text-foreground">
                    {user.contact_information || "Not provided"}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    Email verified
                  </p>
                  <p className="text-sm text-foreground">
                    {user.email_verified_at
                      ? `Verified on ${formatDate(user.email_verified_at)}`
                      : "Not verified"}
                  </p>
                </div>
                <div className="flex gap-2 pt-2">
                  <Button onClick={() => setEditing(true)}>Edit profile</Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <ReportModal
        open={reportOpen}
        onOpenChange={setReportOpen}
        targetType="user"
        targetId={user.id}
        targetLabel={user.name}
      />
    </DashboardShell>
  );
}
