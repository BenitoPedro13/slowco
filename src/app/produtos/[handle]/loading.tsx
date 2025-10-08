import { SiteShell } from "@/components/layout/site-shell";

export default function ProductLoading() {
  return (
    <SiteShell>
      <section className="mx-auto w-full max-w-6xl px-4 pb-16 pt-12 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-4">
            <div className="h-6 w-32 animate-pulse rounded-full bg-white/10" />
            <div className="aspect-square animate-pulse rounded-3xl bg-white/5" />
            <div className="aspect-square animate-pulse rounded-3xl bg-white/5" />
          </div>
          <div className="space-y-6">
            <div className="h-4 w-40 animate-pulse rounded-full bg-white/10" />
            <div className="h-10 w-3/4 animate-pulse rounded-full bg-white/10" />
            <div className="h-12 w-full animate-pulse rounded-full bg-white/10" />
            <div className="h-48 w-full animate-pulse rounded-3xl bg-white/5" />
          </div>
        </div>
      </section>
    </SiteShell>
  );
}
