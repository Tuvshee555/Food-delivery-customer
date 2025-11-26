"use client";

import { GoogleLogin } from "@react-oauth/google";
import { handleGoogleLogin } from "./handlers/handleGoogleLogin";
import { handleFacebookLogin } from "./handlers/handleFacebookLogin";
import { handleGuestLogin } from "./handlers/handleGuestLogin";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import AuthDrawer from "@/components/AuthDrawer";

export const EmailLoggedOut = () => {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const redirect = "/home-page";

  return (
    <div className="px-6 py-10 flex flex-col gap-6">
      <button
        onClick={() => setOpen(true)}
        className="w-full py-3 border border-gray-700 rounded-xl"
      >
        Имэйлээр нэвтрэх
      </button>

      <AuthDrawer open={open} onClose={() => setOpen(false)} />

      <div className="flex items-center my-2">
        <div className="flex-1 border-t border-gray-700"></div>
        <span className="px-4 text-gray-500 text-sm">эсвэл</span>
        <div className="flex-1 border-t border-gray-700"></div>
      </div>

      <div className="flex justify-center">
        <GoogleLogin
          onSuccess={(cred) => handleGoogleLogin(cred, redirect, router)}
          onError={() => toast.error("Google login error")}
        />
      </div>

      <button
        onClick={() => handleFacebookLogin(redirect, router)}
        className="w-full bg-[#1877F2] text-white py-3 rounded-xl font-semibold hover:bg-[#145dbf]"
      >
        Facebook-р нэвтрэх
      </button>

      <button
        onClick={() => handleGuestLogin(redirect, router)}
        className="w-full border border-gray-700 py-3 rounded-xl font-semibold"
      >
        Зочноор нэвтрэх
      </button>
    </div>
  );
};
