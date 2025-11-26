"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { GoogleLogin, CredentialResponse } from "@react-oauth/google";
import AuthDrawer from "@/components/AuthDrawer";
import { googleLogin, facebookLogin, guestLogin } from "./helpers";
import { FacebookAuthResponse } from "./type";

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    FB: any;
    fbAsyncInit: () => void;
  }
}

export const dynamic = "force-dynamic";

export default function SignInPageInner() {
  const router = useRouter();
  const params = useSearchParams();
  const redirectUrl = params.get("redirect") || "/home-page";

  const [openEmail, setOpenEmail] = useState(false);

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
          <GoogleLogin
            onSuccess={(cred: CredentialResponse) =>
              googleLogin(cred, redirectUrl, router.push)
            }
          />
        </div>

        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={() =>
            window.FB &&
            window.FB.login(
              (res: FacebookAuthResponse) =>
                facebookLogin(res, redirectUrl, router.push),
              { scope: "email,public_profile" }
            )
          }
          className="w-full py-4 rounded-xl bg-[#1877F2] text-white font-bold hover:bg-[#1463c2] transition"
        >
          Facebook-р нэвтрэх
        </motion.button>

        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={() => guestLogin(redirectUrl, router.push)}
          className="w-full py-4 rounded-xl border border-gray-700 hover:border-[#facc15] transition font-semibold"
        >
          Зочноор нэвтрэх
        </motion.button>
      </div>

      <p className="text-center text-gray-600 text-xs mt-8">
        Нэвтрэснээр та манай Үйлчилгээний нөхцөл болон Нууцлалын бодлогыг
        зөвшөөрнө.
      </p>
    </div>
  );
}
