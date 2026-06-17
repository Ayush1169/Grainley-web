"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import Link from "next/link";
import {
  Package,
  PlusCircle,
  Pencil,
  Trash2,
  Search,
  ImageOff,
} from "lucide-react";

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchProducts = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/products");
      setProducts(res.data.products);
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to fetch products");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (productId: string) => {
    if (!confirm("Delete this product? This action cannot be undone.")) return;
    try {
      setDeletingId(productId);
      const token = localStorage.getItem("token");
      const res = await axios.delete(
        `http://localhost:5000/api/products/${productId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success(res.data.message || "Product deleted");
      fetchProducts();
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Delete failed");
    } finally {
      setDeletingId(null);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const filtered = products.filter((p: any) =>
    p.name?.toLowerCase().includes(search.toLowerCase()) ||
    p.category?.name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <p className="text-[#4dff91] text-xs font-semibold tracking-widest uppercase mb-1">
            Inventory
          </p>
          <h1 className="text-2xl font-bold text-white">Products</h1>
          <p className="text-[#6a8a6a] text-sm mt-0.5">
            {products.length} total product{products.length !== 1 ? "s" : ""}
          </p>
        </div>
        <Link
          href="/admin/products/create"
          className="flex items-center gap-2 bg-[#1a4a1a] hover:bg-[#235423] text-[#4dff91] border border-[#2a6a2a] px-4 py-2.5 rounded-xl text-sm font-semibold transition whitespace-nowrap"
        >
          <PlusCircle size={16} />
          Add Product
        </Link>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6a8a6a]" />
        <input
          type="text"
          placeholder="Search products or categories…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-[#0f140f] border border-[#1e2e1e] text-white text-sm placeholder-[#4a6a4a] rounded-xl pl-9 pr-4 py-2.5 outline-none focus:border-[#2a6a2a] focus:ring-1 focus:ring-[#2a6a2a] transition"
        />
      </div>

      {/* Table */}
      {loading ? (
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-16 bg-[#0f140f] border border-[#1e2e1e] rounded-xl animate-pulse" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center border border-[#1e2e1e] rounded-2xl bg-[#0f140f]">
          <Package size={40} className="text-[#2a4a2a] mb-3" />
          <p className="text-white font-semibold">No products found</p>
          <p className="text-[#6a8a6a] text-sm mt-1">
            {search ? "Try a different search term" : "Add your first product to get started"}
          </p>
        </div>
      ) : (
        <div className="border border-[#1e2e1e] rounded-2xl overflow-hidden">
          {/* Desktop table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-[#0f140f] border-b border-[#1e2e1e]">
                  <th className="text-left text-[#6a8a6a] font-semibold px-5 py-3.5 text-xs uppercase tracking-wider">
                    Product
                  </th>
                  <th className="text-left text-[#6a8a6a] font-semibold px-5 py-3.5 text-xs uppercase tracking-wider">
                    Category
                  </th>
                  <th className="text-left text-[#6a8a6a] font-semibold px-5 py-3.5 text-xs uppercase tracking-wider">
                    Price
                  </th>
                  <th className="text-left text-[#6a8a6a] font-semibold px-5 py-3.5 text-xs uppercase tracking-wider">
                    Stock
                  </th>
                  <th className="text-center text-[#6a8a6a] font-semibold px-5 py-3.5 text-xs uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1e2e1e]">
                {filtered.map((product: any) => (
                  <tr
                    key={product._id}
                    className="bg-[#0c0f0c] hover:bg-[#0f140f] transition-colors"
                  >
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        {product.images?.length > 0 ? (
                          <img
                            src={product.images[0].url}
                            alt={product.name}
                            className="w-11 h-11 object-cover rounded-xl border border-[#1e2e1e]"
                          />
                        ) : (
                          <div className="w-11 h-11 bg-[#1a2a1a] border border-[#1e2e1e] rounded-xl flex items-center justify-center">
                            <ImageOff size={14} className="text-[#4a6a4a]" />
                          </div>
                        )}
                        <div>
                          <p className="text-white font-medium leading-tight">{product.name}</p>
                          {product.sku && (
                            <p className="text-[#4a6a4a] text-xs mt-0.5">SKU: {product.sku}</p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <span className="bg-[#1a2a1a] text-[#4dff91] text-xs font-medium px-2.5 py-1 rounded-lg">
                        {product.category?.name || "—"}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <p className="text-white font-semibold">₹{product.price}</p>
                      {product.mrp && product.mrp !== product.price && (
                        <p className="text-[#6a8a6a] text-xs line-through">₹{product.mrp}</p>
                      )}
                    </td>
                    <td className="px-5 py-4">
                      <span
                        className={`text-xs font-semibold px-2.5 py-1 rounded-lg ${
                          product.stock === 0
                            ? "bg-[#3a1a1a] text-red-400"
                            : product.stock < 10
                            ? "bg-[#3a2a1a] text-yellow-400"
                            : "bg-[#1a3a1a] text-[#4dff91]"
                        }`}
                      >
                        {product.stock === 0 ? "Out of stock" : `${product.stock} units`}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <Link
                          href={`/admin/products/edit/${product._id}`}
                          className="flex items-center gap-1.5 bg-[#1a2a3a] hover:bg-[#1e3a5a] text-[#4db8ff] border border-[#2a3a5a] px-3 py-1.5 rounded-lg text-xs font-medium transition"
                        >
                          <Pencil size={13} />
                          Edit
                        </Link>
                        <button
                          onClick={() => handleDelete(product._id)}
                          disabled={deletingId === product._id}
                          className="flex items-center gap-1.5 bg-[#3a1a1a] hover:bg-[#5a2a2a] text-red-400 border border-[#5a2a2a] px-3 py-1.5 rounded-lg text-xs font-medium transition disabled:opacity-50"
                        >
                          <Trash2 size={13} />
                          {deletingId === product._id ? "…" : "Delete"}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="md:hidden divide-y divide-[#1e2e1e]">
            {filtered.map((product: any) => (
              <div key={product._id} className="p-4 bg-[#0c0f0c] flex gap-3">
                {product.images?.length > 0 ? (
                  <img
                    src={product.images[0].url}
                    alt={product.name}
                    className="w-14 h-14 object-cover rounded-xl border border-[#1e2e1e] shrink-0"
                  />
                ) : (
                  <div className="w-14 h-14 bg-[#1a2a1a] border border-[#1e2e1e] rounded-xl flex items-center justify-center shrink-0">
                    <ImageOff size={16} className="text-[#4a6a4a]" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-white font-semibold text-sm truncate">{product.name}</p>
                  <p className="text-[#4dff91] text-xs mt-0.5">{product.category?.name}</p>
                  <div className="flex items-center gap-3 mt-1">
                    <p className="text-white text-sm font-bold">₹{product.price}</p>
                    <span className={`text-xs px-2 py-0.5 rounded-md font-medium ${
                      product.stock === 0 ? "bg-[#3a1a1a] text-red-400" : "bg-[#1a3a1a] text-[#4dff91]"
                    }`}>
                      {product.stock === 0 ? "Out of stock" : `${product.stock} units`}
                    </span>
                  </div>
                  <div className="flex gap-2 mt-2">
                    <Link
                      href={`/admin/products/edit/${product._id}`}
                      className="flex items-center gap-1 bg-[#1a2a3a] text-[#4db8ff] border border-[#2a3a5a] px-2.5 py-1 rounded-lg text-xs font-medium"
                    >
                      <Pencil size={11} /> Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(product._id)}
                      disabled={deletingId === product._id}
                      className="flex items-center gap-1 bg-[#3a1a1a] text-red-400 border border-[#5a2a2a] px-2.5 py-1 rounded-lg text-xs font-medium disabled:opacity-50"
                    >
                      <Trash2 size={11} /> Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}