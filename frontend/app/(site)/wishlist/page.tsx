"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import toast from "react-hot-toast";
import { Heart, Trash2, ShoppingCart, ArrowLeft } from "lucide-react";

export default function WishlistPage() {
  const [wishlist, setWishlist] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [removingId, setRemovingId] = useState<string | null>(null);

  useEffect(() => { fetchWishlist(); }, []);

  const fetchWishlist = async () => {
  try {
    const token = localStorage.getItem("token");
    const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/wishlist`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    // filter out items whose product was deleted from DB (populate returns null)
    const validItems = (res.data.wishlist || []).filter((item: any) => item.product);
    setWishlist(validItems);
  } catch (error) { console.log(error); }
  finally { setLoading(false); }
};

  const removeWishlist = async (id: string) => {
    try {
      setRemovingId(id);
      const token = localStorage.getItem("token");
      await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/wishlist/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Removed from wishlist");
      fetchWishlist();
    } catch (error) { console.log(error); }
    finally { setRemovingId(null); }
  };

  const addToCart = async (productId: string) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) { toast.error("Please login first"); return; }
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/cart`, { productId }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Added to cart!");
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Something went wrong");
    }
  };

  if (loading) return (
    <div className="bg-[#f9f9f5] min-h-screen py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="h-8 w-40 bg-gray-200 rounded animate-pulse mb-6" />
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white rounded-2xl overflow-hidden border border-gray-100 animate-pulse">
              <div className="aspect-square bg-gray-100" />
              <div className="p-3 space-y-2">
                <div className="h-3 bg-gray-100 rounded w-3/4" />
                <div className="h-3 bg-gray-100 rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="bg-[#f9f9f5] min-h-screen py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="flex items-center gap-3 mb-2">
          <Link href="/products" className="flex items-center gap-1.5 text-[#2d6a2d] text-sm font-medium hover:underline">
            <ArrowLeft size={15} /> Continue Shopping
          </Link>
        </div>
        <div className="flex items-center gap-3 mb-6">
          <h1 className="text-2xl font-extrabold text-[#1a3d1a]">My Wishlist</h1>
          <span className="bg-[#e8f5e8] text-[#2d6a2d] text-xs font-bold px-2.5 py-1 rounded-full border border-[#c8e6c8]">
            {wishlist.length} item{wishlist.length !== 1 ? "s" : ""}
          </span>
        </div>

        {wishlist.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center bg-white rounded-2xl border border-gray-100">
            <Heart size={52} className="text-[#c8dfc8] mb-4" />
            <h2 className="text-xl font-bold text-[#1a3d1a]">Your wishlist is empty</h2>
            <p className="text-gray-400 text-sm mt-1 mb-6">Save your favourite products here!</p>
            <Link href="/products" className="bg-[#2d6a2d] hover:bg-[#235423] text-white px-6 py-2.5 rounded-xl text-sm font-semibold transition">
              Explore Products
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {wishlist.map((item) => {
              const product = item.product;
              const discount = product.mrp && product.price
                ? Math.round(((product.mrp - product.price) / product.mrp) * 100)
                : 0;

              return (
                <div key={item._id} className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm group">
                  {/* Image */}
                  <Link href={`/product/${product.slug}`} className="block relative aspect-square bg-gray-50">
                    <Image
                      src={product.images?.[0]?.url}
                      alt={product.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    {discount > 0 && (
                      <div className="absolute top-2 left-2 bg-[#2d6a2d] text-white text-[10px] font-bold px-2 py-0.5 rounded-md">
                        {discount}% OFF
                      </div>
                    )}
                    {/* Remove button */}
                    <button
                      onClick={(e) => { e.preventDefault(); removeWishlist(item._id); }}
                      disabled={removingId === item._id}
                      className="absolute top-2 right-2 w-7 h-7 bg-white rounded-full shadow flex items-center justify-center text-red-400 hover:bg-red-50 transition opacity-0 group-hover:opacity-100"
                    >
                      <Trash2 size={13} />
                    </button>
                  </Link>

                  {/* Info */}
                  <div className="p-3">
                    <Link href={`/product/${product.slug}`}>
                      <h3 className="text-[#1a3d1a] font-semibold text-sm leading-tight hover:text-[#2d6a2d] transition line-clamp-2">
                        {product.name}
                      </h3>
                    </Link>
                    {product.packSize && (
                      <p className="text-gray-400 text-[11px] mt-0.5">{product.packSize}</p>
                    )}

                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-[#2d6a2d] font-extrabold text-sm">₹{product.price}</span>
                      {product.mrp && product.mrp > product.price && (
                        <span className="text-gray-400 text-xs line-through">₹{product.mrp}</span>
                      )}
                    </div>

                    <button
                      onClick={() => addToCart(product._id)}
                      className="mt-3 w-full flex items-center justify-center gap-1.5 bg-[#2d6a2d] hover:bg-[#235423] text-white text-xs font-bold py-2.5 rounded-xl transition"
                    >
                      <ShoppingCart size={13} /> Add to Cart
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}