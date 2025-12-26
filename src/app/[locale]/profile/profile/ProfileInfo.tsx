"use client";

import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useAuth } from "../../provider/AuthProvider";
import { useI18n } from "@/components/i18n/ClientI18nProvider";
import { ProfileFields } from "./components/ProfileFields";

export type ProfileForm = {
  firstName: string;
  lastName: string;
  phonenumber: string;
  city: string;
  district: string;
  khoroo: string;
  address: string;
  notes: string;
};

const REQUIRED_FIELDS: (keyof ProfileForm)[] = [
  "firstName",
  "lastName",
  "phonenumber",
  "city",
  "district",
  "khoroo",
  "address",
];

export const ProfileInfo = () => {
  const { userId, token } = useAuth();
  const { t } = useI18n();

  const [loading, setLoading] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [touched, setTouched] = useState<Record<string, boolean>>({});

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

  /* load user */
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

  const hasErrors = useMemo(
    () => REQUIRED_FIELDS.some((k) => !form[k].trim()),
    [form]
  );

  const handleSave = async () => {
    if (hasErrors || !userId || !token) return;

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
    <section className="max-w-3xl space-y-10 p-7">
      <h1 className="text-base font-semibold">{t("my_profile")}</h1>

      <ProfileFields
        form={form}
        update={update}
        touched={touched}
        setTouched={setTouched}
        email={userEmail}
      />

      <div className="flex justify-end">
        <Button
          onClick={handleSave}
          disabled={loading || hasErrors}
          className={`
      h-[44px] px-6 w-full sm:w-auto
      bg-primary text-primary-foreground
      transition

      ${
        loading || hasErrors
          ? "bg-primary/40 text-primary-foreground/70 border border-primary/40 cursor-not-allowed"
          : ""
      }
    `}
        >
          {loading ? `${t("saving")}…` : t("save")}
        </Button>
      </div>
    </section>
  );
};
