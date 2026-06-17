"use client";

import Link from "next/link";
import { ShoppingCart, Heart, User, Search, Menu, X, ChevronDown } from "lucide-react";
import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast/headless";

export default function Navbar() {
  const [cartCount, setCartCount] = useState(0);
  const [wishlistCount, setWishlistCount] = useState(0);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [user, setUser] = useState(null);
  const router = useRouter();

 useEffect(() => {
  const token = localStorage.getItem("token");

  if (token) {
    setUser(true);
    fetchCounts();
  }
}, []);

  const fetchCounts = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;
    
      const cartRes = await axios.get("http://localhost:5000/api/cart", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const wishlistRes = await axios.get("http://localhost:5000/api/wishlist", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCartCount(cartRes.data.cart?.length || 0);
      setWishlistCount(wishlistRes.data.wishlist?.length || 0);
    } catch (error) {
      console.log(error);
    }
  };

  const NAV_LINKS = [
    { label: "Makhana", href: "/products?category=makhana" },
    { label: "Chia Seeds", href: "/products?category=chia-seeds" },
    { label: "Flax Seeds", href: "/products?category=flax-seeds" },
    { label: "Pumpkin Seeds", href: "/products?category=pumpkin-seeds" },
    { label: "Sunflower Seeds", href: "/products?category=sunflower-seeds" },
    { label: "Mix Seeds", href: "/products?category=mix-seeds" },
    { label: "Combo Packs", href: "/products?category=combo-packs" },
    { label: "Offers", href: "/offers", hot: true },
  ];

  return (
    <>
      {/* Top bar */}
      <div className="bg-[#1a3d1a] text-white text-xs py-2 px-4 hidden md:block">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1.5">🌿 100% Natural Seeds</span>
            <span className="flex items-center gap-1.5">🏆 Premium Quality</span>
            <span className="flex items-center gap-1.5">🚚 Fast & Safe Delivery</span>
          </div>
          <div className="flex items-center gap-5 text-white/80">
            <Link href="/track-order" className="hover:text-white transition">Track Order</Link>
            <span>|</span>
            <Link href="/help" className="hover:text-white transition">Help & Support</Link>
            <span>|</span>
            <span>📞 +91 98765 43210</span>
          </div>
        </div>
      </div>

      {/* Main navbar */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center gap-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <span className="text-xl">🌿</span>
            <div>
              <p className="text-[#1a3d1a] font-extrabold text-lg leading-none">NutriSeeds</p>
              <p className="text-[#5a8a5a] text-[9px] leading-none">Healthy Seeds, Healthy You</p>
            </div>
          </Link>

          {/* Category dropdown */}
          <div className="hidden lg:flex items-center gap-1 border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-600 cursor-pointer hover:border-[#2d6a2d] transition shrink-0">
            All Categories <ChevronDown size={14} className="ml-1" />
          </div>

          {/* Search */}
          <div className="flex-1 relative hidden md:block">
            <input
              type="text"
              placeholder="Search for seeds, makhana & more..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full border border-gray-200 rounded-lg pl-4 pr-12 py-2.5 text-sm outline-none focus:border-[#2d6a2d] focus:ring-1 focus:ring-[#2d6a2d] transition"
            />
            <button className="absolute right-0 top-0 h-full px-4 bg-[#2d6a2d] hover:bg-[#235423] rounded-r-lg transition">
              <Search size={16} className="text-white" />
            </button>
          </div>

          {/* Right icons */}
          <div className="flex items-center gap-4 ml-auto shrink-0">
            <Link href="/wishlist" className="relative flex flex-col items-center hidden md:flex">
              <Heart className="w-5 h-5 text-gray-600 hover:text-[#2d6a2d] transition" />
              {wishlistCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[9px] h-4 w-4 rounded-full flex items-center justify-center font-bold">
                  {wishlistCount}
                </span>
              )}
              <span className="text-[9px] text-gray-500 mt-0.5">Wishlist</span>
            </Link>

            <Link href="/cart" className="relative flex flex-col items-center hidden md:flex">
              <ShoppingCart className="w-5 h-5 text-gray-600 hover:text-[#2d6a2d] transition" />
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-[#2d6a2d] text-white text-[9px] h-4 w-4 rounded-full flex items-center justify-center font-bold">
                  {cartCount}
                </span>
              )}
              <span className="text-[9px] text-gray-500 mt-0.5">Cart</span>
            </Link>

            {
  user ? (
    <Link
      href="/profile"
      className="flex flex-col items-center hidden md:flex"
    >
      <User className="w-5 h-5 text-gray-600 hover:text-[#2d6a2d]" />
      <span className="text-[9px] text-gray-500 mt-0.5">
        My Account
      </span>
    </Link>
  ) : (
    <Link
      href="/login"
      className="bg-[#2d6a2d] text-white px-4 py-2 rounded-lg text-sm font-medium hidden md:block"
    >
      Login / Sign Up
    </Link>
  )
}

            {/* Mobile icons */}
            <Link href="/cart" className="relative md:hidden">
              <ShoppingCart className="w-5 h-5 text-gray-700" />
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-[#2d6a2d] text-white text-[9px] h-4 w-4 rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>

            <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden text-gray-700">
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {/* Category nav strip */}
        <div className="hidden md:block border-t border-gray-100 bg-white">
          <div className="max-w-7xl mx-auto px-4 flex items-center gap-1 overflow-x-auto scrollbar-hide py-0.5">
            <Link
              href="/products"
              className="flex items-center gap-1.5 bg-[#2d6a2d] text-white px-3 py-2 text-xs font-semibold rounded shrink-0"
            >
              <Menu size={13} /> All Categories
            </Link>
            {NAV_LINKS.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="shrink-0 px-3 py-2 text-xs font-medium text-gray-700 hover:text-[#2d6a2d] transition whitespace-nowrap flex items-center gap-1"
              >
                {link.label}
                {link.hot && (
                  <span className="bg-red-500 text-white text-[8px] px-1 py-0.5 rounded font-bold">HOT</span>
                )}
              </Link>
            ))}
          </div>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="md:hidden bg-white border-t border-gray-100 px-4 py-4 space-y-3">
            <div className="relative">
              <input
                type="text"
                placeholder="Search seeds, makhana..."
                className="w-full border border-gray-200 rounded-lg pl-4 pr-10 py-2.5 text-sm outline-none focus:border-[#2d6a2d]"
              />
              <Search size={15} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
            </div>
            {NAV_LINKS.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="block text-sm text-gray-700 font-medium py-1.5 border-b border-gray-50"
              >
                {link.label}
              </Link>
            ))}
            <div className="flex gap-4 pt-2">
              <Link href="/wishlist" onClick={() => setMobileOpen(false)} className="flex items-center gap-2 text-sm text-gray-600">
                <Heart size={16} /> Wishlist
              </Link>
              {
  user ? (
    <Link
      href="/profile"
      className="flex flex-col items-center hidden md:flex"
    >
      <User className="w-5 h-5 text-gray-600" />
      <span className="text-[9px] text-gray-500">
        My Account
      </span>
    </Link>
  ) : (
    <Link
      href="/login"
      className="bg-[#2d6a2d] text-white px-4 py-2 rounded-lg text-sm font-medium"
    >
      Login
    </Link>
  )
}
            </div>
          </div>
        )}
      </header>
    </>
  );
}