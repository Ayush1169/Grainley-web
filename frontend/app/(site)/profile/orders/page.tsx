"use client";

import { useEffect, useState } from "react";
import { API } from "@/lib/api";
import Link from "next/link";
import { Package, Loader2 } from "lucide-react";

interface Order {
  _id: string;
  trackingId: string;
  totalAmount: number;
  orderStatus: string;
  estimatedDeliveryDate: string;
  createdAt: string;
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem("token");

      const { data } = await API.get("/orders/my-orders", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setOrders(data.orders || []);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center bg-[#f8f8f3]">
        <Loader2 className="animate-spin text-[#2d6a2d] mb-3" size={32} />
        <p className="text-gray-500 text-sm">Loading your orders…</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8f8f3] py-10 px-4">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold text-[#1a3d1a] mb-8">
          My Orders
        </h1>

        {orders.length === 0 ? (
          <div className="bg-white rounded-xl p-10 text-center shadow border border-gray-100">
            <Package className="mx-auto mb-4 text-gray-300" size={50} />
            <h2 className="text-xl font-semibold text-[#1a3d1a]">
              No Orders Found
            </h2>
            <p className="text-gray-400 text-sm mt-1 mb-5">
              You haven't placed any orders yet.
            </p>
            <Link
              href="/products"
              className="inline-block bg-[#2d6a2d] hover:bg-[#235423] text-white px-6 py-3 rounded-xl text-sm font-semibold transition"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="space-y-5">
            {orders.map((order) => (
              <Link key={order._id} href={`/orders/${order._id}`}>
                <div className="bg-white rounded-xl shadow border border-gray-100 p-5 hover:border-[#2d6a2d] transition cursor-pointer">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm text-gray-500">Tracking ID</p>
                      <h2 className="font-bold text-lg text-[#1a3d1a]">
                        {order.trackingId}
                      </h2>
                    </div>

                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        order.orderStatus === "Cancelled"
                          ? "bg-red-100 text-red-700"
                          : "bg-green-100 text-green-700"
                      }`}
                    >
                      {order.orderStatus}
                    </span>
                  </div>

                  <div className="grid sm:grid-cols-3 gap-4 mt-5">
                    <div>
                      <p className="text-gray-500 text-sm">Order Date</p>
                      <p className="font-medium text-[#1a3d1a]">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </p>
                    </div>

                    <div>
                      <p className="text-gray-500 text-sm">
                        Estimated Delivery
                      </p>
                      <p className="font-medium text-[#2d6a2d]">
                        {order.estimatedDeliveryDate
                          ? new Date(
                              order.estimatedDeliveryDate
                            ).toLocaleDateString()
                          : "Not Available"}
                      </p>
                    </div>

                    <div>
                      <p className="text-gray-500 text-sm">Total Amount</p>
                      <p className="font-bold text-lg text-[#1a3d1a]">
                        ₹{order.totalAmount}
                      </p>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}