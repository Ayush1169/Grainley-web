"use client";

import Image from "next/image";
import Link from "next/link";

interface ProductProps {
  product: {
    _id: string;
    name: string;
    slug: string;
    price: number;
    mrp: number;
    stock: number;
    images: {
      url: string;
    }[];
  };
}

export default function ProductCard({
  product,
}: ProductProps) {
  return (
    <Link
      href={`/product/${product.slug}`}
      className="bg-white border rounded-2xl overflow-hidden hover:shadow-xl transition block"
    >
      <div className="relative h-64 w-full bg-zinc-100">

        {product.images?.[0]?.url ? (
          <Image
            src={product.images[0].url}
            alt={product.name}
            fill
            className="object-cover"
          />
        ) : (
          <div className="h-full flex items-center justify-center">
            No Image
          </div>
        )}

      </div>

      <div className="p-4">

        <h3 className="font-semibold text-lg line-clamp-2">
          {product.name}
        </h3>

        <div className="flex items-center gap-2 mt-2">

          <span className="text-green-700 font-bold text-xl">
            ₹{product.price}
          </span>

          <span className="line-through text-zinc-400">
            ₹{product.mrp}
          </span>

        </div>

        <p className="text-sm mt-2 text-zinc-500">
          Stock: {product.stock}
        </p>

      </div>
    </Link>
  );
}