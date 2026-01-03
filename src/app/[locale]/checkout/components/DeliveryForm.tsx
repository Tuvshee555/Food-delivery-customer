"use client";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useI18n } from "@/components/i18n/ClientI18nProvider";

type DeliveryFormData = {
  lastName?: string;
  phonenumber?: string;
  city?: string;
  district?: string;
  khoroo?: string;
  address?: string;
  notes?: string;
};

interface DeliveryFormProps {
  form: DeliveryFormData;
  setForm: React.Dispatch<React.SetStateAction<DeliveryFormData>>;
  errors: Record<string, boolean>;
}

export default function DeliveryForm({
  form,
  setForm,
  errors,
}: DeliveryFormProps) {
  const { t } = useI18n();

  const handleChange = (key: keyof DeliveryFormData, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  // ⬇️ SAME SIZE, SAME WEIGHT — ONLY COLOR
  const labelClass = (error?: boolean) =>
    `text-sm ${error ? "text-destructive" : "text-foreground"}`;

  // ⬇️ NO GRAY INPUTS
  const inputClass = (error?: boolean) =>
    `mt-1 h-[44px] bg-background border-border text-foreground
     focus-visible:ring-ring ${
       error ? "border-destructive focus-visible:ring-destructive" : ""
     }`;

  return (
    <section className="bg-card rounded-2xl p-6 space-y-8">
      {/* Customer info */}
      <div className="space-y-4">
        <h2 className="text-base font-semibold border-b border-border pb-2">
          {t("customer_info")}
        </h2>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className={labelClass(errors.lastName)}>
              {t("full_name")} *
            </label>
            <Input
              value={form.lastName ?? ""}
              onChange={(e) => handleChange("lastName", e.target.value)}
              className={inputClass(errors.lastName)}
            />
          </div>

          <div>
            <label className={labelClass(errors.phonenumber)}>
              {t("phone_number")} *
            </label>
            <Input
              value={form.phonenumber ?? ""}
              onChange={(e) => handleChange("phonenumber", e.target.value)}
              className={inputClass(errors.phonenumber)}
            />
          </div>
        </div>
      </div>

      {/* Delivery info */}
      <div className="space-y-4">
        <h2 className="text-base font-semibold border-b border-border pb-2">
          {t("delivery_info")}
        </h2>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className={labelClass(errors.city)}>{t("city")} *</label>
            <Input
              value={form.city ?? ""}
              onChange={(e) => handleChange("city", e.target.value)}
              className={inputClass(errors.city)}
            />
          </div>

          <div>
            <label className={labelClass(errors.district)}>
              {t("district")} *
            </label>
            <Input
              value={form.district ?? ""}
              onChange={(e) => handleChange("district", e.target.value)}
              className={inputClass(errors.district)}
            />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className={labelClass(errors.khoroo)}>{t("khoroo")} *</label>
            <Input
              value={form.khoroo ?? ""}
              onChange={(e) => handleChange("khoroo", e.target.value)}
              className={inputClass(errors.khoroo)}
            />
          </div>

          <div>
            <label className={labelClass(errors.address)}>
              {t("address")} *
            </label>
            <Textarea
              value={form.address ?? ""}
              onChange={(e) => handleChange("address", e.target.value)}
              className={`mt-1 h-[90px] bg-background border-border text-foreground
                focus-visible:ring-ring ${
                  errors.address
                    ? "border-destructive focus-visible:ring-destructive"
                    : ""
                }`}
            />
          </div>
        </div>
      </div>

      {/* Additional info */}
      <div>
        <label className="text-sm text-foreground">
          {t("additional_info")}
        </label>
        <Textarea
          value={form.notes ?? ""}
          onChange={(e) => handleChange("notes", e.target.value)}
          className="mt-1 h-[90px] bg-background border-border text-foreground focus-visible:ring-ring"
        />
      </div>
    </section>
  );
}
