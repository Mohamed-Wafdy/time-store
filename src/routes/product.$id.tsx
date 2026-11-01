import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { CheckCircle2, Heart, Minus, Plus, ShoppingCart, Star } from "lucide-react";
import data from "@/data/store.json";
import { ProductGrid, StoreLayout } from "@/components/store";
import { shop, useShop, whatsappUrl } from "@/lib/shop";

const pp = data.productPage;

export const Route = createFileRoute("/product/$id")({
  loader: ({ params }) => {
    const product = data.products.find((p) => String(p.id) === params.id);
    if (!product) throw notFound();
    return { product };
  },
  head: ({ loaderData }) => {
    const p = loaderData?.product;
    const title = p ? `${p.name} - ${p.type} | TIME` : "المنتج غير متوفر | TIME";
    const desc = p ? `${p.name} بسعر ${p.price.toLocaleString("en-US")} ${data.currency}. ${pp.descriptions[p.category as keyof typeof pp.descriptions]}` : pp.notFound;
    return {
      meta: [
        { title },
        { name: "description", content: desc },
        { property: "og:title", content: title },
        { property: "og:description", content: desc },
        { property: "og:type", content: "product" },
      ],
    };
  },
  component: ProductPage,
  notFoundComponent: () => (
    <StoreLayout active={1}>
      <div className="py-24 text-center">
        <p className="text-xl font-bold">{pp.notFound}</p>
        <Link to="/categories" search={{ c: "all" }} className="mt-4 inline-block text-primary hover:underline">{pp.backToShop}</Link>
      </div>
    </StoreLayout>
  ),
});

function ProductPage() {
  const { product: p } = Route.useLoaderData();
  const { favs } = useShop();
  const [qty, setQty] = useState(1);
  const fav = favs.includes(p.id);
  const related = data.products.filter((x) => x.category === p.category && x.id !== p.id).slice(0, 4);
  const category = data.filters.find((f) => f.id === p.category);

  const addToCart = () => {
    for (let i = 0; i < qty; i++) shop.add(p.id);
    toast.success(data.cart.added, { description: p.name });
  };

  return (
    <StoreLayout active={1}>
      <main className="mx-auto max-w-7xl px-4 py-6">
        <nav className="mb-6 flex flex-wrap gap-2 text-sm text-muted-foreground">
          <Link to="/" className="hover:text-primary">{pp.home}</Link>/
          <Link to="/categories" search={{ c: p.category }} className="hover:text-primary">{category?.label}</Link>/
          <span className="text-foreground" dir="ltr">{p.name}</span>
        </nav>

        <div className="grid gap-8 md:grid-cols-2 lg:gap-12">
          <div className="relative overflow-hidden rounded-2xl bg-muted">
            <img src={p.image} alt={p.name} className="aspect-square w-full object-contain p-6" />
          </div>

          <div className="flex flex-col">
            <p className="text-sm text-muted-foreground">{p.type}</p>
            <h1 className="mt-1 text-3xl font-extrabold sm:text-4xl" dir="ltr" style={{ textAlign: "right" }}>{p.name}</h1>
            <div className="mt-3 flex items-center gap-2">
              <div className="flex">{Array.from({ length: 5 }).map((_, i) => <Star key={i} className={`h-4 w-4 text-star ${i < Math.round(p.rating) ? "fill-star" : ""}`} />)}</div>
              <span className="text-sm text-muted-foreground">({p.reviews})</span>
            </div>
            <p className="mt-5 text-3xl font-extrabold text-primary">{p.price.toLocaleString("en-US")} {data.currency}</p>
            <p className="mt-2 flex items-center gap-2 text-sm font-semibold"><CheckCircle2 className="h-4 w-4 text-primary" />{pp.inStock}</p>
            <p className="mt-5 leading-8 text-muted-foreground">{pp.descriptions[p.category as keyof typeof pp.descriptions]}</p>

            <div className="mt-6 flex items-center gap-4">
              <span className="font-semibold">{pp.quantity}</span>
              <div className="flex items-center rounded-md border">
                <button onClick={() => setQty(qty + 1)} className="grid h-10 w-10 place-items-center" aria-label="زيادة"><Plus className="h-4 w-4" /></button>
                <span className="w-10 text-center font-bold">{qty}</span>
                <button onClick={() => setQty(Math.max(1, qty - 1))} className="grid h-10 w-10 place-items-center" aria-label="تقليل"><Minus className="h-4 w-4" /></button>
              </div>
            </div>

            <div className="mt-6 flex gap-3">
              <button onClick={addToCart} className="flex flex-1 items-center justify-center gap-2 rounded-md bg-primary py-3 font-bold text-primary-foreground hover:opacity-90">
                <ShoppingCart className="h-5 w-5" />{pp.addToCart}
              </button>
              <button onClick={() => toast(shop.toggleFav(p.id) ? data.favorites.added : data.favorites.removed)} className="grid h-12 w-12 shrink-0 place-items-center rounded-md border" aria-label="المفضلة">
                <Heart className={`h-5 w-5 ${fav ? "fill-primary text-primary" : ""}`} />
              </button>
            </div>
            <a href={whatsappUrl({ [p.id]: qty })} target="_blank" rel="noopener noreferrer" className="mt-3 block rounded-md bg-secondary py-3 text-center font-bold text-secondary-foreground hover:opacity-90">{pp.buyNow}</a>

            <div className="mt-8 rounded-xl border">
              <p className="border-b p-4 font-bold">{pp.specsTitle}</p>
              <dl className="divide-y text-sm">
                {[[pp.specs.brand, p.name], [pp.specs.type, p.type], [pp.specs.warranty, pp.specs.warrantyValue]].map(([k, v]) => (
                  <div key={k} className="flex justify-between p-4"><dt className="text-muted-foreground">{k}</dt><dd className="font-semibold">{v}</dd></div>
                ))}
              </dl>
            </div>
          </div>
        </div>

        {related.length > 0 && (
          <section className="mt-16">
            <h2 className="mb-6 flex items-center gap-3 text-xl font-extrabold sm:text-2xl"><span className="h-0.5 w-6 bg-primary" />{pp.related}</h2>
            <ProductGrid products={related} />
          </section>
        )}
      </main>
    </StoreLayout>
  );
}
