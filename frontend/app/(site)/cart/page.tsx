"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import toast from "react-hot-toast";
import { Trash2, ShoppingBag, Minus, Plus, ArrowLeft, Tag } from "lucide-react";
import { useRouter } from "next/navigation";

export default function CartPage() {
  const [cart, setCart] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => { fetchCart(); }, []);

  const fetchCart = async () => {
  try {
    const token = localStorage.getItem("token");
    const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/cart`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    // filter out items whose product was deleted from DB (populate returns null)
    const validItems = (res.data.cart || []).filter((item: any) => item.product);
    setCart(validItems);
  } catch (error) { console.log(error); }
  finally { setLoading(false); }
};

  const removeItem = async (id: string) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/cart/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Item removed");
      fetchCart();
    } catch (error) { console.log(error); }
  };

  const updateQty = async (id: string, quantity: number) => {
    if (quantity < 1) return;
    try {
      const token = localStorage.getItem("token");
      await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/cart/${id}`, { quantity }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchCart();
    } catch (error) { console.log(error); }
  };

  const subtotal = cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const savings = cart.reduce((acc, item) => acc + ((item.product.mrp || item.product.price) - item.product.price) * item.quantity, 0);
  const delivery = subtotal > 499 ? 0 : 49;
  const total = subtotal + delivery;

  if (loading) return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="space-y-4 w-full max-w-2xl px-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-28 bg-gray-100 rounded-2xl animate-pulse" />
        ))}
      </div>
    </div>
  );

  return (
    <div className="bg-[#f9f9f5] min-h-screen py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <Link href="/products" className="flex items-center gap-1.5 text-[#2d6a2d] text-sm font-medium hover:underline">
            <ArrowLeft size={16} /> Continue Shopping
          </Link>
        </div>
        <h1 className="text-2xl font-extrabold text-[#1a3d1a] mb-6">
          Shopping Cart <span className="text-base font-semibold text-gray-400 ml-2">({cart.length} item{cart.length !== 1 ? "s" : ""})</span>
        </h1>

        {cart.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center bg-white rounded-2xl border border-gray-100">
            <ShoppingBag size={52} className="text-[#c8dfc8] mb-4" />
            <h2 className="text-xl font-bold text-[#1a3d1a]">Your cart is empty</h2>
            <p className="text-gray-400 text-sm mt-1 mb-6">Add some healthy seeds to your cart!</p>
            <Link href="/products" className="bg-[#2d6a2d] hover:bg-[#235423] text-white px-6 py-2.5 rounded-xl text-sm font-semibold transition">
              Shop Now
            </Link>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Cart items */}
            <div className="flex-1 space-y-4">
              {cart.map((item) => (
                <div key={item._id} className="bg-white border border-gray-100 rounded-2xl p-4 flex gap-4 shadow-sm">
                  {/* Image */}
                  <div className="relative w-20 h-20 md:w-24 md:h-24 shrink-0 rounded-xl overflow-hidden border border-gray-100 bg-gray-50">
                    <Image
                      src={item.product.images?.[0]?.url}
                      alt={item.product.name}
                      fill
                      className="object-cover"
                    />
                  </div>

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h2 className="font-bold text-[#1a3d1a] text-sm md:text-base leading-tight">{item.product.name}</h2>
                        {item.product.packSize && (
                          <p className="text-gray-400 text-xs mt-0.5">{item.product.packSize}</p>
                        )}
                      </div>
                      <button
                        onClick={() => removeItem(item._id)}
                        className="text-gray-300 hover:text-red-400 transition shrink-0"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>

                    <div className="flex items-center justify-between mt-3 flex-wrap gap-2">
                      <div className="flex items-center gap-2">
                        <span className="text-[#2d6a2d] font-extrabold text-base">₹{item.product.price}</span>
                        {item.product.mrp && item.product.mrp > item.product.price && (
                          <span className="text-gray-400 text-xs line-through">₹{item.product.mrp}</span>
                        )}
                      </div>

                      {/* Qty control */}
                      <div className="flex items-center gap-0 border border-gray-200 rounded-xl overflow-hidden">
                        <button
                          onClick={() => updateQty(item._id, item.quantity - 1)}
                          className="w-8 h-8 flex items-center justify-center hover:bg-gray-50 transition text-gray-600"
                        >
                          <Minus size={13} />
                        </button>
                        <span className="w-8 text-center text-sm font-bold text-[#1a3d1a]">{item.quantity}</span>
                        <button
                          onClick={() => updateQty(item._id, item.quantity + 1)}
                          className="w-8 h-8 flex items-center justify-center hover:bg-gray-50 transition text-gray-600"
                        >
                          <Plus size={13} />
                        </button>
                      </div>
                    </div>

                    <p className="text-right text-xs text-gray-400 mt-1">
                      Subtotal: <span className="text-[#1a3d1a] font-semibold">₹{item.product.price * item.quantity}</span>
                    </p>
                  </div>
                </div>
              ))}

              {/* Free delivery banner */}
              {subtotal < 499 && (
                <div className="flex items-center gap-3 bg-[#e8f5e8] border border-[#c8e6c8] rounded-xl px-4 py-3 text-sm text-[#2d6a2d]">
                  <Tag size={15} />
                  Add ₹{499 - subtotal} more for <span className="font-bold ml-1">FREE delivery!</span>
                </div>
              )}
              {subtotal >= 499 && (
                <div className="flex items-center gap-3 bg-[#e8f5e8] border border-[#c8e6c8] rounded-xl px-4 py-3 text-sm text-[#2d6a2d] font-semibold">
                  🎉 You've unlocked FREE delivery!
                </div>
              )}
            </div>

            {/* Order summary */}
            <div className="w-full lg:w-80 shrink-0">
              <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm sticky top-24">
                <h3 className="font-extrabold text-[#1a3d1a] text-base mb-4 pb-3 border-b border-gray-100">Order Summary</h3>

                <div className="space-y-3 text-sm">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal ({cart.length} items)</span>
                    <span className="font-medium text-[#1a3d1a]">₹{subtotal}</span>
                  </div>
                  {savings > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>You Save</span>
                      <span className="font-semibold">− ₹{savings}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-gray-600">
                    <span>Delivery</span>
                    <span className={delivery === 0 ? "text-[#2d6a2d] font-semibold" : "font-medium text-[#1a3d1a]"}>
                      {delivery === 0 ? "FREE" : `₹${delivery}`}
                    </span>
                  </div>
                  <div className="flex justify-between font-extrabold text-[#1a3d1a] text-base pt-3 border-t border-gray-100">
                    <span>Total</span>
                    <span>₹{total}</span>
                  </div>
                </div>

                <button
  onClick={() => router.push("/checkout")}
  className="w-full mt-5 bg-[#2d6a2d] hover:bg-[#235423] text-white font-bold py-3 rounded-xl text-sm transition shadow-sm"
>
  Proceed to Checkout
</button>

                <div className="flex items-center justify-center gap-2 mt-3 text-gray-400 text-xs">
                  🔒 Secure & Encrypted Payment
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}