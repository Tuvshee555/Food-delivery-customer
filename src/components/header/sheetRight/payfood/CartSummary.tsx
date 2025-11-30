"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useI18n } from "@/components/i18n/ClientI18nProvider";

type Props = {
  total: number;
};

export const CartSummary = ({ total }: Props) => {
  const router = useRouter();
  const { locale, t } = useI18n();

  return (
    <div className="pt-4 border-t border-gray-800">
      <div className="flex justify-between text-lg font-semibold mb-4">
        <span>{t("grand_total")}</span>
        <span className="text-[#facc15]">₮ {total.toLocaleString()}</span>
      </div>

      <Button
        className="w-full py-3 rounded-xl bg-gradient-to-r from-[#facc15] to-[#fbbf24] text-black font-semibold text-lg"
        onClick={() => router.push(`/${locale}/checkout`)}
      >
        {t("checkout")}
      </Button>
    </div>
  );
};
