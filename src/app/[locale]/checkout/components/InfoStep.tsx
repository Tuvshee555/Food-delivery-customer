"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

import PaymentSummary from "./PaymentSummary";
import DeliveryForm from "./DeliveryForm";
import TermsDialog from "./TermsDialog";
import { QPayDialog } from "../../qpay/QPayDialog";
import { useAuth } from "../../provider/AuthProvider";
import { useI18n } from "@/components/i18n/ClientI18nProvider";

type PaymentMethod = "qpay" | "card" | "cod" | null;

type CartItem = {
  foodId?: string;
  quantity: number;
  selectedSize?: string | null;
  food?: {
    id?: string;
    price?: number;
  };
};

type DeliveryFormData = {
  lastName?: string;
  phonenumber?: string;
  city?: string;
  district?: string;
  khoroo?: string;
  address?: string;
};

const CART_KEY = "cart";

export default function InfoStep({ cart }: { cart: CartItem[] }) {
  const router = useRouter();
  const { userId, token } = useAuth();
  const { locale, t } = useI18n();

  const [form, setForm] = useState<DeliveryFormData>({});
  const [errors, setErrors] = useState<Record<string, boolean>>({});
  const [openTerms, setOpenTerms] = useState(false);
  const [openQPay, setOpenQPay] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("qpay");

  /* ---------------- totals ---------------- */

  const productTotal = useMemo(
    () => cart.reduce((sum, i) => sum + (i.food?.price ?? 0) * i.quantity, 0),
    [cart]
  );

  const deliveryFee = 100;
  const totalPrice = productTotal + deliveryFee;

  /* ---------------- preload user info ---------------- */

  useEffect(() => {
    if (!userId || !token) return;

    axios
      .get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/user/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        if (res.data?.user) {
          setForm({
            ...res.data.user,
            city: res.data.user.city || t("ulaanbaatar"),
          });
        }
      })
      .catch(() => toast.error(t("err_user_info")));
  }, [userId, token, t]);

  /* ---------------- submit ---------------- */

  const handleSubmit = (newErrors: Record<string, boolean>) => {
    if (Object.keys(newErrors).length) {
      setErrors(newErrors);
      toast.error(t("err_fill_required"));
      return;
    }

    if (!paymentMethod) {
      toast.error(t("choose_payment_method"));
      return;
    }

    setOpenTerms(true);
  };

  /* ---------------- payment flow ---------------- */

  const handlePaymentStart = async () => {
    try {
      setOpenTerms(false);

      if (!cart.length) {
        toast.error(t("cart_empty"));
        return;
      }

      const items = cart.map((i) => ({
        foodId: i.food?.id ?? i.foodId,
        quantity: i.quantity,
        selectedSize: i.selectedSize ?? null,
      }));

      if (items.some((i) => !i.foodId)) {
        toast.error(t("err_invalid_cart_items"));
        return;
      }

      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/order`,
        {
          userId,
          items,
          productTotal,
          deliveryFee,
          totalPrice,
          location: form.address,
          phone: form.phonenumber,
          paymentMethod,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const createdOrder = res.data?.order ?? res.data;
      if (!createdOrder?.id) {
        toast.error(t("err_create_order"));
        return;
      }

      // ✅ CLEAR LOCAL CART
      localStorage.removeItem(CART_KEY);
      window.dispatchEvent(new Event("cart-updated"));

      setOrderId(createdOrder.id);
      localStorage.setItem("lastOrderId", createdOrder.id);

      if (paymentMethod === "card") {
        const stripeRes = await axios.post(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/stripe/create-session`,
          { orderId: createdOrder.id, totalPrice }
        );

        if (stripeRes.data?.url) {
          window.location.href = stripeRes.data.url;
          return;
        }
      }

      if (paymentMethod === "qpay") {
        router.push(
          `/${locale}/checkout/payment-pending?orderId=${createdOrder.id}`
        );
        return;
      }

      if (paymentMethod === "cod") {
        toast.success(t("order_success"));
        router.push(`/${locale}/orders/${createdOrder.id}`);
      }
    } catch (err) {
      console.error(err);
      toast.error(t("err_create_order"));
    }
  };

  /* ---------------- render ---------------- */

  return (
    <>
      <main className="min-h-screen bg-background text-foreground pt-[120px] pb-28">
        <div className="max-w-7xl mx-auto px-4 md:px-8 flex flex-col lg:flex-row gap-10">
          <motion.section
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            <PaymentSummary
              cart={cart}
              paymentMethod={paymentMethod}
              setPaymentMethod={setPaymentMethod}
              onSubmit={() => {
                const e: Record<string, boolean> = {};
                if (!form.lastName) e.lastName = true;
                if (!form.phonenumber) e.phonenumber = true;
                if (!form.city) e.city = true;
                if (!form.district) e.district = true;
                if (!form.khoroo) e.khoroo = true;
                if (!form.address) e.address = true;
                handleSubmit(e);
              }}
            />
          </motion.section>

          <motion.section
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            className="flex-1"
          >
            <DeliveryForm form={form} setForm={setForm} errors={errors} />
          </motion.section>
        </div>
      </main>

      <TermsDialog
        open={openTerms}
        onOpenChange={setOpenTerms}
        onConfirm={handlePaymentStart}
      />

      <QPayDialog
        open={openQPay}
        onOpenChange={setOpenQPay}
        amount={totalPrice}
        orderId={orderId ?? ""}
      />

      {/* Mobile sticky actions */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-background border-t border-border px-4 py-3">
        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => router.back()}
            className="h-[44px] flex-1 rounded-md border border-border text-sm font-medium"
          >
            {t("back")}
          </button>

          <button
            type="button"
            onClick={() => {
              const e: Record<string, boolean> = {};
              if (!form.lastName) e.lastName = true;
              if (!form.phonenumber) e.phonenumber = true;
              if (!form.city) e.city = true;
              if (!form.district) e.district = true;
              if (!form.khoroo) e.khoroo = true;
              if (!form.address) e.address = true;
              handleSubmit(e);
            }}
            className="h-[44px] flex-1 rounded-md bg-primary text-primary-foreground text-sm font-semibold"
          >
            {t("order")}
          </button>
        </div>
      </div>
    </>
  );
}
