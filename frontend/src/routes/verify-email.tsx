import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { AuthLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle, Mail, Loader2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

export const Route = createFileRoute("/verify-email")({
  component: VerifyEmailPage,
});

function VerifyEmailPage() {
  const { user } = useAuth();
  const [resendState, setResendState] = useState<"idle" | "loading" | "sent" | "error">("idle");

  const handleResend = async () => {
    setResendState("loading");
    await new Promise((r) => setTimeout(r, 700));
    setResendState("sent");
  };

  // If user's email is already verified in mock data
  if (user?.email_verified_at) {
    return (
      <AuthLayout title="Email verified" description="Your account is ready">
        <div className="space-y-4 text-center">
          <div className="flex justify-center">
            <CheckCircle className="h-12 w-12 text-success" aria-hidden="true" />
          </div>
          <p className="text-sm text-muted-foreground">
            Your university email has been verified. You can now access the full marketplace.
          </p>
          <Button asChild className="w-full">
            <Link to="/products">Go to marketplace</Link>
          </Button>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      title="Verify your email"
      description="We sent a verification link to your university email"
    >
      <div className="space-y-5">
        <div className="flex justify-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
            <Mail className="h-8 w-8 text-primary" aria-hidden="true" />
          </div>
        </div>

        <p className="text-center text-sm text-muted-foreground">
          {user?.email ? (
            <>
              We sent a verification link to{" "}
              <span className="font-medium text-foreground">{user.email}</span>.
            </>
          ) : (
            "Check your university email for a verification link."
          )}
        </p>

        <p className="text-center text-sm text-muted-foreground">
          Click the link in the email to activate your account.
        </p>

        {resendState === "sent" && (
          <Alert className="border-success/40 bg-success/10">
            <AlertDescription className="text-success">
              Verification email resent. Check your inbox.
            </AlertDescription>
          </Alert>
        )}

        {resendState === "error" && (
          <Alert variant="destructive">
            <AlertDescription>Failed to resend. Please try again.</AlertDescription>
          </Alert>
        )}

        <Button
          variant="outline"
          className="w-full"
          onClick={handleResend}
          disabled={resendState === "loading" || resendState === "sent"}
        >
          {resendState === "loading" ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
              Sending…
            </>
          ) : resendState === "sent" ? (
            "Email sent"
          ) : (
            "Resend verification email"
          )}
        </Button>

        <p className="text-center text-sm text-muted-foreground">
          Already verified?{" "}
          <Link to="/login" className="font-medium text-primary hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
}
