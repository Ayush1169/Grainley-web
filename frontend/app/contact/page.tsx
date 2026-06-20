"use client";

import { useState } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import { ArrowLeft, Phone, Mail, Clock, MapPin, Globe, Send } from "lucide-react";

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);

  // NOTE: This form is UI-only right now — wire it up to a real
  // backend endpoint (e.g. POST /api/contact) before relying on it.
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);

    // Placeholder behavior — replace with an actual API call
    setTimeout(() => {
      toast.success("Message received! We'll get back to you soon.");
      setName("");
      setEmail("");
      setMessage("");
      setSending(false);
    }, 800);
  };

  return (
    <div className="bg-[#f9f9f5] min-h-screen py-10 px-4">
      <div className="max-w-4xl mx-auto">
        <Link
          href="/"
          className="flex items-center gap-1.5 text-[#2d6a2d] text-sm font-medium hover:underline mb-6 w-fit"
        >
          <ArrowLeft size={15} /> Back to Home
        </Link>

        <h1 className="text-2xl md:text-3xl font-extrabold text-[#1a3d1a] mb-2">
          Contact Us
        </h1>
        <p className="text-gray-500 text-sm mb-8">
          Have a question? We'd love to hear from you.
        </p>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Contact details */}
          <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6 space-y-5 h-fit">
            <a href="tel:+919919456600" className="flex items-start gap-3 group">
              <div className="w-9 h-9 bg-[#e8f5e8] rounded-lg flex items-center justify-center shrink-0">
                <Phone size={16} className="text-[#2d6a2d]" />
              </div>
              <div>
                <p className="font-semibold text-[#1a3d1a] text-sm group-hover:text-[#2d6a2d] transition">Phone</p>
                <p className="text-gray-500 text-sm">+91-9919456600</p>
              </div>
            </a>

            <a href="mailto:wecare@grainleyfoods.com" className="flex items-start gap-3 group">
              <div className="w-9 h-9 bg-[#e8f5e8] rounded-lg flex items-center justify-center shrink-0">
                <Mail size={16} className="text-[#2d6a2d]" />
              </div>
              <div>
                <p className="font-semibold text-[#1a3d1a] text-sm group-hover:text-[#2d6a2d] transition">Email</p>
                <p className="text-gray-500 text-sm">wecare@grainleyfoods.com</p>
              </div>
            </a>

            <a
              href="https://grainleyfoods.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-start gap-3 group"
            >
              <div className="w-9 h-9 bg-[#e8f5e8] rounded-lg flex items-center justify-center shrink-0">
                <Globe size={16} className="text-[#2d6a2d]" />
              </div>
              <div>
                <p className="font-semibold text-[#1a3d1a] text-sm group-hover:text-[#2d6a2d] transition">Website</p>
                <p className="text-gray-500 text-sm">grainleyfoods.com</p>
              </div>
            </a>

            <a
              href="https://instagram.com/grainleyfoods"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-start gap-3 group"
            >
              <div className="w-9 h-9 bg-[#e8f5e8] rounded-lg flex items-center justify-center shrink-0">
                <span className="text-[#2d6a2d] font-bold text-xs">IG</span>
              </div>
              <div>
                <p className="font-semibold text-[#1a3d1a] text-sm group-hover:text-[#2d6a2d] transition">Instagram</p>
                <p className="text-gray-500 text-sm">@grainleyfoods</p>
              </div>
            </a>

            <div className="flex items-start gap-3">
              <div className="w-9 h-9 bg-[#e8f5e8] rounded-lg flex items-center justify-center shrink-0">
                <Clock size={16} className="text-[#2d6a2d]" />
              </div>
              <div>
                <p className="font-semibold text-[#1a3d1a] text-sm">Hours</p>
                <p className="text-gray-500 text-sm">Mon - Sat: 9:00 AM - 7:00 PM</p>
              </div>
            </div>

            <a
              href="https://www.google.com/maps/search/?api=1&query=Allied+Traders+994%2F035+Siddhi+Vinayak+Colony+Nilmatha+Road+Telibagh+Lucknow+Uttar+Pradesh+226029"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-start gap-3 group"
            >
              <div className="w-9 h-9 bg-[#e8f5e8] rounded-lg flex items-center justify-center shrink-0">
                <MapPin size={16} className="text-[#2d6a2d]" />
              </div>
              <div>
                <p className="font-semibold text-[#1a3d1a] text-sm group-hover:text-[#2d6a2d] transition">Address</p>
                <p className="text-gray-500 text-sm leading-relaxed">
                  Allied Traders, #994/035, Siddhi Vinayak Colony, Near
                  Vrindawan Sector 6C Post Office, Nilmatha Road, Telibagh,
                  Nagar Nigam Food Safety Zone-19, Lucknow, Uttar Pradesh –
                  226029
                </p>
              </div>
            </a>

            <div className="pt-4 border-t border-gray-100">
              <p className="text-gray-400 text-xs">FSSAI Reg. No. – 22725748000645</p>
            </div>
          </div>

          {/* Contact form */}
          <form
            onSubmit={handleSubmit}
            className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6 space-y-4 h-fit"
          >
            <div>
              <label className="text-xs font-semibold text-gray-500 block mb-1.5">
                Your Name
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#2d6a2d] focus:ring-1 focus:ring-[#2d6a2d] transition"
                placeholder="John Doe"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-500 block mb-1.5">
                Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#2d6a2d] focus:ring-1 focus:ring-[#2d6a2d] transition"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-500 block mb-1.5">
                Message
              </label>
              <textarea
                required
                rows={5}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#2d6a2d] focus:ring-1 focus:ring-[#2d6a2d] transition resize-none"
                placeholder="How can we help?"
              />
            </div>

            <button
              type="submit"
              disabled={sending}
              className="w-full flex items-center justify-center gap-2 bg-[#2d6a2d] hover:bg-[#235423] disabled:opacity-60 text-white font-semibold py-3 rounded-xl text-sm transition"
            >
              {sending ? "Sending…" : "Send Message"} <Send size={14} />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}