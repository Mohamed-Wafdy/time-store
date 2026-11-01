import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Headset, Mail, Phone, RefreshCw, ShieldCheck, Star, Truck, Watch } from "lucide-react";
import data from "@/data/store.json";
import { ProductGrid } from "@/components/store";

const h = data.home;
const icons = { truck: Truck, shield: ShieldCheck, refresh: RefreshCw, headset: Headset } as const;

function Title({ children, link }: { children: string; link?: boolean }) {
  return (
    <div className="mb-6 flex items-center justify-between gap-4">
      <h2 className="flex items-center gap-3 text-xl font-extrabold sm:text-2xl">
        <span className="h-0.5 w-6 bg-primary" />{children}
      </h2>
      {link && <Link to="/categories" search={{ c: "all" }} className="text-sm font-semibold text-primary hover:underline">{data.viewAll}</Link>}
    </div>
  );
}

export function HomeSections() {
  const [email, setEmail] = useState("");
  return (
    <>
      <section className="mx-auto max-w-7xl px-4 pb-12">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-4">
          {h.features.map((f) => {
            const Icon = icons[f.icon as keyof typeof icons];
            return (
              <div key={f.title} className="flex items-center gap-4 rounded-2xl bg-muted p-4 sm:p-5">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-primary text-primary-foreground sm:h-12 sm:w-12"><Icon className="h-5 w-5 sm:h-6 sm:w-6" /></span>
                <div className="min-w-0">
                  <p className="text-base font-extrabold leading-tight sm:text-lg">{f.title}</p>
                  <p className="mt-1 text-sm leading-6 text-muted-foreground">{f.text}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-12">
        <div className="relative overflow-hidden rounded-2xl bg-secondary text-secondary-foreground">
          <img src={h.promo.image} alt={h.promo.title} loading="lazy" className="absolute inset-0 h-full w-full object-cover opacity-50" />
          <div className="relative max-w-lg p-8 sm:p-12">
            <span className="rounded-full bg-primary px-3 py-1 text-xs font-bold text-primary-foreground">{h.promo.tag}</span>
            <h2 className="mt-4 text-2xl font-extrabold sm:text-4xl">{h.promo.title}</h2>
            <p className="mt-2 opacity-90">{h.promo.text}</p>
            <Link to="/categories" search={{ c: h.promo.filter }} className="mt-6 inline-block rounded-md bg-primary px-6 py-3 font-bold text-primary-foreground hover:opacity-90">{h.promo.cta}</Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-12">
        <Title link>{h.newArrivalsTitle}</Title>
        <ProductGrid products={data.products.filter((p) => !p.bestSeller)} />
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-12">
        <Title>{h.brandsTitle}</Title>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-8">
          {h.brands.map((b) => (
            <Link key={b} to="/categories" search={{ c: "all", q: b }} className="grid h-16 place-items-center rounded-lg border px-2 text-center text-sm font-bold transition hover:border-primary hover:text-primary" dir="ltr">{b}</Link>
          ))}
        </div>
      </section>

      <section className="bg-muted py-12">
        <div className="mx-auto max-w-7xl px-4">
          <Title>{h.testimonialsTitle}</Title>
          <div className="grid gap-4 md:grid-cols-3">
            {h.testimonials.map((t) => (
              <figure key={t.name} className="rounded-xl bg-background p-6">
                <div className="flex">{Array.from({ length: 5 }).map((_, i) => <Star key={i} className={`h-4 w-4 text-star ${i < t.rating ? "fill-star" : ""}`} />)}</div>
                <blockquote className="mt-3 text-sm leading-7">{t.text}</blockquote>
                <figcaption className="mt-4 text-sm font-bold">{t.name} <span className="font-normal text-muted-foreground">— {t.city}</span></figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12">
        <div className="flex flex-col items-center gap-4 rounded-2xl border p-8 text-center">
          <Mail className="h-10 w-10 text-primary" />
          <h2 className="text-2xl font-extrabold">{h.newsletter.title}</h2>
          <p className="text-muted-foreground">{h.newsletter.text}</p>
          <form onSubmit={(e) => { e.preventDefault(); if (email) { toast.success(h.newsletter.success); setEmail(""); } }} className="flex w-full max-w-md gap-2">
            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder={h.newsletter.placeholder} className="min-w-0 flex-1 rounded-md border bg-background px-4 py-3 text-sm outline-none focus:border-primary" />
            <button className="shrink-0 rounded-md bg-primary px-6 font-bold text-primary-foreground hover:opacity-90">{h.newsletter.cta}</button>
          </form>
        </div>
      </section>
    </>
  );
}

export function Footer() {
  const f = data.footer;
  return (
    <footer className="bg-secondary text-secondary-foreground">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 md:grid-cols-3">
        <div>
          <div className="flex items-center gap-2 text-2xl font-bold tracking-[0.2em]" dir="rtl"><Watch className="h-7 w-7" />{data.brand}</div>
          <p className="mt-3 text-sm opacity-80">{f.about}</p>
        </div>
        <div>
          <p className="mb-3 font-bold">{f.linksTitle}</p>
          <ul className="space-y-2 text-sm opacity-80">
            {data.nav.map((n) => (
              <li key={n.label}><Link to={n.to} search={(n.to === "/categories" ? { c: n.filter ?? "all" } : {}) as never} className="hover:text-primary">{n.label}</Link></li>
            ))}
          </ul>
        </div>
        <div>
          <p className="mb-3 font-bold">{f.contactTitle}</p>
          <a href={`https://wa.me/${data.whatsapp}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm opacity-80 hover:text-primary"><Phone className="h-4 w-4" /><span dir="ltr">{f.phone}</span></a>
        </div>
      </div>
      <p className="border-t border-secondary-foreground/10 py-4 text-center text-xs opacity-70">{f.copyright}</p>
    </footer>
  );
}
