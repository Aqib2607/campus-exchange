import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, MoveRight, Layers, LayoutGrid, Zap } from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { useEffect, useRef } from "react";

export const Route = createFileRoute("/")({
  component: LandingPage,
});

function useScrollReveal() {
  const ref = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('opacity-100', 'translate-y-0');
          entry.target.classList.remove('opacity-0', 'translate-y-12');
        }
      });
    }, { threshold: 0.1, rootMargin: "0px 0px -50px 0px" });

    const el = ref.current;
    if (el) observer.observe(el);
    return () => { if (el) observer.unobserve(el); };
  }, []);
  
  return ref;
}

function RevealSection({ children, delay = "delay-0", className = "" }: { children: React.ReactNode, delay?: string, className?: string }) {
  const ref = useScrollReveal();
  return (
    <div ref={ref} className={`transition-all duration-1000 ease-out opacity-0 translate-y-12 ${delay} ${className}`}>
      {children}
    </div>
  );
}

function LandingPage() {
  return (
    <AppLayout>
      <div className="flex flex-col items-center bg-background text-foreground">
        
        {/* HERO SECTION */}
        <section className="relative w-full min-h-[90vh] flex flex-col justify-center overflow-hidden border-b border-border bg-card">
          <div className="absolute inset-0 z-0 bg-[url('https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-10 grayscale mix-blend-multiply dark:opacity-20" />
          
          <div className="container-page relative z-10 flex flex-col items-start pt-20 pb-32">
            <div className="animate-in fade-in slide-in-from-bottom-12 duration-1000 fill-mode-both w-full">
              <div className="mb-6 inline-flex items-center gap-2 border border-foreground/20 px-4 py-2 text-xs font-bold uppercase tracking-widest bg-background/50 backdrop-blur-sm">
                <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
                The University Marketplace
              </div>
              
              <h1 className="font-display text-7xl font-bold uppercase leading-[0.85] tracking-tight sm:text-[10rem] md:text-[12rem] text-foreground mix-blend-exclusion dark:mix-blend-normal">
                CAMPUS <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-foreground to-foreground/50">EXCHANGE</span>
              </h1>
              
              <div className="mt-16 flex flex-col items-start gap-8 sm:flex-row sm:items-end w-full max-w-5xl">
                <p className="max-w-xl text-lg font-medium leading-relaxed text-muted-foreground sm:text-xl md:text-2xl">
                  A premium trading platform exclusively for verified university students. 
                  Buy, sell, and discover items securely within your campus community.
                </p>
                
                <div className="flex-shrink-0 sm:ml-auto">
                  <Link
                    to="/products"
                    className="group relative flex h-20 items-center justify-between overflow-hidden bg-foreground px-8 font-display text-xl font-bold uppercase tracking-widest text-background transition-slow hover:bg-primary sm:w-80"
                  >
                    <span>Explore</span>
                    <ArrowRight className="h-8 w-8 transition-transform duration-500 group-hover:translate-x-4" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* EDITORIAL GRID SECTION - CATEGORIES */}
        <section className="container-page w-full section-padding border-b border-border">
          <RevealSection>
            <div className="mb-16 flex items-end justify-between">
              <h2 className="font-display text-5xl font-bold uppercase tracking-tight md:text-7xl">
                Categories
              </h2>
              <Link to="/products" className="group hidden sm:flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-muted-foreground hover:text-foreground">
                View All <MoveRight className="h-4 w-4 transition-transform group-hover:translate-x-2" />
              </Link>
            </div>
          </RevealSection>
          
          <div className="editorial-grid">
            <RevealSection className="col-span-12 md:col-span-8 h-[400px]">
              <Link to="/products" search={{ category: "Textbooks" }} className="group relative block h-full w-full overflow-hidden bg-card border border-border transition-medium hover:border-foreground">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1497633762265-9d179a990aa6?q=80&w=2073&auto=format&fit=crop')] bg-cover bg-center opacity-60 transition-slow group-hover:scale-105 group-hover:opacity-80 grayscale group-hover:grayscale-0" />
                <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent" />
                <div className="absolute bottom-0 left-0 p-8">
                  <h3 className="font-display text-4xl font-bold uppercase tracking-tight text-foreground">Textbooks</h3>
                  <p className="mt-2 text-sm font-medium tracking-wide text-muted-foreground uppercase">Required Reading</p>
                </div>
                <div className="absolute top-8 right-8 flex h-12 w-12 items-center justify-center border border-background/20 bg-background/10 backdrop-blur-md rounded-full transition-medium group-hover:bg-foreground group-hover:text-background">
                  <ArrowRight className="h-5 w-5" />
                </div>
              </Link>
            </RevealSection>
            
            <RevealSection delay="delay-100" className="col-span-12 md:col-span-4 h-[400px]">
              <Link to="/products" search={{ category: "Electronics" }} className="group relative block h-full w-full overflow-hidden bg-card border border-border transition-medium hover:border-foreground">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1498049794561-7780e7231661?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-60 transition-slow group-hover:scale-105 group-hover:opacity-80 grayscale group-hover:grayscale-0" />
                <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent" />
                <div className="absolute bottom-0 left-0 p-8">
                  <h3 className="font-display text-3xl font-bold uppercase tracking-tight text-foreground">Electronics</h3>
                  <p className="mt-2 text-xs font-medium tracking-wide text-muted-foreground uppercase">Laptops & Audio</p>
                </div>
              </Link>
            </RevealSection>
            
            <RevealSection delay="delay-200" className="col-span-12 md:col-span-4 h-[400px]">
              <Link to="/products" search={{ category: "Furniture" }} className="group relative block h-full w-full overflow-hidden bg-card border border-border transition-medium hover:border-foreground">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1505693314120-0d443867891c?q=80&w=2022&auto=format&fit=crop')] bg-cover bg-center opacity-60 transition-slow group-hover:scale-105 group-hover:opacity-80 grayscale group-hover:grayscale-0" />
                <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent" />
                <div className="absolute bottom-0 left-0 p-8">
                  <h3 className="font-display text-3xl font-bold uppercase tracking-tight text-foreground">Dorm Decor</h3>
                  <p className="mt-2 text-xs font-medium tracking-wide text-muted-foreground uppercase">Furniture & Storage</p>
                </div>
              </Link>
            </RevealSection>
            
            <RevealSection delay="delay-300" className="col-span-12 md:col-span-8 h-[400px]">
              <Link to="/products" className="group flex h-full w-full flex-col items-center justify-center border border-border bg-muted/30 transition-medium hover:bg-foreground hover:text-background text-foreground">
                <LayoutGrid className="mb-6 h-12 w-12 opacity-50 transition-medium group-hover:opacity-100 group-hover:scale-110" />
                <h3 className="font-display text-4xl font-bold uppercase tracking-tight">Browse All</h3>
                <span className="mt-4 border-b border-current pb-1 text-sm font-bold uppercase tracking-widest opacity-0 transition-medium group-hover:opacity-100">Explore Catalog</span>
              </Link>
            </RevealSection>
          </div>
        </section>

        {/* FEATURES - EDITORIAL TYPOGRAPHY LIST */}
        <section className="w-full bg-foreground text-background">
          <div className="container-page section-padding">
            <RevealSection>
              <div className="mb-16">
                <h2 className="font-display text-4xl font-bold uppercase tracking-tight md:text-6xl text-background/90">
                  The <span className="text-primary">Standard</span>
                </h2>
              </div>
            </RevealSection>
            
            <div className="flex flex-col">
              {[
                { title: "Verified Identity", desc: "Every user is authenticated with a valid university email address. A closed, secure ecosystem.", icon: Layers },
                { title: "Zero Fees", desc: "No listing fees, no transaction costs, no hidden percentages. Keep 100% of your money.", icon: Zap },
                { title: "Campus Proximity", desc: "Exchange items instantly on campus. Eliminate shipping costs and waiting times entirely.", icon: LayoutGrid }
              ].map((feature, i) => (
                <RevealSection key={i} delay={`delay-${i * 100}`} className="group flex flex-col md:flex-row md:items-center justify-between border-b border-background/20 py-12 transition-colors hover:bg-background/5">
                  <div className="flex items-center gap-8 md:w-1/2">
                    <span className="font-display text-2xl font-bold text-background/30 md:text-4xl">0{i + 1}</span>
                    <h3 className="font-display text-3xl font-bold uppercase tracking-tight md:text-5xl">{feature.title}</h3>
                  </div>
                  <div className="mt-6 flex md:mt-0 md:w-5/12">
                    <p className="text-lg font-medium text-background/70">{feature.desc}</p>
                  </div>
                </RevealSection>
              ))}
            </div>
          </div>
        </section>

        {/* CALL TO ACTION */}
        <section className="container-page w-full section-padding text-center">
          <RevealSection>
            <h2 className="font-display text-6xl font-bold uppercase tracking-tight md:text-8xl">
              Join The <br /> Movement
            </h2>
            <div className="mt-12 flex flex-col items-center justify-center gap-6 sm:flex-row">
              <Link
                to="/register"
                className="inline-flex h-16 w-full items-center justify-center bg-foreground px-12 font-display text-xl font-bold uppercase tracking-widest text-background transition-medium hover:scale-105 hover:bg-primary sm:w-auto"
              >
                Create Account
              </Link>
              <Link
                to="/login"
                className="inline-flex h-16 w-full items-center justify-center border-2 border-foreground bg-transparent px-12 font-display text-xl font-bold uppercase tracking-widest text-foreground transition-medium hover:bg-foreground hover:text-background sm:w-auto"
              >
                Sign In
              </Link>
            </div>
          </RevealSection>
        </section>

      </div>
    </AppLayout>
  );
}
