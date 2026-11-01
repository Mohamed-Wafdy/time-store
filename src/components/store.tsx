import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { useState, type ReactNode } from "react";
import { toast } from "sonner";
import { Grid2x2, Heart, Home, Minus, Plus, Search, ShoppingBag, ShoppingCart, Star, Trash2, Watch } from "lucide-react";
import data from "@/data/store.json";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { cartLines, searchProducts, shop, useShop, whatsappUrl } from "@/lib/shop";

export type Product = (typeof data.products)[number];

export function StoreLayout({ children, active }: { children: ReactNode; active: number }) {
  return (
    <div className="min-h-screen bg-background pb-20 font-sans md:pb-0">
      <Header active={active} />
      {children}
      <BottomNav active={active} />
      <CartSheet />
    </div>
  );
}

function Logo() {
  return (
    <Link to="/" className="flex items-center gap-2 text-2xl font-bold tracking-[0.2em] text-foreground" dir="ltr">
      <Watch className="h-7 w-7" strokeWidth={2.5} />
      {data.brand}
    </Link>
  );
}

function SearchBox({ className = "" }: { className?: string }) {
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const results = searchProducts(q).slice(0, 6);
  const go = () => {
    if (!q.trim()) return;
    setOpen(false);
    navigate({ to: "/categories", search: { c: "all", q: q.trim() } });
  };
  return (
    <div className={`relative ${className}`}>
      <form onSubmit={(e) => { e.preventDefault(); go(); }} className="flex items-center gap-2 rounded-full bg-muted px-4 py-2">
        <Search className="h-4 w-4 shrink-0 text-muted-foreground" />
        <input
          value={q}
          onChange={(e) => { setQ(e.target.value); setOpen(true); }}
          onFocus={() => setOpen(true)}
          onBlur={() => setTimeout(() => setOpen(false), 150)}
          placeholder={data.searchPlaceholder}
          className="w-full min-w-0 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
        />
      </form>
      {open && q.trim() && (
        <div className="absolute inset-x-0 top-full z-40 mt-2 overflow-hidden rounded-xl border bg-popover shadow-lg">
          {results.length ? results.map((p) => (
            <button key={p.id} onMouseDown={() => { setQ(""); setOpen(false); navigate({ to: "/product/$id", params: { id: String(p.id) } }); }} className="flex w-full items-center gap-3 px-3 py-2 text-right hover:bg-muted">
              <img src={p.image} alt="" className="h-10 w-10 shrink-0 rounded bg-muted object-contain" />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold" dir="ltr">{p.name}</p>
                <p className="text-xs text-muted-foreground">{p.type}</p>
              </div>
              <span className="shrink-0 text-xs font-bold">{p.price.toLocaleString("en-US")} {data.currency}</span>
            </button>
          )) : <p className="px-3 py-3 text-sm text-muted-foreground">{data.search.noResults}</p>}
        </div>
      )}
    </div>
  );
}

function CartButton() {
  const { cart } = useShop();
  const count = Object.values(cart).reduce((a, b) => a + b, 0);
  return (
    <button className="relative" aria-label="السلة" onClick={() => shop.openCart(true)}>
      <ShoppingBag className="h-6 w-6" />
      <span className="absolute -top-1.5 -left-1.5 grid h-4 min-w-4 place-items-center rounded-full bg-primary px-1 text-[10px] font-bold text-primary-foreground">{count}</span>
    </button>
  );
}

function Header({ active }: { active: number }) {
  const { favs } = useShop();
  const search = useRouterState({ select: (st) => st.location.search as { c?: string } });
  const path = useRouterState({ select: (st) => st.location.pathname });
  const isActive = (n: (typeof data.nav)[number]) =>
    n.to === "/" ? path === "/" : path === "/categories" && (n.filter ?? "all") === (search.c ?? "all") && n.label !== "العلامات التجارية";
  const badge = "absolute -top-1.5 -left-1.5 grid h-4 min-w-4 place-items-center rounded-full bg-primary px-1 text-[10px] font-bold text-primary-foreground";
  return (
    <header className="sticky top-0 z-30 border-b bg-background/95 backdrop-blur">
      <div className="mx-auto grid max-w-7xl grid-cols-[auto_1fr_auto] items-center gap-4 px-4 py-3 lg:gap-6">
        <Logo />
        <nav className="hidden items-center justify-center gap-5 text-sm font-semibold lg:flex xl:gap-7">
          {data.nav.map((n) => (
            <Link key={n.label} to={n.to} search={(n.to === "/categories" ? { c: n.filter ?? "all" } : {}) as never} className={`whitespace-nowrap border-b-2 py-1 transition ${isActive(n) ? "border-primary text-primary" : "border-transparent hover:text-primary"}`}>
              {n.label}
            </Link>
          ))}
        </nav>
        <div className="col-start-3 flex items-center gap-4">
          <SearchBox className="hidden w-56 xl:block xl:w-64" />
          <Link to="/favorites" className="relative hidden lg:block" aria-label="المفضلة">
            <Heart className={`h-6 w-6 ${active === -1 ? "fill-primary text-primary" : ""}`} />
            {favs.length > 0 && <span className={badge}>{favs.length}</span>}
          </Link>
          <CartButton />
        </div>
      </div>
      <div className="mx-auto max-w-7xl px-4 pb-3 xl:hidden"><SearchBox /></div>
    </header>
  );
}

function BottomNav({ active }: { active: number }) {
  const idx = active === 0 ? 0 : active === -1 ? 1 : 2;
  const cls = (i: number) => `flex flex-col items-center gap-1 text-xs ${i === idx ? "text-primary" : ""}`;
  return (
    <nav className="fixed inset-x-0 bottom-0 z-30 grid grid-cols-4 border-t bg-background py-2 md:hidden">
      <Link to="/" className={cls(0)}><Home className="h-5 w-5" />{data.bottomNav[0]}</Link>
      <Link to="/favorites" className={cls(1)}><Heart className="h-5 w-5" />{data.bottomNav[1]}</Link>
      <Link to="/categories" search={{ c: "all" }} className={cls(2)}><Grid2x2 className="h-5 w-5" />{data.bottomNav[2]}</Link>
      <button onClick={() => shop.openCart(true)} className={cls(3)}><ShoppingBag className="h-5 w-5" />{data.bottomNav[3]}</button>
    </nav>
  );
}

function CartSheet() {
  const { cart, cartOpen } = useShop();
  const lines = cartLines(cart);
  const total = lines.reduce((s, l) => s + l.product.price * l.qty, 0);
  return (
    <Sheet open={cartOpen} onOpenChange={shop.openCart}>
      <SheetContent side="left" className="flex w-full flex-col sm:max-w-md" dir="rtl">
        <SheetHeader><SheetTitle className="text-right">{data.cart.title}</SheetTitle></SheetHeader>
        <div className="-mx-2 flex-1 overflow-y-auto px-2">
          {lines.length === 0 && <p className="py-20 text-center text-muted-foreground">{data.cart.empty}</p>}
          {lines.map(({ product: p, qty }) => (
            <div key={p.id} className="flex items-center gap-3 border-b py-3">
              <img src={p.image} alt={p.name} className="h-16 w-16 shrink-0 rounded bg-muted object-contain" />
              <div className="min-w-0 flex-1">
                <p className="truncate font-semibold" dir="ltr">{p.name}</p>
                <p className="text-sm font-bold">{(p.price * qty).toLocaleString("en-US")} {data.currency}</p>
                <div className="mt-1 flex items-center gap-2">
                  <button onClick={() => shop.setQty(p.id, qty + 1)} className="grid h-7 w-7 place-items-center rounded border" aria-label="زيادة"><Plus className="h-3 w-3" /></button>
                  <span className="w-6 text-center text-sm">{qty}</span>
                  <button onClick={() => shop.setQty(p.id, qty - 1)} className="grid h-7 w-7 place-items-center rounded border" aria-label="تقليل"><Minus className="h-3 w-3" /></button>
                </div>
              </div>
              <button onClick={() => shop.setQty(p.id, 0)} aria-label={data.cart.remove} className="text-muted-foreground hover:text-destructive"><Trash2 className="h-5 w-5" /></button>
            </div>
          ))}
        </div>
        {lines.length > 0 && (
          <div className="space-y-3 border-t pt-4">
            <div className="flex justify-between font-bold"><span>{data.cart.total}</span><span>{total.toLocaleString("en-US")} {data.currency}</span></div>
            <a href={whatsappUrl(cart)} target="_blank" rel="noopener noreferrer" className="block rounded-md bg-primary py-3 text-center font-bold text-primary-foreground hover:opacity-90">
              {data.cart.checkout}
            </a>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}

function Stars({ value, reviews }: { value: number; reviews: number }) {
  return (
    <div className="flex items-center gap-1">
      <div className="flex">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star key={i} className={`h-3 w-3 text-star ${i < Math.round(value) ? "fill-star" : ""}`} />
        ))}
      </div>
      <span className="text-[10px] text-muted-foreground">({reviews})</span>
    </div>
  );
}

export function ProductCard({ p }: { p: Product }) {
  const { favs } = useShop();
  const fav = favs.includes(p.id);
  return (
    <div className="flex flex-col">
      <div className="relative overflow-hidden rounded-md bg-muted">
        {"oldPrice" in p && <span className="absolute top-2 left-2 z-10 rounded-full bg-destructive px-2 py-0.5 text-[11px] font-bold text-destructive-foreground">{data.offerBadge} {Math.round((1 - p.price / p.oldPrice) * 100)}%</span>}
        <button onClick={() => toast(shop.toggleFav(p.id) ? data.favorites.added : data.favorites.removed)} className="absolute top-2 right-2 z-10" aria-label="المفضلة">
          <Heart className={`h-5 w-5 ${fav ? "fill-primary text-primary" : "text-foreground"}`} />
        </button>
        <Link to="/product/$id" params={{ id: String(p.id) }}><img src={p.image} alt={p.name} loading="lazy" className="aspect-square w-full object-contain p-2 transition hover:scale-105" /></Link>
      </div>
      <div className="mt-3 flex items-end justify-between gap-2 px-1">
        <div className="min-w-0">
          <Link to="/product/$id" params={{ id: String(p.id) }}><h3 className="truncate font-semibold hover:text-primary" dir="ltr">{p.name}</h3></Link>
          <p className="text-xs text-muted-foreground">{p.type}</p>
          <p className="mt-1 flex flex-wrap items-baseline gap-x-2 font-bold">
            {p.price.toLocaleString("en-US")} {data.currency}
            {"oldPrice" in p && <span className="text-xs font-normal text-muted-foreground line-through">{p.oldPrice.toLocaleString("en-US")}</span>}
          </p>
          <Stars value={p.rating} reviews={p.reviews} />
        </div>
        <button onClick={() => { shop.add(p.id); toast.success(data.cart.added, { description: p.name }); }} className="grid h-9 w-9 shrink-0 place-items-center rounded-md bg-primary text-primary-foreground transition hover:opacity-90" aria-label="أضف للسلة">
          <ShoppingCart className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}

export function ProductGrid({ products }: { products: Product[] }) {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 lg:gap-6">
      {products.map((p) => <ProductCard key={p.id} p={p} />)}
    </div>
  );
}
