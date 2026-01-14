/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useI18n } from "@/components/i18n/ClientI18nProvider";
import { useAuth } from "@/app/[locale]/provider/AuthProvider";

/** CANONICAL (match backend) */
export type PaymentMethod = "QPAY" | "BANK" | "COD" | "LEMON" | null;

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

  // NEW: submission lock
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  // create idempotency key (UUID fallback)
  const createIdempotencyKey = () => {
    try {
      // modern browsers
      // @ts-ignore
      if (globalThis?.crypto?.randomUUID) return globalThis.crypto.randomUUID();
      // fallback
      return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
    } catch {
      return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
    }
  };

  const handlePaymentStart = async () => {
    if (isSubmitting) return;

    setIsSubmitting(true);

    try {
      // ✅ don’t close terms dialog yet (prevents clicking order again)
      if (!cart.length) {
        toast.error(t("cart_empty"));
        setIsSubmitting(false);
        return;
      }

      if (!token) {
        router.push(`/${locale}/log-in`);
        setIsSubmitting(false);
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
        setIsSubmitting(false);
        return;
      }

      if (!paymentMethod) {
        toast.error(t("choose_payment_method"));
        setIsSubmitting(false);
        return;
      }

      const idempotencyKey = createIdempotencyKey();

      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/order`,
        {
          items: normalizedItems,
          totalPrice,
          paymentMethod,
          firstName: form.firstName ?? null,
          lastName: form.lastName ?? null,
          phone: form.phonenumber ?? null,
          city: form.city ?? null,
          district: form.district ?? null,
          khoroo: form.khoroo ?? null,
          address: form.address ?? null,
          notes: form.notes ?? "",
          idempotencyKey,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
          timeout: 60_000,
        }
      );

      const order = res.data ?? {};
      // backend sometimes returns order.id or order.orderId - handle both
      const returnedOrderId =
        order.id ?? order.orderId ?? order.orderId ?? null;

      if (!returnedOrderId) {
        toast.error(t("err_create_order"));
        setIsSubmitting(false);
        return;
      }

      // If Lemon flow, create checkout and redirect to Lemon
      if (paymentMethod === "LEMON") {
        // make redirect back to your frontend success page
        const redirectUrl = `${window.location.origin}/${locale}/profile/orders/${returnedOrderId}`;

        // prefer per-app env variant id
        const variantFromEnv =
          Number(process.env.NEXT_PUBLIC_LEMON_VARIANT_ID || 0) || undefined;

        if (!variantFromEnv) {
          toast.error(
            t("payment.lemon_variant_missing") ||
              "LEMON variant id missing. Contact admin."
          );
          // fallback: still clear cart and go to orders page
          setOpenTerms(false);
          localStorage.removeItem(CART_KEY);
          try {
            localStorage.setItem("lastOrderId", returnedOrderId);
          } catch {}
          setOrderId(returnedOrderId);
          router.push(`/${locale}/profile/orders/${returnedOrderId}`);
          setIsSubmitting(false);
          return;
        }

        try {
          const lemonRes = await axios.post(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/payment/lemon/checkout`,
            {
              orderId: returnedOrderId,
              variantId: variantFromEnv,
              redirectUrl,
            },
            { headers: { Authorization: `Bearer ${token}` }, timeout: 15000 }
          );

          const lemonData = lemonRes.data ?? {};
          const checkoutUrl =
            lemonData.checkoutUrl ?? lemonData.checkout_url ?? null;

          if (!checkoutUrl) {
            throw new Error("no checkout url");
          }

          // close terms, clear cart, store last order id
          setOpenTerms(false);
          localStorage.removeItem(CART_KEY);
          try {
            localStorage.setItem("lastOrderId", returnedOrderId);
          } catch {}
          window.dispatchEvent(new Event("cart-updated"));
          setOrderId(returnedOrderId);

          // redirect to Lemon checkout (hard redirect)
          window.location.href = checkoutUrl;
          return;
        } catch (err: any) {
          console.error("LEMON checkout error:", err?.response?.data || err);
          toast.error(
            t("err_create_lemon_checkout") || "Failed to start payment"
          );
          // fallback: route to order detail so user can retry
          setOpenTerms(false);
          localStorage.removeItem(CART_KEY);
          try {
            localStorage.setItem("lastOrderId", returnedOrderId);
          } catch {}
          setOrderId(returnedOrderId);
          router.push(`/${locale}/profile/orders/${returnedOrderId}`);
          setIsSubmitting(false);
          return;
        }
      }

      // non-LEMON flows:
      // close terms
      setOpenTerms(false);

      // clear cart
      localStorage.removeItem(CART_KEY);
      window.dispatchEvent(new Event("cart-updated"));

      setOrderId(returnedOrderId);
      try {
        localStorage.setItem("lastOrderId", returnedOrderId);
      } catch {}

      if (paymentMethod === "QPAY") {
        router.push(
          `/${locale}/checkout/payment-pending?orderId=${returnedOrderId}`
        );
        setIsSubmitting(false);
        return;
      }

      if (paymentMethod === "BANK") {
        router.push(
          `/${locale}/checkout/bank-transfer?orderId=${returnedOrderId}`
        );
        setIsSubmitting(false);
        return;
      }

      toast.success(t("order_success"));
      router.push(`/${locale}/profile/orders/${returnedOrderId}`);
    } catch (err: any) {
      if (err?.response?.status === 401) {
        router.push(`/${locale}/log-in`);
        setIsSubmitting(false);
        return;
      }
      console.error("handlePaymentStart error:", err?.response?.data || err);
      toast.error(t("err_create_order"));
    } finally {
      // ✅ only reset after request finishes if we didn't redirect away
      setIsSubmitting(false);
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
    isSubmitting, // expose loading flag for UI
    t,
    router,
  };
}
