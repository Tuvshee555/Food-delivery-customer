/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { GoogleLogin, CredentialResponse } from "@react-oauth/google";
import { toast } from "sonner";
import { ChevronLeft, Loader2 } from "lucide-react";
import axios from "axios";
import { loadFacebookSDK } from "@/utils/loadFacebookSDK";
import { useAuth } from "../provider/AuthProvider";
import { motion } from "framer-motion";

declare global {
  interface Window {
    FB: fb.FacebookStatic;
  }
}

export default function LogIn() {
  const router = useRouter();
  const { setAuthToken } = useAuth();

  const [user, setUser] = useState({ email: "", password: "", role: "USER" });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadFacebookSDK();
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const payload = {
      email: user.email,
      password: user.password,
      role: user.role,
    };

    try {
      setLoading(true);
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/user/login`,
        payload
      );

      if (response.data.success) {
        const { token, user: userData } = response.data;
        localStorage.setItem("token", token);
        localStorage.setItem("email", userData.email);
        localStorage.setItem("userId", userData.userId || userData._id);
        setAuthToken(token);
        toast.success("Successfully logged in!");
        router.push("/home-page");
      } else {
        setError(response.data.message);
        toast.error(response.data.message);
      }
    } catch (err: unknown) {
      console.error("Login error:", err);
      if (axios.isAxiosError(err)) {
        const message =
          err.response?.data?.message || "An error occurred while logging in.";
        setError(message);
        toast.error(message);
      } else if (err instanceof Error) {
        setError(err.message);
        toast.error(err.message);
      } else {
        setError("An unexpected error occurred.");
        toast.error("An unexpected error occurred.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async (credentialResponse: CredentialResponse) => {
    if (!credentialResponse.credential)
      return toast.error("No Google credentials received!");

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/user/auth/google`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token: credentialResponse.credential }),
        }
      );

      const data = await res.json();
      if (data.token && data.user) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("email", data.user.email);
        localStorage.setItem("userId", data.user._id);
        setAuthToken(data.token);
        toast.success("Successfully logged in with Google!");
        router.push("/home-page");
      } else {
        toast.error("Google login failed!");
      }
    } catch {
      toast.error("Google login failed!");
    }
  };

  const handleFacebookLogin = () => {
    if (!window.FB) return toast.error("Facebook SDK not loaded yet!");

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
                localStorage.setItem("userId", data.user._id);
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
    <div className="min-h-screen w-full flex flex-col md:flex-row items-center justify-center bg-gradient-to-br from-white via-[#f9f9f9] to-[#fff5f5] relative overflow-hidden px-4 py-8 sm:px-6 md:px-12 lg:px-20">
      <div className="absolute inset-0 bg-[url('/deliverM.png')] opacity-5" />

      <div className="flex flex-col md:flex-row items-center justify-center gap-10 md:gap-16 z-10 w-full max-w-6xl">
        {/* ==== Left section (Form) ==== */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex flex-col gap-6 w-full sm:w-[380px] md:w-[420px] bg-white/90 backdrop-blur-md p-6 sm:p-8 rounded-2xl shadow-2xl border border-gray-100"
        >
          <ChevronLeft
            className="w-6 h-6 text-gray-600 hover:text-black hover:scale-110 transition cursor-pointer"
            onClick={() => router.push("/")}
          />

          <h1 className="text-xl sm:text-2xl font-semibold text-gray-900 text-center md:text-left">
            Log in
          </h1>
          <p className="text-gray-500 text-sm text-center md:text-left">
            Log in to enjoy your favorite dishes.
          </p>

          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            <input
              type="email"
              placeholder="Enter your email address"
              value={user.email}
              onChange={(e) =>
                setUser((prev) => ({ ...prev, email: e.target.value }))
              }
              className="border border-gray-300 rounded-xl p-3 text-gray-700 text-sm focus:ring-2 focus:ring-red-500 outline-none transition"
            />

            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={user.password}
              onChange={(e) =>
                setUser((prev) => ({ ...prev, password: e.target.value }))
              }
              className="border border-gray-300 rounded-xl p-3 text-gray-700 text-sm focus:ring-2 focus:ring-red-500 outline-none transition"
            />

            {/* Show Password Toggle */}
            <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={showPassword}
                onChange={() => setShowPassword(!showPassword)}
                className="accent-red-500 w-4 h-4 cursor-pointer"
              />
              <span className="hover:text-black transition-colors duration-200">
                Show password
              </span>
            </label>

            {/* Error Message */}
            {error && (
              <p className="text-red-500 text-xs font-medium mt-1">{error}</p>
            )}

            {/* Forgot Password Link */}
            <p
              className="text-sm text-gray-700 underline underline-offset-2 hover:text-red-500 transition-colors duration-200 cursor-pointer"
              onClick={() => router.push("/forgot-password")}
            >
              Forgot your password?
            </p>

            <motion.button
              whileHover={{ scale: !loading ? 1.02 : 1 }}
              whileTap={{ scale: !loading ? 0.97 : 1 }}
              type="submit"
              disabled={loading}
              className={`h-[42px] w-full rounded-xl text-white font-medium shadow-md transition-all ${
                loading
                  ? "bg-gray-300 cursor-not-allowed"
                  : "bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 hover:shadow-lg"
              }`}
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" /> Logging in...
                </div>
              ) : (
                "Log in"
              )}
            </motion.button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-2 text-gray-400 text-sm mt-2">
            <span className="w-full h-px bg-gray-200" />
            or
            <span className="w-full h-px bg-gray-200" />
          </div>

          <div className="mt-3 flex justify-center">
            <GoogleLogin
              onSuccess={handleGoogleLogin}
              onError={() => toast.error("Google login error")}
            />
          </div>

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={handleFacebookLogin}
            className="h-[42px] w-full bg-[#1877F2] text-white rounded-xl font-medium 
                       hover:bg-[#145dbf] shadow-md hover:shadow-lg transition-all"
          >
            Continue with Facebook
          </motion.button>

          <div className="flex flex-wrap justify-center items-center gap-2 mt-4 text-sm text-center">
            <p className="text-gray-500">Don’t have an account?</p>
            <span
              className="text-red-500 font-medium hover:underline cursor-pointer"
              onClick={() => router.push("/sign-up")}
            >
              Sign up
            </span>
          </div>
        </motion.div>

        {/* ==== Right section (Image) ==== */}
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
}
