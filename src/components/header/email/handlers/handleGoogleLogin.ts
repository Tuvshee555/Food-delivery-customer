"use client";

import { toast } from "sonner";
import { GooglePayload } from "../types";
import { saveAuth } from "@/utils/auth";

export const handleGoogleLogin = async (
  payload: GooglePayload,
  redirect: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  router: any
) => {
  const credential = payload.credential;
  if (!credential) return toast.error("Google credential missing");

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/user/auth/google`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: credential, role: "USER" }),
      }
    );

    const data = await res.json();
    if (!res.ok) return toast.error(data.message || "Google login failed");

    localStorage.setItem("token", data.token);
    localStorage.setItem("userId", data.user.id);
    localStorage.setItem("email", data.user.email);

    saveAuth(data);
    window.dispatchEvent(new Event("auth-changed"));

    toast.success("Google-р нэвтэрлээ!");
    router.push(redirect);
  } catch {
    toast.error("Google login error");
  }
};
