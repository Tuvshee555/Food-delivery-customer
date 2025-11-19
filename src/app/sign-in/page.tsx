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
  //   const redirectUrl = "/home-page";

  const { setAuthToken } = useAuth();
  const [openEmail, setOpenEmail] = useState(false);

  // GOOGLE LOGIN
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
      window.dispatchEvent(new Event("auth-changed"));
      toast.success("Google-р нэвтэрлээ!");
      router.push(redirectUrl);

      router.push(redirectUrl);
    } catch {
      toast.error("Google login error");
    }
  };

  // FACEBOOK LOGIN
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

            setAuthToken(data.token);
            toast.success("Facebook-р нэвтэрлээ!");

            router.push(redirectUrl);
          })
          .catch(() => toast.error("Facebook login failed"));
      },
      { scope: "email,public_profile" }
    );
  };

  // GUEST LOGIN
  const handleGuest = () => {
    localStorage.setItem("token", "guest-" + crypto.randomUUID());
    localStorage.setItem("email", "Зочин хэрэглэгч");
    localStorage.setItem("guest", "true");

    toast.success("Зочноор нэвтэрлээ");
    router.push(redirectUrl);
  };

  return (
    <div className="min-h-screen w-full bg-[#0a0a0a] text-white px-6 pt-28 pb-12 flex flex-col items-center">
      {/* TITLE */}
      <div className="w-full max-w-md text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">Нэвтрэх</h1>
        <p className="text-gray-400">Үргэлжлүүлэхийн тулд нэвтэрнэ үү</p>
      </div>

      {/* CONTENT */}
      <div className="w-full max-w-md flex flex-col gap-5">
        {/* EMAIL LOGIN */}
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={() => setOpenEmail(true)}
          className="w-full py-4 rounded-xl bg-[#1a1a1a] border border-gray-700 
                     hover:border-[#facc15] transition font-semibold"
        >
          Имэйлээр нэвтрэх
        </motion.button>

        <AuthDrawer open={openEmail} onClose={() => setOpenEmail(false)} />

        {/* DIVIDER */}
        <div className="flex items-center my-2">
          <div className="flex-1 border-t border-gray-700" />
          <span className="px-3 text-gray-500 text-sm">эсвэл</span>
          <div className="flex-1 border-t border-gray-700" />
        </div>

        {/* GOOGLE */}
        <div className="flex justify-center">
          <GoogleLogin onSuccess={handleGoogleLogin} />
        </div>

        {/* FACEBOOK */}
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={handleFacebookLogin}
          className="w-full py-4 rounded-xl bg-[#1877F2] text-white font-bold 
                     hover:bg-[#1463c2] transition"
        >
          Facebook-р нэвтрэх
        </motion.button>

        {/* GUEST */}
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={handleGuest}
          className="w-full py-4 rounded-xl border border-gray-700 
                     font-semibold hover:border-[#facc15] transition"
        >
          Зочноор нэвтрэх
        </motion.button>
      </div>

      {/* FOOTER TEXT */}
      <p className="text-center text-gray-600 text-xs mt-8">
        Нэвтэрснээр та манай Үйлчилгээний нөхцөл болон Нууцлалын бодлогыг
        зөвшөөрнө.
      </p>
    </div>
  );
}
