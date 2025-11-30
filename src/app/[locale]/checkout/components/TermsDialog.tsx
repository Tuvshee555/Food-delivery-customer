"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ShieldCheck, Truck, CreditCard } from "lucide-react";
import { useI18n } from "@/components/i18n/ClientI18nProvider";

export default function TermsDialog({
  open,
  onOpenChange,
  onConfirm,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onConfirm: () => void;
}) {
  const { t } = useI18n();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-[#0a0a0a] text-white border-gray-800 max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold mb-4">
            {t("terms_title")}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-5 text-gray-300">
          <div>
            <p className="flex items-center gap-2 font-medium text-white mb-1">
              <ShieldCheck size={18} /> {t("terms_service")}
            </p>
            <p className="text-sm">{t("terms_service_desc")}</p>
          </div>

          <div>
            <p className="flex items-center gap-2 font-medium text-white mb-1">
              <Truck size={18} /> {t("terms_delivery")}
            </p>
            <p className="text-sm">{t("terms_delivery_desc")}</p>
          </div>

          <div>
            <p className="flex items-center gap-2 font-medium text-white mb-1">
              <CreditCard size={18} /> {t("terms_payment")}
            </p>
            <p className="text-sm">{t("terms_payment_desc")}</p>
          </div>
        </div>

        <DialogFooter className="flex justify-end gap-3 mt-6">
          <DialogClose asChild>
            <Button variant="outline" className="text-gray-300 border-gray-700">
              {t("cancel")}
            </Button>
          </DialogClose>
          <Button
            onClick={onConfirm}
            className="bg-gradient-to-r from-[#facc15] to-[#fbbf24] text-black font-semibold hover:brightness-110"
          >
            {t("continue")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
