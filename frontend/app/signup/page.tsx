"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import axios from "axios";
import toast from "react-hot-toast";
import {
  User,
  Phone,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Shield,
  Award,
  Truck,
  CreditCard,
  CheckCircle2,
} from "lucide-react";

type Step = "form" | "otp";

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

export default function SignupPage() {
  const router = useRouter();

  const [step, setStep] = useState<Step>("form");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [agreed, setAgreed] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);

  // ─── handlers ────────────────────────────────────────────
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.phone || !formData.email || !formData.password) {
      toast.error("Please fill all fields");
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    if (!agreed) {
      toast.error("Please agree to Terms & Conditions");
      return;
    }

    try {
      setLoading(true);
      const res = await axios.post("http://localhost:5000/api/auth/send-otp", {
        email: formData.email,
      });
      toast.success(res.data.message || "OTP sent to your email!");
      setStep("otp");
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleOtpChange = (val: string, idx: number) => {
    if (!/^\d?$/.test(val)) return;
    const updated = [...otp];
    updated[idx] = val;
    setOtp(updated);

    // auto-focus next
    if (val && idx < 5) {
      const next = document.getElementById(`otp-${idx + 1}`);
      next?.focus();
    }
  };

  const handleOtpKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, idx: number) => {
    if (e.key === "Backspace" && !otp[idx] && idx > 0) {
      const prev = document.getElementById(`otp-${idx - 1}`);
      prev?.focus();
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    const code = otp.join("");
    if (code.length < 6) {
      toast.error("Enter the complete 6-digit OTP");
      return;
    }

    try {
      setLoading(true);
      const res = await axios.post("http://localhost:5000/api/auth/signup", {
        email: formData.email,
        otp: code,
        name: formData.name,
        phone: formData.phone,
        password: formData.password,
      });
      toast.success(res.data.message || "Account created! Please login.");
      router.push("/login");
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    try {
      setLoading(true);
      const res = await axios.post("http://localhost:5000/api/auth/send-otp", {
        email: formData.email,
      });
      toast.success(res.data.message || "OTP resent!");
      setOtp(["", "", "", "", "", ""]);
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Could not resend OTP");
    } finally {
      setLoading(false);
    }
  };

  // ─── render ───────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#f5f5ef] flex flex-col">
      {/* Top bar */}
      <header className="w-full px-6 py-4 flex justify-between items-center">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="flex gap-[2px]">
            <span className="text-[#2d6a2d] text-2xl">🌿</span>
          </div>
          <div>
            <p className="text-[#1a3d1a] font-bold text-lg leading-none">NutriSeeds</p>
            <p className="text-[#5a8a5a] text-[11px] leading-none">Healthy Seeds, Healthy You</p>
          </div>
        </div>
        <p className="text-sm text-gray-500">
          Already have an account?{" "}
          <Link href="/login" className="text-[#2d6a2d] font-semibold hover:underline">
            Login
          </Link>
        </p>
      </header>

      {/* Main content */}
      <main className="flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-6xl flex flex-col lg:flex-row gap-8 items-center">

          {/* ── Left hero ── */}
          <div className="hidden lg:flex flex-col flex-1 gap-8">
            <div>
              <h1 className="text-4xl xl:text-5xl font-extrabold text-[#1a3d1a] leading-tight">
                Join NutriSeeds<br />and live a healthy life!
              </h1>
              <p className="mt-4 text-[#4a6a4a] text-base max-w-sm">
                Create your account and explore our wide range of 100% natural and premium quality seeds.
              </p>
            </div>

            {/* Feature list */}
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

          {/* ── Right form card ── */}
          <div className="w-full lg:w-[480px] bg-white rounded-2xl shadow-lg p-8">
            {step === "form" ? (
              <>
                <h2 className="text-2xl font-bold text-[#1a3d1a]">Create Your Account</h2>
                <p className="text-gray-400 text-sm mt-1 mb-6">
                  Sign up and start your healthy journey with us.
                </p>

                <form onSubmit={handleSendOtp} className="space-y-4">
                  {/* Row: Name + Phone */}
                  <div className="flex gap-3">
                    <div className="flex-1">
                      <label className="text-xs font-semibold text-gray-600 mb-1 block">Full Name</label>
                      <div className="relative">
                        <User size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                          type="text"
                          name="name"
                          placeholder="Enter your full name"
                          value={formData.name}
                          onChange={handleChange}
                          className="w-full border border-gray-200 rounded-lg pl-9 pr-3 py-2.5 text-sm outline-none focus:border-[#2d6a2d] focus:ring-1 focus:ring-[#2d6a2d] transition"
                        />
                      </div>
                    </div>
                    <div className="flex-1">
                      <label className="text-xs font-semibold text-gray-600 mb-1 block">Phone Number</label>
                      <div className="relative">
                        <Phone size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                          type="tel"
                          name="phone"
                          placeholder="Enter phone number"
                          value={formData.phone}
                          onChange={handleChange}
                          className="w-full border border-gray-200 rounded-lg pl-9 pr-3 py-2.5 text-sm outline-none focus:border-[#2d6a2d] focus:ring-1 focus:ring-[#2d6a2d] transition"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Email */}
                  <div>
                    <label className="text-xs font-semibold text-gray-600 mb-1 block">Email Address</label>
                    <div className="relative">
                      <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input
                        type="email"
                        name="email"
                        placeholder="Enter your email address"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full border border-gray-200 rounded-lg pl-9 pr-3 py-2.5 text-sm outline-none focus:border-[#2d6a2d] focus:ring-1 focus:ring-[#2d6a2d] transition"
                      />
                    </div>
                  </div>

                  {/* Password */}
                  <div>
                    <label className="text-xs font-semibold text-gray-600 mb-1 block">Password</label>
                    <div className="relative">
                      <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        placeholder="Create a password"
                        value={formData.password}
                        onChange={handleChange}
                        className="w-full border border-gray-200 rounded-lg pl-9 pr-10 py-2.5 text-sm outline-none focus:border-[#2d6a2d] focus:ring-1 focus:ring-[#2d6a2d] transition"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                      </button>
                    </div>
                  </div>

                  {/* Confirm Password */}
                  <div>
                    <label className="text-xs font-semibold text-gray-600 mb-1 block">Confirm Password</label>
                    <div className="relative">
                      <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input
                        type={showConfirm ? "text" : "password"}
                        name="confirmPassword"
                        placeholder="Confirm your password"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        className="w-full border border-gray-200 rounded-lg pl-9 pr-10 py-2.5 text-sm outline-none focus:border-[#2d6a2d] focus:ring-1 focus:ring-[#2d6a2d] transition"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirm(!showConfirm)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showConfirm ? <EyeOff size={15} /> : <Eye size={15} />}
                      </button>
                    </div>
                  </div>

                  {/* Terms */}
                  <label className="flex items-start gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={agreed}
                      onChange={(e) => setAgreed(e.target.checked)}
                      className="mt-0.5 accent-[#2d6a2d] w-4 h-4"
                    />
                    <span className="text-sm text-gray-500">
                      I agree to the{" "}
                      <a href="#" className="text-[#2d6a2d] font-semibold hover:underline">
                        Terms &amp; Conditions
                      </a>{" "}
                      and{" "}
                      <a href="#" className="text-[#2d6a2d] font-semibold hover:underline">
                        Privacy Policy
                      </a>
                    </span>
                  </label>

                  {/* Submit */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-[#2d6a2d] hover:bg-[#235423] text-white font-semibold py-3 rounded-xl text-sm transition disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {loading ? "Sending OTP…" : "Create Account"}
                  </button>
                </form>
              </>
            ) : (
              /* ── OTP Step ── */
              <>
                <div className="flex flex-col items-center text-center mb-6">
                  <div className="w-14 h-14 rounded-full bg-[#e8f5e8] flex items-center justify-center mb-3">
                    <CheckCircle2 size={28} className="text-[#2d6a2d]" />
                  </div>
                  <h2 className="text-2xl font-bold text-[#1a3d1a]">Verify your email</h2>
                  <p className="text-gray-400 text-sm mt-1">
                    We sent a 6-digit OTP to{" "}
                    <span className="text-[#2d6a2d] font-semibold">{formData.email}</span>
                  </p>
                </div>

                <form onSubmit={handleVerifyOtp} className="space-y-6">
                  {/* OTP boxes */}
                  <div className="flex justify-center gap-3">
                    {otp.map((digit, idx) => (
                      <input
                        key={idx}
                        id={`otp-${idx}`}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleOtpChange(e.target.value, idx)}
                        onKeyDown={(e) => handleOtpKeyDown(e, idx)}
                        className="w-11 h-12 text-center text-lg font-bold border-2 border-gray-200 rounded-xl outline-none focus:border-[#2d6a2d] focus:ring-1 focus:ring-[#2d6a2d] transition caret-transparent"
                      />
                    ))}
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-[#2d6a2d] hover:bg-[#235423] text-white font-semibold py-3 rounded-xl text-sm transition disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {loading ? "Verifying…" : "Verify & Create Account"}
                  </button>

                  <div className="text-center text-sm text-gray-400 space-y-1">
                    <p>
                      Didn't receive the OTP?{" "}
                      <button
                        type="button"
                        onClick={handleResendOtp}
                        disabled={loading}
                        className="text-[#2d6a2d] font-semibold hover:underline disabled:opacity-50"
                      >
                        Resend OTP
                      </button>
                    </p>
                    <p>
                      <button
                        type="button"
                        onClick={() => setStep("form")}
                        className="text-gray-500 hover:text-[#2d6a2d] hover:underline"
                      >
                        ← Back to sign up
                      </button>
                    </p>
                  </div>
                </form>
              </>
            )}
          </div>
        </div>
      </main>

      {/* Bottom trust bar */}
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
              <p className="font-semibold text-[#1a3d1a] text-xs">Customer Support</p>
              <p className="text-[11px]">24/7 Support</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}