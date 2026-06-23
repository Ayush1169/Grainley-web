"use client";

import { API } from "@/lib/api";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import axios from "axios";
import toast from "react-hot-toast";
import {
  ShoppingCart, Heart, Star,
  Package, Tag, Clock, Leaf, ShieldCheck,
  ChevronRight, Plus, Minus, Loader2
} from "lucide-react";
import { getGuestCartQty, addToGuestCart, updateGuestCartQty } from "@/lib/guestCart";

export default function ProductDetails() {
  const params = useParams();
  const [product, setProduct] = useState<any>(null);

  const [cartItemId, setCartItemId] = useState<string | null>(null);
  const [cartQty, setCartQty] = useState(0);
  const [cartLoading, setCartLoading] = useState(false);

  const [wishlistItemId, setWishlistItemId] = useState<string | null>(null);
  const [wishlistLoading, setWishlistLoading] = useState(false);
  const inWishlist = !!wishlistItemId;

  const getToken = () => localStorage.getItem("token");

  useEffect(() => { fetchProduct(); }, []);

  useEffect(() => {
    if (product?._id) {
      fetchCartStatus();
      fetchWishlistStatus();
    }
  }, [product?._id]);

  const fetchProduct = async () => {
    try {
      const res = await API.get(`/products/slug/${params.slug}`);
      setProduct(res.data.product);
    } catch (error) { console.log(error); }
  };

  // cart status — guest (localStorage) or logged-in (backend)
  const fetchCartStatus = async () => {
    const token = getToken();
    if (!token) {
      setCartItemId(null);
      setCartQty(getGuestCartQty(product._id));
      return;
    }
    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/cart`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const items = res.data?.cart || [];
      const existing = items.find((item: any) => item.product?._id === product._id);
      if (existing) {
        setCartItemId(existing._id);
        setCartQty(existing.quantity);
      } else {
        setCartItemId(null);
        setCartQty(0);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const fetchWishlistStatus = async () => {
    const token = getToken();
    if (!token) return; // wishlist still needs login
    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/wishlist`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const items = res.data?.wishlist || [];
      const existing = items.find((item: any) => item.product?._id === product._id);
      setWishlistItemId(existing?._id || null);
    } catch (error) {
      console.log(error);
    }
  };

  const requireAuth = () => {
    const token = getToken();
    if (!token) {
      toast.error("Please login first");
      return null;
    }
    return token;
  };

  // first click — guest goes to localStorage, logged-in user goes to backend
  const addToCart = async () => {
    const token = getToken();

    if (!token) {
      const newQty = addToGuestCart(product._id);
      setCartQty(newQty);
      toast.success("Added to cart!");
      return;
    }

    try {
      setCartLoading(true);
      const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/cart`, { productId: product._id }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCartItemId(res.data.cart._id);
      setCartQty(res.data.cart.quantity);
      toast.success("Added to cart!");
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Something went wrong");
    } finally { setCartLoading(false); }
  };

  // +/- once it's already in the cart
  const updateCartQty = async (nextQty: number) => {
    const token = getToken();

    if (!token) {
      updateGuestCartQty(product._id, nextQty);
      setCartQty(Math.max(nextQty, 0));
      if (nextQty <= 0) toast.success("Removed from cart");
      return;
    }

    if (!cartItemId) return;
    try {
      setCartLoading(true);
      if (nextQty <= 0) {
        await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/cart/${cartItemId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCartItemId(null);
        setCartQty(0);
        toast.success("Removed from cart");
      } else {
        await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/cart/${cartItemId}`, { quantity: nextQty }, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCartQty(nextQty);
      }
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Something went wrong");
    } finally { setCartLoading(false); }
  };

  // wishlist stays login-required, as already implemented
  const toggleWishlist = async () => {
    const token = requireAuth();
    if (!token) return;
    try {
      setWishlistLoading(true);
      if (inWishlist && wishlistItemId) {
        await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/wishlist/${wishlistItemId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setWishlistItemId(null);
        toast.success("Removed from wishlist");
      } else {
        const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/wishlist`, { productId: product._id }, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setWishlistItemId(res.data.wishlist._id);
        toast.success("Added to wishlist!");
      }
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Something went wrong");
    } finally { setWishlistLoading(false); }
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
        <nav className="flex items-center gap-1.5 text-xs text-gray-400 mb-6">
          <Link href="/" className="hover:text-[#2d6a2d] transition">Home</Link>
          <ChevronRight size={12} />
          <Link href="/products" className="hover:text-[#2d6a2d] transition">Products</Link>
          <ChevronRight size={12} />
          <span className="text-[#1a3d1a] font-medium">{product.name}</span>
        </nav>

        <div className="grid md:grid-cols-2 gap-8">
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

          <div className="space-y-5">
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

            {product.description && (
              <p className="text-gray-600 text-sm leading-relaxed">{product.description}</p>
            )}

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

            {product.stock !== undefined && (
              <div className={`flex items-center gap-2 text-xs font-semibold ${product.stock > 0 ? "text-[#2d6a2d]" : "text-red-500"}`}>
                <div className={`w-2 h-2 rounded-full ${product.stock > 0 ? "bg-[#2d6a2d]" : "bg-red-500"}`} />
                {product.stock > 0 ? `In Stock (${product.stock} left)` : "Out of Stock"}
              </div>
            )}

            <div className="flex gap-3 pt-1">
              {cartQty === 0 ? (
                <button
                  onClick={addToCart}
                  disabled={cartLoading || product.stock === 0}
                  className="flex-1 flex items-center justify-center gap-2 bg-[#2d6a2d] hover:bg-[#235423] text-white font-bold py-3 rounded-xl text-sm transition disabled:opacity-60 disabled:cursor-not-allowed shadow-sm"
                >
                  {cartLoading ? <Loader2 size={16} className="animate-spin" /> : <ShoppingCart size={16} />}
                  {cartLoading ? "Adding…" : "Add to Cart"}
                </button>
              ) : (
                <div className="flex-1 flex items-center justify-between bg-[#2d6a2d] text-white font-bold py-1.5 px-2 rounded-xl text-sm shadow-sm">
                  <button
                    onClick={() => updateCartQty(cartQty - 1)}
                    disabled={cartLoading}
                    className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-white/15 disabled:opacity-60 transition"
                  >
                    <Minus size={16} />
                  </button>
                  <span className="text-base tabular-nums">
                    {cartLoading ? <Loader2 size={16} className="animate-spin mx-auto" /> : cartQty}
                  </span>
                  <button
                    onClick={() => updateCartQty(cartQty + 1)}
                    disabled={cartLoading || cartQty >= product.stock}
                    className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-white/15 disabled:opacity-60 transition"
                  >
                    <Plus size={16} />
                  </button>
                </div>
              )}

              <button
                onClick={toggleWishlist}
                disabled={wishlistLoading}
                className={`flex items-center justify-center gap-2 border-2 font-bold px-5 py-3 rounded-xl text-sm transition disabled:opacity-60 ${
                  inWishlist
                    ? "border-[#2d6a2d] bg-[#2d6a2d] text-white"
                    : "border-[#2d6a2d] text-[#2d6a2d] hover:bg-[#2d6a2d] hover:text-white"
                }`}
              >
                <Heart size={16} className={inWishlist ? "fill-white" : ""} />
                {wishlistLoading ? "…" : inWishlist ? "Already in Wishlist" : "Wishlist"}
              </button>
            </div>

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