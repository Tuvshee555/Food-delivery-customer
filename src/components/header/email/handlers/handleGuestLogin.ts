/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { toast } from "sonner";

export const handleGuestLogin = async (
  redirect: string,
  router: any,
  locale: string
) => {
  let guestId = localStorage.getItem("userId");

  if (!guestId || !guestId.startsWith("guest-")) {
    guestId = "guest-" + crypto.randomUUID();
    localStorage.setItem("userId", guestId);
  }

  const guestToken = "guest-token-" + crypto.randomUUID();
  localStorage.setItem("token", guestToken);
  localStorage.setItem("email", "Guest User");
  localStorage.setItem("guest", "true");

  try {
    await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/user/guest`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ guestId }),
    });
  } catch {
    toast.error("Failed to create guest account");
    return;
  }

  window.dispatchEvent(new Event("auth-changed"));
  toast.success("Logged in as guest!");

  router.push(`/${locale}${redirect}`);
};
