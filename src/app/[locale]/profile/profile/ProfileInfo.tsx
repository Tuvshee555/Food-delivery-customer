"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "../../provider/AuthProvider";
import { useI18n } from "@/components/i18n/ClientI18nProvider";

export const ProfileInfo = () => {
  const { userId, token } = useAuth();
  const { t } = useI18n();

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
          const u = res.data.user;
          setForm({
            firstName: u.firstName || "",
            lastName: u.lastName || "",
            phonenumber: u.phonenumber || "",
            city: u.city || "",
            district: u.district || "",
            khoroo: u.khoroo || "",
            address: u.address || "",
            notes: u.notes || "",
          });
        }
      } catch {
        toast.error(t("err_user_info"));
      }
    };

    fetchUser();
  }, [userId, token, t]);

  const handleChange = (key: string, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    if (!userId || !token) {
      toast.error(t("login_required"));
      return;
    }

    try {
      setLoading(true);
      await axios.put(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/user/${userId}`,
        form,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success(t("profile_saved"));
    } catch {
      toast.error(t("profile_save_error"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-8">{t("my_profile")}</h1>

      {/* Name Fields */}
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label className="label"> {t("last_name")} *</label>
          <Input
            value={form.lastName}
            onChange={(e) => handleChange("lastName", e.target.value)}
            className="input"
          />
        </div>

        <div>
          <label className="label">{t("first_name")} *</label>
          <Input
            value={form.firstName}
            onChange={(e) => handleChange("firstName", e.target.value)}
            className="input"
          />
        </div>
      </div>

      {/* Phone + Email */}
      <div className="grid md:grid-cols-2 gap-6 mt-6">
        <div>
          <label className="label">{t("phone")} *</label>
          <Input
            value={form.phonenumber}
            onChange={(e) => handleChange("phonenumber", e.target.value)}
            className="input"
          />
        </div>

        <div>
          <label className="label">{t("email")}</label>
          <Input
            value={userEmail || ""}
            disabled
            className="input disabled:opacity-60 text-gray-400"
          />
        </div>
      </div>

      {/* Location */}
      <div className="mt-6">
        <label className="label">{t("city")} *</label>
        <Input
          value={form.city}
          onChange={(e) => handleChange("city", e.target.value)}
          className="input"
        />
      </div>

      <div className="grid md:grid-cols-2 gap-6 mt-6">
        <div>
          <label className="label">{t("district")} *</label>
          <Input
            value={form.district}
            onChange={(e) => handleChange("district", e.target.value)}
            className="input"
          />
        </div>
        <div>
          <label className="label">{t("khoroo")} *</label>
          <Input
            value={form.khoroo}
            onChange={(e) => handleChange("khoroo", e.target.value)}
            className="input"
          />
        </div>
      </div>

      {/* Address + Notes */}
      <div className="grid md:grid-cols-2 gap-6 mt-6">
        <div>
          <label className="label">{t("notes")}</label>
          <Textarea
            value={form.notes}
            onChange={(e) => handleChange("notes", e.target.value)}
            className="textarea"
          />
        </div>

        <div>
          <label className="label">{t("address")} *</label>
          <Textarea
            value={form.address}
            onChange={(e) => handleChange("address", e.target.value)}
            className="textarea"
          />
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end mt-10">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          disabled={loading}
          onClick={handleSave}
          className="primary-btn"
        >
          {loading ? t("saving") + "..." : t("save")}
        </motion.button>
      </div>
    </div>
  );
};
