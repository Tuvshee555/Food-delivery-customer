"use client";

import { useAuthLoader } from "./hooks/useAuthLoader";
import { useAuth } from "@/app/provider/AuthProvider";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetFooter,
} from "@/components/ui/sheet";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { motion } from "framer-motion";
import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { ProfileHeader } from "./ProfileHeader";
import { LoginOptions } from "./LoginOptions";
import { MenuButtons } from "./MenuButtons";
import { CredentialResponse } from "@react-oauth/google";
import { saveAuth } from "@/utils/auth";

export const ProfileMenu = () => {
  const { userEmail } = useAuthLoader();
  const { token, setAuthToken } = useAuth();
  const router = useRouter();

  const firstLetter = userEmail ? userEmail.charAt(0).toUpperCase() : "?";

  const handleLogout = () => {
    setAuthToken(null);
    localStorage.clear();
    window.dispatchEvent(new Event("auth-changed"));
    toast.success("Амжилттай истемээс гарлаа");
    router.push("/home-page");
  };

  // Google login
  const handleGoogleLogin = async (credentialResponse: CredentialResponse) => {
    if (!credentialResponse.credential)
      return toast.error("Google credential not found!");

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

      if (!res.ok) {
        toast.error(data.message || "Google login failed");
        return;
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("email", data.user.email);
      localStorage.setItem("userId", data.user.id);

      window.dispatchEvent(new Event("auth-changed"));
      saveAuth(data);
      window.location.reload();

      toast.success("Google-р амжилттай нэвтэрлээ");
    } catch {
      toast.error("Google login error");
    }
  };

  // Facebook login
  const handleFacebookLogin = () => {
    if (!window.FB) return toast.error("Facebook SDK not loaded yet!");

    // FB.login callback must NOT be async
    window.FB.login(
      (response: fb.StatusResponse) => {
        if (response.authResponse) {
          const token = response.authResponse.accessToken;

          fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/user/auth/facebook`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ token }),
          })
            .then((res) => res.json())
            .then((data) => {
              if (data.token && data.user) {
                localStorage.setItem("token", data.token);
                localStorage.setItem("email", data.user.email);
                localStorage.setItem("userId", data.user.id);
                setAuthToken(data.token);
                toast.success("Successfully logged in with Facebook!");
                router.push("/home-page");
              } else {
                toast.error("Facebook login failed");
              }
            })
            .catch(() => toast.error("Facebook login failed"));
        } else {
          toast.error("Facebook login cancelled or failed!");
        }
      },
      { scope: "email,public_profile" }
    );
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="relative flex items-center justify-center w-[42px] h-[42px] rounded-full border border-gray-700 bg-[#1a1a1a]"
        >
          <span className="text-lg font-semibold text-[#facc15]">
            {firstLetter}
          </span>
        </motion.button>
      </SheetTrigger>

      <SheetContent className="bg-[#0a0a0a] border-l border-gray-800">
        <VisuallyHidden>User Menu</VisuallyHidden>

        {!token && (
          <LoginOptions
            handleGoogleLogin={handleGoogleLogin}
            handleFacebookLogin={handleFacebookLogin}
          />
        )}

        {token && (
          <>
            <ProfileHeader userEmail={userEmail} />
            <MenuButtons />
            <SheetFooter>
              <motion.button
                onClick={handleLogout}
                whileHover={{ scale: 1.02 }}
                className="w-full bg-red-600 py-3 rounded-xl font-semibold"
              >
                <LogOut className="inline-block" /> Системээс гарах
              </motion.button>
            </SheetFooter>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
};
