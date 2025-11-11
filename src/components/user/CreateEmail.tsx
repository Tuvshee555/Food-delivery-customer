/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { GoogleLogin, CredentialResponse } from "@react-oauth/google";
import { toast } from "sonner";
import { ChevronLeft } from "lucide-react";
import { UserType } from "@/type/type";
import { motion } from "framer-motion";

declare global {
  interface Window {
    FB: fb.FacebookStatic;
    fbAsyncInit: () => void;
  }
}

export const CreateEmail = ({ nextStep, user, setUser }: UserType) => {
  const router = useRouter();

  useEffect(() => {
    if (typeof window === "undefined" || window.FB) return;

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
  }, []);

  const handleGoogleSignUp = async (credentialResponse: CredentialResponse) => {
    if (!credentialResponse.credential) {
      toast.error("No Google credentials received!");
      return;
    }

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
        toast.error(data.message || "Google signup failed!");
        return;
      }

      localStorage.setItem("user", JSON.stringify(data.user));
      localStorage.setItem("email", data.user.email);
      setUser(data.user);
      toast.success("Signed up with Google successfully!");
      router.push("/home-page");
    } catch (error) {
      console.error(error);
      toast.error("Google signup failed!");
    }
  };

  const handleFacebookSignUp = () => {
    if (!window.FB) {
      toast.error("Facebook SDK not loaded yet!");
      return;
    }

    window.FB.login(
      async (response: fb.StatusResponse) => {
        if (response.authResponse) {
          const token = response.authResponse.accessToken;

          try {
            const res = await fetch(
              `${process.env.NEXT_PUBLIC_BACKEND_URL}/user/auth/facebook`,
              {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ token, role: "USER" }),
              }
            );

            const data = await res.json();
            if (!res.ok) {
              toast.error(data.message || "Facebook signup failed!");
              return;
            }

            localStorage.setItem("user", JSON.stringify(data.user));
            localStorage.setItem("email", data.user.email);
            setUser(data.user);
            toast.success("Signed up with Facebook successfully!");
            router.push("/log-in");
          } catch (error) {
            console.error(error);
            toast.error("Facebook signup failed!");
          }
        } else {
          toast.error("Facebook login cancelled or failed!");
        }
      },
      { scope: "email,public_profile" }
    );
  };

  return (
    <div className="min-h-screen w-full flex flex-col md:flex-row items-center justify-center bg-gradient-to-br from-white via-[#f9f9f9] to-[#fff5f5] relative overflow-hidden px-4 py-8 sm:px-6 md:px-12 lg:px-20">
      <div className="absolute inset-0 bg-[url('/deliverM.png')] opacity-5" />

      <div className="flex flex-col md:flex-row items-center justify-center gap-10 md:gap-16 z-10 w-full max-w-6xl">
        {/* ===== Left section ===== */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex flex-col gap-6 w-full sm:w-[380px] md:w-[420px] bg-white/90 backdrop-blur-md p-6 sm:p-8 rounded-2xl shadow-2xl border border-gray-100"
        >
          <ChevronLeft
            className="w-6 h-6 text-gray-600 hover:text-black hover:scale-110 transition cursor-pointer"
            onClick={() => router.back()}
          />

          <h1 className="text-xl sm:text-2xl font-semibold text-gray-900 text-center md:text-left">
            Create your account
          </h1>
          <p className="text-gray-500 text-sm text-center md:text-left">
            Sign up to explore your favorite dishes.
          </p>

          <input
            value={user.email}
            onChange={(e) =>
              setUser((prev: any) => ({ ...prev, email: e.target.value }))
            }
            placeholder="Enter your email address"
            className="border border-gray-300 rounded-xl p-3 text-gray-700 text-sm focus:ring-2 focus:ring-red-500 outline-none transition"
          />

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            className="h-[42px] w-full rounded-xl text-white bg-gradient-to-r from-red-500 to-orange-500 
                       hover:from-red-600 hover:to-orange-600 font-medium shadow-md hover:shadow-lg transition-all"
            onClick={nextStep}
          >
            Let’s go
          </motion.button>

          {/* Divider */}
          <div className="flex items-center gap-2 text-gray-400 text-sm mt-2">
            <span className="w-full h-px bg-gray-200" />
            or
            <span className="w-full h-px bg-gray-200" />
          </div>

          {/* Google */}
          <div className="mt-3 flex justify-center">
            <GoogleLogin
              onSuccess={handleGoogleSignUp}
              onError={() => toast.error("Google login error")}
            />
          </div>

          {/* Facebook */}
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={handleFacebookSignUp}
            className="h-[42px] w-full bg-[#1877F2] text-white rounded-xl font-medium 
                       hover:bg-[#145dbf] shadow-md hover:shadow-lg transition-all"
          >
            Continue with Facebook
          </motion.button>

          <div className="flex flex-wrap justify-center items-center gap-2 mt-4 text-sm text-center">
            <p className="text-gray-500">Already have an account?</p>
            <span
              className="text-red-500 font-medium hover:underline cursor-pointer"
              onClick={() => router.push("/log-in")}
            >
              Log in
            </span>
          </div>
        </motion.div>

        {/* ===== Right image ===== */}
        <motion.img
          src="/deliverM.png"
          alt="Delivery illustration"
          className="hidden md:block md:w-[420px] lg:w-[700px] rounded-2xl shadow-xl object-cover"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        />
      </div>
    </div>
  );
};
