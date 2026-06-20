"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, ChevronDown } from "lucide-react";

// PLACEHOLDER: Replace these with your real, frequently asked questions.
const FAQS = [
  {
    q: "How long does delivery take?",
    a: "Delivery times depend on your location. Typically 1-2 days within Bhubaneswar, 2-3 days within Odisha, and 3-5 days for the rest of India. You'll see an estimated delivery date at checkout before placing your order.",
  },
  {
    q: "What payment methods do you accept?",
    a: "Currently we support Cash on Delivery (COD). Online payment options will be added soon.",
  },
  {
    q: "Can I track my order?",
    a: "Yes — once your order is placed, you can track its status anytime from the My Orders section in your profile. Once shipped, you'll also see the courier name and tracking number.",
  },
  {
    q: "What is your return policy?",
    a: "[PLACEHOLDER] We accept returns within X days of delivery for unopened, unused products. See our Return & Refund Policy page for full details.",
  },
  {
    q: "Are your products 100% natural?",
    a: "Yes, all our seeds and products are sourced naturally with no artificial preservatives or additives.",
  },
  {
    q: "How do I cancel an order?",
    a: "[PLACEHOLDER] You can cancel an order before it has been shipped by contacting our support team. Once shipped, cancellation may not be possible.",
  },
];

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="bg-[#f9f9f5] min-h-screen py-10 px-4">
      <div className="max-w-2xl mx-auto">
        <Link
          href="/"
          className="flex items-center gap-1.5 text-[#2d6a2d] text-sm font-medium hover:underline mb-6 w-fit"
        >
          <ArrowLeft size={15} /> Back to Home
        </Link>

        <h1 className="text-2xl md:text-3xl font-extrabold text-[#1a3d1a] mb-2">
          Frequently Asked Questions
        </h1>
        <p className="text-gray-500 text-sm mb-8">
          Quick answers to common questions about orders, delivery, and more.
        </p>

        <div className="space-y-3">
          {FAQS.map((item, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden"
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left"
                >
                  <span className="font-semibold text-[#1a3d1a] text-sm">
                    {item.q}
                  </span>
                  <ChevronDown
                    size={18}
                    className={`text-[#2d6a2d] shrink-0 transition-transform ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-5 pb-4">
                    <p className="text-gray-500 text-sm leading-relaxed">
                      {item.a}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="bg-[#e8f5e8] border border-[#c8e6c8] rounded-2xl p-5 mt-8 text-center">
          <p className="text-[#1a3d1a] font-semibold text-sm mb-1">
            Still have questions?
          </p>
          <p className="text-gray-500 text-xs mb-3">
            We're happy to help with anything not covered here.
          </p>
          <Link
            href="/contact"
            className="inline-block bg-[#2d6a2d] hover:bg-[#235423] text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition"
          >
            Contact Support
          </Link>
        </div>
      </div>
    </div>
  );
}