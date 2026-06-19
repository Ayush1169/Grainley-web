"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { Users, Search, Loader2, Shield, User } from "lucide-react";

export default function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => { fetchUsers(); }, []);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/admin/users`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(res.data.users);
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  const filtered = users.filter((u: any) =>
    u.name?.toLowerCase().includes(search.toLowerCase()) ||
    u.email?.toLowerCase().includes(search.toLowerCase()) ||
    u.phone?.includes(search)
  );

  const adminCount = users.filter((u: any) => u.role === "admin").length;
  const userCount = users.filter((u: any) => u.role !== "admin").length;

  const getInitials = (name: string) =>
    name?.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase() || "?";

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <p className="text-[#4dff91] text-xs font-semibold tracking-widest uppercase mb-1">
          People
        </p>
        <h1 className="text-2xl font-bold text-white">Customers</h1>
        <p className="text-[#6a8a6a] text-sm mt-0.5">
          {users.length} registered user{users.length !== 1 ? "s" : ""}
        </p>
      </div>

      {/* Stat pills */}
      <div className="flex flex-wrap gap-3">
        <div className="flex items-center gap-2 bg-[#0f140f] border border-[#1e2e1e] rounded-xl px-4 py-2.5">
          <div className="w-7 h-7 bg-[#1a4a1a] rounded-lg flex items-center justify-center">
            <Users size={13} className="text-[#4dff91]" />
          </div>
          <div>
            <p className="text-white font-bold text-sm leading-none">{users.length}</p>
            <p className="text-[#6a8a6a] text-[10px] mt-0.5">Total</p>
          </div>
        </div>
        <div className="flex items-center gap-2 bg-[#0f140f] border border-[#1e2e1e] rounded-xl px-4 py-2.5">
          <div className="w-7 h-7 bg-[#1a2a3a] rounded-lg flex items-center justify-center">
            <User size={13} className="text-[#4db8ff]" />
          </div>
          <div>
            <p className="text-white font-bold text-sm leading-none">{userCount}</p>
            <p className="text-[#6a8a6a] text-[10px] mt-0.5">Customers</p>
          </div>
        </div>
        <div className="flex items-center gap-2 bg-[#0f140f] border border-[#1e2e1e] rounded-xl px-4 py-2.5">
          <div className="w-7 h-7 bg-[#3a1a1a] rounded-lg flex items-center justify-center">
            <Shield size={13} className="text-red-400" />
          </div>
          <div>
            <p className="text-white font-bold text-sm leading-none">{adminCount}</p>
            <p className="text-[#6a8a6a] text-[10px] mt-0.5">Admins</p>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6a8a6a]" />
        <input
          type="text"
          placeholder="Search by name, email or phone…"
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
        <div className="flex flex-col items-center justify-center py-20 border border-[#1e2e1e] rounded-2xl bg-[#0f140f] text-center">
          <Users size={38} className="text-[#2a4a2a] mb-3" />
          <p className="text-white font-semibold">No users found</p>
          <p className="text-[#6a8a6a] text-sm mt-1">
            {search ? "Try a different search term" : "No users registered yet"}
          </p>
        </div>
      ) : (
        <div className="border border-[#1e2e1e] rounded-2xl overflow-hidden">
          {/* Desktop table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-[#0f140f] border-b border-[#1e2e1e]">
                  {["Customer", "Email", "Phone", "Role", "Joined"].map((h) => (
                    <th key={h} className="text-left text-[#6a8a6a] font-semibold px-5 py-3.5 text-xs uppercase tracking-wider">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1e2e1e]">
                {filtered.map((user: any) => (
                  <tr key={user._id} className="bg-[#0c0f0c] hover:bg-[#0f140f] transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-[#1a3a1a] border border-[#2a4a2a] flex items-center justify-center shrink-0">
                          <span className="text-[#4dff91] text-xs font-bold">
                            {getInitials(user.name)}
                          </span>
                        </div>
                        <span className="text-white font-medium">{user.name}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-[#8aaa8a]">{user.email}</td>
                    <td className="px-5 py-4 text-[#8aaa8a]">{user.phone || "—"}</td>
                    <td className="px-5 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold ${
                        user.role === "admin"
                          ? "bg-[#3a1a1a] text-red-400 border border-[#5a2a2a]"
                          : "bg-[#1a3a1a] text-[#4dff91] border border-[#2a5a2a]"
                      }`}>
                        {user.role === "admin"
                          ? <Shield size={11} />
                          : <User size={11} />}
                        {user.role}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-[#6a8a6a] text-xs">
                      {new Date(user.createdAt).toLocaleDateString("en-IN", {
                        day: "2-digit", month: "short", year: "numeric",
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="md:hidden divide-y divide-[#1e2e1e]">
            {filtered.map((user: any) => (
              <div key={user._id} className="p-4 bg-[#0c0f0c] flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#1a3a1a] border border-[#2a4a2a] flex items-center justify-center shrink-0">
                  <span className="text-[#4dff91] text-xs font-bold">
                    {getInitials(user.name)}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-white font-semibold text-sm truncate">{user.name}</p>
                    <span className={`shrink-0 inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-xs font-semibold ${
                      user.role === "admin"
                        ? "bg-[#3a1a1a] text-red-400 border border-[#5a2a2a]"
                        : "bg-[#1a3a1a] text-[#4dff91] border border-[#2a5a2a]"
                    }`}>
                      {user.role === "admin" ? <Shield size={10} /> : <User size={10} />}
                      {user.role}
                    </span>
                  </div>
                  <p className="text-[#6a8a6a] text-xs mt-0.5 truncate">{user.email}</p>
                  <div className="flex items-center gap-3 mt-1 text-[#4a6a4a] text-xs">
                    {user.phone && <span>{user.phone}</span>}
                    <span>
                      {new Date(user.createdAt).toLocaleDateString("en-IN", {
                        day: "2-digit", month: "short", year: "numeric",
                      })}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Footer count */}
      {!loading && filtered.length > 0 && (
        <p className="text-[#4a6a4a] text-xs text-center pb-2">
          Showing {filtered.length} of {users.length} users
        </p>
      )}
    </div>
  );
}