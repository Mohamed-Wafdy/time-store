import { useSyncExternalStore } from "react";
import data from "@/data/store.json";

type State = { cart: Record<number, number>; favs: number[]; cartOpen: boolean };
const KEY = "time-shop";
let state: State = { cart: {}, favs: [], cartOpen: false };
let loaded = false;
const subs = new Set<() => void>();

function load() {
  if (loaded || typeof window === "undefined") return;
  loaded = true;
  try {
    const s = JSON.parse(localStorage.getItem(KEY) || "{}");
    state = { cart: s.cart ?? {}, favs: s.favs ?? [], cartOpen: false };
  } catch {}
}
function set(next: Partial<State>) {
  state = { ...state, ...next };
  localStorage.setItem(KEY, JSON.stringify({ cart: state.cart, favs: state.favs }));
  subs.forEach((f) => f());
}
const empty: State = { cart: {}, favs: [], cartOpen: false };

export function useShop() {
  const s = useSyncExternalStore(
    (f) => { load(); subs.add(f); f(); return () => subs.delete(f); },
    () => state,
    () => empty,
  );
  return s;
}

export const shop = {
  add: (id: number) => set({ cart: { ...state.cart, [id]: (state.cart[id] ?? 0) + 1 } }),
  setQty: (id: number, q: number) => {
    const cart = { ...state.cart };
    if (q <= 0) delete cart[id]; else cart[id] = q;
    set({ cart });
  },
  toggleFav: (id: number) => {
    const has = state.favs.includes(id);
    set({ favs: has ? state.favs.filter((x) => x !== id) : [...state.favs, id] });
    return !has;
  },
  openCart: (o: boolean) => set({ cartOpen: o }),
};

export function cartLines(cart: Record<number, number>) {
  return Object.entries(cart)
    .map(([id, qty]) => ({ product: data.products.find((p) => p.id === Number(id))!, qty }))
    .filter((l) => l.product);
}

export function whatsappUrl(cart: Record<number, number>) {
  const lines = cartLines(cart);
  const total = lines.reduce((s, l) => s + l.product.price * l.qty, 0);
  const fmt = (n: number) => `${n.toLocaleString("en-US")} ${data.currency}`;
  const msg = [
    data.cart.orderIntro,
    "",
    ...lines.map((l, i) => `${i + 1}. ${l.product.name} (${l.product.type}) × ${l.qty} = ${fmt(l.product.price * l.qty)}`),
    "",
    `${data.cart.orderTotal}: ${fmt(total)}`,
  ].join("\n");
  return `https://wa.me/${data.whatsapp}?text=${encodeURIComponent(msg)}`;
}

export function searchProducts(q: string) {
  const t = q.trim().toLowerCase();
  if (!t) return [];
  return data.products.filter((p) => p.name.toLowerCase().includes(t) || p.type.includes(t));
}
