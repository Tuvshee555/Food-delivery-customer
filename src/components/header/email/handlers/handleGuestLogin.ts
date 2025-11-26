"use client";

import { toast } from "sonner";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const handleGuestLogin = async (redirect: string, router: any) => {
  let guestId = localStorage.getItem("userId");

  if (!guestId || !guestId.startsWith("guest-")) {
    guestId = "guest-" + crypto.randomUUID();
    localStorage.setItem("userId", guestId);
  }

  const guestToken = "guest-token-" + crypto.randomUUID();
  localStorage.setItem("token", guestToken);
  localStorage.setItem("email", "Зочин хэрэглэгч");
  localStorage.setItem("guest", "true");

  try {
    await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/user/guest`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ guestId }),
    });
  } catch {
    toast.error("Guest үүсгэхэд алдаа гарлаа");
    return;
  }

  window.dispatchEvent(new Event("auth-changed"));
  toast.success("Зочноор нэвтэрлээ!");

  router.push(redirect);
};
