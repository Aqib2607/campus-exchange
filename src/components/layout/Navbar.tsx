import { useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { GraduationCap, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { useAuth } from "@/contexts/AuthContext";

const publicLinks = [
  { to: "/products", label: "Marketplace" },
  { to: "/favorites", label: "Favorites" },
  { to: "/dashboard/messages", label: "Messages" },
] as const;

export function Navbar() {
  const { user, isAdmin, signOut } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleSignOut = () => {
    signOut();
    setOpen(false);
    navigate({ to: "/login" });
  };

  const navItems = (
    <>
      {publicLinks.map((l) => (
        <Link
          key={l.to}
          to={l.to}
          onClick={() => setOpen(false)}
          className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
          activeProps={{ className: "text-primary" }}
        >
          {l.label}
        </Link>
      ))}
      <Link
        to={isAdmin ? "/admin" : "/dashboard"}
        onClick={() => setOpen(false)}
        className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
        activeProps={{ className: "text-primary" }}
      >
        {isAdmin ? "Admin" : "Dashboard"}
      </Link>
    </>
  );

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-card/95 backdrop-blur">
      <div className="container-page flex h-16 items-center justify-between gap-4">
        <Link to="/" className="flex items-center gap-2 font-bold text-foreground">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <GraduationCap className="h-5 w-5" aria-hidden="true" />
          </span>
          Campus Exchange
        </Link>

        <nav aria-label="Main" className="hidden items-center gap-1 md:flex">
          {navItems}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          {user ? (
            <>
              <Link
                to="/dashboard/profile"
                className="text-sm font-medium text-muted-foreground hover:text-foreground"
              >
                {user.name}
              </Link>
              <Button variant="outline" size="sm" onClick={handleSignOut}>
                Logout
              </Button>
            </>
          ) : (
            <>
              <Button asChild variant="ghost" size="sm">
                <Link to="/login">Login</Link>
              </Button>
              <Button asChild size="sm">
                <Link to="/register">Register</Link>
              </Button>
            </>
          )}
        </div>

        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="outline" size="icon" aria-label="Open navigation menu">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-72">
            <SheetTitle className="mb-4">Menu</SheetTitle>
            <nav aria-label="Mobile" className="flex flex-col gap-1">
              {navItems}
            </nav>
            <div className="mt-6 flex flex-col gap-2">
              {user ? (
                <Button variant="outline" onClick={handleSignOut}>
                  Logout
                </Button>
              ) : (
                <>
                  <Button asChild variant="outline" onClick={() => setOpen(false)}>
                    <Link to="/login">Login</Link>
                  </Button>
                  <Button asChild onClick={() => setOpen(false)}>
                    <Link to="/register">Register</Link>
                  </Button>
                </>
              )}
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
