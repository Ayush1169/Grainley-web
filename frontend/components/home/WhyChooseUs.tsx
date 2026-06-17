import { ShieldCheck, Truck, Leaf, BadgeCheck, Star, RefreshCw } from "lucide-react";

const FEATURES = [
  { icon: Leaf, label: "100% Natural", sub: "No Preservatives", color: "bg-green-50 text-[#2d6a2d]" },
  { icon: Star, label: "Rich in Nutrients", sub: "Boosts Your Health", color: "bg-yellow-50 text-yellow-600" },
  { icon: BadgeCheck, label: "Premium Quality", sub: "Carefully Handpicked", color: "bg-blue-50 text-blue-600" },
  { icon: Truck, label: "Fast & Safe Delivery", sub: "Quick Delivery", color: "bg-orange-50 text-orange-600" },
  { icon: ShieldCheck, label: "Secure Payments", sub: "100% Safe & Secure", color: "bg-purple-50 text-purple-600" },
  { icon: RefreshCw, label: "Easy Returns", sub: "Hassle Free Returns", color: "bg-pink-50 text-pink-600" },
];

export default function WhyChooseUs() {
  return (
    <section className="py-10 bg-white border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
          {FEATURES.map((f) => (
            <div key={f.label} className="flex flex-col items-center text-center gap-2">
              <div className={`w-12 h-12 rounded-xl ${f.color} flex items-center justify-center`}>
                <f.icon size={22} />
              </div>
              <div>
                <p className="text-[#1a3d1a] font-semibold text-xs leading-tight">{f.label}</p>
                <p className="text-gray-400 text-[10px] mt-0.5">{f.sub}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}