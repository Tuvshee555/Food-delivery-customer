"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useAuth } from "../../provider/AuthProvider";
import { useI18n } from "@/components/i18n/ClientI18nProvider";

type ProfileForm = {
  firstName: string;
  lastName: string;
  phonenumber: string;
  city: string;
  district: string;
  khoroo: string;
  address: string;
  notes: string;
};

export const ProfileInfo = () => {
  const { userId, token } = useAuth();
  const { t } = useI18n();

  const [loading, setLoading] = useState(false);
  const [userEmail, setUserEmail] = useState<string>("");

  const [form, setForm] = useState<ProfileForm>({
    firstName: "",
    lastName: "",
    phonenumber: "",
    city: "",
    district: "",
    khoroo: "",
    address: "",
    notes: "",
  });

  /* ---------------- load user ---------------- */

  useEffect(() => {
    setUserEmail(localStorage.getItem("email") ?? "");

    if (!userId || !token) return;

    axios
      .get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/user/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        const u = res.data?.user;
        if (!u) return;

        setForm({
          firstName: u.firstName ?? "",
          lastName: u.lastName ?? "",
          phonenumber: u.phonenumber ?? "",
          city: u.city ?? "",
          district: u.district ?? "",
          khoroo: u.khoroo ?? "",
          address: u.address ?? "",
          notes: u.notes ?? "",
        });
      })
      .catch(() => toast.error(t("err_user_info")));
  }, [userId, token, t]);

  const update = (k: keyof ProfileForm, v: string) =>
    setForm((p) => ({ ...p, [k]: v }));

  /* ---------------- save ---------------- */

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

  /* ---------------- render ---------------- */

  return (
    <section className="max-w-3xl space-y-10 p-7">
      <h1 className="text-base font-semibold">{t("my_profile")}</h1>

      {/* Personal info */}
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2">
          <Field
            label={t("last_name")}
            required
            value={form.lastName}
            onChange={(v) => update("lastName", v)}
          />

          <Field
            label={t("first_name")}
            required
            value={form.firstName}
            onChange={(v) => update("firstName", v)}
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Field
            label={t("phone")}
            required
            value={form.phonenumber}
            onChange={(v) => update("phonenumber", v)}
          />

          <div>
            <label className="text-sm text-muted-foreground">
              {t("email")}
            </label>
            <Input value={userEmail} disabled className="mt-1 h-[44px]" />
          </div>
        </div>
      </div>

      {/* Address */}
      <div className="space-y-6">
        <Field
          label={t("city")}
          required
          value={form.city}
          onChange={(v) => update("city", v)}
        />

        <div className="grid gap-4 md:grid-cols-2">
          <Field
            label={t("district")}
            required
            value={form.district}
            onChange={(v) => update("district", v)}
          />

          <Field
            label={t("khoroo")}
            required
            value={form.khoroo}
            onChange={(v) => update("khoroo", v)}
          />
        </div>
      </div>

      {/* Notes & address */}
      <div className="grid gap-4 md:grid-cols-2">
        <TextareaField
          label={t("notes")}
          value={form.notes}
          onChange={(v) => update("notes", v)}
        />

        <TextareaField
          label={t("address")}
          required
          value={form.address}
          onChange={(v) => update("address", v)}
        />
      </div>

      {/* Save */}
      <div className="flex justify-end">
        <Button
          className="
      h-[44px]
      w-full sm:w-auto
      px-6
    "
          onClick={handleSave}
          disabled={loading}
        >
          {loading ? `${t("saving")}…` : t("save")}
        </Button>
      </div>
    </section>
  );
};

/* ---------------- helpers ---------------- */

function Field({
  label,
  value,
  onChange,
  required,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  required?: boolean;
}) {
  return (
    <div>
      <label className="text-sm text-muted-foreground">
        {label}
        {required && " *"}
      </label>
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 h-[44px]"
      />
    </div>
  );
}

function TextareaField({
  label,
  value,
  onChange,
  required,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  required?: boolean;
}) {
  return (
    <div>
      <label className="text-sm text-muted-foreground">
        {label}
        {required && " *"}
      </label>
      <Textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 h-[96px]"
      />
    </div>
  );
}
