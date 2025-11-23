"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { GoogleLogin, CredentialResponse } from "@react-oauth/google";
import { toast } from "sonner";
import { saveAuth } from "@/utils/auth";
import { useAuth } from "../provider/AuthProvider";
import AuthDrawer from "@/components/AuthDrawer";

declare global {
  interface Window {
    FB: any;
    fbAsyncInit: () => void;
  }
}

export default function SignInPage() {
  const router = useRouter();
  const params = useSearchParams();
  const redirectUrl = params.get("redirect") || "/home-page";

  const [openEmail, setOpenEmail] = useState(false);
  const { setAuthToken } = useAuth();

  /** GOOGLE LOGIN */
  const handleGoogleLogin = async (credentialResponse: CredentialResponse) => {
    if (!credentialResponse.credential)
      return toast.error("Google credential missing");

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/user/auth/google`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            token: credentialResponse.credential,
            role: "USER",
          }),
        }
      );

      const data = await res.json();
      if (!res.ok) return toast.error(data.message || "Google login failed");

      localStorage.setItem("token", data.token);
      localStorage.setItem("email", data.user.email);
      localStorage.setItem("userId", data.user.id);

      saveAuth(data);

      // 🔥 CRITICAL FIX
      window.dispatchEvent(new Event("auth-changed"));

      toast.success("Google-р нэвтэрлээ!");
      setTimeout(() => router.push(redirectUrl), 150);
    } catch {
      toast.error("Google login error");
    }
  };

  /** FACEBOOK LOGIN */
  const handleFacebookLogin = () => {
    if (!window.FB) return toast.error("Facebook SDK not loaded!");

    window.FB.login(
      (response: any) => {
        if (!response.authResponse)
          return toast.error("Facebook login cancelled");

        const token = response.authResponse.accessToken;

        fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/user/auth/facebook`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token }),
        })
          .then((res) => res.json())
          .then((data) => {
            if (!data.token) return toast.error("Facebook login failed");

            localStorage.setItem("token", data.token);
            localStorage.setItem("email", data.user.email);
            localStorage.setItem("userId", data.user.id);

            // 🔥 FIX - must fire this or AuthProvider won't update
            window.dispatchEvent(new Event("auth-changed"));

            toast.success("Facebook-р нэвтэрлээ!");
            setTimeout(() => router.push(redirectUrl), 150);
          })
          .catch(() => toast.error("Facebook login failed"));
      },
      { scope: "email,public_profile" }
    );
  };

  /** GUEST LOGIN */
  const handleGuest = () => {
    let guestId = localStorage.getItem("userId");
    if (!guestId || !guestId.startsWith("guest-")) {
      guestId = "guest-" + crypto.randomUUID();
      localStorage.setItem("userId", guestId);
    }

    let guestToken = localStorage.getItem("token");
    if (!guestToken || !guestToken.startsWith("guest-token-")) {
      guestToken = "guest-token-" + crypto.randomUUID();
      localStorage.setItem("token", guestToken);
    }

    localStorage.setItem("email", "Зочин хэрэглэгч");
    localStorage.setItem("guest", "true");

    // notify auth system (AuthProvider listens for this)
    window.dispatchEvent(new Event("auth-changed"));

    // also notify cart listeners (same-tab listeners)
    window.dispatchEvent(new Event("cart-changed"));

    toast.success("Зочноор нэвтэрлээ!");
    setTimeout(() => router.push(redirectUrl), 150);
  };

  return (
    <div className="min-h-screen w-full bg-[#0a0a0a] text-white px-6 pt-28 pb-12 flex flex-col items-center">
      <div className="w-full max-w-md text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">Нэвтрэх</h1>
        <p className="text-gray-400">Үргэлжлүүлэхийн тулд нэвтэрнэ үү</p>
      </div>

      <div className="w-full max-w-md flex flex-col gap-5">
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={() => setOpenEmail(true)}
          className="w-full py-4 rounded-xl bg-[#1a1a1a] border border-gray-700 hover:border-[#facc15] transition font-semibold"
        >
          Имэйлээр нэвтрэх
        </motion.button>

        <AuthDrawer open={openEmail} onClose={() => setOpenEmail(false)} />

        <div className="flex items-center my-2">
          <div className="flex-1 border-t border-gray-700" />
          <span className="px-3 text-gray-500 text-sm">эсвэл</span>
          <div className="flex-1 border-t border-gray-700" />
        </div>

        <div className="flex justify-center">
          <GoogleLogin onSuccess={handleGoogleLogin} />
        </div>

        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={handleFacebookLogin}
          className="w-full py-4 rounded-xl bg-[#1877F2] text-white font-bold hover:bg-[#1463c2] transition"
        >
          Facebook-р нэвтрэх
        </motion.button>

        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={handleGuest}
          className="w-full py-4 rounded-xl border border-gray-700 hover:border-[#facc15] transition font-semibold"
        >
          Зочноор нэвтрэх
        </motion.button>
      </div>

      <p className="text-center text-gray-600 text-xs mt-8">
        Нэвтэрснээр та манай Үйлчилгээний нөхцөл болон Нууцлалын бодлогыг
        зөвшөөрнө.
      </p>
    </div>
  );
}
