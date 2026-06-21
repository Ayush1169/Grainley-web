"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { API } from "@/lib/api";
import ProductCard from "@/components/products/ProductCard";
import { SlidersHorizontal, Search, Package, X } from "lucide-react";

// Maps the slug used in URLs (?category=makhana) to the human-readable
// label shown in the UI. Keep this in sync with your category data.
const CATEGORY_LABELS: Record<string, string> = {
  makhana: "Makhana",
  "chia-seeds": "Chia Seeds",
  "flax-seeds": "Flax Seeds",
  "pumpkin-seeds": "Pumpkin Seeds",
  "sunflower-seeds": "Sunflower Seeds",
  "mix-seeds": "Mix Seeds",
  "combo-packs": "Combo Packs",
  "gift-packs": "Gift Packs",
};

function ProductsContent() {
  const searchParams = useSearchParams();
  const categorySlug = searchParams.get("category"); // e.g. "makhana" or null

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await API.get("/products");
      setProducts(response.data.products);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Category matching is resilient to how your backend actually
  // populates `category` on each product — it could be a populated
  // object ({ name, slug }) or just a raw ObjectId string depending
  // on your Product.find() query elsewhere. We check both shapes.
  const matchesCategory = (product: any) => {
    if (!categorySlug) return true; // no filter applied

    const productCategorySlug =
      product.category?.slug ||
      product.category?.name?.toLowerCase().replace(/\s+/g, "-");

    return productCategorySlug === categorySlug;
  };

  const filtered = products
    .filter(matchesCategory)
    .filter((p: any) => p.name?.toLowerCase().includes(search.toLowerCase()));

  const categoryLabel = categorySlug ? CATEGORY_LABELS[categorySlug] || categorySlug : null;

  return (
    <div className="bg-[#f9f9f5] min-h-screen">
      {/* Page header */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-2xl font-extrabold text-[#1a3d1a]">
            {categoryLabel ? categoryLabel : "All Products"}
          </h1>
          <p className="text-gray-400 text-sm mt-1">
            {loading ? "Loading…" : `${filtered.length} product${filtered.length !== 1 ? "s" : ""} available`}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Active category filter chip */}
        {categoryLabel && (
          <div className="flex items-center gap-2 mb-4">
            <span className="inline-flex items-center gap-2 bg-[#e8f5e8] border border-[#c8e6c8] text-[#2d6a2d] text-xs font-semibold px-3 py-1.5 rounded-full">
              {categoryLabel}
              <a href="/products" className="hover:text-[#1a3d1a]">
                <X size={12} />
              </a>
            </span>
          </div>
        )}

        {/* Search + filter bar */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search products…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full border border-gray-200 bg-white rounded-xl pl-9 pr-4 py-2.5 text-sm outline-none focus:border-[#2d6a2d] focus:ring-1 focus:ring-[#2d6a2d] transition"
            />
          </div>
          <button className="flex items-center gap-2 border border-gray-200 bg-white rounded-xl px-4 py-2.5 text-sm text-gray-600 hover:border-[#2d6a2d] hover:text-[#2d6a2d] transition font-medium">
            <SlidersHorizontal size={15} /> Filters
          </button>
        </div>

        {/* Grid */}
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl overflow-hidden border border-gray-100 animate-pulse">
                <div className="aspect-square bg-gray-100" />
                <div className="p-3 space-y-2">
                  <div className="h-3 bg-gray-100 rounded w-3/4" />
                  <div className="h-3 bg-gray-100 rounded w-1/2" />
                  <div className="h-8 bg-gray-100 rounded" />
                </div>
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <Package size={48} className="text-gray-200 mb-3" />
            <p className="text-[#1a3d1a] font-semibold">No products found</p>
            <p className="text-gray-400 text-sm mt-1">
              {categoryLabel
                ? `No products in ${categoryLabel} yet — try another category`
                : "Try a different search term"}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filtered.map((product: any) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// useSearchParams() requires a Suspense boundary for static export,
// same fix pattern as the order-success page.
import { Suspense } from "react";

export default function ProductsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#f9f9f5]" />}>
      <ProductsContent />
    </Suspense>
  );
}