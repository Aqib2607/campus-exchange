import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, CheckCircle } from "lucide-react";
import type { ReportReason, ReportTargetType } from "@/types";

const REASONS: ReportReason[] = [
  "Spam",
  "Inappropriate Content",
  "Misleading Listing",
  "Suspicious User",
  "Other",
];

interface ReportModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  targetType: ReportTargetType;
  targetLabel: string;
}

export function ReportModal({ open, onOpenChange, targetType, targetLabel }: ReportModalProps) {
  const [reason, setReason] = useState<string>("");
  const [description, setDescription] = useState("");
  const [errors, setErrors] = useState<{ reason?: string; description?: string }>({});
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const reset = () => {
    setReason("");
    setDescription("");
    setErrors({});
    setStatus("idle");
  };

  const handleClose = () => {
    onOpenChange(false);
    setTimeout(reset, 300);
  };

  const validate = () => {
    const e: typeof errors = {};
    if (!reason) e.reason = "Please select a reason.";
    if (!description.trim()) e.description = "Please provide a brief description.";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setStatus("loading");
    await new Promise((r) => setTimeout(r, 700));
    setStatus("success");
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        {status === "success" ? (
          <>
            <DialogHeader>
              <DialogTitle>Report submitted</DialogTitle>
              <DialogDescription>Thank you for helping keep Campus Exchange safe.</DialogDescription>
            </DialogHeader>
            <div className="flex flex-col items-center gap-3 py-4 text-center">
              <CheckCircle className="h-10 w-10 text-success" aria-hidden="true" />
              <p className="text-sm text-muted-foreground">
                Our admin team will review your report and take appropriate action.
              </p>
            </div>
            <DialogFooter>
              <Button onClick={handleClose} className="w-full">Close</Button>
            </DialogFooter>
          </>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>Report {targetType === "product" ? "listing" : "user"}</DialogTitle>
              <DialogDescription>
                Reporting: <span className="font-medium text-foreground">{targetLabel}</span>
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit} noValidate className="space-y-4">
              {status === "error" && (
                <Alert variant="destructive">
                  <AlertDescription>Something went wrong. Please try again.</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="report-reason">Reason</Label>
                <Select value={reason} onValueChange={setReason}>
                  <SelectTrigger
                    id="report-reason"
                    aria-invalid={!!errors.reason}
                    aria-describedby={errors.reason ? "reason-error" : undefined}
                  >
                    <SelectValue placeholder="Select a reason" />
                  </SelectTrigger>
                  <SelectContent>
                    {REASONS.map((r) => (
                      <SelectItem key={r} value={r}>{r}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.reason && (
                  <p id="reason-error" className="text-xs text-destructive">{errors.reason}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="report-description">Description</Label>
                <Textarea
                  id="report-description"
                  rows={4}
                  placeholder="Briefly describe the issue…"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  aria-invalid={!!errors.description}
                  aria-describedby={errors.description ? "desc-error" : undefined}
                />
                {errors.description && (
                  <p id="desc-error" className="text-xs text-destructive">{errors.description}</p>
                )}
              </div>

              <DialogFooter className="gap-2 sm:gap-0">
                <Button type="button" variant="outline" onClick={handleClose} disabled={status === "loading"}>
                  Cancel
                </Button>
                <Button type="submit" variant="destructive" disabled={status === "loading"}>
                  {status === "loading" ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
                      Submitting…
                    </>
                  ) : (
                    "Submit report"
                  )}
                </Button>
              </DialogFooter>
            </form>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
