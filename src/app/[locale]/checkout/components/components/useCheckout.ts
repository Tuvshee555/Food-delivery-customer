/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useI18n } from "@/components/i18n/ClientI18nProvider";
import { useAuth } from "@/app/[locale]/provider/AuthProvider";

/** CANONICAL (match backend) */
export type PaymentMethod = "QPAY" | "BANK" | "COD" | null;

export type CartItem = {
  foodId?: string;
  quantity: number;
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
  const [orderId, setOrderId] = useState<string | null>(null);

  /* use backend enum everywhere */
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(null);

  const productTotal = useMemo(
    () => cart.reduce((s, i) => s + (i.food?.price ?? 0) * i.quantity, 0),
    [cart]
  );

  // const deliveryFee = 100;
  const deliveryFee = 0;
  const totalPrice = productTotal + deliveryFee;

  const initialLoadRef = useRef(true);
  const saveTimerRef = useRef<number | null>(null);

  useEffect(() => {
    if (!userId || !token) return;

    initialLoadRef.current = true;

    axios
      .get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/user/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        if (res.data?.user) {
          setForm({
            firstName: res.data.user.firstName ?? "",
            lastName: res.data.user.lastName ?? "",
            phonenumber: res.data.user.phonenumber ?? "",
            city: res.data.user.city ?? t("ulaanbaatar"),
            district: res.data.user.district ?? "",
            khoroo: res.data.user.khoroo ?? "",
            address: res.data.user.address ?? "",
            notes: res.data.user.notes ?? "",
          });
        }
      })
      .catch(() => toast.error(t("err_user_info")))
      .finally(() => {
        initialLoadRef.current = false;
      });
  }, [userId, token, t]);

  useEffect(() => {
    if (!userId || !token || initialLoadRef.current) return;

    const hasAny = Object.values(form).some(
      (v) => typeof v === "string" && v.trim()
    );
    if (!hasAny) return;

    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);

    saveTimerRef.current = window.setTimeout(async () => {
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
            notes: form.notes ?? "",
          },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } catch {
        toast.error(t("profile_save_error"));
      } finally {
        saveTimerRef.current = null;
      }
    }, 800);

    return () => {
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    };
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

      // --- VALIDATION: paymentMethod must be one of API values ---
      if (!paymentMethod) {
        toast.error(t("choose_payment_method"));
        return;
      }

      // Helpful local debug
      console.log("START PAYMENT", {
        paymentMethod,
        normalizedItems,
        totalPrice,
      });

      // POST order to backend — send paymentMethod exactly as backend expects
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/order`,
        {
          items: normalizedItems,
          totalPrice,
          paymentMethod: paymentMethod, // exact value: "QPAY" | "BANK" | "COD"
          firstName: form.firstName ?? null,
          lastName: form.lastName ?? null,
          phone: form.phonenumber ?? null,
          city: form.city ?? null,
          district: form.district ?? null,
          khoroo: form.khoroo ?? null,
          address: form.address ?? null,
          notes: form.notes ?? "",
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log("PAYLOAD SENT", {
        items: normalizedItems,
        totalPrice,
        paymentMethod,
      });

      const order = res.data ?? {};
      // backend shape: use whichever field you return — prefer `id` + `orderNumber`
      const returnedOrderId = order.id ?? order.orderId ?? null;
      const returnedOrderNumber =
        order.orderNumber ?? order.order_number ?? null;

      if (!returnedOrderId) {
        console.error("Order creation returned unexpected payload:", order);
        toast.error(t("err_create_order"));
        return;
      }

      // clear cart client side
      localStorage.removeItem(CART_KEY);
      window.dispatchEvent(new Event("cart-updated"));

      setOrderId(returnedOrderId);
      try {
        localStorage.setItem("lastOrderId", returnedOrderId);
      } catch {}

      // ROUTING — use exact paymentMethod
      if (paymentMethod === "QPAY") {
        router.push(
          `/${locale}/checkout/payment-pending?orderId=${returnedOrderId}`
        );
        return;
      }

      if (paymentMethod === "BANK") {
        router.push(
          `/${locale}/checkout/bank-transfer?orderId=${returnedOrderId}`
        );
        return;
      }

      // COD
      toast.success(t("order_success"));
      router.push(`/${locale}/orders/${returnedOrderId}`);
    } catch (err: any) {
      console.error("handlePaymentStart error:", err?.response?.data ?? err);
      if (err?.response?.status === 401) {
        router.push(`/${locale}/log-in`);
        return;
      }
      toast.error(t("err_create_order"));
    }
  };

  return {
    form,
    setForm,
    errors,
    openTerms,
    setOpenTerms,
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
