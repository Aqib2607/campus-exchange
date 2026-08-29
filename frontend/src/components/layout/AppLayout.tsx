import type { ReactNode } from "react";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";

export function AppLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar />
      <main className="container-page flex-1 py-8">{children}</main>
      <Footer />
    </div>
  );
}

export function AuthLayout({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar />
      <main className="container-page flex flex-1 items-start justify-center py-10 sm:py-16">
        <div className="w-full max-w-md rounded-none border-2 border-border bg-card p-6 sm:p-8">
          <h1 className="font-display text-4xl font-bold uppercase tracking-widest text-foreground">{title}</h1>
          {description && <p className="mt-1 text-sm text-muted-foreground">{description}</p>}
          <div className="mt-6">{children}</div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
