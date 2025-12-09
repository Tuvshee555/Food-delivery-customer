/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { toast } from "sonner";
import PaymentSummary from "./PaymentSummary";
import DeliveryForm from "./DeliveryForm";
import TermsDialog from "./TermsDialog";
import { useAuth } from "../../provider/AuthProvider";
import { QPayDialog } from "../../qpay/QPayDialog";
import { useI18n } from "@/components/i18n/ClientI18nProvider";

type PaymentMethod = "qpay" | "card" | "cod" | null;

export default function InfoStep({
  router,
  cart,
  refreshCart,
}: {
  router: any;
  cart: any[];
  refreshCart: () => void;
}) {
  const { userId, token } = useAuth();
  const { locale, t } = useI18n();

  const [amount, setAmount] = useState(0);
  const [openTerms, setOpenTerms] = useState(false);
  const [form, setForm] = useState<any>({});
  const [errors, setErrors] = useState<Record<string, boolean>>({});
  const [openQPay, setOpenQPay] = useState(false);
  const [newOrderId, setNewOrderId] = useState<string | null>(null);

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("qpay");

  // Load user info
  useEffect(() => {
    if (!userId || !token) return;

    const fetchUser = async () => {
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/user/${userId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (res.data.success && res.data.user) {
          setForm({
            ...res.data.user,
            city: res.data.user.city || t("ulaanbaatar"),
          });
        }
      } catch {
        toast.error(t("err_user_info"));
      }
    };

    fetchUser();
  }, [userId, token]);

  // Validate form and open terms
  const handleSubmit = (newErrors: Record<string, boolean>) => {
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      toast.error(t("err_fill_required"));
      return;
    }

    if (!paymentMethod) {
      toast.error(t("choose_payment_method"));
      return;
    }

    const total = cart.reduce(
      (sum, i) => sum + (i.food?.price || i.price) * i.quantity,
      0
    );

    setAmount(total + 100);
    setOpenTerms(true);
  };

  // Create order + start selected payment flow
  const handlePaymentStart = async () => {
    try {
      setOpenTerms(false);

      if (!cart.length) {
        toast.error(t("cart_empty"));
        return;
      }

      if (!paymentMethod) {
        toast.error(t("choose_payment_method"));
        return;
      }

      const total = cart.reduce(
        (sum, i) => sum + (i.food?.price || i.price) * i.quantity,
        0
      );

      const deliveryFee = 100;
      const totalPrice = total + deliveryFee;

      const mappedItems = cart.map((item) => ({
        foodId: item.food?.id || item.foodId || item.id,
        quantity: item.quantity,
        selectedSize: item.selectedSize || null,
      }));

      if (mappedItems.some((i) => !i.foodId)) {
        toast.error(t("err_invalid_cart_items"));
        return;
      }

      // 1) Create order in your backend (existing route)
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/order`,
        {
          userId,
          totalPrice,
          deliveryFee,
          productTotal: total,
          location: form.address,
          phone: form.phonenumber,
          paymentMethod, // save chosen method
          items: mappedItems,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const createdOrder = res.data.order || res.data;
      if (!createdOrder?.id) {
        toast.error(t("err_create_order"));
        return;
      }

      localStorage.setItem("lastOrderId", createdOrder.id);
      await refreshCart();
      setNewOrderId(createdOrder.id);

      // 2) Route per payment method
      if (paymentMethod === "card") {
        // Call your backend Stripe route to create a Checkout Session
        const stripeRes = await axios.post(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/stripe/create-session`,
          {
            orderId: createdOrder.id,
            totalPrice,
          }
        );

        if (stripeRes.data?.url) {
          // redirect user to Stripe Checkout
          window.location.href = stripeRes.data.url;
          return;
        } else {
          toast.error(t("err_create_order"));
          return;
        }
      } else if (paymentMethod === "qpay") {
        // Keep your existing QPay pending flow
        router.push(
          `/${locale}/checkout/payment-pending?orderId=${createdOrder.id}`
        );
        return;
      } else if (paymentMethod === "cod") {
        // COD: order created and will be handled later
        toast.success(t("order_success"));
        router.push(`/${locale}/orders/${createdOrder.id}`);
        return;
      }
    } catch (err: any) {
      console.error("Order error:", err.response?.data || err.message);
      toast.error(t("err_create_order"));
    }
  };

  return (
    <>
      <main className="min-h-screen bg-[#0a0a0a] text-white pt-[130px] pb-24">
        <div className="max-w-7xl mx-auto px-6 md:px-10 flex flex-col lg:flex-row gap-10">
          {/* LEFT: Payment summary */}
          <motion.section
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
          >
            <PaymentSummary
              cart={cart}
              router={router}
              onSubmit={() => {
                const newErrors: Record<string, boolean> = {};

                if (!form.lastName) newErrors.lastName = true;
                if (!form.phonenumber) newErrors.phonenumber = true;
                if (!form.city) newErrors.city = true;
                if (!form.district) newErrors.district = true;
                if (!form.khoroo) newErrors.khoroo = true;
                if (!form.address) newErrors.address = true;

                handleSubmit(newErrors);
              }}
              paymentMethod={paymentMethod}
              setPaymentMethod={setPaymentMethod}
            />
          </motion.section>

          {/* RIGHT: Delivery form */}
          <motion.section
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
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
        amount={amount}
        orderId={newOrderId || ""}
      />
    </>
  );
}
