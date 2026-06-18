"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  MapPin, Plus, ArrowLeft, ShieldCheck,
  Truck, CreditCard, Check, ShoppingBag,
} from "lucide-react";

export default function CheckoutPage() {
  const router = useRouter();

  const [cart, setCart] = useState<any[]>([]);
  const [addresses, setAddresses] = useState<any[]>([]);
  const [selectedAddress, setSelectedAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);

  useEffect(() => {
    Promise.all([fetchCart(), fetchAddresses()]).finally(() => setPageLoading(false));
  }, []);

  const fetchCart = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:5000/api/cart", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCart(res.data.cart || []);
    } catch (error) { console.log(error); }
  };

  const fetchAddresses = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:5000/api/addresses", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAddresses(res.data.addresses || []);
      const defaultAddress = res.data.addresses?.find((a: any) => a.isDefault);
      if (defaultAddress) setSelectedAddress(defaultAddress._id);
    } catch (error) { console.log(error); }
  };

  const totalAmount = cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const delivery = totalAmount > 499 ? 0 : 49;
  const grandTotal = totalAmount + delivery;

  const placeOrder = async () => {
    try {
      if (!selectedAddress) { toast.error("Please select a delivery address"); return; }

      const selected = addresses.find((a: any) => a._id === selectedAddress);
      if (!selected) { toast.error("Address not found"); return; }

      setLoading(true);
      const token = localStorage.getItem("token");

      const products = cart.map((item) => ({
        product: item.product._id,
        quantity: item.quantity,
        price: item.product.price,
      }));

      await axios.post(
        "http://localhost:5000/api/orders",
        {
          products,
          totalAmount,
          shippingAddress: `
${selected.houseNo},
${selected.street},
${selected.landmark},
${selected.city},
${selected.state},
${selected.pincode}
`,
          paymentMethod: "COD",
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success("Order placed successfully!");
      router.push("/profile/orders");
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Order failed");
    } finally {
      setLoading(false);
    }
  };

  if (pageLoading) {
    return (
      <div className="bg-[#f9f9f5] min-h-screen py-8">
        <div className="max-w-6xl mx-auto px-4 space-y-4">
          <div className="h-8 w-40 bg-gray-200 rounded animate-pulse" />
          <div className="grid md:grid-cols-2 gap-6">
            <div className="h-72 bg-white border border-gray-100 rounded-2xl animate-pulse" />
            <div className="h-72 bg-white border border-gray-100 rounded-2xl animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#f9f9f5] min-h-screen py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <Link href="/cart" className="flex items-center gap-1.5 text-[#2d6a2d] text-sm font-medium hover:underline mb-3 w-fit">
          <ArrowLeft size={15} /> Back to Cart
        </Link>
        <h1 className="text-2xl font-extrabold text-[#1a3d1a] mb-6">Checkout</h1>

        {/* Step indicator */}
        <div className="flex items-center gap-2 mb-6 text-xs font-semibold">
          <span className="flex items-center gap-1.5 text-[#2d6a2d]">
            <span className="w-5 h-5 rounded-full bg-[#2d6a2d] text-white flex items-center justify-center text-[10px]">✓</span> Cart
          </span>
          <span className="w-8 h-px bg-[#2d6a2d]" />
          <span className="flex items-center gap-1.5 text-[#2d6a2d]">
            <span className="w-5 h-5 rounded-full bg-[#2d6a2d] text-white flex items-center justify-center text-[10px]">2</span> Checkout
          </span>
          <span className="w-8 h-px bg-gray-200" />
          <span className="flex items-center gap-1.5 text-gray-400">
            <span className="w-5 h-5 rounded-full bg-gray-200 text-gray-400 flex items-center justify-center text-[10px]">3</span> Confirmation
          </span>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* ── Address Section ── */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <MapPin size={18} className="text-[#2d6a2d]" />
              <h2 className="text-lg font-bold text-[#1a3d1a]">Select Delivery Address</h2>
            </div>

            {addresses.length === 0 ? (
              <div className="bg-white border border-gray-100 rounded-2xl p-8 text-center">
                <MapPin size={36} className="text-gray-200 mx-auto mb-3" />
                <p className="text-[#1a3d1a] font-semibold text-sm">No saved addresses</p>
                <p className="text-gray-400 text-xs mt-1 mb-4">Add an address to continue checkout</p>
                <button
                  onClick={() => router.push("/profile/addresses")}
                  className="bg-[#2d6a2d] hover:bg-[#235423] text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition"
                >
                  + Add New Address
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {addresses.map((addr: any) => {
                  const isSelected = selectedAddress === addr._id;
                  return (
                    <label
                      key={addr._id}
                      className={`block rounded-2xl p-4 cursor-pointer transition-all border-2 ${
                        isSelected
                          ? "border-[#2d6a2d] bg-[#e8f5e8]"
                          : "border-gray-100 bg-white hover:border-gray-200"
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`mt-0.5 w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${
                          isSelected ? "border-[#2d6a2d] bg-[#2d6a2d]" : "border-gray-300"
                        }`}>
                          {isSelected && <Check size={11} className="text-white" />}
                        </div>
                        <input
                          type="radio"
                          checked={isSelected}
                          onChange={() => setSelectedAddress(addr._id)}
                          className="hidden"
                        />
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <p className="font-bold text-[#1a3d1a] text-sm">{addr.fullName}</p>
                            {addr.isDefault && (
                              <span className="text-[10px] font-bold bg-[#2d6a2d] text-white px-2 py-0.5 rounded-full">DEFAULT</span>
                            )}
                          </div>
                          <p className="text-gray-500 text-xs mt-0.5">{addr.mobile}</p>
                          <p className="text-gray-600 text-sm mt-1.5 leading-relaxed">
                            {addr.houseNo}, {addr.street}{addr.landmark && `, ${addr.landmark}`}
                            <br />
                            {addr.city}, {addr.state} – {addr.pincode}
                          </p>
                        </div>
                      </div>
                    </label>
                  );
                })}

                <button
                  onClick={() => router.push("/profile/addresses")}
                  className="w-full flex items-center justify-center gap-2 border-2 border-dashed border-gray-200 hover:border-[#2d6a2d] text-[#2d6a2d] font-semibold text-sm rounded-2xl py-3 transition"
                >
                  <Plus size={15} /> Add New Address
                </button>
              </div>
            )}
          </div>

          {/* ── Order Summary ── */}
          <div>
            <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm sticky top-24">
              <div className="flex items-center gap-2 mb-4 pb-4 border-b border-gray-100">
                <ShoppingBag size={18} className="text-[#2d6a2d]" />
                <h2 className="text-lg font-bold text-[#1a3d1a]">Order Summary</h2>
              </div>

              {/* Items */}
              <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
                {cart.map((item) => (
                  <div key={item._id} className="flex justify-between items-start gap-3 text-sm">
                    <span className="text-gray-600 leading-snug">
                      {item.product.name}
                      <span className="text-gray-400"> × {item.quantity}</span>
                    </span>
                    <span className="font-semibold text-[#1a3d1a] shrink-0">₹{item.product.price * item.quantity}</span>
                  </div>
                ))}
              </div>

              <hr className="my-4 border-gray-100" />

              {/* Totals */}
              <div className="space-y-2 text-sm">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span className="font-medium text-[#1a3d1a]">₹{totalAmount}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Delivery</span>
                  <span className={delivery === 0 ? "text-[#2d6a2d] font-semibold" : "font-medium text-[#1a3d1a]"}>
                    {delivery === 0 ? "FREE" : `₹${delivery}`}
                  </span>
                </div>
              </div>

              <hr className="my-4 border-gray-100" />

              <div className="flex justify-between font-extrabold text-[#1a3d1a] text-lg">
                <span>Total</span>
                <span>₹{grandTotal}</span>
              </div>

              {/* Payment method */}
              <div className="flex items-center gap-2 bg-[#f5f5ef] border border-gray-100 rounded-xl px-4 py-3 mt-4 text-sm">
                <CreditCard size={15} className="text-[#2d6a2d]" />
                <span className="text-gray-600">Payment Method:</span>
                <span className="font-bold text-[#1a3d1a]">Cash on Delivery</span>
              </div>

              <button
                onClick={placeOrder}
                disabled={loading || cart.length === 0}
                className="w-full mt-5 bg-[#2d6a2d] hover:bg-[#235423] text-white font-bold py-3.5 rounded-xl text-sm transition disabled:opacity-60 disabled:cursor-not-allowed shadow-sm"
              >
                {loading ? "Placing Order…" : `Place Order (COD) · ₹${grandTotal}`}
              </button>

              <div className="flex items-center justify-center gap-4 mt-4 text-gray-400 text-[11px]">
                <span className="flex items-center gap-1"><ShieldCheck size={12} /> Secure</span>
                <span className="flex items-center gap-1"><Truck size={12} /> Fast Delivery</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}