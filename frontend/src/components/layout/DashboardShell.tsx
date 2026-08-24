import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";

export interface SidebarLink {
  to: string;
  label: string;
  icon: ReactNode;
}

export function DashboardShell({
  links,
  heading,
  children,
}: {
  links: SidebarLink[];
  heading: string;
  children: ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar />
      <div className="container-page flex flex-1 flex-col gap-6 py-12 lg:flex-row lg:gap-16">
        <aside className="lg:w-60 lg:shrink-0" aria-label={heading}>
          <p className="mb-6 border-b border-border pb-4 px-1 text-xs font-bold uppercase tracking-widest text-muted-foreground">
            {heading}
          </p>
          <nav className="flex gap-2 overflow-x-auto pb-1 lg:flex-col lg:overflow-visible">
            {links.map((link) => (
              <Link
                key={link.to}
                to={link.to as never}
                activeOptions={{ exact: link.to === "/dashboard" || link.to === "/admin" }}
                className="flex shrink-0 items-center gap-3 rounded-none px-4 py-3 text-xs font-bold uppercase tracking-widest text-muted-foreground transition-colors hover:bg-muted/50 hover:text-foreground"
                activeProps={{ className: "bg-foreground text-background hover:bg-foreground hover:text-background" }}
              >
                <span aria-hidden="true">{link.icon}</span>
                {link.label}
              </Link>
            ))}
          </nav>
        </aside>
        <main className="min-w-0 flex-1 lg:pb-12">{children}</main>
      </div>
      <Footer />
    </div>
  );
}
