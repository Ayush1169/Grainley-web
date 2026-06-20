"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  User, Heart, ShoppingCart, Package,
  LogOut, Phone, Mail, ChevronRight,
  MapPin, Settings, Shield,
} from "lucide-react";

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) { router.push("/login"); return; }
    const savedUser = localStorage.getItem("user");
    if (savedUser) setUser(JSON.parse(savedUser));
  }, []);

  const logoutHandler = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.push("/login");
  };

  const getInitials = (name: string) =>
    name?.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase() || "NS";

  const QUICK_ACTIONS = [
    { icon: Heart, label: "My Wishlist", sub: "View saved products", href: "/wishlist", iconColor: "text-red-500", bg: "bg-red-50" },
    { icon: ShoppingCart, label: "My Cart", sub: "Manage cart items", href: "/cart", iconColor: "text-[#2d6a2d]", bg: "bg-[#e8f5e8]" },
    { icon: Package, label: "My Orders", sub: "Track your orders", href: "/profile/orders", iconColor: "text-blue-500", bg: "bg-blue-50" },
  ];

  const MENU_ITEMS = [
    { icon: Package, label: "My Orders", sub: "View & track all orders", href: "/profile/orders" },
    { icon: Heart, label: "Wishlist", sub: "Products you've saved", href: "/wishlist" },
    { icon: ShoppingCart, label: "Cart", sub: "Items in your cart", href: "/cart" },
    { icon: MapPin, label: "Saved Addresses", sub: "Manage delivery addresses", href: "/addresses" },
    { icon: Settings, label: "Account Settings", sub: "Update profile & password", href: "/settings" },
    { icon: Shield, label: "Privacy & Security", sub: "Manage your data", href: "/privacy" },
  ];

  return (
    <div className="bg-[#f9f9f5] min-h-screen py-8">
      <div className="max-w-3xl mx-auto px-4 space-y-5">

        {/* Profile card */}
        <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
          {/* Green top strip */}
          <div className="h-16 bg-gradient-to-r from-[#1a3d1a] to-[#2d6a2d]" />

          <div className="px-5 pb-5 -mt-8">
            {/* Avatar */}
            <div className="w-16 h-16 rounded-2xl bg-[#2d6a2d] border-4 border-white shadow-md flex items-center justify-center shrink-0 mb-3">
              <span className="text-white font-extrabold text-xl">
                {user ? getInitials(user.name) : <User size={26} />}
              </span>
            </div>

            <div className="flex items-start justify-between flex-wrap gap-3">
              <div>
                <h2 className="text-xl font-extrabold text-[#1a3d1a]">
                  {user?.name || "NutriSeeds User"}
                </h2>
                <div className="space-y-1 mt-1.5">
                  {user?.email && (
                    <div className="flex items-center gap-2 text-gray-500 text-sm">
                      <Mail size={13} className="text-[#2d6a2d]" />
                      {user.email}
                    </div>
                  )}
                  {user?.phone && (
                    <div className="flex items-center gap-2 text-gray-500 text-sm">
                      <Phone size={13} className="text-[#2d6a2d]" />
                      {user.phone}
                    </div>
                  )}
                </div>
              </div>

              <span className={`text-xs font-bold px-3 py-1 rounded-full ${
                user?.role === "admin"
                  ? "bg-red-50 text-red-500 border border-red-200"
                  : "bg-[#e8f5e8] text-[#2d6a2d] border border-[#c8e6c8]"
              }`}>
                {user?.role === "admin" ? "🛡 Admin" : "🌿 Member"}
              </span>
            </div>
          </div>
        </div>

        {/* Quick action cards */}
        <div className="grid grid-cols-3 gap-3">
          {QUICK_ACTIONS.map(({ icon: Icon, label, sub, href, iconColor, bg }) => (
            <Link
              key={label}
              href={href}
              className="bg-white border border-gray-100 rounded-2xl p-4 hover:shadow-md hover:border-gray-200 transition text-center group"
            >
              <div className={`w-11 h-11 ${bg} rounded-xl flex items-center justify-center mx-auto mb-2 group-hover:scale-110 transition-transform`}>
                <Icon size={20} className={iconColor} />
              </div>
              <p className="text-[#1a3d1a] font-bold text-sm">{label}</p>
              <p className="text-gray-400 text-[11px] mt-0.5 hidden sm:block">{sub}</p>
            </Link>
          ))}
        </div>

        {/* Full menu list */}
        <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-5 pt-4 pb-2">
            Account
          </p>
          <div className="divide-y divide-gray-50">
            {MENU_ITEMS.map(({ icon: Icon, label, sub, href }) => (
              <Link
                key={label}
                href={href}
                className="flex items-center gap-4 px-5 py-3.5 hover:bg-[#f9f9f5] transition group"
              >
                <div className="w-9 h-9 bg-[#e8f5e8] rounded-xl flex items-center justify-center shrink-0 group-hover:bg-[#d0ebd0] transition">
                  <Icon size={16} className="text-[#2d6a2d]" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[#1a3d1a] font-semibold text-sm">{label}</p>
                  <p className="text-gray-400 text-xs mt-0.5">{sub}</p>
                </div>
                <ChevronRight size={16} className="text-gray-300 group-hover:text-[#2d6a2d] transition shrink-0" />
              </Link>
            ))}
          </div>
        </div>

        {/* Logout */}
        <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
          <button
            onClick={logoutHandler}
            className="w-full flex items-center gap-4 px-5 py-4 hover:bg-red-50 transition group"
          >
            <div className="w-9 h-9 bg-red-50 rounded-xl flex items-center justify-center shrink-0 group-hover:bg-red-100 transition">
              <LogOut size={16} className="text-red-500" />
            </div>
            <div className="flex-1 text-left">
              <p className="text-red-500 font-semibold text-sm">Logout</p>
              <p className="text-gray-400 text-xs mt-0.5">Sign out of your account</p>
            </div>
            <ChevronRight size={16} className="text-red-300 group-hover:text-red-500 transition" />
          </button>
        </div>

        <p className="text-center text-gray-300 text-xs pb-4">
          NutriSeeds © 2024 · Healthy Seeds, Healthy You
        </p>
      </div>
    </div>
  );
}