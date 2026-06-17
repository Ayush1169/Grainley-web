import Link from "next/link";
import { Phone, Mail, Clock, MapPin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-100">

      {/* Newsletter */}
      <div className="bg-[#f5f5ef] py-8 px-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="text-[#1a3d1a] font-extrabold text-lg">Subscribe to Our Newsletter</h3>
            <p className="text-gray-500 text-sm mt-0.5">Get the latest updates on new products, offers and health tips.</p>
          </div>
          <div className="flex w-full md:w-auto gap-2">
            <input
              type="email"
              placeholder="Enter your email address"
              className="flex-1 md:w-72 border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#2d6a2d] focus:ring-1 focus:ring-[#2d6a2d] transition bg-white"
            />
            <button className="bg-[#2d6a2d] hover:bg-[#235423] text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition whitespace-nowrap">
              Subscribe
            </button>
          </div>
        </div>
      </div>

      {/* Main footer */}
      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xl">🌿</span>
              <div>
                <p className="text-[#1a3d1a] font-extrabold text-base leading-none">NutriSeeds</p>
                <p className="text-[#5a8a5a] text-[9px]">Healthy Seeds, Healthy You</p>
              </div>
            </div>
            <p className="text-gray-500 text-xs leading-relaxed">
              NutriSeeds brings you the finest range of natural and premium quality seeds for a healthy and better lifestyle.
            </p>
            <div className="flex gap-3 mt-4">
              {["f", "in", "yt", "wa"].map((s) => (
                <div key={s} className="w-8 h-8 bg-gray-100 hover:bg-[#2d6a2d] hover:text-white rounded-full flex items-center justify-center text-gray-500 text-xs font-bold cursor-pointer transition">
                  {s}
                </div>
              ))}
            </div>
          </div>

          {/* Shop */}
          <div>
            <h4 className="text-[#1a3d1a] font-bold text-sm mb-3">Shop</h4>
            <div className="space-y-2 text-xs text-gray-500">
              {["Makhana", "Chia Seeds", "Flax Seeds", "Pumpkin Seeds", "Sunflower Seeds", "Mix Seeds", "Combo Packs", "All Products"].map((item) => (
                <Link key={item} href="/products" className="block hover:text-[#2d6a2d] transition">{item}</Link>
              ))}
            </div>
          </div>

          {/* Customer Service */}
          <div>
            <h4 className="text-[#1a3d1a] font-bold text-sm mb-3">Customer Service</h4>
            <div className="space-y-2 text-xs text-gray-500">
              {["About Us", "Contact Us", "FAQ's", "Shipping Policy", "Return & Refund", "Terms & Conditions", "Privacy Policy"].map((item) => (
                <Link key={item} href="#" className="block hover:text-[#2d6a2d] transition">{item}</Link>
              ))}
            </div>
          </div>

          {/* My Account */}
          <div>
            <h4 className="text-[#1a3d1a] font-bold text-sm mb-3">My Account</h4>
            <div className="space-y-2 text-xs text-gray-500">
              {["My Orders", "Wishlist", "Addresses", "Account Details", "Track Order", "My Coupons"].map((item) => (
                <Link key={item} href="#" className="block hover:text-[#2d6a2d] transition">{item}</Link>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-[#1a3d1a] font-bold text-sm mb-3">Contact Us</h4>
            <div className="space-y-2.5 text-xs text-gray-500">
              <div className="flex items-start gap-2">
                <Phone size={12} className="text-[#2d6a2d] mt-0.5 shrink-0" />
                <span>+91 98765 43210</span>
              </div>
              <div className="flex items-start gap-2">
                <Mail size={12} className="text-[#2d6a2d] mt-0.5 shrink-0" />
                <span>support@nutriseeds.com</span>
              </div>
              <div className="flex items-start gap-2">
                <Clock size={12} className="text-[#2d6a2d] mt-0.5 shrink-0" />
                <span>Mon - Sat: 9:00 AM - 7:00 PM</span>
              </div>
              <div className="flex items-start gap-2">
                <MapPin size={12} className="text-[#2d6a2d] mt-0.5 shrink-0" />
                <span>Bangalore, Karnataka, India</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-gray-100 py-4 px-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
          <p className="text-gray-400 text-xs">© 2024 NutriSeeds. All Rights Reserved.</p>
          <div className="flex items-center gap-2">
            <span className="text-gray-400 text-xs">We Accept:</span>
            {["VISA", "MC", "UPI", "PayTM", "GPay"].map((p) => (
              <span key={p} className="bg-gray-100 text-gray-600 text-[9px] font-bold px-2 py-1 rounded border border-gray-200">
                {p}
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}