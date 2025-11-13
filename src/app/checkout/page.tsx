"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import InfoStep from "./components/InfoStep";
import CartStep from "./components/CartStep";

export default function CheckoutPage() {
  const router = useRouter();
  const step = useSearchParams().get("step") || "cart";

  const [cart, setCart] = useState<any[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem("cart");
    if (stored) setCart(JSON.parse(stored));
  }, []);

  if (step === "info") return <InfoStep router={router} />;

  return <CartStep cart={cart} router={router} />;
}

// if (step === "payment") return <PaymentStep cart={cart} router={router} />;
// if (step === "done") return <SuccessStep />;
