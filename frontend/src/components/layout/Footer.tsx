import { Link } from "@tanstack/react-router";

export function Footer() {
  return (
    <footer className="mt-16 border-t border-border bg-card">
      <div className="container-page flex flex-col gap-4 py-8 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
        <p>Campus Exchange — a student marketplace for one university. Educational project.</p>
        <nav aria-label="Footer" className="flex flex-wrap gap-4">
          <Link to="/products" className="hover:text-foreground">
            Marketplace
          </Link>
          <Link to="/register" className="hover:text-foreground">
            Register
          </Link>
          <Link to="/login" className="hover:text-foreground">
            Login
          </Link>
        </nav>
      </div>
    </footer>
  );
}
