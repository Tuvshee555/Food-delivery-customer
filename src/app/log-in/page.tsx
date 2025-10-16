/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
"use client";

import axios from "axios";
import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { GoogleLogin, CredentialResponse } from "@react-oauth/google";
import { useAuth } from "../provider/AuthProvider";

export default function LogIn() {
  const [user, setUser] = useState({
    email: "",
    password: "",
    role: "USER",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const { setAuthToken } = useAuth();
  const router = useRouter();

  // ------------------------
  // Email/Password login
  // ------------------------
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      setLoading(true);
      const response = await axios.post(
        "http://localhost:4000/user/login",
        user
      );

      if (response.data.success) {
        const { token, user: userData } = response.data;

        localStorage.setItem("token", token);
        localStorage.setItem("email", userData.email);
        localStorage.setItem("userId", userData.userId || userData.user_id);

        setAuthToken(token);
        toast.success("Successfully logged in!");
        router.push("/home-page");
      } else {
        setError(response.data.message);
        toast.error(response.data.message);
      }
    } catch (err) {
      console.log(err);
      setError("An error occurred while logging in.");
      toast.error("An error occurred while logging in.");
    } finally {
      setLoading(false);
    }
  };

  // ------------------------
  // Google login
  // ------------------------
  const handleGoogleLogin = async (credentialResponse: CredentialResponse) => {
    if (!credentialResponse.credential) {
      toast.error("No Google credentials received!");
      return;
    }

    try {
      const res = await fetch("http://localhost:4000/user/auth/google", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: credentialResponse.credential }),
      });
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
      console.error("Google login failed:", error);
      toast.error("Google login failed!");
    }
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
          {/* Email */}
          <input
            className="text-[#71717b] border border-gray-300 rounded-[8px] p-2 focus:outline-none focus:ring-2 focus:ring-black"
            placeholder="Enter your email address"
            type="email"
            value={user.email}
            onChange={(e) =>
              setUser((prev) => ({ ...prev, email: e.target.value }))
            }
          />

          {/* Password */}
          <div className="relative">
            <input
              className="text-[#71717b] border border-gray-300 rounded-[8px] p-2 w-full focus:outline-none focus:ring-2 focus:ring-black"
              placeholder="Password"
              type={showPassword ? "text" : "password"}
              value={user.password}
              onChange={(e) =>
                setUser((prev) => ({ ...prev, password: e.target.value }))
              }
            />
          </div>

          {/* Show password toggle */}
          <label className="flex items-center gap-2 text-black text-sm cursor-pointer">
            <input
              type="checkbox"
              checked={showPassword}
              onChange={() => setShowPassword(!showPassword)}
            />
            Show password
          </label>

          {/* Error */}
          {error && <p className="text-red-500 text-sm">{error}</p>}

          {/* Forgot password */}
          <p
            className="text-[14px] underline text-black hover:text-red-500 cursor-pointer"
            onClick={() => router.push("/forgot-password")}
          >
            Forgot your password?
          </p>

          {/* Submit */}
          <div>
            {" "}
            <button
              type="submit"
              disabled={loading}
              className={`h-[36px] w-full rounded-[8px] text-white transition duration-300 ${
                loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-[#d1d1d1] hover:bg-black"
              }`}
            >
              {loading ? "Logging in..." : "Log in"}
            </button>
            {/* Divider and Google Login */}
            <div className="mt-2">
              <div className="flex items-center gap-2 text-gray-500 ">
                <span className="w-full h-px bg-gray-300" />
                or
                <span className="w-full h-px bg-gray-300" />
              </div>
              <div className="mt-2">
                <GoogleLogin
                  onSuccess={handleGoogleLogin}
                  onError={() => toast.error("Google login error")}
                />
              </div>
            </div>
          </div>
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
