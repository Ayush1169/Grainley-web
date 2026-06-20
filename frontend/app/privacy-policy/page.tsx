import Link from "next/link";
import { ArrowLeft, ShieldCheck } from "lucide-react";

export default function PrivacyPolicyPage() {
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
            <ShieldCheck size={22} className="text-[#2d6a2d]" />
            <h1 className="text-2xl md:text-3xl font-extrabold text-[#1a3d1a]">
              Privacy Policy
            </h1>
          </div>
          <p className="text-gray-400 text-xs mb-8">
            {/* PLACEHOLDER */}Last updated: [Date]
          </p>

          <div className="space-y-6 text-sm text-gray-600 leading-relaxed">
            <p>
              {/* PLACEHOLDER: generic boilerplate — have it reviewed for
                  compliance with applicable data protection law (e.g. India's
                  DPDP Act) before relying on it */}
              NutriSeeds ("we", "us", "our") respects your privacy and is
              committed to protecting the personal information you share with
              us. This policy explains what data we collect, how we use it,
              and your rights regarding it.
            </p>

            <div>
              <h2 className="font-bold text-[#1a3d1a] text-base mb-2">
                Information We Collect
              </h2>
              <ul className="list-disc list-inside space-y-1.5">
                <li>Name, email address, and phone number (at signup)</li>
                <li>Delivery addresses you save to your account</li>
                <li>Order history and transaction details</li>
                <li>Basic usage data (pages visited, device/browser info)</li>
              </ul>
            </div>

            <div>
              <h2 className="font-bold text-[#1a3d1a] text-base mb-2">
                How We Use Your Information
              </h2>
              <ul className="list-disc list-inside space-y-1.5">
                <li>To process and deliver your orders</li>
                <li>To send order confirmations, OTPs, and delivery updates</li>
                <li>To provide customer support</li>
                <li>
                  {/* PLACEHOLDER: only keep this if you actually send marketing emails */}
                  To send promotional offers, if you've opted in
                </li>
                <li>To improve our website and services</li>
              </ul>
            </div>

            <div>
              <h2 className="font-bold text-[#1a3d1a] text-base mb-2">
                Data Sharing
              </h2>
              <p>
                {/* PLACEHOLDER: confirm exactly who you share data with */}
                We share your delivery address and contact details with our
                courier partners solely for the purpose of fulfilling your
                order. We do not sell your personal information to third
                parties.
              </p>
            </div>

            <div>
              <h2 className="font-bold text-[#1a3d1a] text-base mb-2">
                Data Security
              </h2>
              <p>
                We use industry-standard measures, including encrypted
                password storage and secure authentication (JWT-based
                sessions), to protect your data. However, no method of
                transmission over the internet is 100% secure.
              </p>
            </div>

            <div>
              <h2 className="font-bold text-[#1a3d1a] text-base mb-2">
                Your Rights
              </h2>
              <p>
                {/* PLACEHOLDER */}
                You can request access to, correction of, or deletion of your
                personal data at any time by contacting us through our{" "}
                <Link href="/contact" className="text-[#2d6a2d] underline">
                  Contact Us
                </Link>{" "}
                page.
              </p>
            </div>

            <div>
              <h2 className="font-bold text-[#1a3d1a] text-base mb-2">
                Cookies
              </h2>
              <p>
                {/* PLACEHOLDER: confirm what you actually use cookies/localStorage for */}
                We use local storage to keep you logged in and remember your
                cart. We do not currently use third-party tracking cookies.
              </p>
            </div>

            <div>
              <h2 className="font-bold text-[#1a3d1a] text-base mb-2">
                Changes to This Policy
              </h2>
              <p>
                We may update this privacy policy periodically. Significant
                changes will be communicated via email or a notice on our
                website.
              </p>
            </div>

            <div>
              <h2 className="font-bold text-[#1a3d1a] text-base mb-2">
                Contact Us
              </h2>
              <p>
                For privacy-related questions, reach out via our{" "}
                <Link href="/contact" className="text-[#2d6a2d] underline">
                  Contact Us
                </Link>{" "}
                page.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}