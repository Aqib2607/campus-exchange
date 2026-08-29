import { useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { AuthLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useAuth } from "@/contexts/AuthContext";
import { UNIVERSITY_DOMAIN } from "@/lib/constants";
import { Loader2 } from "lucide-react";

export const Route = createFileRoute("/register")({
  component: RegisterPage,
});

function RegisterPage() {
  const { registerUser, user } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "" });
  const [errors, setErrors] = useState<Partial<typeof form & { form: string }>>({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  if (user) {
    navigate({ to: "/dashboard" });
    return null;
  }

  const set = (patch: Partial<typeof form>) => setForm((v) => ({ ...v, ...patch }));

  const validate = () => {
    const e: typeof errors = {};
    if (!form.name.trim()) e.name = "Full name is required.";
    if (!form.email.trim()) {
      e.email = "University email is required.";
    } else if (!form.email.toLowerCase().endsWith(`@${UNIVERSITY_DOMAIN}`)) {
      e.email = `Email must end with @${UNIVERSITY_DOMAIN}`;
    }
    if (form.password.length < 8) e.password = "Password must be at least 8 characters.";
    if (form.password !== form.confirm) e.confirm = "Passwords do not match.";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    setErrors({});
    
    try {
      await registerUser({
        name: form.name,
        email: form.email,
        password: form.password,
        password_confirmation: form.confirm
      });
      setSuccess(true);
    } catch (error: any) {
      if (error.response?.data?.errors) {
        const serverErrors = error.response.data.errors;
        setErrors({
          email: serverErrors.email?.[0],
          password: serverErrors.password?.[0],
          form: "Validation failed. Check your inputs.",
        });
      } else {
        setErrors({ form: "An error occurred during registration. Please try again." });
      }
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <AuthLayout title="Check your email" description="One more step to get started">
        <div className="space-y-4 text-sm text-muted-foreground">
          <p>
            We sent a verification link to <span className="font-medium text-foreground">{form.email}</span>.
          </p>
          <p>Click the link in that email to verify your account and access the marketplace.</p>
          <Button asChild className="w-full">
            <Link to="/verify-email">Continue to verification</Link>
          </Button>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      title="Create account"
      description={`Register with your @${UNIVERSITY_DOMAIN} email`}
    >
      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        {errors.form && (
          <Alert variant="destructive">
            <AlertDescription>{errors.form}</AlertDescription>
          </Alert>
        )}

        <div className="space-y-2">
          <Label htmlFor="name">Full name</Label>
          <Input
            id="name"
            type="text"
            autoComplete="name"
            placeholder="Your name"
            value={form.name}
            onChange={(e) => set({ name: e.target.value })}
            aria-invalid={!!errors.name}
            aria-describedby={errors.name ? "name-error" : undefined}
            disabled={loading}
          />
          {errors.name && (
            <p id="name-error" className="text-xs text-destructive">{errors.name}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">University email</Label>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            placeholder={`you@${UNIVERSITY_DOMAIN}`}
            value={form.email}
            onChange={(e) => set({ email: e.target.value })}
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? "reg-email-error" : undefined}
            disabled={loading}
          />
          {errors.email && (
            <p id="reg-email-error" className="text-xs text-destructive">{errors.email}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            autoComplete="new-password"
            placeholder="At least 8 characters"
            value={form.password}
            onChange={(e) => set({ password: e.target.value })}
            aria-invalid={!!errors.password}
            aria-describedby={errors.password ? "reg-password-error" : undefined}
            disabled={loading}
          />
          {errors.password && (
            <p id="reg-password-error" className="text-xs text-destructive">{errors.password}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirm">Confirm password</Label>
          <Input
            id="confirm"
            type="password"
            autoComplete="new-password"
            placeholder="Repeat your password"
            value={form.confirm}
            onChange={(e) => set({ confirm: e.target.value })}
            aria-invalid={!!errors.confirm}
            aria-describedby={errors.confirm ? "confirm-error" : undefined}
            disabled={loading}
          />
          {errors.confirm && (
            <p id="confirm-error" className="text-xs text-destructive">{errors.confirm}</p>
          )}
        </div>

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
              Creating account…
            </>
          ) : (
            "Create account"
          )}
        </Button>

        <p className="text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link to="/login" className="font-medium text-primary hover:underline">
            Sign in
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
}
