/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Button } from "@/components/ui/button";
import { useI18n } from "@/components/i18n/ClientI18nProvider";

export default function PaymentSummary({
  cart,
  router,
  onSubmit,
  paymentMethod,
  setPaymentMethod,
}: {
  cart: any[];
  router: any;
  onSubmit: () => void;
  paymentMethod: "qpay" | "card" | "cod" | null;
  setPaymentMethod: (p: "qpay" | "card" | "cod" | null) => void;
}) {
  const { locale, t } = useI18n();

  const total = cart.reduce(
    (sum, i) => sum + (i.food?.price || i.price) * i.quantity,
    0
  );
  const delivery = 100;
  const grandTotal = total + delivery;

  return (
    <div className="w-full lg:w-[400px] bg-[#111]/90 border border-gray-800 rounded-3xl p-8 h-fit shadow-[0_0_40px_-10px_rgba(250,204,21,0.15)]">
      <h2 className="text-xl font-semibold mb-6 border-b border-gray-800 pb-3">
        {t("payment_info")}
      </h2>

      <div className="flex justify-between text-gray-300 mb-3">
        <span>{t("product_total")}</span>
        <span>{total.toLocaleString()}₮</span>
      </div>
      <div className="flex justify-between text-gray-300 mb-3">
        <span>{t("delivery_price")}</span>
        <span>{delivery.toLocaleString()}₮</span>
      </div>

      <div className="border-t border-gray-700 my-4" />

      <div className="flex justify-between items-center font-semibold text-lg">
        <span>{t("grand_total")}</span>
        <span className="text-[#facc15] text-2xl">
          {grandTotal.toLocaleString()}₮
        </span>
      </div>

      {/* Payment method selection */}
      <div className="mt-6 space-y-2">
        <div className="text-sm text-gray-300 mb-2">{t("choose_payment")}</div>

        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="radio"
            name="payment"
            value="qpay"
            checked={paymentMethod === "qpay"}
            onChange={() => setPaymentMethod("qpay")}
          />
          <span className="ml-2">QPay</span>
        </label>

        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="radio"
            name="payment"
            value="card"
            checked={paymentMethod === "card"}
            onChange={() => setPaymentMethod("card")}
          />
          <span className="ml-2">Card (Visa / Mastercard)</span>
        </label>

        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="radio"
            name="payment"
            value="cod"
            checked={paymentMethod === "cod"}
            onChange={() => setPaymentMethod("cod")}
          />
          <span className="ml-2">{t("cash_on_delivery")}</span>
        </label>
      </div>

      <div className="flex mt-6 gap-2">
        <input
          type="text"
          placeholder={t("coupon_placeholder")}
          className="flex-1 bg-[#1a1a1a] border border-gray-700 rounded-lg px-4 py-2 text-sm text-white placeholder-gray-500 focus:border-[#facc15] outline-none transition"
        />
        <button className="bg-[#facc15] text-black px-5 py-2 rounded-lg font-semibold hover:brightness-110 transition">
          {t("check")}
        </button>
      </div>

      <div className="flex gap-3 mt-8">
        <Button
          variant="outline"
          onClick={() => router.push(`/${locale}/checkout?step=cart`)}
          className="border-gray-600 text-gray-300 hover:border-[#facc15] hover:text-[#facc15] w-full"
        >
          {t("back")}
        </Button>

        <Button
          onClick={onSubmit}
          className="w-full bg-gradient-to-r from-[#facc15] to-[#fbbf24] text-black font-semibold hover:brightness-110"
        >
          {t("order")}
        </Button>
      </div>

      <p className="text-gray-500 text-sm mt-6 leading-snug flex gap-2 items-start">
        ⚠️ {t("delivery_notice")}
      </p>
    </div>
  );
}
