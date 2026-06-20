"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { Package, Truck, Loader2, X } from "lucide-react";

interface OrderItem {
  product: {
    _id: string;
    name: string;
  };
  quantity: number;
  price: number;
}

interface Order {
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
  user: {
    name: string;
    email: string;
    phone: string;
  };
  shippingAddress: {
    fullName: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    pincode: string;
  };
}

const STATUS_OPTIONS = [
  "Pending",
  "Processing",
  "Packed",
  "Shipped",
  "Out For Delivery",
  "Delivered",
  "Cancelled",
];

const STATUS_COLORS: Record<string, string> = {
  Pending: "bg-yellow-500/20 text-yellow-400",
  Processing: "bg-blue-500/20 text-blue-400",
  Packed: "bg-purple-500/20 text-purple-400",
  Shipped: "bg-cyan-500/20 text-cyan-400",
  "Out For Delivery": "bg-orange-500/20 text-orange-400",
  Delivered: "bg-green-500/20 text-green-400",
  Cancelled: "bg-red-500/20 text-red-400",
};

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  // Holds state for the "enter courier details" modal,
  // shown only when an admin picks "Shipped" from the dropdown.
  const [courierModalOrder, setCourierModalOrder] = useState<Order | null>(null);
  const [courierName, setCourierName] = useState("");
  const [courierTrackingId, setCourierTrackingId] = useState("");

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/orders/admin/all`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setOrders(res.data.orders || []);
    } catch (error) {
      console.log(error);
      toast.error("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  // Central status update function. If the new status is "Shipped",
  // we don't fire the request immediately — we open the courier modal
  // first, and the actual API call happens from there instead.
  const handleStatusChange = (order: Order, newStatus: string) => {
    if (newStatus === "Shipped") {
      setCourierName(order.courierName || "");
      setCourierTrackingId(order.courierTrackingId || "");
      setCourierModalOrder(order);
      return;
    }

    updateOrder(order._id, { orderStatus: newStatus });
  };

  const updateOrder = async (
    orderId: string,
    payload: { orderStatus?: string; courierName?: string; courierTrackingId?: string }
  ) => {
    try {
      setUpdatingId(orderId);
      const token = localStorage.getItem("token");

      const res = await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/orders/admin/${orderId}`,
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success("Order updated");

      setOrders((prev) =>
        prev.map((o) => (o._id === orderId ? res.data.order : o))
      );
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Update failed");
    } finally {
      setUpdatingId(null);
    }
  };

  const submitCourierDetails = async () => {
    if (!courierModalOrder) return;

    if (!courierName.trim() || !courierTrackingId.trim()) {
      toast.error("Enter both courier name and tracking ID");
      return;
    }

    await updateOrder(courierModalOrder._id, {
      orderStatus: "Shipped",
      courierName: courierName.trim(),
      courierTrackingId: courierTrackingId.trim(),
    });

    setCourierModalOrder(null);
    setCourierName("");
    setCourierTrackingId("");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex flex-col justify-center items-center">
        <Loader2 className="animate-spin text-green-500 mb-3" size={32} />
        <p className="text-zinc-400 text-sm">Loading orders…</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black p-6 md:p-10">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl text-white font-bold mb-2">All Orders</h1>
        <p className="text-zinc-400 text-sm mb-8">
          {orders.length} order{orders.length !== 1 ? "s" : ""} total
        </p>

        {orders.length === 0 ? (
          <div className="bg-zinc-900 rounded-xl p-12 text-center">
            <Package className="mx-auto mb-4 text-zinc-600" size={48} />
            <p className="text-zinc-400">No orders yet</p>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div
                key={order._id}
                className="bg-zinc-900 rounded-xl p-5 border border-zinc-800"
              >
                <div className="flex flex-wrap justify-between items-start gap-4 mb-4">
                  <div>
                    <p className="text-zinc-500 text-xs">Tracking ID</p>
                    <p className="text-white font-bold text-lg">{order.trackingId}</p>
                    <p className="text-zinc-500 text-xs mt-1">
                      {new Date(order.createdAt).toLocaleString()}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        STATUS_COLORS[order.orderStatus] || "bg-zinc-700 text-zinc-300"
                      }`}
                    >
                      {order.orderStatus}
                    </span>

                    <select
                      value={order.orderStatus}
                      disabled={updatingId === order._id}
                      onChange={(e) => handleStatusChange(order, e.target.value)}
                      className="bg-zinc-800 text-white text-sm rounded-lg px-3 py-2 border border-zinc-700 focus:outline-none focus:border-green-600 disabled:opacity-50"
                    >
                      {STATUS_OPTIONS.map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </select>

                    {updatingId === order._id && (
                      <Loader2 className="animate-spin text-green-500" size={16} />
                    )}
                  </div>
                </div>

                <div className="grid md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="text-zinc-500 text-xs mb-1">Customer</p>
                    <p className="text-white font-medium">
                      {order.user?.name || "Unknown"}
                    </p>
                    <p className="text-zinc-400 text-xs">{order.user?.email}</p>
                    <p className="text-zinc-400 text-xs">{order.shippingAddress?.phone}</p>
                  </div>

                  <div>
                    <p className="text-zinc-500 text-xs mb-1">Delivery Address</p>
                    <p className="text-zinc-300 text-xs leading-relaxed">
                      {order.shippingAddress?.address}, {order.shippingAddress?.city},{" "}
                      {order.shippingAddress?.state} – {order.shippingAddress?.pincode}
                    </p>
                  </div>

                  <div>
                    <p className="text-zinc-500 text-xs mb-1">Order Value</p>
                    <p className="text-white font-bold">₹{order.totalAmount}</p>
                    <p className="text-zinc-400 text-xs mt-1">
                      {order.paymentMethod} ·{" "}
                      <span
                        className={
                          order.paymentStatus === "Paid"
                            ? "text-green-400"
                            : "text-yellow-400"
                        }
                      >
                        {order.paymentStatus}
                      </span>
                    </p>
                  </div>
                </div>

                {order.courierName && order.courierTrackingId && (
                  <div className="flex items-center gap-2 bg-zinc-800 rounded-lg px-3 py-2 mt-4 text-xs">
                    <Truck size={14} className="text-green-500 shrink-0" />
                    <span className="text-zinc-300">
                      Shipped via{" "}
                      <span className="font-semibold text-white">{order.courierName}</span>
                      {" · "}AWB:{" "}
                      <span className="font-semibold text-white">
                        {order.courierTrackingId}
                      </span>
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Courier details modal — shown only when admin selects "Shipped" */}
      {courierModalOrder && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
          <div className="bg-zinc-900 rounded-xl p-6 max-w-md w-full border border-zinc-800 relative">
            <button
              onClick={() => setCourierModalOrder(null)}
              className="absolute top-4 right-4 text-zinc-500 hover:text-white"
            >
              <X size={18} />
            </button>

            <h2 className="text-white font-bold text-lg mb-1">
              Mark as Shipped
            </h2>
            <p className="text-zinc-400 text-xs mb-5">
              Order {courierModalOrder.trackingId} — enter the courier details
              provided at pickup.
            </p>

            <div className="space-y-3">
              <div>
                <label className="text-zinc-400 text-xs mb-1 block">
                  Courier Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Ekart, Delhivery, BlueDart"
                  value={courierName}
                  onChange={(e) => setCourierName(e.target.value)}
                  className="w-full p-2.5 rounded bg-zinc-800 text-white text-sm border border-zinc-700 focus:outline-none focus:border-green-600"
                />
              </div>

              <div>
                <label className="text-zinc-400 text-xs mb-1 block">
                  Tracking ID (AWB Number)
                </label>
                <input
                  type="text"
                  placeholder="e.g. EK1234567890"
                  value={courierTrackingId}
                  onChange={(e) => setCourierTrackingId(e.target.value)}
                  className="w-full p-2.5 rounded bg-zinc-800 text-white text-sm border border-zinc-700 focus:outline-none focus:border-green-600"
                />
              </div>
            </div>

            <button
              onClick={submitCourierDetails}
              disabled={updatingId === courierModalOrder._id}
              className="w-full bg-green-600 hover:bg-green-700 disabled:opacity-60 text-white font-semibold p-3 rounded-lg text-sm mt-5 transition"
            >
              {updatingId === courierModalOrder._id ? "Saving…" : "Confirm & Mark Shipped"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}