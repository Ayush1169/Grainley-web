"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import {
  MapPin, Search, Navigation, User, Phone,
  Home, Map, Landmark, Building2, Hash,
  Loader2, Check,
} from "lucide-react";

export default function AddressPage() {
  const [addresses, setAddresses] = useState([]);
  const [loadingAddresses, setLoadingAddresses] = useState(true);
  const [saving, setSaving] = useState(false);
  const [locating, setLocating] = useState(false);

  const [fullName, setFullName] = useState("");
  const [mobile, setMobile] = useState("");
  const [houseNo, setHouseNo] = useState("");
  const [street, setStreet] = useState("");
  const [landmark, setLandmark] = useState("");
  const [city, setCity] = useState("");
  const [stateName, setStateName] = useState("");
  const [pincode, setPincode] = useState("");

  const [search, setSearch] = useState("");
  const [suggestions, setSuggestions] = useState<any[]>([]);

  useEffect(() => { fetchAddresses(); }, []);

  const fetchAddresses = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/addresses`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAddresses(res.data.addresses);
    } catch (error) { console.log(error); }
    finally { setLoadingAddresses(false); }
  };

  const searchAddress = async (value: string) => {
    setSearch(value);
    if (value.length < 3) { setSuggestions([]); return; }
    try {
      const res = await axios.get(`https://photon.komoot.io/api/?q=${value}&limit=5`);
      setSuggestions(res.data.features);
    } catch (error) { console.log(error); }
  };

  const useCurrentLocation = () => {
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const lat = position.coords.latitude;
          const lon = position.coords.longitude;
          const res = await axios.get(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`
          );
          const addr = res.data.address;
          setHouseNo(addr.house_number || "");
          setStreet(addr.road || "");
          setCity(addr.city || addr.town || addr.village || "");
          setStateName(addr.state || "");
          setPincode(addr.postcode || "");
          toast.success("Location loaded!");
        } catch (error) {
          console.log(error);
          toast.error("Couldn't fetch location");
        } finally {
          setLocating(false);
        }
      },
      () => { setLocating(false); toast.error("Location access denied"); }
    );
  };

  const saveAddress = async () => {
    if (!fullName || !mobile || !houseNo || !city || !pincode) {
      toast.error("Please fill all required fields");
      return;
    }
    try {
      setSaving(true);
      const token = localStorage.getItem("token");
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/addresses`,
        { fullName, mobile, houseNo, street, landmark, city, state: stateName, pincode },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Address saved!");
      setFullName(""); setMobile(""); setHouseNo(""); setStreet("");
      setLandmark(""); setCity(""); setStateName(""); setPincode(""); setSearch("");
      fetchAddresses();
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to save address");
    } finally {
      setSaving(false);
    }
  };

  const inputClass =
    "w-full border border-gray-200 rounded-xl pl-10 pr-3 py-3 text-sm outline-none focus:border-[#2d6a2d] focus:ring-1 focus:ring-[#2d6a2d] transition";
  const labelClass = "block text-xs font-semibold text-gray-500 mb-1.5";

  return (
    <div className="bg-[#f9f9f5] min-h-screen py-8">
      <div className="max-w-6xl mx-auto px-4">
        <h1 className="text-2xl font-extrabold text-[#1a3d1a] mb-6">My Addresses</h1>

        <div className="grid md:grid-cols-2 gap-6">
          {/* ── Add Address Form ── */}
          <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
            <div className="flex items-center gap-2 mb-5">
              <MapPin size={18} className="text-[#2d6a2d]" />
              <h2 className="font-bold text-lg text-[#1a3d1a]">Add New Address</h2>
            </div>

            {/* Search location */}
            <div className="relative mb-3">
              <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                value={search}
                onChange={(e) => searchAddress(e.target.value)}
                placeholder="Search your location…"
                className={inputClass}
              />
              {suggestions.length > 0 && (
                <div className="absolute z-20 w-full bg-white border border-gray-200 rounded-xl mt-1.5 max-h-48 overflow-y-auto shadow-lg">
                  {suggestions.map((item, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => {
                        setStreet(item.properties.name || "");
                        setCity(item.properties.city || "");
                        setStateName(item.properties.state || "");
                        setSearch(item.properties.name || "");
                        setSuggestions([]);
                      }}
                      className="w-full text-left px-4 py-2.5 hover:bg-[#f5f5ef] transition text-sm border-b border-gray-50 last:border-0"
                    >
                      <p className="text-[#1a3d1a] font-medium">{item.properties.name}</p>
                      <p className="text-gray-400 text-xs">{item.properties.city}</p>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <button
              onClick={useCurrentLocation}
              disabled={locating}
              className="flex items-center gap-2 text-[#2d6a2d] font-semibold text-sm mb-5 hover:underline disabled:opacity-60"
            >
              {locating ? <Loader2 size={15} className="animate-spin" /> : <Navigation size={15} />}
              {locating ? "Fetching location…" : "Use Current Location"}
            </button>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={labelClass}>Full Name *</label>
                  <div className="relative">
                    <User size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="John Doe" className={inputClass} />
                  </div>
                </div>
                <div>
                  <label className={labelClass}>Mobile Number *</label>
                  <div className="relative">
                    <Phone size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input value={mobile} onChange={(e) => setMobile(e.target.value)} placeholder="98765 43210" className={inputClass} />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={labelClass}>House / Flat No *</label>
                  <div className="relative">
                    <Home size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input value={houseNo} onChange={(e) => setHouseNo(e.target.value)} placeholder="123" className={inputClass} />
                  </div>
                </div>
                <div>
                  <label className={labelClass}>Street</label>
                  <div className="relative">
                    <Map size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input value={street} onChange={(e) => setStreet(e.target.value)} placeholder="MG Road" className={inputClass} />
                  </div>
                </div>
              </div>

              <div>
                <label className={labelClass}>Landmark</label>
                <div className="relative">
                  <Landmark size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input value={landmark} onChange={(e) => setLandmark(e.target.value)} placeholder="Near City Mall" className={inputClass} />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className={labelClass}>City *</label>
                  <div className="relative">
                    <Building2 size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input value={city} onChange={(e) => setCity(e.target.value)} placeholder="Bhopal" className={inputClass} />
                  </div>
                </div>
                <div>
                  <label className={labelClass}>State</label>
                  <input value={stateName} onChange={(e) => setStateName(e.target.value)} placeholder="MP" className="w-full border border-gray-200 rounded-xl px-3 py-3 text-sm outline-none focus:border-[#2d6a2d] focus:ring-1 focus:ring-[#2d6a2d] transition" />
                </div>
                <div>
                  <label className={labelClass}>Pincode *</label>
                  <div className="relative">
                    <Hash size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input value={pincode} onChange={(e) => setPincode(e.target.value)} placeholder="462001" className={inputClass} />
                  </div>
                </div>
              </div>

              <button
                onClick={saveAddress}
                disabled={saving}
                className="w-full bg-[#2d6a2d] hover:bg-[#235423] text-white font-bold py-3 rounded-xl text-sm transition disabled:opacity-60 disabled:cursor-not-allowed mt-2"
              >
                {saving ? "Saving…" : "Save Address"}
              </button>
            </div>
          </div>

          {/* ── Saved Addresses ── */}
          <div>
            <div className="flex items-center gap-2 mb-5">
              <MapPin size={18} className="text-[#2d6a2d]" />
              <h2 className="font-bold text-lg text-[#1a3d1a]">
                Saved Addresses {addresses.length > 0 && <span className="text-gray-400 font-normal text-sm">({addresses.length})</span>}
              </h2>
            </div>

            {loadingAddresses ? (
              <div className="space-y-3">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="h-28 bg-white border border-gray-100 rounded-2xl animate-pulse" />
                ))}
              </div>
            ) : addresses.length === 0 ? (
              <div className="bg-white border border-gray-100 rounded-2xl p-10 text-center">
                <MapPin size={36} className="text-gray-200 mx-auto mb-3" />
                <p className="text-[#1a3d1a] font-semibold text-sm">No saved addresses yet</p>
                <p className="text-gray-400 text-xs mt-1">Add your first address using the form</p>
              </div>
            ) : (
              <div className="space-y-3">
                {addresses.map((addr: any) => (
                  <div key={addr._id} className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm hover:shadow-md transition">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-[#e8f5e8] rounded-lg flex items-center justify-center shrink-0">
                          <MapPin size={14} className="text-[#2d6a2d]" />
                        </div>
                        <p className="font-bold text-[#1a3d1a] text-sm">{addr.fullName}</p>
                      </div>
                      {addr.isDefault && (
                        <span className="flex items-center gap-1 text-[10px] font-bold bg-[#e8f5e8] text-[#2d6a2d] px-2 py-1 rounded-full border border-[#c8e6c8]">
                          <Check size={9} /> DEFAULT
                        </span>
                      )}
                    </div>
                    <p className="text-gray-500 text-xs mt-2 ml-10">{addr.mobile}</p>
                    <p className="text-gray-600 text-sm mt-1 ml-10 leading-relaxed">
                      {addr.houseNo}, {addr.street}
                      <br />
                      {addr.city}, {addr.state} – {addr.pincode}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}