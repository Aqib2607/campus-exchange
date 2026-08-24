import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { AuthLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { UNIVERSITY_DOMAIN } from "@/lib/mock-data";
import { Loader2, CheckCircle } from "lucide-react";

export const Route = createFileRoute("/forgot-password")({
  component: ForgotPasswordPage,
});

function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const validate = () => {
    if (!email.trim()) {
      setEmailError("University email is required.");
      return false;
    }
    if (!email.toLowerCase().endsWith(`@${UNIVERSITY_DOMAIN}`)) {
      setEmailError(`Email must end with @${UNIVERSITY_DOMAIN}`);
      return false;
    }
    setEmailError("");
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setStatus("loading");
    await new Promise((r) => setTimeout(r, 800));
    setStatus("success");
  };

  if (status === "success") {
    return (
      <AuthLayout title="Check your email" description="Password reset instructions sent">
        <div className="space-y-4 text-center">
          <div className="flex justify-center">
            <CheckCircle className="h-12 w-12 text-success" aria-hidden="true" />
          </div>
          <p className="text-sm text-muted-foreground">
            We sent a password reset link to{" "}
            <span className="font-medium text-foreground">{email}</span>.
          </p>
          <p className="text-sm text-muted-foreground">
            Check your inbox and follow the instructions.
          </p>
          <Button asChild variant="outline" className="w-full">
            <Link to="/login">Back to sign in</Link>
          </Button>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      title="Forgot password"
      description="Enter your university email to receive a reset link"
    >
      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        {status === "error" && (
          <Alert variant="destructive">
            <AlertDescription>Something went wrong. Please try again.</AlertDescription>
          </Alert>
        )}

        <div className="space-y-2">
          <Label htmlFor="email">University email</Label>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            placeholder={`you@${UNIVERSITY_DOMAIN}`}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            aria-invalid={!!emailError}
            aria-describedby={emailError ? "fp-email-error" : undefined}
            disabled={status === "loading"}
          />
          {emailError && (
            <p id="fp-email-error" className="text-xs text-destructive">{emailError}</p>
          )}
        </div>

        <Button type="submit" className="w-full" disabled={status === "loading"}>
          {status === "loading" ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
              Sending reset link…
            </>
          ) : (
            "Send reset link"
          )}
        </Button>

        <p className="text-center text-sm text-muted-foreground">
          Remember your password?{" "}
          <Link to="/login" className="font-medium text-primary hover:underline">
            Sign in
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
}
