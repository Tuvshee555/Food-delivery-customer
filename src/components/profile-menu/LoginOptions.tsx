"use client";

import { GoogleLogin, CredentialResponse } from "@react-oauth/google";
import { toast } from "sonner";
import AuthDrawer from "../AuthDrawer";
import { useState } from "react";
import { saveAuth } from "@/utils/auth";

export const LoginOptions = ({
  handleGoogleLogin,
  handleFacebookLogin,
}: {
  handleGoogleLogin: (c: CredentialResponse) => void;
  handleFacebookLogin: () => void;
}) => {
  const [authOpen, setAuthOpen] = useState(false);

  return (
    <div className="px-6 py-10 flex flex-col gap-6">
      <button
        onClick={() => setAuthOpen(true)}
        className="w-full py-3 border border-gray-700 rounded-xl"
      >
        Имэйлээр нэвтрэх
      </button>

      <AuthDrawer open={authOpen} onClose={() => setAuthOpen(false)} />

      <div className="flex items-center my-2">
        <div className="flex-1 border-t border-gray-700"></div>
        <span className="px-4 text-gray-500 text-sm">эсвэл</span>
        <div className="flex-1 border-t border-gray-700"></div>
      </div>

      <GoogleLogin
        onSuccess={handleGoogleLogin}
        onError={() => toast.error("Google login error")}
      />

      <button
        onClick={handleFacebookLogin}
        className="w-full bg-[#1877F2] text-white py-3 rounded-xl font-semibold hover:bg-[#145dbf] transition"
      >
        Facebook-р нэвтрэх
      </button>

      <button
        onClick={() => {
          localStorage.setItem("token", "guest-" + crypto.randomUUID());
          localStorage.setItem("email", "Зочин хэрэглэгч");
          localStorage.setItem("guest", "true");
          window.dispatchEvent(new Event("auth-changed"));
        }}
        className="w-full border border-gray-700 py-3 rounded-xl font-semibold"
      >
        Зочноор нэвтрэх
      </button>
    </div>
  );
};
