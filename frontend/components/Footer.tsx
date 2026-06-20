import Link from "next/link";
import Image from "next/image";
import { Phone, Mail, Clock, MapPin, Globe } from "lucide-react";

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
              <Image
                src="/logo/logo.png"
                alt="Grainley Foods"
                width={28}
                height={28}
                className="rounded-md object-contain"
              />
              <div>
                <p className="text-[#1a3d1a] font-extrabold text-base leading-none">Grainley Foods</p>
                <p className="text-[#5a8a5a] text-[9px]">Healthy Seeds, Healthy You</p>
              </div>
            </div>
            <p className="text-gray-500 text-xs leading-relaxed">
              Grainley Foods brings you the finest range of natural and premium quality seeds for a healthy and better lifestyle.
            </p>
            <div className="flex gap-3 mt-4">
              {/* PLACEHOLDER: only Instagram is a confirmed real handle right now.
                  Replace f/in/yt hrefs with real profile URLs once you have them. */}
              <a
                href="#"
                className="w-8 h-8 bg-gray-100 hover:bg-[#2d6a2d] hover:text-white rounded-full flex items-center justify-center text-gray-500 text-xs font-bold cursor-pointer transition"
              >
                f
              </a>
              <a
                href="#"
                className="w-8 h-8 bg-gray-100 hover:bg-[#2d6a2d] hover:text-white rounded-full flex items-center justify-center text-gray-500 text-xs font-bold cursor-pointer transition"
              >
                in
              </a>
              <a
                href="#"
                className="w-8 h-8 bg-gray-100 hover:bg-[#2d6a2d] hover:text-white rounded-full flex items-center justify-center text-gray-500 text-xs font-bold cursor-pointer transition"
              >
                yt
              </a>
              <a
                href="https://instagram.com/grainleyfoods"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 bg-gray-100 hover:bg-[#2d6a2d] hover:text-white rounded-full flex items-center justify-center text-gray-500 text-xs font-bold transition"
                aria-label="Instagram"
              >
                ig
              </a>
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
              {[
                { label: "About Us", href: "/about" },
                { label: "Contact Us", href: "/contact" },
                { label: "FAQ's", href: "/faq" },
                { label: "Shipping Policy", href: "/shipping-policy" },
                { label: "Return & Refund", href: "/return-refund" },
                { label: "Terms & Conditions", href: "/terms" },
                { label: "Privacy Policy", href: "/privacy-policy" },
              ].map(({ label, href }) => (
                <Link key={label} href={href} className="block hover:text-[#2d6a2d] transition">{label}</Link>
              ))}
            </div>
          </div>

          {/* My Account */}
          <div>
            <h4 className="text-[#1a3d1a] font-bold text-sm mb-3">My Account</h4>
            <div className="space-y-2 text-xs text-gray-500">
              {[
                { label: "My Orders", href: "/profile/orders" },
                { label: "Wishlist", href: "/wishlist" },
                { label: "Addresses", href: "/profile/addresses" },
                { label: "Account Details", href: "/profile" },
                { label: "Track Order", href: "/profile/orders" },
                { label: "My Coupons", href: "#" },
              ].map(({ label, href }) => (
                <Link key={label} href={href} className="block hover:text-[#2d6a2d] transition">{label}</Link>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-[#1a3d1a] font-bold text-sm mb-3">Contact Us</h4>
            <div className="space-y-2.5 text-xs text-gray-500">
              <a href="tel:+919919456600" className="flex items-start gap-2 hover:text-[#2d6a2d] transition w-fit">
                <Phone size={12} className="text-[#2d6a2d] mt-0.5 shrink-0" />
                <span>+91-9919456600</span>
              </a>
              <a href="mailto:wecare@grainleyfoods.com" className="flex items-start gap-2 hover:text-[#2d6a2d] transition w-fit">
                <Mail size={12} className="text-[#2d6a2d] mt-0.5 shrink-0" />
                <span>wecare@grainleyfoods.com</span>
              </a>
              <a
                href="https://grainleyfoods.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start gap-2 hover:text-[#2d6a2d] transition w-fit"
              >
                <Globe size={12} className="text-[#2d6a2d] mt-0.5 shrink-0" />
                <span>grainleyfoods.com</span>
              </a>
              <div className="flex items-start gap-2">
                <Clock size={12} className="text-[#2d6a2d] mt-0.5 shrink-0" />
                <span>Mon - Sat: 9:00 AM - 7:00 PM</span>
              </div>
              <a
                href="https://www.google.com/maps/search/?api=1&query=Allied+Traders+994%2F035+Siddhi+Vinayak+Colony+Nilmatha+Road+Telibagh+Lucknow+Uttar+Pradesh+226029"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start gap-2 hover:text-[#2d6a2d] transition"
              >
                <MapPin size={12} className="text-[#2d6a2d] mt-0.5 shrink-0" />
                <span>
                  Allied Traders, #994/035, Siddhi Vinayak Colony, Near
                  Vrindawan Sector 6C Post Office, Nilmatha Road, Telibagh,
                  Lucknow, Uttar Pradesh – 226029
                </span>
              </a>
            </div>
          </div>
        </div>

        {/* FSSAI / compliance strip */}
        <div className="border-t border-gray-100 mt-8 pt-5 flex flex-wrap items-center gap-x-6 gap-y-2 text-[10px] text-gray-400">
          <span>FSSAI Reg. No. – 22725748000645</span>
          <span>Made in India</span>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-gray-100 py-4 px-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
          <p className="text-gray-400 text-xs">© 2024 Grainley Foods. All Rights Reserved.</p>
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