"use client";

import { API } from "@/lib/api";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import axios from "axios";
import toast from "react-hot-toast";
import {
  ShoppingCart, Heart, ArrowLeft, Star,
  Package, Tag, Clock, Leaf, ShieldCheck,
  ChevronRight
} from "lucide-react";

export default function ProductDetails() {
  const params = useParams();
  const [product, setProduct] = useState<any>(null);
  const [addingCart, setAddingCart] = useState(false);
  const [addingWishlist, setAddingWishlist] = useState(false);

  useEffect(() => { fetchProduct(); }, []);

  const fetchProduct = async () => {
    try {
      const res = await API.get(`/products/slug/${params.slug}`);
      setProduct(res.data.product);
    } catch (error) { console.log(error); }
  };

  const addToCart = async () => {
    try {
      setAddingCart(true);
      const token = localStorage.getItem("token");
      if (!token) { toast.error("Please login first"); return; }
      await axios.post("http://localhost:5000/api/cart", { productId: product._id }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Added to cart!");
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Something went wrong");
    } finally { setAddingCart(false); }
  };

  const addToWishlist = async () => {
    try {
      setAddingWishlist(true);
      const token = localStorage.getItem("token");
      if (!token) { toast.error("Please login first"); return; }
      await axios.post("http://localhost:5000/api/wishlist", { productId: product._id }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Added to wishlist!");
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Something went wrong");
    } finally { setAddingWishlist(false); }
  };

  const discount = product?.mrp && product?.price
    ? Math.round(((product.mrp - product.price) / product.mrp) * 100)
    : 0;

  if (!product) return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="grid md:grid-cols-2 gap-8 max-w-5xl w-full px-4">
        <div className="aspect-square bg-gray-100 rounded-2xl animate-pulse" />
        <div className="space-y-4 pt-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-4 bg-gray-100 rounded animate-pulse" style={{ width: `${70 - i * 8}%` }} />
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="bg-[#f9f9f5] min-h-screen py-6">
      <div className="max-w-6xl mx-auto px-4">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-xs text-gray-400 mb-6">
          <Link href="/" className="hover:text-[#2d6a2d] transition">Home</Link>
          <ChevronRight size={12} />
          <Link href="/products" className="hover:text-[#2d6a2d] transition">Products</Link>
          <ChevronRight size={12} />
          <span className="text-[#1a3d1a] font-medium">{product.name}</span>
        </nav>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Image */}
          <div className="relative aspect-square rounded-2xl overflow-hidden border border-gray-100 bg-white shadow-sm">
            <Image
              src={product.images?.[0]?.url}
              alt={product.name}
              fill
              className="object-cover"
            />
            {discount > 0 && (
              <div className="absolute top-3 left-3 bg-[#2d6a2d] text-white text-xs font-bold px-2.5 py-1 rounded-lg">
                {discount}% OFF
              </div>
            )}
          </div>

          {/* Info */}
          <div className="space-y-5">
            {/* Name + rating */}
            <div>
              {product.category?.name && (
                <span className="inline-flex items-center gap-1 text-[#2d6a2d] text-xs font-semibold bg-[#e8f5e8] border border-[#c8e6c8] px-2.5 py-1 rounded-full mb-2">
                  <Tag size={10} /> {product.category.name}
                </span>
              )}
              <h1 className="text-2xl md:text-3xl font-extrabold text-[#1a3d1a] leading-tight">{product.name}</h1>
              <div className="flex items-center gap-1.5 mt-2">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={14} className="text-yellow-400 fill-yellow-400" />
                ))}
                <span className="text-gray-400 text-xs ml-1">(128 reviews)</span>
              </div>
            </div>

            {/* Price */}
            <div className="flex items-end gap-3 bg-white border border-gray-100 rounded-2xl px-5 py-4">
              <span className="text-3xl font-extrabold text-[#2d6a2d]">₹{product.price}</span>
              {product.mrp && product.mrp > product.price && (
                <>
                  <span className="text-gray-400 text-base line-through mb-0.5">₹{product.mrp}</span>
                  <span className="text-xs font-bold text-white bg-[#2d6a2d] px-2 py-0.5 rounded-lg mb-0.5">
                    Save ₹{product.mrp - product.price}
                  </span>
                </>
              )}
            </div>

            {/* Description */}
            {product.description && (
              <p className="text-gray-600 text-sm leading-relaxed">{product.description}</p>
            )}

            {/* Product details grid */}
            <div className="grid grid-cols-2 gap-2">
              {[
                { icon: <Package size={13} />, label: "Brand", value: product.brand },
                { icon: <Tag size={13} />, label: "Pack Size", value: product.packSize },
                { icon: <Clock size={13} />, label: "Shelf Life", value: product.shelfLife },
                { icon: <Leaf size={13} />, label: "GST", value: product.gst ? `${product.gst}%` : null },
                { icon: <ShieldCheck size={13} />, label: "HSN Code", value: product.hsnCode },
                { icon: <Package size={13} />, label: "Stock", value: product.stock ? `${product.stock} units` : "Out of stock" },
              ].filter(d => d.value).map((d) => (
                <div key={d.label} className="flex items-center gap-2 bg-white border border-gray-100 rounded-xl px-3 py-2.5">
                  <span className="text-[#2d6a2d]">{d.icon}</span>
                  <div className="min-w-0">
                    <p className="text-[10px] text-gray-400 uppercase tracking-wide leading-none">{d.label}</p>
                    <p className="text-[#1a3d1a] font-semibold text-xs mt-0.5 truncate">{d.value}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Stock indicator */}
            {product.stock !== undefined && (
              <div className={`flex items-center gap-2 text-xs font-semibold ${product.stock > 0 ? "text-[#2d6a2d]" : "text-red-500"}`}>
                <div className={`w-2 h-2 rounded-full ${product.stock > 0 ? "bg-[#2d6a2d]" : "bg-red-500"}`} />
                {product.stock > 0 ? `In Stock (${product.stock} left)` : "Out of Stock"}
              </div>
            )}

            {/* CTA buttons */}
            <div className="flex gap-3 pt-1">
              <button
                onClick={addToCart}
                disabled={addingCart || product.stock === 0}
                className="flex-1 flex items-center justify-center gap-2 bg-[#2d6a2d] hover:bg-[#235423] text-white font-bold py-3 rounded-xl text-sm transition disabled:opacity-60 disabled:cursor-not-allowed shadow-sm"
              >
                <ShoppingCart size={16} />
                {addingCart ? "Adding…" : "Add to Cart"}
              </button>
              <button
                onClick={addToWishlist}
                disabled={addingWishlist}
                className="flex items-center justify-center gap-2 border-2 border-[#2d6a2d] text-[#2d6a2d] hover:bg-[#2d6a2d] hover:text-white font-bold px-5 py-3 rounded-xl text-sm transition disabled:opacity-60"
              >
                <Heart size={16} />
                {addingWishlist ? "…" : "Wishlist"}
              </button>
            </div>

            {/* Trust note */}
            <div className="flex items-center gap-2 text-gray-400 text-xs">
              <ShieldCheck size={13} className="text-[#2d6a2d]" />
              100% Natural • No Preservatives • Fast Delivery
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}