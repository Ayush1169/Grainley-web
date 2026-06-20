import Link from "next/link";
import { ArrowLeft, Truck, Clock, MapPin, Package } from "lucide-react";

export default function ShippingPolicyPage() {
  return (
    <div className="bg-[#f9f9f5] min-h-screen py-10 px-4">
      <div className="max-w-3xl mx-auto">
        <Link
          href="/"
          className="flex items-center gap-1.5 text-[#2d6a2d] text-sm font-medium hover:underline mb-6 w-fit"
        >
          <ArrowLeft size={15} /> Back to Home
        </Link>

        <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6 md:p-10">
          <h1 className="text-2xl md:text-3xl font-extrabold text-[#1a3d1a] mb-2">
            Shipping Policy
          </h1>
          <p className="text-gray-400 text-xs mb-8">
            {/* PLACEHOLDER */}Last updated: [Date]
          </p>

          <div className="grid sm:grid-cols-3 gap-4 mb-8">
            {[
              { icon: MapPin, title: "Same City", desc: "1 day delivery" },
              { icon: Truck, title: "Same State", desc: "2 days delivery" },
              { icon: Package, title: "Rest of India", desc: "3-5 days delivery" },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="bg-[#f5f5ef] rounded-xl p-4 text-center">
                <Icon size={20} className="text-[#2d6a2d] mx-auto mb-2" />
                <p className="font-semibold text-[#1a3d1a] text-sm">{title}</p>
                <p className="text-gray-500 text-xs mt-0.5">{desc}</p>
              </div>
            ))}
          </div>

          <div className="space-y-6 text-sm text-gray-600 leading-relaxed">
            <div>
              <h2 className="font-bold text-[#1a3d1a] text-base mb-2">
                Delivery Timelines
              </h2>
              <p>
                We currently ship from our facility in Bhubaneswar, Odisha.
                Estimated delivery dates are shown at checkout based on your
                delivery address, before you place your order. These are
                estimates and actual delivery may occasionally vary due to
                courier delays, weather, or regional disruptions.
              </p>
            </div>

            <div>
              <h2 className="font-bold text-[#1a3d1a] text-base mb-2">
                Shipping Charges
              </h2>
              <p>
                {/* PLACEHOLDER: confirm your actual free-shipping threshold */}
                Orders above ₹499 qualify for free shipping. Orders below this
                amount incur a flat shipping fee of ₹49.
              </p>
            </div>

            <div>
              <h2 className="font-bold text-[#1a3d1a] text-base mb-2">
                Order Tracking
              </h2>
              <p>
                Once your order is shipped, you'll be able to see the courier
                name and tracking number on your order details page under "My
                Orders". You can also track the live status of your order —
                Packed, Shipped, Out for Delivery, or Delivered — at any time.
              </p>
            </div>

            <div>
              <h2 className="font-bold text-[#1a3d1a] text-base mb-2">
                Delivery Attempts
              </h2>
              <p>
                {/* PLACEHOLDER: confirm your actual policy with your courier partner */}
                Our courier partners typically attempt delivery [X] times
                before returning the package to us. Please ensure someone is
                available at the delivery address, or provide accurate
                landmark details to help the delivery agent locate you.
              </p>
            </div>

            <div>
              <h2 className="font-bold text-[#1a3d1a] text-base mb-2">
                Areas We Currently Serve
              </h2>
              <p>
                {/* PLACEHOLDER */}
                We currently deliver across India. Some remote pin codes may
                have limited courier serviceability — we'll notify you at
                checkout if this affects your order.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}