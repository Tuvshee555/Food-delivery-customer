"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import axios from "axios";
import { toast } from "sonner";
import { useAuth } from "@/app/provider/AuthProvider";
import { LogOut, User, Package, Ticket } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function ProfilePage() {
  const router = useRouter();
  const { userId, token } = useAuth();

  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    phonenumber: "",
    city: "",
    district: "",
    khoroo: "",
    address: "",
    notes: "",
  });

  // ✅ Load profile from backend
  useEffect(() => {
    const email = localStorage.getItem("email");
    setUserEmail(email);

    if (!userId || !token) return;

    const fetchUser = async () => {
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/user/${userId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (res.data.success && res.data.user) {
          setForm({
            firstName: res.data.user.firstName || "",
            lastName: res.data.user.lastName || "",
            phonenumber: res.data.user.phonenumber || "",
            city: res.data.user.city || "",
            district: res.data.user.district || "",
            khoroo: res.data.user.khoroo || "",
            address: res.data.user.address || "",
            notes: res.data.user.notes || "",
          });
        }
      } catch (err: any) {
        console.error(err);
        toast.error("❌ Хэрэглэгчийн мэдээлэл ачаалахад алдаа гарлаа.");
      }
    };

    fetchUser();
  }, [userId, token]);

  // ✅ Handle input changes
  const handleChange = (key: string, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  // ✅ Save / Update profile
  const handleSave = async () => {
    if (!userId || !token) {
      toast.error("❌ Та нэвтэрсэн байх шаардлагатай.");
      return;
    }

    const { firstName, lastName, phonenumber, city, district, khoroo } = form;
    if (
      !firstName ||
      !lastName ||
      !phonenumber ||
      !city ||
      !district ||
      !khoroo
    ) {
      toast.error("⚠️ Бүх талбаруудыг бөглөнө үү.");
      return;
    }

    try {
      setLoading(true);

      const res = await axios.put(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/user/${userId}`,
        form,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data.success) {
        toast.success("✅ Профайл амжилттай хадгалагдлаа!");
        localStorage.setItem("address", form.address);
      }
    } catch (err: any) {
      console.error(err);
      toast.error("❌ Хадгалах үед алдаа гарлаа.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/log-in");
  };

  const firstLetter = userEmail ? userEmail.charAt(0).toUpperCase() : "?";

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white pt-[120px] px-4 md:px-10 pb-20">
      <div className="max-w-[1300px] mx-auto flex flex-col md:flex-row gap-10">
        {/* ✅ Sidebar */}
        <aside className="w-full md:w-[300px] bg-[#0e0e0e]/90 border border-gray-800 rounded-2xl p-6 flex flex-col items-center text-center gap-6 shadow-[0_0_30px_-10px_rgba(250,204,21,0.1)]">
          <div className="w-20 h-20 rounded-full bg-gray-700 flex items-center justify-center text-2xl font-semibold text-[#facc15]">
            {firstLetter}
          </div>
          <p className="text-sm text-gray-400">{userEmail}</p>

          <nav className="w-full flex flex-col text-left gap-2">
            <button
              onClick={() => router.push("/dashboard")}
              className="flex items-center gap-3 px-4 py-2 rounded-xl text-gray-300 hover:text-[#facc15] transition"
            >
              <User className="w-4 h-4 text-[#facc15]" /> Хянах самбар
            </button>

            <button
              onClick={() => router.push("/profile")}
              className="flex items-center gap-3 px-4 py-2 rounded-xl text-white bg-[#1a1a1a] border border-gray-700"
            >
              <User className="w-4 h-4 text-[#facc15]" /> Профайл
            </button>

            <button
              onClick={() => router.push("/orders")}
              className="flex items-center gap-3 px-4 py-2 rounded-xl text-gray-300 hover:text-[#facc15] transition"
            >
              <Package className="w-4 h-4 text-[#facc15]" /> Захиалгууд
            </button>

            <button
              onClick={() => router.push("/tickets")}
              className="flex items-center gap-3 px-4 py-2 rounded-xl text-gray-300 hover:text-[#facc15] transition"
            >
              <Ticket className="w-4 h-4 text-[#facc15]" /> Миний тасалбар
            </button>

            <button
              onClick={handleLogout}
              className="flex items-center gap-3 px-4 py-2 rounded-xl text-gray-300 hover:text-red-500 transition mt-4 border-t border-gray-800 pt-4"
            >
              <LogOut className="w-4 h-4 text-red-500" /> Системээс гарах
            </button>
          </nav>
        </aside>

        {/* ✅ Profile Form */}
        <section className="flex-1 bg-[#0e0e0e]/90 border border-gray-800 rounded-2xl p-8 shadow-[0_0_40px_-10px_rgba(250,204,21,0.1)]">
          <h1 className="text-2xl font-bold mb-8">Миний профайл</h1>

          {/* Grid sections */}
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="text-sm text-gray-400">Овог *</label>
              <Input
                value={form.lastName}
                onChange={(e) => handleChange("lastName", e.target.value)}
                className="bg-[#1a1a1a] border-gray-700 text-white mt-1"
              />
            </div>

            <div>
              <label className="text-sm text-gray-400">Нэр *</label>
              <Input
                value={form.firstName}
                onChange={(e) => handleChange("firstName", e.target.value)}
                className="bg-[#1a1a1a] border-gray-700 text-white mt-1"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mt-6">
            <div>
              <label className="text-sm text-gray-400">Утасны дугаар *</label>
              <Input
                value={form.phonenumber}
                onChange={(e) => handleChange("phonenumber", e.target.value)}
                className="bg-[#1a1a1a] border-gray-700 text-white mt-1"
              />
            </div>

            <div>
              <label className="text-sm text-gray-400">Имэйл хаяг</label>
              <Input
                value={userEmail || ""}
                disabled
                className="bg-[#1a1a1a] border-gray-700 text-gray-400 mt-1"
              />
            </div>
          </div>

          <div className="mt-6">
            <label className="text-sm text-gray-400">Хот / Аймаг *</label>
            <Input
              value={form.city}
              onChange={(e) => handleChange("city", e.target.value)}
              className="bg-[#1a1a1a] border-gray-700 text-white mt-1"
            />
          </div>

          <div className="flex flex-col md:flex-row gap-6 mt-6">
            <div className="flex-1">
              <label className="text-sm text-gray-400">Сум / Дүүрэг *</label>
              <Input
                value={form.district}
                onChange={(e) => handleChange("district", e.target.value)}
                className="bg-[#1a1a1a] border-gray-700 text-white mt-1"
              />
            </div>

            <div className="flex-1">
              <label className="text-sm text-gray-400">Баг / Хороо *</label>
              <Input
                value={form.khoroo}
                onChange={(e) => handleChange("khoroo", e.target.value)}
                className="bg-[#1a1a1a] border-gray-700 text-white mt-1"
              />
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-6 mt-6">
            <div className="flex-1">
              <label className="text-sm text-gray-400">Нэмэлт мэдээлэл</label>
              <Textarea
                value={form.notes}
                onChange={(e) => handleChange("notes", e.target.value)}
                className="bg-[#1a1a1a] border-gray-700 text-white mt-1 h-[120px]"
              />
            </div>

            <div className="flex-1">
              <label className="text-sm text-gray-400">Хүргэлтийн хаяг *</label>
              <Textarea
                value={form.address}
                onChange={(e) => handleChange("address", e.target.value)}
                className="bg-[#1a1a1a] border-gray-700 text-white mt-1 h-[120px]"
              />
            </div>
          </div>

          <div className="flex justify-end mt-10">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              disabled={loading}
              onClick={handleSave}
              className="px-8 py-3 rounded-xl bg-gradient-to-r from-[#facc15] to-[#fbbf24] 
                         text-black font-semibold shadow-[0_0_20px_rgba(250,204,21,0.2)] hover:brightness-110 transition-all"
            >
              {loading ? "Хадгалж байна..." : "Хадгалах"}
            </motion.button>
          </div>
        </section>
      </div>
    </main>
  );
}
