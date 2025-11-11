"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { useAuth } from "@/app/provider/AuthProvider";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export const ProfileInfo = () => {
  const { userId, token } = useAuth();
  const [loading, setLoading] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);

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
      } catch {
        toast.error("❌ Хэрэглэгчийн мэдээлэл ачаалахад алдаа гарлаа.");
      }
    };
    fetchUser();
  }, [userId, token]);

  const handleChange = (key: string, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    if (!userId || !token) {
      toast.error("❌ Та нэвтэрсэн байх шаардлагатай.");
      return;
    }

    try {
      setLoading(true);
      await axios.put(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/user/${userId}`,
        form,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("✅ Профайл амжилттай хадгалагдлаа!");
    } catch {
      toast.error("❌ Хадгалах үед алдаа гарлаа.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-8">Миний профайл</h1>

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
    </div>
  );
};
