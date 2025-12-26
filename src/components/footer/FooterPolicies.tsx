"use client";

import { Truck, CreditCard, ShieldCheck } from "lucide-react";
import { useI18n } from "@/components/i18n/ClientI18nProvider";

export default function FooterPolicies() {
  const { t } = useI18n();

  return (
    <section className="w-full bg-background text-foreground border-t border-border">
      <div
        className="
          max-w-7xl mx-auto
          px-4 sm:px-6 lg:px-8
          py-10
          grid grid-cols-1 md:grid-cols-3
          gap-8 
          mb-[100px]
        "
      >
        {/* Delivery */}
        <div className="flex gap-4">
          <Truck className="w-6 h-6 text-muted-foreground shrink-0" />
          <div className="space-y-1">
            <p className="font-medium">{t("footer.delivery.title")}</p>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {t("footer.delivery.desc")}
            </p>
          </div>
        </div>

        {/* Payment */}
        <div className="flex gap-4">
          <CreditCard className="w-6 h-6 text-muted-foreground shrink-0" />
          <div className="space-y-1">
            <p className="font-medium">{t("footer.payment.title")}</p>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {t("footer.payment.desc")}
            </p>
          </div>
        </div>

        {/* Service */}
        <div className="flex gap-4">
          <ShieldCheck className="w-6 h-6 text-muted-foreground shrink-0" />
          <div className="space-y-1">
            <p className="font-medium">{t("footer.service.title")}</p>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {t("footer.service.desc")}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
