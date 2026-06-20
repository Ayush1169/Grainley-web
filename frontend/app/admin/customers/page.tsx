"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { Users, Loader2, Mail, Phone, ShoppingBag, IndianRupee } from "lucide-react";

interface Customer {
  _id: string;
  name: string;
  email: string;
  phone: string;
  createdAt: string;
  totalOrders: number;
  totalSpent: number;
}

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/admin/customers`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setCustomers(res.data.customers || []);
    } catch (error) {
      console.log(error);
      toast.error("Failed to load customers");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex flex-col justify-center items-center">
        <Loader2 className="animate-spin text-green-500 mb-3" size={32} />
        <p className="text-zinc-400 text-sm">Loading customers…</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black p-6 md:p-10">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl text-white font-bold mb-2">Customers</h1>
        <p className="text-zinc-400 text-sm mb-8">
          {customers.length} customer{customers.length !== 1 ? "s" : ""} total
        </p>

        {customers.length === 0 ? (
          <div className="bg-zinc-900 rounded-xl p-12 text-center">
            <Users className="mx-auto mb-4 text-zinc-600" size={48} />
            <p className="text-zinc-400">No customers yet</p>
          </div>
        ) : (
          <div className="bg-zinc-900 rounded-xl border border-zinc-800 overflow-hidden">
            {/* Table header — hidden on mobile, shown on md+ */}
            <div className="hidden md:grid grid-cols-12 gap-4 px-5 py-3 bg-zinc-950 text-zinc-500 text-xs font-semibold uppercase">
              <div className="col-span-4">Customer</div>
              <div className="col-span-3">Contact</div>
              <div className="col-span-2">Joined</div>
              <div className="col-span-1 text-center">Orders</div>
              <div className="col-span-2 text-right">Total Spent</div>
            </div>

            <div className="divide-y divide-zinc-800">
              {customers.map((customer) => (
                <div
                  key={customer._id}
                  className="grid md:grid-cols-12 gap-2 md:gap-4 px-5 py-4 hover:bg-zinc-800/40 transition"
                >
                  <div className="md:col-span-4">
                    <p className="text-white font-semibold text-sm">
                      {customer.name || "Unnamed"}
                    </p>
                  </div>

                  <div className="md:col-span-3 space-y-1">
                    <p className="flex items-center gap-1.5 text-zinc-400 text-xs">
                      <Mail size={12} /> {customer.email}
                    </p>
                    <p className="flex items-center gap-1.5 text-zinc-400 text-xs">
                      <Phone size={12} /> {customer.phone || "—"}
                    </p>
                  </div>

                  <div className="md:col-span-2">
                    <p className="text-zinc-400 text-xs">
                      {customer.createdAt
                        ? new Date(customer.createdAt).toLocaleDateString()
                        : "—"}
                    </p>
                  </div>

                  <div className="md:col-span-1 flex md:justify-center items-center gap-1.5">
                    <ShoppingBag size={13} className="text-green-500 md:hidden" />
                    <span className="text-white font-semibold text-sm">
                      {customer.totalOrders}
                    </span>
                    <span className="text-zinc-500 text-xs md:hidden">orders</span>
                  </div>

                  <div className="md:col-span-2 flex md:justify-end items-center gap-1">
                    <IndianRupee size={13} className="text-green-500" />
                    <span className="text-white font-bold text-sm">
                      {customer.totalSpent.toLocaleString("en-IN")}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}