"use client";

import Link from "next/link";

const CATEGORIES = [
  { name: "Makhana", emoji: "⚪", href: "/products?category=makhana", bg: "bg-amber-50" },
  { name: "Chia Seeds", emoji: "🌑", href: "/products?category=chia-seeds", bg: "bg-gray-50" },
  { name: "Flax Seeds", emoji: "🟤", href: "/products?category=flax-seeds", bg: "bg-orange-50" },
  { name: "Pumpkin Seeds", emoji: "🟢", href: "/products?category=pumpkin-seeds", bg: "bg-green-50" },
  { name: "Sunflower Seeds", emoji: "🌻", href: "/products?category=sunflower-seeds", bg: "bg-yellow-50" },
  { name: "Mix Seeds", emoji: "🌾", href: "/products?category=mix-seeds", bg: "bg-lime-50" },
  { name: "Combo Packs", emoji: "📦", href: "/products?category=combo-packs", bg: "bg-blue-50" },
  { name: "Gift Packs", emoji: "🎁", href: "/products?category=gift-packs", bg: "bg-pink-50" },
];

export default function Categories() {
  return (
    <section className="py-10 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl md:text-2xl font-extrabold text-[#1a3d1a]">Shop By Category</h2>
          <Link href="/products" className="text-[#2d6a2d] text-sm font-semibold hover:underline">
            View All →
          </Link>
        </div>

        {/* Category grid */}
        <div className="grid grid-cols-4 md:grid-cols-8 gap-3">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.name}
              href={cat.href}
              className="group flex flex-col items-center gap-2"
            >
              <div className={`w-full aspect-square ${cat.bg} border border-gray-100 rounded-2xl flex items-center justify-center text-3xl md:text-4xl shadow-sm group-hover:shadow-md group-hover:scale-105 transition-all`}>
                {cat.emoji}
              </div>
              <p className="text-[11px] md:text-xs font-semibold text-gray-700 text-center leading-tight">
                {cat.name}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}