import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function TermsPage() {
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
            Terms &amp; Conditions
          </h1>
          <p className="text-gray-400 text-xs mb-8">
            {/* PLACEHOLDER */}Last updated: [Date]
          </p>

          <div className="space-y-6 text-sm text-gray-600 leading-relaxed">
            <p>
              {/* PLACEHOLDER: this is generic boilerplate — have it reviewed
                  by someone qualified before relying on it legally */}
              Welcome to NutriSeeds. By accessing or using our website, you
              agree to be bound by the following terms and conditions. Please
              read them carefully before placing an order.
            </p>

            <div>
              <h2 className="font-bold text-[#1a3d1a] text-base mb-2">
                1. Use of Website
              </h2>
              <p>
                You agree to use this website only for lawful purposes and in
                a way that does not infringe the rights of, restrict, or
                inhibit anyone else's use of the site.
              </p>
            </div>

            <div>
              <h2 className="font-bold text-[#1a3d1a] text-base mb-2">
                2. Account Registration
              </h2>
              <p>
                You are responsible for maintaining the confidentiality of
                your account credentials and for all activities that occur
                under your account. Notify us immediately of any unauthorized
                use.
              </p>
            </div>

            <div>
              <h2 className="font-bold text-[#1a3d1a] text-base mb-2">
                3. Product Information &amp; Pricing
              </h2>
              <p>
                We strive to ensure all product descriptions, images, and
                prices are accurate. However, errors may occur, and we
                reserve the right to correct pricing or availability errors,
                even after an order has been placed.
              </p>
            </div>

            <div>
              <h2 className="font-bold text-[#1a3d1a] text-base mb-2">
                4. Orders &amp; Payment
              </h2>
              <p>
                {/* PLACEHOLDER */}
                All orders are subject to acceptance and availability. We
                currently accept Cash on Delivery (COD) as a payment method.
                We reserve the right to cancel any order at our discretion,
                including in cases of suspected fraud.
              </p>
            </div>

            <div>
              <h2 className="font-bold text-[#1a3d1a] text-base mb-2">
                5. Shipping &amp; Delivery
              </h2>
              <p>
                Delivery timelines are estimates and not guarantees. See our{" "}
                <Link href="/shipping-policy" className="text-[#2d6a2d] underline">
                  Shipping Policy
                </Link>{" "}
                for full details.
              </p>
            </div>

            <div>
              <h2 className="font-bold text-[#1a3d1a] text-base mb-2">
                6. Returns &amp; Refunds
              </h2>
              <p>
                See our{" "}
                <Link href="/return-refund" className="text-[#2d6a2d] underline">
                  Return &amp; Refund Policy
                </Link>{" "}
                for details on eligibility and process.
              </p>
            </div>

            <div>
              <h2 className="font-bold text-[#1a3d1a] text-base mb-2">
                7. Limitation of Liability
              </h2>
              <p>
                {/* PLACEHOLDER: have a lawyer review this section specifically */}
                NutriSeeds shall not be liable for any indirect, incidental,
                or consequential damages arising from the use of our products
                or website, to the maximum extent permitted by law.
              </p>
            </div>

            <div>
              <h2 className="font-bold text-[#1a3d1a] text-base mb-2">
                8. Changes to These Terms
              </h2>
              <p>
                We may update these terms from time to time. Continued use of
                the website after changes constitutes acceptance of the
                revised terms.
              </p>
            </div>

            <div>
              <h2 className="font-bold text-[#1a3d1a] text-base mb-2">
                9. Contact
              </h2>
              <p>
                For questions about these terms, reach out via our{" "}
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