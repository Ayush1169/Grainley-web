"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { API } from "@/lib/api";
import Link from "next/link";
import {
  CheckCircle2, Package, Calendar, CreditCard,
  MapPin, ArrowRight, Loader2,
} from "lucide-react";

interface OrderDetails {
  _id: string;
  trackingId: string;
  totalAmount: number;
  orderStatus: string;
  paymentMethod: string;
  estimatedDeliveryDate: string;
  createdAt: string;
  shippingAddress: {
    fullName: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    pincode: string;
  };
}

export default function OrderSuccessPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const orderId = searchParams.get("id");

  const [order, setOrder] = useState<OrderDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!orderId) {
      setError(true);
      setLoading(false);
      return;
    }
    fetchOrder();
  }, [orderId]);

  const fetchOrder = async () => {
    try {
      const token = localStorage.getItem("token");
      const { data } = await API.get(`/orders/${orderId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOrder(data.order);
    } catch (err) {
      console.log(err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "Not available";
    return new Date(dateStr).toLocaleDateString("en-IN", {
      weekday: "short",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center bg-[#f8f8f3]">
        <Loader2 className="animate-spin text-[#2d6a2d] mb-3" size={32} />
        <p className="text-gray-500 text-sm">Loading your order…</p>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center bg-[#f8f8f3] px-4">
        <Package className="text-gray-300 mb-4" size={48} />
        <h2 className="text-xl font-bold text-[#1a3d1a] mb-2">
          We couldn't find that order
        </h2>
        <p className="text-gray-500 text-sm mb-6 text-center">
          The order link may be invalid or it has expired.
        </p>
        <Link
          href="/profile/orders"
          className="bg-[#2d6a2d] hover:bg-[#235423] text-white px-6 py-3 rounded-xl text-sm font-semibold transition"
        >
          Go to My Orders
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8f8f3] py-10 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Success header */}
        <div className="bg-white rounded-2xl shadow border border-gray-100 p-8 text-center mb-6">
          <div className="w-16 h-16 rounded-full bg-[#e8f5e8] flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="text-[#2d6a2d]" size={36} />
          </div>
          <h1 className="text-2xl font-extrabold text-[#1a3d1a] mb-1">
            Order Placed Successfully!
          </h1>
          <p className="text-gray-500 text-sm">
            Thank you for shopping with us. A confirmation has been sent to your account.
          </p>
        </div>

        {/* Order details card */}
        <div className="bg-white rounded-2xl shadow border border-gray-100 p-6 mb-6">
          <div className="flex justify-between items-center pb-4 mb-4 border-b border-gray-100">
            <div>
              <p className="text-xs text-gray-400">Tracking ID</p>
              <p className="font-bold text-[#1a3d1a] text-lg">{order.trackingId}</p>
            </div>
            <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-semibold">
              {order.orderStatus}
            </span>
          </div>

          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <Calendar size={17} className="text-[#2d6a2d] mt-0.5 shrink-0" />
              <div>
                <p className="text-xs text-gray-400">Estimated Delivery</p>
                <p className="font-semibold text-[#1a3d1a] text-sm">
                  {formatDate(order.estimatedDeliveryDate)}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <CreditCard size={17} className="text-[#2d6a2d] mt-0.5 shrink-0" />
              <div>
                <p className="text-xs text-gray-400">Payment Method</p>
                <p className="font-semibold text-[#1a3d1a] text-sm">
                  {order.paymentMethod === "COD" ? "Cash on Delivery" : order.paymentMethod}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <MapPin size={17} className="text-[#2d6a2d] mt-0.5 shrink-0" />
              <div>
                <p className="text-xs text-gray-400">Delivering To</p>
                <p className="font-semibold text-[#1a3d1a] text-sm">
                  {order.shippingAddress?.fullName}
                </p>
                <p className="text-gray-500 text-xs mt-0.5 leading-relaxed">
                  {order.shippingAddress?.address}, {order.shippingAddress?.city},{" "}
                  {order.shippingAddress?.state} – {order.shippingAddress?.pincode}
                </p>
              </div>
            </div>
          </div>

          <div className="flex justify-between items-center mt-5 pt-4 border-t border-gray-100">
            <span className="text-gray-500 text-sm">Total Amount</span>
            <span className="font-extrabold text-[#1a3d1a] text-xl">
              ₹{order.totalAmount}
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Link
            href={`/orders/${order._id}`}
            className="flex-1 flex items-center justify-center gap-2 bg-[#2d6a2d] hover:bg-[#235423] text-white font-semibold py-3.5 rounded-xl text-sm transition"
          >
            Track Order <ArrowRight size={15} />
          </Link>
          <Link
            href="/products"
            className="flex-1 flex items-center justify-center gap-2 bg-white border border-gray-200 hover:border-[#2d6a2d] text-[#1a3d1a] font-semibold py-3.5 rounded-xl text-sm transition"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}