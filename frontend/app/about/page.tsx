import Link from "next/link";
import { ArrowLeft, Leaf, Heart, ShieldCheck, Users } from "lucide-react";

export default function AboutPage() {
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
          <div className="flex items-center gap-2 mb-2">
            <span className="text-2xl">🌿</span>
            <h1 className="text-2xl md:text-3xl font-extrabold text-[#1a3d1a]">
              About NutriSeeds
            </h1>
          </div>
          <p className="text-gray-500 text-sm mb-8">
            Healthy Seeds, Healthy You
          </p>

          <div className="prose prose-sm max-w-none text-gray-600 leading-relaxed space-y-4">
            <p>
              {/* PLACEHOLDER: Replace with your real founding story */}
              NutriSeeds was founded with a simple mission — to bring naturally
              grown, nutrient-rich seeds and superfoods directly from source to
              your kitchen, without unnecessary processing or additives.
              [Replace this paragraph with your actual brand story: when you
              started, why, and what makes your sourcing different.]
            </p>
            <p>
              {/* PLACEHOLDER */}
              Every product we sell is carefully selected and quality-checked
              before it reaches you. We believe good health starts with what
              you eat every day, and seeds are one of nature's most concentrated
              sources of nutrition.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-4 mt-10">
            {[
              { icon: Leaf, title: "100% Natural", desc: "No preservatives or additives" },
              { icon: ShieldCheck, title: "Quality Checked", desc: "Every batch carefully inspected" },
              { icon: Heart, title: "Health First", desc: "Nutrition-focused sourcing" },
              { icon: Users, title: "Trusted by Customers", desc: "Growing community across India" },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="flex items-start gap-3 bg-[#f5f5ef] rounded-xl p-4">
                <div className="w-9 h-9 bg-[#e8f5e8] rounded-lg flex items-center justify-center shrink-0">
                  <Icon size={17} className="text-[#2d6a2d]" />
                </div>
                <div>
                  <p className="font-semibold text-[#1a3d1a] text-sm">{title}</p>
                  <p className="text-gray-500 text-xs mt-0.5">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}