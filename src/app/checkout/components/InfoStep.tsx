"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { toast } from "sonner";
import { useAuth } from "@/app/provider/AuthProvider";
import { Header } from "@/components/header/Header";
import { QPayDialog } from "@/app/qpay/QPayDialog";
import PaymentSummary from "./PaymentSummary";
import DeliveryForm from "./DeliveryForm";
import TermsDialog from "./TermsDialog";

export default function InfoStep({ router }: { router: any }) {
  const { userId, token } = useAuth();
  const [cart, setCart] = useState<any[]>([]);
  const [amount, setAmount] = useState(0);
  const [openQPay, setOpenQPay] = useState(false);
  const [openTerms, setOpenTerms] = useState(false);
  const [form, setForm] = useState<any>({});
  const [errors, setErrors] = useState<Record<string, boolean>>({});

  // 🧠 Load cart + user info
  useEffect(() => {
    const stored = localStorage.getItem("cart");
    if (stored) {
      try {
        setCart(JSON.parse(stored));
      } catch {
        console.error("Invalid cart JSON");
      }
    }

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
            city: res.data.user.city || "Улаанбаатар",
          });
        }
      } catch {
        toast.error("❌ Хэрэглэгчийн мэдээлэл ачаалахад алдаа гарлаа.");
      }
    };
    fetchUser();
  }, [userId, token]);

  // 🧾 Validate form before continuing
  const handleSubmit = (newErrors: Record<string, boolean>) => {
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      toast.error("⚠️ Бүх шаардлагатай талбаруудыг бөглөнө үү.");
      return;
    }
    localStorage.setItem("checkout_info", JSON.stringify(form));
    setAmount(
      cart.reduce((s, i) => s + (i.food?.price || i.price) * i.quantity, 0) +
        100
    );
    setOpenTerms(true);
  };

  // 💳 Create order and move to payment
  const handlePaymentStart = async () => {
    try {
      setOpenTerms(false);

      // 🛒 Get latest cart + info
      const cart = JSON.parse(localStorage.getItem("cart") || "[]");
      const info = JSON.parse(localStorage.getItem("checkout_info") || "{}");

      if (!cart.length) {
        toast.error("🛒 Сагс хоосон байна.");
        return;
      }

      // 🧮 Totals
      const total = cart.reduce(
        (sum: number, i: any) => sum + (i.food?.price || i.price) * i.quantity,
        0
      );
      const deliveryFee = 100;
      const totalPrice = total + deliveryFee;

      // 🧩 Safe mapping (handles all cases)
      const mappedItems = cart.map((item: any) => ({
        foodId:
          item.food?.id ||
          item.food?._id ||
          item.foodId ||
          item._id ||
          item.id ||
          null,
        quantity: item.quantity || 1,
        selectedSize: item.selectedSize || null,
      }));

      // 🔍 Log data to confirm before sending
      console.log("🧾 Sending order data:", {
        userId,
        totalPrice,
        location: info.address,
        phone: info.phonenumber,
        items: mappedItems,
      });

      // 🚨 Check missing foodId before sending
      if (mappedItems.some((i: { foodId: any }) => !i.foodId)) {
        console.error("❌ Some items missing foodId", mappedItems);
        toast.error("❌ Invalid cart items. Please try again.");
        return;
      }

      // ✅ Send order to backend
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/order`,
        {
          userId,
          totalPrice,
          deliveryFee,
          productTotal: total,
          location: info.address,
          phone: info.phonenumber,
          items: mappedItems,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const createdOrder = res.data.order || res.data; // backend may return full object
      if (!createdOrder?.id) {
        toast.error("❌ Захиалга үүсгэхэд алдаа гарлаа.");
        return;
      }

      // 🧭 Redirect to payment page
      router.push(`/checkout/payment-pending?orderId=${createdOrder.id}`);
    } catch (error: any) {
      console.error("Order error:", error.response?.data || error.message);
      toast.error("❌ Захиалга үүсгэхэд алдаа гарлаа.");
    }
  };

  const handlePaymentSuccess = () => {
    toast.success("✅ Төлбөр амжилттай хийгдлээ!");
    setOpenQPay(false);
    router.push("/checkout?step=payment");
  };

  return (
    <>
      <Header compact />
      <main className="min-h-screen bg-[#0a0a0a] text-white pt-[130px] pb-24">
        <div className="max-w-7xl mx-auto px-6 md:px-10 flex flex-col lg:flex-row gap-10">
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
            />
          </motion.section>

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
        orderId={`ORDER-${Date.now()}`}
        onSuccess={handlePaymentSuccess}
      />
    </>
  );
}
