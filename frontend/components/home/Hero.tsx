"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Leaf, BadgeCheck, Truck, ShieldCheck } from "lucide-react";

const SLIDES = [
  {
    image: "/homepage/homepage.png",
    badge: "100% Natural & Premium Quality",
    heading1: "Wholesome Seeds",
    heading2: "For a Healthy Life",
    desc: "Discover a wide range of natural seeds rich in nutrients and goodness.",
    offer1: "UP TO",
    offer2: "20%",
    offer3: "OFF",
    offer4: "On Selected Items",
  },
  {
    image: "/homepage/homepage2.png",
    badge: "Fresh & Organic",
    heading1: "Pure Makhana,",
    heading2: "Pure Goodness",
    desc: "Handpicked premium makhana — light, crunchy, and full of nutrition.",
    offer1: "FLAT",
    offer2: "15%",
    offer3: "OFF",
    offer4: "On First Order",
  },
];

const TRUST = [
  { icon: <Leaf size={18} className="text-[#2d6a2d]" />, label: "100% Natural", sub: "No Additives" },
  { icon: <BadgeCheck size={18} className="text-[#2d6a2d]" />, label: "Premium Quality", sub: "Carefully Selected" },
  { icon: <Truck size={18} className="text-[#2d6a2d]" />, label: "Fast Delivery", sub: "At Your Doorstep" },
  { icon: <ShieldCheck size={18} className="text-[#2d6a2d]" />, label: "Secure Payment", sub: "100% Safe & Secure" },
];

export default function Hero() {
  const [current, setCurrent] = useState(0);
  const [visible, setVisible] = useState(0); // what's actually shown
  const [fading, setFading] = useState(false);

  const goTo = (idx: number) => {
    if (fading) return;
    setFading(true);
    // fade out → swap content → fade in
    setTimeout(() => {
      setVisible(idx);
      setCurrent(idx);
      setFading(false);
    }, 350);
  };

  const prev = () => goTo((current - 1 + SLIDES.length) % SLIDES.length);
  const next = () => goTo((current + 1) % SLIDES.length);

  useEffect(() => {
    const timer = setInterval(() => {
      goTo((current + 1) % SLIDES.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [current, fading]);

  const slide = SLIDES[visible];

  return (
    <section className="w-full bg-[#f5f5ef]">
      {/* ── Slider ── */}
      <div className="relative overflow-hidden mx-3 mt-3 rounded-2xl" style={{ minHeight: 340 }}>

        {/* Background image — always visible, cross-fades */}
        {SLIDES.map((s, i) => (
          <div
            key={i}
            className="absolute inset-0 transition-opacity duration-500"
            style={{ opacity: i === visible && !fading ? 1 : 0, zIndex: 0 }}
          >
            <Image
              src={s.image}
              alt={s.heading1}
              fill
              className="object-cover object-center"
              priority={i === 0}
            />
          </div>
        ))}

        {/* Left gradient for text legibility — always on top of image */}
        <div className="absolute inset-0 z-10 bg-gradient-to-r from-white/95 via-white/75 to-white/10 pointer-events-none" />

        {/* ── Slide content — fades in/out cleanly ── */}
        <div
          className="relative z-20 flex items-center min-h-[340px] px-8 md:px-14 py-10 md:py-14 max-w-7xl mx-auto transition-opacity duration-300"
          style={{ opacity: fading ? 0 : 1 }}
        >
          {/* Text */}
          <div className="max-w-md">
            <span className="inline-flex items-center gap-1.5 bg-[#e8f5e8] text-[#2d6a2d] text-xs font-semibold px-3 py-1.5 rounded-full border border-[#c5dfc5] mb-4">
              🌿 {slide.badge}
            </span>

            <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-[#1a3d1a] leading-tight">
              {slide.heading1}
              <br />
              <span className="text-[#2d6a2d]">{slide.heading2}</span>
            </h1>

            <p className="mt-3 text-gray-600 text-sm md:text-[15px] leading-relaxed max-w-xs">
              {slide.desc}
            </p>

            <div className="flex flex-wrap gap-3 mt-6">
              <Link
                href="/products"
                className="bg-[#2d6a2d] hover:bg-[#235423] text-white px-6 py-2.5 rounded-xl text-sm font-semibold transition shadow-sm"
              >
                Shop Now
              </Link>
              <Link
                href="/products"
                className="border-2 border-[#2d6a2d] text-[#2d6a2d] hover:bg-[#2d6a2d] hover:text-white px-6 py-2.5 rounded-xl text-sm font-semibold transition"
              >
                Explore Products
              </Link>
            </div>
          </div>

          {/* Offer circle */}
          <div className="hidden md:flex absolute right-14 top-1/2 -translate-y-1/2 w-28 h-28 rounded-full bg-white border-4 border-[#2d6a2d] shadow-xl flex-col items-center justify-center text-center gap-0.5 z-30">
            <p className="text-[#1a3d1a] font-bold text-[10px] uppercase tracking-wide">{slide.offer1}</p>
            <p className="text-[#2d6a2d] font-extrabold text-2xl leading-none">{slide.offer2}</p>
            <p className="text-[#1a3d1a] font-bold text-sm leading-none">{slide.offer3}</p>
            <p className="text-gray-500 text-[9px] leading-tight mt-0.5 px-2">{slide.offer4}</p>
          </div>
        </div>

        {/* Arrows */}
        <button
          onClick={prev}
          className="absolute left-3 top-1/2 -translate-y-1/2 z-30 w-9 h-9 bg-white/90 hover:bg-white rounded-full shadow-md flex items-center justify-center transition"
        >
          <ChevronLeft size={18} className="text-[#2d6a2d]" />
        </button>
        <button
          onClick={next}
          className="absolute right-3 top-1/2 -translate-y-1/2 z-30 w-9 h-9 bg-white/90 hover:bg-white rounded-full shadow-md flex items-center justify-center transition"
        >
          <ChevronRight size={18} className="text-[#2d6a2d]" />
        </button>

        {/* Dots */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2 z-30">
          {SLIDES.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              className={`rounded-full transition-all duration-300 ${
                i === current ? "w-7 h-2.5 bg-[#2d6a2d]" : "w-2.5 h-2.5 bg-white/70 hover:bg-white"
              }`}
            />
          ))}
        </div>
      </div>

      {/* ── Trust bar ── */}
      <div className="max-w-7xl mx-auto px-3 py-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {TRUST.map((t) => (
            <div
              key={t.label}
              className="flex items-center gap-3 bg-white border border-gray-100 rounded-xl px-4 py-3 shadow-sm"
            >
              <div className="w-9 h-9 bg-[#e8f5e8] rounded-lg flex items-center justify-center shrink-0">
                {t.icon}
              </div>
              <div>
                <p className="text-[#1a3d1a] font-semibold text-sm leading-none">{t.label}</p>
                <p className="text-gray-400 text-[11px] mt-0.5">{t.sub}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}