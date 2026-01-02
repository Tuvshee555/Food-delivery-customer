"use client";

import { Button } from "@/components/ui/button";
import { useI18n } from "@/components/i18n/ClientI18nProvider";
import { useRouter } from "next/navigation";

type CartItem = {
  quantity: number;
  price?: number;
  food?: {
    price?: number;
  };
};

type PaymentMethod = "qpay" | "card" | "cod" | null;

interface PaymentSummaryProps {
  cart: CartItem[];
  onSubmit: () => void;
  paymentMethod: PaymentMethod;
  setPaymentMethod: (p: PaymentMethod) => void;
  hideActions?: boolean; // set true when using sticky actions
}

export default function PaymentSummary({
  cart,
  onSubmit,
  paymentMethod,
  setPaymentMethod,
  hideActions = false,
}: PaymentSummaryProps) {
  const { locale, t } = useI18n();
  const router = useRouter();

  const total = cart.reduce(
    (sum, i) => sum + (i.food?.price ?? i.price ?? 0) * i.quantity,
    0
  );

  const delivery = 100;
  const grandTotal = total + delivery;

  return (
    <aside className="w-full lg:w-[400px] bg-card rounded-2xl p-6 space-y-6 h-fit">
      <h2 className="text-base font-semibold border-b border-border pb-3">
        {t("payment_info")}
      </h2>

      <div className="space-y-2 text-sm">
        <div className="flex justify-between text-muted-foreground">
          <span>{t("product_total")}</span>
          <span>{total.toLocaleString()}₮</span>
        </div>

        <div className="flex justify-between text-muted-foreground">
          <span>{t("delivery_price")}</span>
          <span>{delivery.toLocaleString()}₮</span>
        </div>
      </div>

      <div className="border-t border-border" />

      <div className="flex justify-between items-center font-semibold">
        <span>{t("grand_total")}</span>
        <span className="text-lg">{grandTotal.toLocaleString()}₮</span>
      </div>

      <div className="space-y-3">
        <p className="text-sm font-medium">{t("choose_payment")}</p>

        {(["qpay", "card", "cod"] as PaymentMethod[]).map((method) => (
          <label
            key={method}
            className="flex items-center gap-3 h-[44px] px-3 rounded-md border border-border cursor-pointer hover:bg-muted transition"
          >
            <input
              type="radio"
              name="payment"
              checked={paymentMethod === method}
              onChange={() => setPaymentMethod(method)}
            />
            <span className="text-sm">{t(`payment.${method}`)}</span>
          </label>
        ))}
      </div>

      {!hideActions && (
        <div className="hidden lg:flex gap-3">
          <Button
            variant="outline"
            className="w-full h-[44px]"
            onClick={() => router.push(`/${locale}/checkout?step=cart`)}
          >
            {t("back")}
          </Button>

          <Button
            className="w-full h-[44px]"
            onClick={onSubmit}
            disabled={!paymentMethod}
          >
            {t("order")}
          </Button>
        </div>
      )}

      <p className="text-sm text-muted-foreground leading-relaxed">
        {t("delivery_notice")}
      </p>
    </aside>
  );
}
