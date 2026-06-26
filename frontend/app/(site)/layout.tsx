import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Script from "next/script";

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />

      {/* TEMPORARY — remove after debugging */}
      <Script src="https://cdn.jsdelivr.net/npm/eruda" strategy="beforeInteractive" />
      <Script id="eruda-init" strategy="afterInteractive">
        {`eruda.init();`}
      </Script>
    </>
  );
}