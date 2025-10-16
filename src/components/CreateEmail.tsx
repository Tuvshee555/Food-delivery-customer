/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
"use client";

import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { GoogleLogin, CredentialResponse } from "@react-oauth/google";
import { toast } from "sonner";

type User = {
  email: string;
  password: string;
  repassword: string;
  role?: string;
};

type UserType = {
  setUser: React.Dispatch<React.SetStateAction<User>>;
  nextStep: () => void;
  user: User;
};

export const CreateEmail = ({ nextStep, user, setUser }: UserType) => {
  const router = useRouter();

  // ✅ Google Sign-Up handler
  const handleGoogleSignUp = async (credentialResponse: CredentialResponse) => {
    if (!credentialResponse.credential) {
      toast.error("No Google credentials received!");
      return;
    }

    try {
      const res = await fetch("http://localhost:4000/user/auth/google", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token: credentialResponse.credential,
          role: "USER", // ✅ Send selected role
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        toast.error(data.message || "Google signup failed!");
        return;
      }

      // ✅ Store user info
      localStorage.setItem("user", JSON.stringify(data.user));
      localStorage.setItem("email", data.user.email);
      setUser(data.user);

      toast.success("Signed up with Google successfully!");
      router.push("/log-in"); // ✅ redirect to login instead of home
    } catch (error) {
      console.error("Google signup failed:", error);
      toast.error("Google signup failed!");
    }
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

        {/* Email input */}
        <input
          value={user.email}
          onChange={(e) =>
            setUser((prev) => ({ ...prev, email: e.target.value }))
          }
          placeholder="Enter your email address"
          className="border-2 rounded-[8px] p-[6px] text-[#71717b]"
        />

        <div>
          <button
            className="h-[36px] w-full rounded-[8px] text-white bg-[#d1d1d1] hover:bg-black"
            onClick={nextStep}
          >
            Lets go
          </button>
          <div className="mt-2">
            <div className="flex items-center gap-2 text-gray-500 ">
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
          </div>
        </div>

        <div className="flex gap-3 justify-center ">
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
