import { createFileRoute } from "@tanstack/react-router";
import data from "@/data/store.json";
import { ProductGrid, StoreLayout } from "@/components/store";
import { useShop } from "@/lib/shop";

export const Route = createFileRoute("/favorites")({
  head: () => ({
    meta: [
      { title: "المفضلة | TIME" },
      { name: "description", content: "الساعات التي أضفتها إلى المفضلة في متجر TIME." },
      { property: "og:title", content: "المفضلة | TIME" },
      { property: "og:description", content: "قائمة ساعاتك المفضلة." },
    ],
  }),
  component: Favorites,
});

function Favorites() {
  const { favs } = useShop();
  const list = data.products.filter((p) => favs.includes(p.id));
  return (
    <StoreLayout active={-1}>
      <main className="mx-auto max-w-7xl px-4 py-8">
        <h1 className="mb-6 flex items-center gap-3 text-2xl font-extrabold sm:text-3xl">
          <span className="h-0.5 w-6 bg-primary" />{data.favorites.title}
        </h1>
        {list.length ? <ProductGrid products={list} /> : <p className="py-20 text-center text-muted-foreground">{data.favorites.empty}</p>}
      </main>
    </StoreLayout>
  );
}
