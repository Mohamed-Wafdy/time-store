import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Filter } from "lucide-react";
import data from "@/data/store.json";
import { ProductGrid, StoreLayout } from "@/components/store";
import { searchProducts } from "@/lib/shop";

const page = data.categoriesPage;

export const Route = createFileRoute("/categories")({
  validateSearch: (s: Record<string, unknown>): { c: string; q?: string | undefined } => ({
    c: typeof s["c"] === "string" && data.filters.some((f) => f.id === s["c"]) ? (s["c"] as string) : "all",
    q: typeof s["q"] === "string" ? (s["q"] as string) : undefined,
  }),
  head: () => ({
    meta: [
      { title: "جميع الساعات والأقسام | TIME" },
      { name: "description", content: "تصفح جميع الساعات الرجالية والنسائية والذكية والفاخرة مع التصفية والترتيب." },
      { property: "og:title", content: "جميع الساعات والأقسام | TIME" },
      { property: "og:description", content: "تصفح جميع الساعات حسب القسم والسعر." },
    ],
  }),
  component: Categories,
});

function Categories() {
  const { c, q } = Route.useSearch();
  const [sort, setSort] = useState("default");

  let list = c === "all" ? data.products : data.products.filter((p) => (c === "offers" ? "oldPrice" in p : p.category === c));
  if (q) list = searchProducts(q).filter((p) => list.includes(p));
  if (sort === "price-asc") list = [...list].sort((a, b) => a.price - b.price);
  if (sort === "price-desc") list = [...list].sort((a, b) => b.price - a.price);

  return (
    <StoreLayout active={1}>
      <main className="mx-auto max-w-7xl px-4 py-8">
        <div className="mb-6">
          <h1 className="flex items-center gap-3 text-2xl font-extrabold sm:text-3xl">
            <span className="h-0.5 w-6 bg-primary" />{page.title}
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">{q ? `${data.search.resultsFor} "${q}"` : page.subtitle}</p>
        </div>

        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="grid h-9 w-9 place-items-center rounded-full bg-muted"><Filter className="h-4 w-4" /></span>
            {data.filters.map((f) => (
              <Link key={f.id} to="/categories" search={{ c: f.id, q }} className={`rounded-full px-5 py-2 text-sm font-semibold transition ${c === f.id ? "bg-secondary text-secondary-foreground" : "bg-muted hover:bg-border"}`}>
                {f.label}
              </Link>
            ))}
          </div>
          <div className="flex items-center gap-3 text-sm">
            <span className="text-muted-foreground">{list.length} {page.countLabel}</span>
            <label className="flex items-center gap-2">
              {page.sortLabel}
              <select value={sort} onChange={(e) => setSort(e.target.value)} className="rounded-full border bg-background px-3 py-2">
                {page.sorts.map((s) => <option key={s.id} value={s.id}>{s.label}</option>)}
              </select>
            </label>
          </div>
        </div>

        {list.length ? <ProductGrid products={list} /> : <p className="py-20 text-center text-muted-foreground">{page.empty}</p>}
      </main>
    </StoreLayout>
  );
}
