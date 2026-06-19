"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { Tag, Trash2, PlusCircle, Loader2, Search } from "lucide-react";

export default function CategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const fetchCategories = async () => {
    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/categories`);
      setCategories(res.data.categories);
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to fetch categories");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this category?")) return;
    try {
      setDeletingId(id);
      const token = localStorage.getItem("token");
      await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/categories/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Category deleted");
      fetchCategories();
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Delete failed");
    } finally {
      setDeletingId(null);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) { toast.error("Category name is required"); return; }
    try {
      setSubmitting(true);
      const token = localStorage.getItem("token");
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/categories`,
        { name, description },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success(res.data.message || "Category created!");
      setName("");
      setDescription("");
      fetchCategories();
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to create");
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => { fetchCategories(); }, []);

  const filtered = categories.filter((c: any) =>
    c.name?.toLowerCase().includes(search.toLowerCase())
  );

  const inputClass =
    "w-full bg-[#0c0f0c] border border-[#1e2e1e] text-white text-sm placeholder-[#4a6a4a] rounded-xl px-4 py-3 outline-none focus:border-[#2a6a2a] focus:ring-1 focus:ring-[#2a6a2a] transition";
  const labelClass = "block text-xs font-semibold text-[#8aaa8a] uppercase tracking-wider mb-1.5";

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <p className="text-[#4dff91] text-xs font-semibold tracking-widest uppercase mb-1">
          Catalogue
        </p>
        <h1 className="text-2xl font-bold text-white">Categories</h1>
        <p className="text-[#6a8a6a] text-sm mt-0.5">
          {categories.length} total categor{categories.length !== 1 ? "ies" : "y"}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Left: Create form */}
        <div className="lg:col-span-1">
          <div className="bg-[#0f140f] border border-[#1e2e1e] rounded-2xl p-5 sticky top-5">
            <div className="flex items-center gap-2 mb-5 pb-4 border-b border-[#1e2e1e]">
              <div className="w-8 h-8 bg-[#1a4a1a] rounded-lg flex items-center justify-center">
                <PlusCircle size={15} className="text-[#4dff91]" />
              </div>
              <p className="text-white font-semibold text-sm">New Category</p>
            </div>

            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className={labelClass}>Name *</label>
                <input
                  type="text"
                  placeholder="e.g. Superfood Seeds"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>Description</label>
                <textarea
                  placeholder="Short description of this category…"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  className={inputClass + " resize-none"}
                />
              </div>
              <button
                type="submit"
                disabled={submitting}
                className="w-full flex items-center justify-center gap-2 bg-[#2d6a2d] hover:bg-[#235423] text-white font-semibold py-3 rounded-xl text-sm transition disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {submitting ? (
                  <Loader2 size={15} className="animate-spin" />
                ) : (
                  <PlusCircle size={15} />
                )}
                {submitting ? "Creating…" : "Create Category"}
              </button>
            </form>
          </div>
        </div>

        {/* Right: List */}
        <div className="lg:col-span-2 space-y-4">
          {/* Search */}
          <div className="relative">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6a8a6a]" />
            <input
              type="text"
              placeholder="Search categories…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-[#0f140f] border border-[#1e2e1e] text-white text-sm placeholder-[#4a6a4a] rounded-xl pl-9 pr-4 py-2.5 outline-none focus:border-[#2a6a2a] focus:ring-1 focus:ring-[#2a6a2a] transition"
            />
          </div>

          {loading ? (
            <div className="space-y-3">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-16 bg-[#0f140f] border border-[#1e2e1e] rounded-xl animate-pulse" />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 border border-[#1e2e1e] rounded-2xl bg-[#0f140f] text-center">
              <Tag size={36} className="text-[#2a4a2a] mb-3" />
              <p className="text-white font-semibold">No categories found</p>
              <p className="text-[#6a8a6a] text-sm mt-1">
                {search ? "Try a different search" : "Create your first category on the left"}
              </p>
            </div>
          ) : (
            <div className="border border-[#1e2e1e] rounded-2xl overflow-hidden">
              {/* Desktop table */}
              <div className="hidden sm:block overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-[#0f140f] border-b border-[#1e2e1e]">
                      <th className="text-left text-[#6a8a6a] font-semibold px-5 py-3.5 text-xs uppercase tracking-wider">Name</th>
                      <th className="text-left text-[#6a8a6a] font-semibold px-5 py-3.5 text-xs uppercase tracking-wider">Description</th>
                      <th className="text-center text-[#6a8a6a] font-semibold px-5 py-3.5 text-xs uppercase tracking-wider">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#1e2e1e]">
                    {filtered.map((cat: any) => (
                      <tr key={cat._id} className="bg-[#0c0f0c] hover:bg-[#0f140f] transition-colors">
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 bg-[#1a4a1a] rounded-lg flex items-center justify-center shrink-0">
                              <Tag size={13} className="text-[#4dff91]" />
                            </div>
                            <span className="text-white font-medium">{cat.name}</span>
                          </div>
                        </td>
                        <td className="px-5 py-4 text-[#6a8a6a] text-sm max-w-[200px] truncate">
                          {cat.description || <span className="text-[#2a4a2a] italic">No description</span>}
                        </td>
                        <td className="px-5 py-4 text-center">
                          <button
                            onClick={() => handleDelete(cat._id)}
                            disabled={deletingId === cat._id}
                            className="flex items-center gap-1.5 bg-[#3a1a1a] hover:bg-[#5a2a2a] text-red-400 border border-[#5a2a2a] px-3 py-1.5 rounded-lg text-xs font-medium transition disabled:opacity-50 mx-auto"
                          >
                            {deletingId === cat._id ? (
                              <Loader2 size={12} className="animate-spin" />
                            ) : (
                              <Trash2 size={12} />
                            )}
                            {deletingId === cat._id ? "Deleting…" : "Delete"}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile cards */}
              <div className="sm:hidden divide-y divide-[#1e2e1e]">
                {filtered.map((cat: any) => (
                  <div key={cat._id} className="p-4 bg-[#0c0f0c] flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3 min-w-0">
                      <div className="w-9 h-9 bg-[#1a4a1a] rounded-lg flex items-center justify-center shrink-0">
                        <Tag size={14} className="text-[#4dff91]" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-white font-semibold text-sm">{cat.name}</p>
                        <p className="text-[#6a8a6a] text-xs mt-0.5 truncate">
                          {cat.description || "No description"}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleDelete(cat._id)}
                      disabled={deletingId === cat._id}
                      className="flex items-center gap-1 bg-[#3a1a1a] text-red-400 border border-[#5a2a2a] px-2.5 py-1.5 rounded-lg text-xs font-medium shrink-0 disabled:opacity-50"
                    >
                      {deletingId === cat._id ? <Loader2 size={11} className="animate-spin" /> : <Trash2 size={11} />}
                      Delete
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}