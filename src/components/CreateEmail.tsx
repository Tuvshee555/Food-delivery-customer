"use client";

import axios from "axios";
import { ChevronLeft } from "lucide-react";
import * as yup from "yup";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { InputEventType, SignUpEmailStepType } from "@/type/type";

export const CreateEmail = ({ nextStep, setUser }: SignUpEmailStepType) => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleInputChange = (e: InputEventType) => {
    setEmail(e.target.value);
  };

  const validateEmail = async () => {
    try {
      await yup
        .object()
        .shape({
          email: yup
            .string()
            .email("Invalid email")
            .required("Email is required"),
        })
        .validate({ email });

      setUser((prev: any) => ({ ...prev, email }));
      nextStep();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="h-screen w-screen bg-white flex items-center justify-center gap-12">
      <div className="flex flex-col gap-6 w-[416px]">
        <ChevronLeft className="bg-white rounded-[6px] hover:cursor-pointer" />

        <h1 className="text-[24px] font-semibold text-black">
          Create your account
        </h1>
        <p className="text-[16px] text-[#71717a]">
          Sign up to explore your favorite dishes.
        </p>

        <input
          className="border-2 rounded-[8px] p-[6px] text-[#71717b]"
          placeholder="Enter your email address"
          value={email}
          onChange={handleInputChange}
        />
        {error && <p className="text-red-500 text-sm">{error}</p>}

        <button
          className="h-[36px] w-full rounded-[8px] text-white bg-[#d1d1d1] hover:bg-black"
          onClick={validateEmail}
        >
          Let's go
        </button>

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
      <img src="./deliverM.png" className="w-[860px] h-[900px]" />
    </div>
  );
};
