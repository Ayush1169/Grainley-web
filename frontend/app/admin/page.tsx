"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Package,
  Tag,
  Users,
  ShoppingCart,
  TrendingUp,
  PlusCircle,
  ArrowRight,
} from "lucide-react";

interface Stats {
  totalProducts: number;
  totalCategories: number;
  totalUsers: number;
  totalOrders?: number;
}

const QUICK_ACTIONS = [
  {
    label: "Add Product",
    href: "/admin/products/create",
    icon: PlusCircle,
    color: "bg-[#1a4a1a] text-[#4dff91] border-[#2a6a2a]",
  },
  {
    label: "Manage Categories",
    href: "/admin/categories",
    icon: Tag,
    color: "bg-[#1a2a3a] text-[#4db8ff] border-[#2a3a5a]",
  },
  {
    label: "View All Products",
    href: "/admin/products",
    icon: Package,
    color: "bg-[#2a1a3a] text-[#c084fc] border-[#3a2a5a]",
  },
  {
    label: "View Orders",
    href: "/admin/orders",
    icon: ShoppingCart,
    color: "bg-[#3a1a1a] text-[#f87171] border-[#5a2a2a]",
  },
];

export default function AdminDashboard() {
  const router = useRouter();

  const [stats, setStats] = useState<Stats>({
    totalProducts: 0,
    totalCategories: 0,
    totalUsers: 0,
    totalOrders: 0,
  });

  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) { router.push("/login"); return; }

    const parsedUser = JSON.parse(storedUser);
    if (parsedUser.role !== "admin") { router.push("/login"); return; }

    setUser(parsedUser);
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:5000/api/admin/stats", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setStats({
        totalProducts: res.data.totalProducts ?? 0,
        totalCategories: res.data.totalCategories ?? 0,
        totalUsers: res.data.totalUsers ?? 0,
        totalOrders: res.data.totalOrders ?? 0,
      });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const STAT_CARDS = [
    {
      label: "Total Products",
      value: stats.totalProducts,
      icon: Package,
      accent: "#4dff91",
      bg: "bg-[#1a4a1a]",
      iconBg: "bg-[#0f2a0f]",
    },
    {
      label: "Categories",
      value: stats.totalCategories,
      icon: Tag,
      accent: "#4db8ff",
      bg: "bg-[#1a2a3a]",
      iconBg: "bg-[#0f1a2a]",
    },
    {
      label: "Customers",
      value: stats.totalUsers,
      icon: Users,
      accent: "#c084fc",
      bg: "bg-[#2a1a3a]",
      iconBg: "bg-[#1a0f2a]",
    },
    {
      label: "Total Orders",
      value: stats.totalOrders ?? 0,
      icon: ShoppingCart,
      accent: "#f87171",
      bg: "bg-[#3a1a1a]",
      iconBg: "bg-[#2a0f0f]",
    },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <p className="text-[#4dff91] text-sm font-semibold tracking-widest uppercase mb-1">
            Overview
          </p>
          <h1 className="text-2xl lg:text-3xl font-bold text-white">
            Welcome back{user?.name ? `, ${user.name}` : ""} 👋
          </h1>
          <p className="text-[#6a8a6a] text-sm mt-1">
            Here's what's happening with your store today.
          </p>
        </div>
        <div className="flex items-center gap-2 bg-[#1a4a1a] border border-[#2a6a2a] px-4 py-2 rounded-xl">
          <TrendingUp size={16} className="text-[#4dff91]" />
          <span className="text-[#4dff91] text-sm font-medium">Store Live</span>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {STAT_CARDS.map(({ label, value, icon: Icon, accent, bg, iconBg }) => (
          <div
            key={label}
            className={`${bg} border border-white/5 rounded-2xl p-5 flex flex-col gap-4`}
          >
            <div className={`w-10 h-10 ${iconBg} rounded-xl flex items-center justify-center`}>
              <Icon size={18} style={{ color: accent }} />
            </div>
            <div>
              {loading ? (
                <div className="h-8 w-16 bg-white/10 rounded-lg animate-pulse" />
              ) : (
                <p className="text-3xl font-bold text-white">{value}</p>
              )}
              <p className="text-[#6a8a6a] text-xs mt-1">{label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div>
        <p className="text-[#6a8a6a] text-sm font-semibold uppercase tracking-widest mb-4">
          Quick Actions
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {QUICK_ACTIONS.map(({ label, href, icon: Icon, color }) => (
            <Link
              key={href}
              href={href}
              className={`group flex items-center justify-between gap-3 border ${color} rounded-2xl px-5 py-4 transition-all hover:opacity-90 hover:scale-[1.02]`}
            >
              <div className="flex items-center gap-3">
                <Icon size={18} />
                <span className="text-sm font-semibold">{label}</span>
              </div>
              <ArrowRight
                size={15}
                className="opacity-0 group-hover:opacity-100 transition-opacity -translate-x-1 group-hover:translate-x-0 duration-200"
              />
            </Link>
          ))}
        </div>
      </div>

      {/* Divider info */}
      <div className="border border-[#1e2e1e] rounded-2xl px-6 py-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <p className="text-white font-semibold text-sm">Need to review orders?</p>
          <p className="text-[#6a8a6a] text-xs mt-0.5">
            Check all pending and completed orders in one place.
          </p>
        </div>
        <Link
          href="/admin/orders"
          className="flex items-center gap-2 bg-[#1a4a1a] text-[#4dff91] border border-[#2a6a2a] px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-[#235423] transition whitespace-nowrap"
        >
          Go to Orders <ArrowRight size={14} />
        </Link>
      </div>
    </div>
  );
}