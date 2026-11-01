import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import data from "@/data/store.json";
import { ProductGrid, StoreLayout } from "@/components/store";
import { Footer, HomeSections } from "@/components/home-sections";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "TIME | متجر الساعات الفاخرة" },
      { name: "description", content: "تسوق أفضل الساعات الرجالية والنسائية والذكية من أشهر العلامات التجارية." },
      { property: "og:title", content: "TIME | متجر الساعات الفاخرة" },
      { property: "og:description", content: "تسوق أفضل الساعات الرجالية والنسائية والذكية." },
    ],
  }),
  component: Index,
});

const filterIds = new Set(data.filters.map((f) => f.id));

function Index() {
  const [slide, setSlide] = useState(0);
  const slides = data.heroSlides;

  useEffect(() => {
    const t = setInterval(() => setSlide((s) => (s + 1) % slides.length), 5000);
    return () => clearInterval(t);
  }, [slides.length]);

  return (
    <StoreLayout active={0}>
      <section className="relative mx-auto max-w-7xl overflow-hidden px-4 pt-4 lg:px-0 lg:pt-0">
        <div className="relative overflow-hidden rounded-xl lg:rounded-none">
          <img src={slides[slide]?.image} alt={slides[slide]?.alt} className="block aspect-[3/1] w-full object-contain" />
          <button onClick={() => setSlide((slide - 1 + slides.length) % slides.length)} className="absolute top-1/2 right-4 hidden h-10 w-10 -translate-y-1/2 place-items-center rounded-full bg-background sm:grid" aria-label="السابق"><ChevronRight /></button>
          <button onClick={() => setSlide((slide + 1) % slides.length)} className="absolute top-1/2 left-4 hidden h-10 w-10 -translate-y-1/2 place-items-center rounded-full bg-background sm:grid" aria-label="التالي"><ChevronLeft /></button>
          <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-2">
            {slides.map((_, i) => (
              <span key={i} className={`h-2 w-2 rounded-full ${i === slide ? "bg-primary" : "bg-background"}`} />
            ))}
          </div>
        </div>
      </section>

      <main className="mx-auto max-w-7xl px-4">
        <section className="grid grid-cols-4 gap-3 py-6 sm:grid-cols-6 sm:gap-6 sm:py-10">
          {data.categories.map((c, i) => (
            <Link key={c.id} to="/categories" search={{ c: filterIds.has(c.id) ? c.id : c.id === "offers" ? "offers" : "all" }} className={`flex flex-col items-center gap-2 ${i >= 4 ? "hidden sm:flex" : ""}`}>
              <img src={c.image} alt={c.name} className="aspect-square w-16 rounded-full bg-muted object-cover sm:w-24" />
              <span className="text-xs font-semibold sm:text-sm"><span className="sm:hidden">{c.short}</span><span className="hidden sm:inline">{c.name}</span></span>
            </Link>
          ))}
        </section>

        <section className="pb-12">
          <div className="mb-5 flex items-center justify-between gap-4">
            <h2 className="flex items-center gap-3 text-xl font-extrabold sm:text-2xl">
              <span className="h-0.5 w-6 bg-primary" />{data.bestSellersTitle}
            </h2>
            <Link to="/categories" search={{ c: "all" }} className="text-sm font-semibold text-primary hover:underline">{data.viewAll}</Link>
          </div>
          <ProductGrid products={data.products.filter((p) => p.bestSeller)} />
        </section>
      </main>
      <HomeSections />
      <Footer />
    </StoreLayout>
  );
}
