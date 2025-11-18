"use client";

import { useEffect, useState } from "react";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
} from "@/components/ui/sheet";
import { User, Package, Ticket, LogOut } from "lucide-react";

import { GoogleLogin, CredentialResponse } from "@react-oauth/google";
import { toast } from "sonner";
import { saveAuth } from "@/utils/auth";
import { useAuth } from "@/app/provider/AuthProvider";
import AuthDrawer from "../AuthDrawer";

declare global {
  interface Window {
    FB: any;
    fbAsyncInit: () => void;
  }
}

export const Email = () => {
  const router = useRouter();
  const { token, setAuthToken } = useAuth();
  const [authOpen, setAuthOpen] = useState(false);

  const [userEmail, setUserEmail] = useState<string | null>(null);

  // Combined useEffect: Loads Facebook SDK + restores email listener
  useEffect(() => {
    // -------------------------
    // FACEBOOK SDK INITIALIZER
    // -------------------------
    if (typeof window !== "undefined" && !window.FB) {
      window.fbAsyncInit = function () {
        window.FB.init({
          appId: process.env.NEXT_PUBLIC_FACEBOOK_APP_ID!,
          cookie: true,
          xfbml: true,
          version: "v20.0",
        });
      };

      const script = document.createElement("script");
      script.id = "facebook-jssdk";
      script.src = "https://connect.facebook.net/en_US/sdk.js";
      script.async = true;
      document.body.appendChild(script);
    }

    // -------------------------
    // LOCAL STORAGE EMAIL RESTORE
    // -------------------------
    const updateEmail = () => {
      setUserEmail(localStorage.getItem("email"));
    };

    updateEmail();
    window.addEventListener("auth-changed", updateEmail);

    // Cleanup
    return () => {
      window.removeEventListener("auth-changed", updateEmail);
    };
  }, []);

  const handleLogout = () => {
    setAuthToken(null);
    localStorage.clear();
    window.dispatchEvent(new Event("auth-changed"));
    setUserEmail(null);
    window.location.reload();
    toast.success("Амжилттай истемээс гарлаа");
    router.push("/home-page");
  };

  const firstLetter = userEmail ? userEmail.charAt(0).toUpperCase() : "?";

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

  // ⭐ Facebook login handler (ADDED)
  // const handleFacebookLogin = () => {
  //   if (!window.FB) {
  //     toast.error("Facebook SDK not loaded yet!");
  //     return;
  //   }

  //   window.FB.login(
  //     async (response: any) => {
  //       if (!response.authResponse) {
  //         toast.error("Facebook login cancelled!");
  //         return;
  //       }

  //       const token = response.authResponse.accessToken;

  //       try {
  //         const res = await fetch(
  //           `${process.env.NEXT_PUBLIC_BACKEND_URL}/user/auth/facebook`,
  //           {
  //             method: "POST",
  //             headers: { "Content-Type": "application/json" },
  //             body: JSON.stringify({ token, role: "USER" }),
  //           }
  //         );

  //         const data = await res.json();

  //         if (!res.ok) {
  //           toast.error(data.message || "Facebook login failed");
  //           return;
  //         }

  //         localStorage.setItem("token", data.token);
  //         localStorage.setItem("email", data.user.email);
  //         localStorage.setItem("userId", data.user.id);

  //         saveAuth(data);
  //         window.dispatchEvent(new Event("auth-changed"));
  //         window.location.reload();

  //         toast.success("Facebook-ээр амжилттай нэвтэрлээ!");
  //       } catch {
  //         toast.error("Facebook login error!");
  //       }
  //     },
  //     { scope: "email,public_profile" }
  //   );
  // };

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
          className="relative flex items-center justify-center w-[42px] h-[42px] 
                     rounded-full border border-gray-700 bg-[#1a1a1a] 
                     hover:border-[#facc15] transition-all duration-300 
                     hover:shadow-[0_0_12px_rgba(250,204,21,0.3)]"
        >
          <span className="text-lg font-semibold text-[#facc15]">
            {firstLetter}
          </span>
        </motion.button>
      </SheetTrigger>

      <SheetContent
        side="right"
        className="w-full sm:max-w-[420px] bg-[#0a0a0a] text-white border-l border-gray-800 
                   flex flex-col justify-between p-0 overflow-hidden"
      >
        <VisuallyHidden>
          <SheetTitle>User Menu</SheetTitle>
        </VisuallyHidden>

        {/* ▶ NOT LOGGED IN */}
        {!token && (
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

            <div className="flex justify-center">
              <GoogleLogin
                onSuccess={handleGoogleLogin}
                onError={() => toast.error("Google login error")}
              />
            </div>

            {/* ⭐ Facebook button (ADDED) */}
            <button
              onClick={handleFacebookLogin}
              className="w-full bg-[#1877F2] text-white py-3 rounded-xl 
                         font-semibold hover:bg-[#145dbf] transition"
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
        )}

        {/* ▶ LOGGED IN */}
        {token && (
          <>
            <div className="flex flex-col items-center pt-8 pb-6 border-b border-gray-800">
              <div className="w-16 h-16 rounded-full bg-gray-700 flex items-center justify-center text-2xl font-semibold text-[#facc15]">
                {firstLetter}
              </div>
              <h2 className="mt-3 font-medium text-gray-300 text-sm">
                {userEmail}
              </h2>
            </div>

            <div className="flex flex-col px-6 py-5 gap-4">
              <button
                onClick={() => router.push("/profile?tab=profile")}
                className="flex items-start gap-3 p-4 rounded-xl bg-[#111]/90 border border-gray-800 hover:border-[#facc15] transition"
              >
                <User className="w-5 h-5 text-[#facc15]" />
                <div>
                  <p className="font-semibold">Профайл</p>
                  <p className="text-gray-400 text-sm">Таны мэдээлэл</p>
                </div>
              </button>

              <button
                onClick={() => router.push("/profile?tab=orders")}
                className="flex items-start gap-3 p-4 rounded-xl bg-[#111]/90 border border-gray-800 hover:border-[#facc15] transition"
              >
                <Package className="w-5 h-5 text-[#facc15]" />
                <div>
                  <p className="font-semibold">Захиалгууд</p>
                  <p className="text-gray-400 text-sm">Захиалгын түүх</p>
                </div>
              </button>

              <button
                onClick={() => router.push("/profile?tab=tickets")}
                className="flex items-start gap-3 p-4 rounded-xl bg-[#111]/90 border border-gray-800 hover:border-[#facc15] transition"
              >
                <Ticket className="w-5 h-5 text-[#facc15]" />
                <div>
                  <p className="font-semibold">Миний тасалбар</p>
                  <p className="text-gray-400 text-sm">Тасалбарууд</p>
                </div>
              </button>
            </div>

            <SheetFooter className="border-t border-gray-800 p-5 bg-[#111]/80">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                onClick={handleLogout}
                className="w-full bg-red-600 hover:bg-red-700 py-3 rounded-xl font-semibold"
              >
                <LogOut className="w-4 h-4 inline-block" /> Системээс гарах
              </motion.button>
            </SheetFooter>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
};
