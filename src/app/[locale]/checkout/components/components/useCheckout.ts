/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useI18n } from "@/components/i18n/ClientI18nProvider";
import { useAuth } from "@/app/[locale]/provider/AuthProvider";

export type PaymentMethod = "qpay" | "card" | "cod" | null;

export type CartItem = {
  foodId?: string;
  quantity: number;
  selectedSize?: string | null;
  food?: {
    id?: string;
    price?: number;
  };
};

export type DeliveryFormData = {
  firstName?: string;
  lastName?: string;
  phonenumber?: string;
  city?: string;
  district?: string;
  khoroo?: string;
  address?: string;
  notes?: string;
};

const CART_KEY = "cart";

export function useCheckout(cart: CartItem[]) {
  const router = useRouter();
  const { userId, token } = useAuth();
  const { locale, t } = useI18n();

  const [form, setForm] = useState<DeliveryFormData>({});
  const [errors, setErrors] = useState<Record<string, boolean>>({});
  const [openTerms, setOpenTerms] = useState(false);
  const [openQPay, setOpenQPay] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("qpay");

  const productTotal = useMemo(
    () => cart.reduce((s, i) => s + (i.food?.price ?? 0) * i.quantity, 0),
    [cart]
  );

  const deliveryFee = 100;
  const totalPrice = productTotal + deliveryFee;

  // load user defaults into form (once signed in)
  useEffect(() => {
    if (!userId || !token) return;

    axios
      .get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/user/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        if (res.data?.user) {
          // prefer existing user fields; default city to Ulaanbaatar
          setForm({
            firstName: res.data.user.firstName ?? "",
            lastName: res.data.user.lastName ?? "",
            phonenumber: res.data.user.phonenumber ?? "",
            city: res.data.user.city || t("ulaanbaatar"),
            district: res.data.user.district ?? "",
            khoroo: res.data.user.khoroo ?? "",
            address: res.data.user.address ?? "",
          });
        }
      })
      .catch(() => toast.error(t("err_user_info")));
  }, [userId, token, t]);

  // AUTO-SAVE: when delivery form changes and user is signed in -> debounce save to profile
  // AUTO-SAVE delivery info to user profile (debounced)
  useEffect(() => {
    if (!userId || !token) return;

    const hasAny = Object.values(form).some((v) => v && v.trim?.());
    if (!hasAny) return;

    const handler = setTimeout(async () => {
      try {
        await axios.put(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/user/${userId}`,
          {
            firstName: form.firstName ?? "",
            lastName: form.lastName ?? "",
            phonenumber: form.phonenumber ?? "",
            city: form.city ?? "",
            district: form.district ?? "",
            khoroo: form.khoroo ?? "",
            address: form.address ?? "",
          },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } catch {
        // do NOT block checkout
        toast.error(t("profile_save_error"));
      }
    }, 1000);

    return () => clearTimeout(handler);
  }, [form, userId, token, t]);

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

  const handlePaymentStart = async () => {
    try {
      setOpenTerms(false);

      if (!cart.length) return toast.error(t("cart_empty"));

      if (!token) {
        toast.error(t("unauthorized"));
        router.push(`/${locale}/log-in`);
        return;
      }

      const normalizedItems = cart
        .map((i) => ({
          foodId: i.food?.id ?? i.foodId ?? null,
          quantity: Number(i.quantity) || 0,
        }))
        .filter((i) => i.foodId && i.quantity > 0);

      if (!normalizedItems.length) {
        toast.error(t("err_invalid_cart_items"));
        return;
      }
      const fullLocation = [
        form.city && `${t("city")}: ${form.city}`,
        form.district && `${t("district")}: ${form.district}`,
        form.khoroo && `${t("khoroo")}: ${form.khoroo}`,
        form.address && `${t("address")}: ${form.address}`,
        form.firstName && `${t("first_name")}: ${form.firstName}`,
        form.lastName && `${t("last_name")}: ${form.lastName}`,
        form.phonenumber && `${t("phone_number")}: ${form.phonenumber}`,
      ]
        .filter(Boolean)
        .join(" • ");

      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/order`,
        {
          items: normalizedItems,
          productTotal,
          deliveryFee,
          totalPrice,
          location: fullLocation, // ✅ FULL TEXT
          notes: form.notes ?? "", // ✅ ADD THIS
          phone: form.phonenumber,
          paymentMethod,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const order = res.data?.order ?? res.data;
      if (!order?.id) return toast.error(t("err_create_order"));

      localStorage.removeItem(CART_KEY);
      window.dispatchEvent(new Event("cart-updated"));

      setOrderId(order.id);
      localStorage.setItem("lastOrderId", order.id);

      if (paymentMethod === "card") {
        const stripe = await axios.post(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/stripe/create-session`,
          { orderId: order.id, totalPrice },
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (stripe.data?.url) {
          window.location.href = stripe.data.url;
          return;
        }
      }

      if (paymentMethod === "qpay") {
        router.push(`/${locale}/checkout/payment-pending?orderId=${order.id}`);
        return;
      }

      if (paymentMethod === "cod") {
        toast.success(t("order_success"));
        router.push(`/${locale}/orders/${order.id}`);
      }
    } catch (err: any) {
      if (err?.response?.status === 401) {
        toast.error(t("unauthorized"));
        router.push(`/${locale}/log-in`);
        return;
      }

      localStorage.removeItem(CART_KEY);
      window.dispatchEvent(new Event("cart-updated"));
      toast.error(t("err_create_order"));
    }
  };

  return {
    form,
    setForm,
    errors,
    openTerms,
    setOpenTerms,
    openQPay,
    setOpenQPay,
    orderId,
    paymentMethod,
    setPaymentMethod,
    productTotal,
    deliveryFee,
    totalPrice,
    handleSubmit,
    handlePaymentStart,
    t,
    router,
  };
}
