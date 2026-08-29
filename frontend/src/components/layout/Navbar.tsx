import { useState, useEffect } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { useAuth } from "@/contexts/AuthContext";

const publicLinks = [
  { to: "/products", label: "MARKETPLACE" },
  { to: "/favorites", label: "FAVORITES" },
  { to: "/dashboard/messages", label: "MESSAGES" },
] as const;

export function Navbar() {
  const { user, isAdmin, signOut } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSignOut = async () => {
    setOpen(false);
    await signOut();
    navigate({ to: "/" });
  };

  const navItems = (
    <>
      {publicLinks.map((l) => (
        <Link
          key={l.to}
          to={l.to}
          onClick={() => setOpen(false)}
          className="relative px-3 py-2 text-xs font-bold tracking-wider text-muted-foreground transition-fast hover:text-foreground after:absolute after:bottom-0 after:left-1/2 after:h-[2px] after:w-0 after:-translate-x-1/2 after:bg-primary after:transition-all after:duration-300 hover:after:w-full focus-visible:outline-none"
          activeProps={{ className: "text-foreground after:w-full" }}
        >
          {l.label}
        </Link>
      ))}
      <Link
        to={isAdmin ? "/admin" : "/dashboard"}
        onClick={() => setOpen(false)}
        className="relative px-3 py-2 text-xs font-bold tracking-wider text-muted-foreground transition-fast hover:text-foreground after:absolute after:bottom-0 after:left-1/2 after:h-[2px] after:w-0 after:-translate-x-1/2 after:bg-primary after:transition-all after:duration-300 hover:after:w-full focus-visible:outline-none"
        activeProps={{ className: "text-foreground after:w-full" }}
      >
        {isAdmin ? "ADMIN" : "DASHBOARD"}
      </Link>
    </>
  );

  return (
    <header 
      className={`sticky top-0 z-40 transition-slow border-b ${
        scrolled ? "bg-background/90 backdrop-blur-md border-border shadow-sm" : "bg-background border-transparent"
      }`}
    >
      <div className="container-page flex h-20 items-center justify-between gap-4">
        <Link to="/" className="flex items-center gap-3 font-display text-2xl font-bold uppercase tracking-tight text-foreground transition-fast hover:opacity-80">
          <div className="flex h-10 w-10 items-center justify-center bg-foreground text-background">
            <span className="font-display text-xl leading-none">CE</span>
          </div>
          Campus Exchange
        </Link>

        <nav aria-label="Main" className="hidden items-center gap-6 md:flex">
          {navItems}
        </nav>

        <div className="hidden items-center gap-4 md:flex">
          {user ? (
            <>
              <Link
                to="/dashboard/profile"
                className="text-xs font-bold tracking-wider text-muted-foreground transition-fast hover:text-foreground"
              >
                {user.name?.toUpperCase() || 'PROFILE'}
              </Link>
              <Button variant="outline" size="sm" onClick={handleSignOut} className="rounded-none border-2 px-6 font-bold uppercase tracking-widest text-xs transition-medium hover:bg-foreground hover:text-background">
                Logout
              </Button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-xs font-bold tracking-wider text-muted-foreground transition-fast hover:text-foreground">
                LOGIN
              </Link>
              <Button asChild size="sm" className="rounded-none px-6 font-bold uppercase tracking-widest text-xs transition-medium">
                <Link to="/register">Register</Link>
              </Button>
            </>
          )}
        </div>

        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon" aria-label="Open navigation menu" className="rounded-none">
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-full sm:w-[400px] border-l-0 bg-background/95 backdrop-blur-xl">
            <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
            <div className="flex h-full flex-col justify-center gap-8 px-6">
              <nav aria-label="Mobile" className="flex flex-col gap-6 text-center">
                {publicLinks.map((l) => (
                  <Link
                    key={l.to}
                    to={l.to}
                    onClick={() => setOpen(false)}
                    className="font-display text-3xl font-bold uppercase tracking-tight text-muted-foreground transition-medium hover:text-foreground"
                    activeProps={{ className: "text-foreground" }}
                  >
                    {l.label}
                  </Link>
                ))}
                <Link
                  to={isAdmin ? "/admin" : "/dashboard"}
                  onClick={() => setOpen(false)}
                  className="font-display text-3xl font-bold uppercase tracking-tight text-muted-foreground transition-medium hover:text-foreground"
                  activeProps={{ className: "text-foreground" }}
                >
                  {isAdmin ? "ADMIN" : "DASHBOARD"}
                </Link>
              </nav>
              
              <div className="mt-8 flex flex-col gap-4">
                {user ? (
                  <Button variant="outline" onClick={handleSignOut} className="h-14 rounded-none border-2 font-display text-lg uppercase tracking-widest">
                    Logout
                  </Button>
                ) : (
                  <>
                    <Button asChild variant="outline" onClick={() => setOpen(false)} className="h-14 rounded-none border-2 font-display text-lg uppercase tracking-widest">
                      <Link to="/login">Login</Link>
                    </Button>
                    <Button asChild onClick={() => setOpen(false)} className="h-14 rounded-none font-display text-lg uppercase tracking-widest">
                      <Link to="/register">Register</Link>
                    </Button>
                  </>
                )}
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
