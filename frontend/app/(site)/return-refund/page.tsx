import Link from "next/link";
import { ArrowLeft, RotateCcw, AlertCircle, CheckCircle2 } from "lucide-react";

export default function ReturnRefundPage() {
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
            <RotateCcw size={22} className="text-[#2d6a2d]" />
            <h1 className="text-2xl md:text-3xl font-extrabold text-[#1a3d1a]">
              Return &amp; Refund Policy
            </h1>
          </div>
          <p className="text-gray-400 text-xs mb-8">
            {/* PLACEHOLDER */}Last updated: [Date]
          </p>

          <div className="space-y-6 text-sm text-gray-600 leading-relaxed">
            <div className="bg-[#e8f5e8] border border-[#c8e6c8] rounded-xl p-4 flex items-start gap-3">
              <CheckCircle2 size={18} className="text-[#2d6a2d] shrink-0 mt-0.5" />
              <p className="text-[#1a3d1a] text-sm">
                {/* PLACEHOLDER: set your real return window */}
                We accept returns within <strong>7 days</strong> of delivery
                for unopened, unused, and undamaged products.
              </p>
            </div>

            <div>
              <h2 className="font-bold text-[#1a3d1a] text-base mb-2">
                Eligibility for Returns
              </h2>
              <ul className="list-disc list-inside space-y-1.5">
                <li>Product must be unopened and in its original packaging</li>
                <li>Product must be unused and undamaged</li>
                <li>Return request raised within the return window</li>
                <li>
                  {/* PLACEHOLDER */}
                  Due to the perishable/consumable nature of food products,
                  opened packages cannot be returned unless defective
                </li>
              </ul>
            </div>

            <div>
              <h2 className="font-bold text-[#1a3d1a] text-base mb-2">
                Non-Returnable Items
              </h2>
              <p>
                {/* PLACEHOLDER */}
                Products that have been opened, used, or are missing original
                packaging cannot be returned, except in cases of damage,
                defect, or incorrect items received.
              </p>
            </div>

            <div>
              <h2 className="font-bold text-[#1a3d1a] text-base mb-2">
                How to Request a Return
              </h2>
              <ol className="list-decimal list-inside space-y-1.5">
                <li>Go to "My Orders" and select the relevant order</li>
                <li>
                  {/* PLACEHOLDER: this assumes a return-request feature you may not have built yet */}
                  Contact our support team with your order ID and reason for
                  return
                </li>
                <li>We'll review your request and confirm pickup or return shipping</li>
                <li>Once received and inspected, your refund will be processed</li>
              </ol>
            </div>

            <div>
              <h2 className="font-bold text-[#1a3d1a] text-base mb-2">
                Refunds
              </h2>
              <p>
                {/* PLACEHOLDER: confirm actual refund timeline and method */}
                Once your return is received and inspected, refunds are
                processed within 5-7 business days. For Cash on Delivery
                orders, refunds are issued via bank transfer or UPI; for
                online payments, refunds go back to the original payment
                method.
              </p>
            </div>

            <div className="bg-amber-50 border border-amber-100 rounded-xl p-4 flex items-start gap-3">
              <AlertCircle size={18} className="text-amber-600 shrink-0 mt-0.5" />
              <p className="text-amber-800 text-sm">
                Damaged or incorrect items must be reported within 48 hours of
                delivery, along with photos, to qualify for a replacement or
                refund.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}