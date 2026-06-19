"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import axios from "axios";
import toast from "react-hot-toast";
import { API } from "@/lib/api";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  Shield,
  Award,
  Truck,
  CreditCard,
  Phone,
} from "lucide-react";

const FEATURE_LIST = [
  {
    icon: <Shield size={20} className="text-[#2d6a2d]" />,
    title: "100% Natural Products",
    desc: "Pure and natural seeds with no additives.",
  },
  {
    icon: <Award size={20} className="text-[#2d6a2d]" />,
    title: "Premium Quality",
    desc: "Carefully selected for the best quality.",
  },
  {
    icon: <Truck size={20} className="text-[#2d6a2d]" />,
    title: "Fast & Safe Delivery",
    desc: "Quick delivery to your doorstep.",
  },
  {
    icon: <CreditCard size={20} className="text-[#2d6a2d]" />,
    title: "Secure Payments",
    desc: "100% safe and secure transactions.",
  },
];

export default function LoginPage() {
  const router = useRouter();
  
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

      console.log("HANDLE SUBMIT CALLED");
  console.log("HANDLE SUBMIT CALLED"); 

    if (!formData.email || !formData.password) {
      toast.error("Please fill all fields");
      return;
    }

    try {
      setLoading(true);
      const response = await API.post(
  "/auth/login",
  formData
);
console.log("LOGIN RESPONSE", response.data);
CreditCard
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));

      toast.success("Login Successful!");

      

const user = response.data.user;

if (user.role === "admin") {
  router.push("/admin");
} else {
  router.push("/");
}
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Login Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f5ef] flex flex-col">
      {/* ── Top bar ── */}
      <header className="w-full px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🌿</span>
          <div>
            <p className="text-[#1a3d1a] font-bold text-lg leading-none">NutriSeeds</p>
            <p className="text-[#5a8a5a] text-[11px] leading-none">Healthy Seeds, Healthy You</p>
          </div>
        </div>
        <p className="text-sm text-gray-500">
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="text-[#2d6a2d] font-semibold hover:underline">
            Sign Up
          </Link>
        </p>
      </header>

      {/* ── Main ── */}
      <main className="flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-6xl flex flex-col lg:flex-row gap-10 items-center">

          {/* ── Left hero ── */}
          <div className="hidden lg:flex flex-col flex-1 gap-8">
            <div>
              <h1 className="text-4xl xl:text-5xl font-extrabold text-[#1a3d1a] leading-tight">
                Welcome Back!
              </h1>
              <p className="mt-4 text-[#4a6a4a] text-base max-w-xs">
                Login to your account and continue your healthy journey.
              </p>
            </div>

            <ul className="space-y-5">
              {FEATURE_LIST.map((f) => (
                <li key={f.title} className="flex items-start gap-4">
                  <div className="w-11 h-11 rounded-full border-2 border-[#b5d5b5] bg-white flex items-center justify-center shrink-0">
                    {f.icon}
                  </div>
                  <div>
                    <p className="font-bold text-[#1a3d1a] text-sm">{f.title}</p>
                    <p className="text-[#6a8a6a] text-sm">{f.desc}</p>
                  </div>
                </li>
              ))}
            </ul>

            {/* Seed image */}
            <div className="relative w-full h-64 xl:h-72 rounded-2xl overflow-hidden">
              <Image
                src="/signup/signup.png"
                alt="Premium seeds"
                fill
                className="object-cover object-center"
                priority
              />
            </div>
          </div>

          {/* ── Right card ── */}
          <div className="w-full lg:w-[460px] bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-[#1a3d1a]">Login to Your Account</h2>
            <p className="text-gray-400 text-sm mt-1 mb-6">
              Enter your email and password to continue.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email */}
              <div>
                <label className="text-xs font-semibold text-gray-600 mb-1 block">
                  Email Address
                </label>
                <div className="relative">
                  <Mail
                    size={15}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  />
                  <input
                    type="email"
                    name="email"
                    placeholder="Enter your email address"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full border border-gray-200 rounded-xl pl-9 pr-3 py-3 text-sm outline-none focus:border-[#2d6a2d] focus:ring-1 focus:ring-[#2d6a2d] transition"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="text-xs font-semibold text-gray-600 mb-1 block">
                  Password
                </label>
                <div className="relative">
                  <Lock
                    size={15}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  />
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full border border-gray-200 rounded-xl pl-9 pr-10 py-3 text-sm outline-none focus:border-[#2d6a2d] focus:ring-1 focus:ring-[#2d6a2d] transition"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>

                {/* Forgot password */}
                <div className="text-right mt-1">
                  <Link
                    href="/forgot-password"
                    className="text-sm text-[#2d6a2d] font-semibold hover:underline"
                  >
                    Forgot Password?
                  </Link>
                </div>
              </div>

              {/* Login button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#2d6a2d] hover:bg-[#235423] text-white font-semibold py-3 rounded-xl text-sm transition disabled:opacity-60 disabled:cursor-not-allowed mt-2"
              >
                {loading ? "Logging in…" : "Login"}
              </button>

              {/* OR divider */}
              <div className="flex items-center gap-3 my-1">
                <div className="flex-1 h-px bg-gray-200" />
                <span className="text-xs text-gray-400 font-medium">OR</span>
                <div className="flex-1 h-px bg-gray-200" />
              </div>

              {/* Security note */}
              <div className="flex items-start gap-3 border border-gray-100 rounded-xl p-4 bg-gray-50 mt-2">
                <Shield size={22} className="text-[#2d6a2d] shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-[#1a3d1a]">
                    Your Security is Our Priority
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    We use advanced encryption to keep your information safe and secure.
                  </p>
                </div>
              </div>
            </form>
          </div>
        </div>
      </main>

      {/* ── Footer trust bar ── */}
      <footer className="w-full border-t border-gray-200 py-4 px-6">
        <div className="max-w-6xl mx-auto flex justify-center gap-10 text-sm text-gray-500">
          <div className="flex items-center gap-2">
            <Shield size={16} className="text-[#2d6a2d]" />
            <div>
              <p className="font-semibold text-[#1a3d1a] text-xs">100% Secure</p>
              <p className="text-[11px]">Payments</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Award size={16} className="text-[#2d6a2d]" />
            <div>
              <p className="font-semibold text-[#1a3d1a] text-xs">Premium Quality</p>
              <p className="text-[11px]">Guaranteed</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Phone size={16} className="text-[#2d6a2d]" />
            <div>
              <p className="font-semibold text-[#1a3d1a] text-xs">24/7 Support</p>
              <p className="text-[11px]">We&apos;re here to help</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}