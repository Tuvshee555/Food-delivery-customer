/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { GoogleLogin, CredentialResponse } from "@react-oauth/google";
import { toast } from "sonner";
import { ChevronLeft } from "lucide-react";

import axios from "axios";
import { loadFacebookSDK } from "@/utils/loadFacebookSDK";
import { useAuth } from "../provider/AuthProvider";

declare global {
  interface Window {
    FB: fb.FacebookStatic;
  }
}

// type LoginResponse = {
//   success: boolean;
//   message?: string;
//   token?: string;
//   user?: {
//     _id?: string;
//     userId?: string;
//     email: string;
//   };
// };

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
      role: user.role, // send only what backend expects
    };

    console.log("Sending login payload:", payload);

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
    } catch (error) {
      console.error(error);
      toast.error("Google login failed!");
    }
  };

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
    <div className="h-screen w-screen bg-white flex items-center justify-center gap-12">
      <div className="flex flex-col gap-6 w-[416px]">
        <ChevronLeft
          className="bg-white rounded-[6px] hover:cursor-pointer"
          onClick={() => router.push("/")}
        />

        <h1 className="text-[24px] font-bold text-black">Log in</h1>
        <p className="text-[16px] text-[#71717a]">
          Log in to enjoy your favorite dishes.
        </p>

        <form className="flex flex-col gap-4" onSubmit={handleLogin}>
          <input
            className="text-[#71717b] border border-gray-300 rounded-[8px] p-2"
            placeholder="Enter your email address"
            type="email"
            value={user.email}
            onChange={(e) =>
              setUser((prev) => ({ ...prev, email: e.target.value }))
            }
          />

          <input
            className="text-[#71717b] border border-gray-300 rounded-[8px] p-2"
            placeholder="Password"
            type={showPassword ? "text" : "password"}
            value={user.password}
            onChange={(e) =>
              setUser((prev) => ({ ...prev, password: e.target.value }))
            }
          />

          <label className="flex items-center gap-2 text-black text-sm cursor-pointer">
            <input
              type="checkbox"
              checked={showPassword}
              onChange={() => setShowPassword(!showPassword)}
            />
            Show password
          </label>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <p
            className="text-[14px] underline text-black hover:text-red-500 cursor-pointer"
            onClick={() => router.push("/forgot-password")}
          >
            Forgot your password?
          </p>

          <button
            type="submit"
            disabled={loading}
            className={`h-[36px] w-full rounded-[8px] text-white ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-[#d1d1d1] hover:bg-black"
            }`}
          >
            {loading ? "Logging in..." : "Log in"}
          </button>

          <div className="mt-2 flex items-center gap-2 text-gray-500">
            <span className="w-full h-px bg-gray-300" /> or{" "}
            <span className="w-full h-px bg-gray-300" />
          </div>

          <GoogleLogin
            onSuccess={handleGoogleLogin}
            onError={() => toast.error("Google login error")}
          />

          <button
            onClick={handleFacebookLogin}
            className="mt-2 h-[36px] w-full bg-[#1877F2] text-white rounded-[8px] hover:bg-[#145dbf]"
          >
            Continue with Facebook
          </button>
        </form>

        <div className="flex gap-3 justify-center">
          <p className="text-[16px] text-[#71717a]">Don’t have an account?</p>
          <p
            className="text-[16px] text-[#2762ea] hover:cursor-pointer"
            onClick={() => router.push(`/sign-up`)}
          >
            Sign up
          </p>
        </div>
      </div>

      <img src="./deliverM.png" className="w-[860px] h-[900px]" />
    </div>
  );
}
