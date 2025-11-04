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

declare global {
  interface Window {
    FB: fb.FacebookStatic;
    fbAsyncInit: () => void;
  }
}

export const CreateEmail = ({ nextStep, user, setUser }: UserType) => {
  const router = useRouter();

  // Load Facebook SDK
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.FB) return;

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

  // Google signup
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

  // Facebook signup
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
    <div className="h-screen w-screen bg-white flex items-center justify-center gap-12">
      <div className="flex flex-col gap-6 w-[416px]">
        <ChevronLeft
          className="bg-white rounded-[6px] hover:cursor-pointer"
          onClick={() => router.back()}
        />
        <h1 className="text-[24px] font-semibold text-black">
          Create your account
        </h1>
        <p className="text-[16px] text-[#71717a]">
          Sign up to explore your favorite dishes.
        </p>

        <input
          value={user.email}
          onChange={(e) =>
            setUser((prev: any) => ({ ...prev, email: e.target.value }))
          }
          placeholder="Enter your email address"
          className="border-2 rounded-[8px] p-[6px] text-[#71717b]"
        />

        <button
          className="h-[36px] w-full rounded-[8px] text-white bg-[#d1d1d1] hover:bg-black"
          onClick={nextStep}
        >
          Lets go
        </button>

        <div className="mt-2">
          <div className="flex items-center gap-2 text-gray-500">
            <span className="w-full h-px bg-gray-300" />
            or
            <span className="w-full h-px bg-gray-300" />
          </div>

          <div className="mt-2">
            <GoogleLogin
              onSuccess={handleGoogleSignUp}
              onError={() => toast.error("Google login error")}
            />
          </div>

          <div className="mt-2">
            <button
              onClick={handleFacebookSignUp}
              className="h-[36px] w-full bg-[#1877F2] text-white rounded-[8px] hover:bg-[#145dbf]"
            >
              Continue with Facebook
            </button>
          </div>
        </div>

        <div className="flex gap-3 justify-center">
          <p className="text-[16px] text-[#71717a]">Already have an account?</p>
          <p
            className="text-[16px] text-[#2762ea] hover:cursor-pointer"
            onClick={() => router.push("/log-in")}
          >
            Log in
          </p>
        </div>
      </div>

      <img src="/deliverM.png" className="w-[860px] h-[900px]" />
    </div>
  );
};
