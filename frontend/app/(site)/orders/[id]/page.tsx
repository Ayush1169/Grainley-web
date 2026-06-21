"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { API } from "@/lib/api";
import Image from "next/image";
import Link from "next/link";
import {
  Package, MapPin, CreditCard, Truck, Loader2,
  CheckCircle2, Circle, XCircle, ArrowLeft, Box,
} from "lucide-react";

interface OrderItem {
  product: {
    _id: string;
    name: string;
    slug: string;
    images: { url: string }[];
  };
  quantity: number;
  price: number;
}

interface OrderDetails {
  _id: string;
  trackingId: string;
  totalAmount: number;
  orderStatus: string;
  paymentMethod: string;
  paymentStatus: string;
  estimatedDeliveryDate: string;
  createdAt: string;
  courierName: string | null;
  courierTrackingId: string | null;
  products: OrderItem[];
  shippingAddress: {
    fullName: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    pincode: string;
  };
  tracking: {
    orderPlacedAt: string;
    packedAt: string | null;
    shippedAt: string | null;
    outForDeliveryAt: string | null;
    deliveredAt: string | null;
  };
}

// Defines the order in which timeline steps appear.
// Each step maps to a field on order.tracking.
const TIMELINE_STEPS = [
  { key: "orderPlacedAt", label: "Order Placed" },
  { key: "packedAt", label: "Packed" },
  { key: "shippedAt", label: "Shipped" },
  { key: "outForDeliveryAt", label: "Out For Delivery" },
  { key: "deliveredAt", label: "Delivered" },
] as const;

export default function OrderDetailsPage() {
  const params = useParams();
  const orderId = params.id as string;

  const [order, setOrder] = useState<OrderDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!orderId) return;
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

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return null;
    return new Date(dateStr).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatEstimate = (dateStr: string) => {
    if (!dateStr) return "Not available";
    return new Date(dateStr).toLocaleDateString("en-IN", {
      weekday: "short",
      day: "numeric",
      month: "long",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center bg-[#f8f8f3]">
        <Loader2 className="animate-spin text-[#2d6a2d] mb-3" size={32} />
        <p className="text-gray-500 text-sm">Loading order details…</p>
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
        <Link
          href="/profile/orders"
          className="bg-[#2d6a2d] hover:bg-[#235423] text-white px-6 py-3 rounded-xl text-sm font-semibold transition mt-4"
        >
          Go to My Orders
        </Link>
      </div>
    );
  }

  const isCancelled = order.orderStatus === "Cancelled";

  // Determine how many timeline steps are "complete" based on which
  // tracking timestamps exist. Steps are sequential, so the last
  // filled timestamp tells us how far along the order is.
  let completedStepIndex = -1;
  TIMELINE_STEPS.forEach((step, idx) => {
    if (order.tracking?.[step.key]) completedStepIndex = idx;
  });

  return (
    <div className="min-h-screen bg-[#f8f8f3] py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <Link
          href="/profile/orders"
          className="flex items-center gap-1.5 text-[#2d6a2d] text-sm font-medium hover:underline mb-4 w-fit"
        >
          <ArrowLeft size={15} /> Back to My Orders
        </Link>

        {/* Header card */}
        <div className="bg-white rounded-2xl shadow border border-gray-100 p-5 mb-5 flex flex-wrap justify-between items-center gap-3">
          <div>
            <p className="text-xs text-gray-400">Tracking ID</p>
            <p className="font-bold text-[#1a3d1a] text-lg">{order.trackingId}</p>
            <p className="text-xs text-gray-400 mt-1">
              Ordered on {formatDate(order.createdAt)}
            </p>
          </div>
          <span
            className={`px-3 py-1.5 rounded-full text-xs font-semibold ${
              isCancelled
                ? "bg-red-100 text-red-700"
                : "bg-green-100 text-green-700"
            }`}
          >
            {order.orderStatus}
          </span>
        </div>

        {/* Tracking Timeline */}
        <div className="bg-white rounded-2xl shadow border border-gray-100 p-6 mb-5">
          <h2 className="font-bold text-[#1a3d1a] mb-5 flex items-center gap-2">
            <Truck size={18} className="text-[#2d6a2d]" /> Order Tracking
          </h2>

          {isCancelled ? (
            <div className="flex items-center gap-3 bg-red-50 border border-red-100 rounded-xl px-4 py-4">
              <XCircle className="text-red-500 shrink-0" size={22} />
              <div>
                <p className="font-semibold text-red-700 text-sm">
                  This order was cancelled
                </p>
                <p className="text-red-500 text-xs mt-0.5">
                  No further tracking updates will be shown for this order.
                </p>
              </div>
            </div>
          ) : (
            <div className="relative pl-1">
              {TIMELINE_STEPS.map((step, idx) => {
                const isDone = idx <= completedStepIndex;
                const isLast = idx === TIMELINE_STEPS.length - 1;
                const timestamp = order.tracking?.[step.key];

                return (
                  <div key={step.key} className="flex gap-4">
                    {/* Icon + connecting line */}
                    <div className="flex flex-col items-center">
                      {isDone ? (
                        <CheckCircle2 className="text-[#2d6a2d] shrink-0" size={22} />
                      ) : (
                        <Circle className="text-gray-300 shrink-0" size={22} />
                      )}
                      {!isLast && (
                        <div
                          className={`w-0.5 flex-1 min-h-[28px] ${
                            idx < completedStepIndex ? "bg-[#2d6a2d]" : "bg-gray-200"
                          }`}
                        />
                      )}
                    </div>

                    {/* Label + timestamp */}
                    <div className={`pb-7 ${isLast ? "pb-0" : ""}`}>
                      <p
                        className={`text-sm font-semibold ${
                          isDone ? "text-[#1a3d1a]" : "text-gray-400"
                        }`}
                      >
                        {step.label}
                      </p>
                      {timestamp && (
                        <p className="text-xs text-gray-400 mt-0.5">
                          {formatDate(timestamp)}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Courier info — only shown once admin has shipped the order */}
          {order.courierName && order.courierTrackingId && (
            <div className="flex items-center gap-2 bg-[#f5f5ef] border border-gray-100 rounded-xl px-4 py-3 mt-5 text-sm">
              <Box size={15} className="text-[#2d6a2d] shrink-0" />
              <span className="text-gray-600">
                Shipped via <span className="font-semibold text-[#1a3d1a]">{order.courierName}</span>
                {" · "}AWB: <span className="font-semibold text-[#1a3d1a]">{order.courierTrackingId}</span>
              </span>
            </div>
          )}

          {!isCancelled && (
            <div className="flex items-center gap-2 text-sm mt-4">
              <span className="text-gray-500">Estimated Delivery:</span>
              <span className="font-semibold text-[#2d6a2d]">
                {formatEstimate(order.estimatedDeliveryDate)}
              </span>
            </div>
          )}
        </div>

        <div className="grid md:grid-cols-2 gap-5">
          {/* Products */}
          <div className="bg-white rounded-2xl shadow border border-gray-100 p-5">
            <h2 className="font-bold text-[#1a3d1a] mb-4 flex items-center gap-2">
              <Package size={18} className="text-[#2d6a2d]" /> Items
            </h2>
            <div className="space-y-4">
              {order.products.map((item, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <div className="relative w-14 h-14 rounded-lg overflow-hidden bg-zinc-100 shrink-0">
                    {item.product?.images?.[0]?.url ? (
                      <Image
                        src={item.product.images[0].url}
                        alt={item.product.name}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="h-full flex items-center justify-center text-[10px] text-gray-400">
                        No Image
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-[#1a3d1a] truncate">
                      {item.product?.name || "Product unavailable"}
                    </p>
                    <p className="text-xs text-gray-400">Qty: {item.quantity}</p>
                  </div>
                  <p className="text-sm font-semibold text-[#1a3d1a] shrink-0">
                    ₹{item.price * item.quantity}
                  </p>
                </div>
              ))}
            </div>

            <div className="flex justify-between items-center mt-5 pt-4 border-t border-gray-100">
              <span className="text-gray-500 text-sm">Total Amount</span>
              <span className="font-extrabold text-[#1a3d1a] text-lg">
                ₹{order.totalAmount}
              </span>
            </div>
          </div>

          {/* Address + Payment */}
          <div className="space-y-5">
            <div className="bg-white rounded-2xl shadow border border-gray-100 p-5">
              <h2 className="font-bold text-[#1a3d1a] mb-3 flex items-center gap-2">
                <MapPin size={18} className="text-[#2d6a2d]" /> Delivery Address
              </h2>
              <p className="text-sm font-semibold text-[#1a3d1a]">
                {order.shippingAddress?.fullName}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {order.shippingAddress?.phone}
              </p>
              <p className="text-sm text-gray-600 mt-2 leading-relaxed">
                {order.shippingAddress?.address}
                <br />
                {order.shippingAddress?.city}, {order.shippingAddress?.state} –{" "}
                {order.shippingAddress?.pincode}
              </p>
            </div>

            <div className="bg-white rounded-2xl shadow border border-gray-100 p-5">
              <h2 className="font-bold text-[#1a3d1a] mb-3 flex items-center gap-2">
                <CreditCard size={18} className="text-[#2d6a2d]" /> Payment
              </h2>
              <div className="flex justify-between text-sm mb-1.5">
                <span className="text-gray-500">Method</span>
                <span className="font-semibold text-[#1a3d1a]">
                  {order.paymentMethod === "COD" ? "Cash on Delivery" : order.paymentMethod}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Status</span>
                <span
                  className={`font-semibold ${
                    order.paymentStatus === "Paid" ? "text-[#2d6a2d]" : "text-amber-600"
                  }`}
                >
                  {order.paymentStatus}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}