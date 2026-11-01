import { describe, expect, it } from "vitest";
import { whatsappUrl, searchProducts } from "@/lib/shop";

describe("checkout", () => {
  it("sends the order to WhatsApp 01025532830 with items and total", () => {
    const url = whatsappUrl({ 1: 2, 2: 1 });
    expect(url.startsWith("https://wa.me/201025532830?text=")).toBe(true);
    const text = decodeURIComponent(url.split("text=")[1]!);
    expect(text).toContain("Emporio Armani");
    expect(text).toContain("× 2");
    expect(text).toContain("12,497");
  });
  it("search suggests matching products", () => {
    expect(searchProducts("cas").map((p) => p.name)).toContain("Casio");
  });
});
