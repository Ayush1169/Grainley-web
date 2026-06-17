"use client";

import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import toast from "react-hot-toast";
import Link from "next/link";
import { Package, ImagePlus, X, ChevronLeft, Loader2 } from "lucide-react";

export default function EditProductPage() {
  const { id } = useParams();
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);

  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [categories, setCategories] = useState([]);
  const [fetchingProduct, setFetchingProduct] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState<any>({
    name: "",
    description: "",
    price: "",
    stock: "",
    category: "",
    featured: false,
    sku: "",
    mrp: "",
    gst: "",
    hsnCode: "",
    packSize: "",
    shelfLife: "",
    brand: "",
  });

  useEffect(() => {
    fetchProduct();
    fetchCategories();
  }, []);

  const fetchProduct = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/products/${id}`);
      const p = res.data.product;
      setFormData({
        name: p.name || "",
        description: p.description || "",
        price: p.price || "",
        stock: p.stock || "",
        category: p.category?._id || p.category || "",
        featured: p.featured || false,
        sku: p.sku || "",
        mrp: p.mrp || "",
        gst: p.gst || "",
        hsnCode: p.hsnCode || "",
        packSize: p.packSize || "",
        shelfLife: p.shelfLife || "",
        brand: p.brand || "",
      });
      if (p.images?.length > 0) setPreview(p.images[0].url);
    } catch (err) {
      toast.error("Failed to load product");
    } finally {
      setFetchingProduct(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/categories");
      setCategories(res.data.categories);
    } catch (err) {
      console.error(err);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const removeImage = () => {
    setImage(null);
    setPreview(null);
    if (fileRef.current) fileRef.current.value = "";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      const token = localStorage.getItem("token");

      // If new image selected, send as FormData; else send JSON
      if (image) {
        const data = new FormData();
        Object.entries(formData).forEach(([key, val]) => data.append(key, String(val)));
        data.append("image", image);
        await axios.put(`http://localhost:5000/api/products/${id}`, data, {
          headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" },
        });
      } else {
        await axios.put(`http://localhost:5000/api/products/${id}`, formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }

      toast.success("Product updated!");
      router.push("/admin/products");
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Update failed");
    } finally {
      setSubmitting(false);
    }
  };

  const inputClass =
    "w-full bg-[#0c0f0c] border border-[#1e2e1e] text-white text-sm placeholder-[#4a6a4a] rounded-xl px-4 py-3 outline-none focus:border-[#2a6a2a] focus:ring-1 focus:ring-[#2a6a2a] transition";
  const labelClass = "block text-xs font-semibold text-[#8aaa8a] uppercase tracking-wider mb-1.5";

  if (fetchingProduct) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 size={28} className="text-[#4dff91] animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <Link
          href="/admin/products"
          className="inline-flex items-center gap-1.5 text-[#6a8a6a] hover:text-[#4dff91] text-sm transition mb-3"
        >
          <ChevronLeft size={15} /> Back to Products
        </Link>
        <p className="text-[#4db8ff] text-xs font-semibold tracking-widest uppercase mb-1">
          Editing
        </p>
        <h1 className="text-2xl font-bold text-white">Edit Product</h1>
        <p className="text-[#6a8a6a] text-sm mt-0.5 truncate">{formData.name}</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

          {/* Left — image */}
          <div className="lg:col-span-1">
            <div className="bg-[#0f140f] border border-[#1e2e1e] rounded-2xl p-5 sticky top-5">
              <p className={labelClass}>Product Image</p>
              {preview ? (
                <div className="relative">
                  <img
                    src={preview}
                    alt="Preview"
                    className="w-full aspect-square object-cover rounded-xl border border-[#1e2e1e]"
                  />
                  <button
                    type="button"
                    onClick={removeImage}
                    className="absolute top-2 right-2 bg-[#3a1a1a] border border-[#5a2a2a] text-red-400 rounded-full p-1 hover:bg-[#5a2a2a] transition"
                  >
                    <X size={14} />
                  </button>
                  <button
                    type="button"
                    onClick={() => fileRef.current?.click()}
                    className="mt-3 w-full border border-[#1e2e1e] text-[#6a8a6a] hover:text-white hover:border-[#2a6a2a] rounded-xl py-2 text-xs transition"
                  >
                    Replace image
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => fileRef.current?.click()}
                  className="w-full aspect-square border-2 border-dashed border-[#1e2e1e] hover:border-[#2a6a2a] rounded-xl flex flex-col items-center justify-center gap-2 text-[#4a6a4a] hover:text-[#4dff91] transition group"
                >
                  <ImagePlus size={28} className="group-hover:scale-110 transition" />
                  <p className="text-sm font-medium">Upload image</p>
                </button>
              )}
              <input ref={fileRef} type="file" accept="image/*" onChange={handleImage} className="hidden" />

              {/* Featured toggle */}
              <div className="mt-5 pt-5 border-t border-[#1e2e1e]">
                <label className="flex items-center justify-between cursor-pointer">
                  <div>
                    <p className="text-white text-sm font-medium">Featured</p>
                    <p className="text-[#6a8a6a] text-xs">Show on homepage</p>
                  </div>
                  <div
                    onClick={() => setFormData({ ...formData, featured: !formData.featured })}
                    className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                      formData.featured ? "bg-[#2d6a2d]" : "bg-[#1e2e1e]"
                    }`}
                  >
                    <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${
                      formData.featured ? "translate-x-6" : "translate-x-1"
                    }`} />
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* Right — fields */}
          <div className="lg:col-span-2 space-y-5">
            {/* Basic */}
            <div className="bg-[#0f140f] border border-[#1e2e1e] rounded-2xl p-5 space-y-4">
              <p className="text-white font-semibold text-sm border-b border-[#1e2e1e] pb-3">Basic Information</p>
              <div>
                <label className={labelClass}>Product Name *</label>
                <input type="text" name="name" value={formData.name} onChange={handleChange} required className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Description</label>
                <textarea name="description" value={formData.description} onChange={handleChange} rows={4} className={inputClass + " resize-none"} />
              </div>
              <div>
                <label className={labelClass}>Category</label>
                <select name="category" value={formData.category} onChange={handleChange} className={inputClass}>
                  <option value="">Select a category</option>
                  {categories.map((cat: any) => (
                    <option key={cat._id} value={cat._id}>{cat.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className={labelClass}>Brand</label>
                <input type="text" name="brand" value={formData.brand} onChange={handleChange} className={inputClass} />
              </div>
            </div>

            {/* Pricing */}
            <div className="bg-[#0f140f] border border-[#1e2e1e] rounded-2xl p-5 space-y-4">
              <p className="text-white font-semibold text-sm border-b border-[#1e2e1e] pb-3">Pricing & Inventory</p>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Selling Price (₹) *</label>
                  <input type="number" name="price" value={formData.price} onChange={handleChange} required className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>MRP (₹)</label>
                  <input type="number" name="mrp" value={formData.mrp} onChange={handleChange} className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Stock (units) *</label>
                  <input type="number" name="stock" value={formData.stock} onChange={handleChange} required className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>GST (%)</label>
                  <input type="number" name="gst" value={formData.gst} onChange={handleChange} className={inputClass} />
                </div>
              </div>
            </div>

            {/* Details */}
            <div className="bg-[#0f140f] border border-[#1e2e1e] rounded-2xl p-5 space-y-4">
              <p className="text-white font-semibold text-sm border-b border-[#1e2e1e] pb-3">Product Details</p>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>SKU</label>
                  <input type="text" name="sku" value={formData.sku} onChange={handleChange} className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>HSN Code</label>
                  <input type="text" name="hsnCode" value={formData.hsnCode} onChange={handleChange} className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Pack Size</label>
                  <input type="text" name="packSize" value={formData.packSize} onChange={handleChange} className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Shelf Life</label>
                  <input type="text" name="shelfLife" value={formData.shelfLife} onChange={handleChange} className={inputClass} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <Link
            href="/admin/products"
            className="px-5 py-2.5 border border-[#1e2e1e] text-[#6a8a6a] hover:text-white hover:border-[#2a6a2a] rounded-xl text-sm font-medium transition"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={submitting}
            className="flex items-center gap-2 bg-[#1a2a3a] hover:bg-[#1e3a5a] text-[#4db8ff] border border-[#2a3a5a] font-semibold px-6 py-2.5 rounded-xl text-sm transition disabled:opacity-60"
          >
            <Package size={16} />
            {submitting ? "Saving…" : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
}