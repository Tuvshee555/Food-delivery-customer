"use client";

import { GoogleLogin } from "@react-oauth/google";
import { handleFacebookLogin } from "./handlers/handleFacebookLogin";
import { handleGuestLogin } from "./handlers/handleGuestLogin";
import { handleGoogleLogin } from "./handlers/handleGoogleLogin";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import AuthDrawer from "@/components/AuthDrawer";
import { useLocale, useI18n } from "@/components/i18n/ClientI18nProvider";

export const EmailLoggedOut = () => {
  const router = useRouter();
  const { t } = useI18n();
  const locale = useLocale();

  const [open, setOpen] = useState(false);

  const redirect = "/home-page";

  return (
    <div className="px-6 py-10 flex flex-col gap-6">
      {/* EMAIL LOGIN */}
      <button
        onClick={() => setOpen(true)}
        className="w-full py-3 border border-border rounded-xl
                   text-foreground hover:bg-muted transition"
      >
        {t("login_with_email")}
      </button>

      <AuthDrawer open={open} onClose={() => setOpen(false)} />

      {/* DIVIDER */}
      <div className="flex items-center my-2">
        <div className="flex-1 border-t border-border" />
        <span className="px-4 text-muted-foreground text-sm">{t("or")}</span>
        <div className="flex-1 border-t border-border" />
      </div>

      {/* GOOGLE */}
      <div className="flex justify-center">
        <GoogleLogin
          onSuccess={(cred) =>
            handleGoogleLogin(cred, redirect, router, locale)
          }
          onError={() => toast.error(t("google_login_error"))}
        />
      </div>

      {/* FACEBOOK */}
      <button
        onClick={() => handleFacebookLogin(redirect, router, locale)}
        className="
          w-full bg-[#1877F2] text-white py-3 rounded-xl font-semibold
          hover:bg-[#145dbf] transition
        "
      >
        {t("login_with_facebook")}
      </button>

      {/* GUEST */}
      <button
        onClick={() => handleGuestLogin(redirect, router, locale)}
        className="
          w-full border border-border py-3 rounded-xl font-semibold
          text-foreground hover:bg-muted transition
        "
      >
        {t("login_as_guest")}
      </button>
    </div>
  );
};
