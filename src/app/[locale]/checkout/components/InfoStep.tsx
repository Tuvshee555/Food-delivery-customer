"use client";

import TermsDialog from "./TermsDialog";
import { QPayDialog } from "../../qpay/QPayDialog";
import { CartItem } from "@/type/type";
import { useCheckout } from "./components/useCheckout";
import CheckoutLayout from "./components/CheckoutLayout";

export default function InfoStep({ cart }: { cart: CartItem[] }) {
  const checkout = useCheckout(cart);

  const validateAndSubmit = () => {
    const e: Record<string, boolean> = {};
    if (!checkout.form.lastName) e.lastName = true;
    if (!checkout.form.phonenumber) e.phonenumber = true;
    if (!checkout.form.city) e.city = true;
    if (!checkout.form.district) e.district = true;
    if (!checkout.form.khoroo) e.khoroo = true;
    if (!checkout.form.address) e.address = true;
    checkout.handleSubmit(e);
  };

  return (
    <>
      <CheckoutLayout
        cart={cart}
        form={checkout.form}
        errors={checkout.errors}
        paymentMethod={checkout.paymentMethod}
        setPaymentMethod={checkout.setPaymentMethod}
        setForm={checkout.setForm}
        onSubmit={validateAndSubmit}
      />

      <TermsDialog
        open={checkout.openTerms}
        onOpenChange={checkout.setOpenTerms}
        onConfirm={checkout.handlePaymentStart}
      />

      <QPayDialog
        open={checkout.openQPay}
        onOpenChange={checkout.setOpenQPay}
        amount={checkout.totalPrice}
        orderId={checkout.orderId ?? ""}
      />

      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-background border-t border-border px-4 py-3">
        <div className="flex gap-3">
          <button
            onClick={() => checkout.router.back()}
            className="h-[44px] flex-1 rounded-md border"
          >
            {checkout.t("back")}
          </button>
          <button
            onClick={validateAndSubmit}
            className="h-[44px] flex-1 rounded-md bg-primary text-primary-foreground font-semibold"
          >
            {checkout.t("order")}
          </button>
        </div>
      </div>
    </>
  );
}
