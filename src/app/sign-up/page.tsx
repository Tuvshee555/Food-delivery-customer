"use client";

import axios from "axios";
import { ChevronLeft } from "lucide-react";
import * as yup from "yup";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { SignUp } from "@/components/SignUp";

type SignUpEmailStepType = {
  nextStep: () => void;
  stepBack: () => void;
};

export default function CreateEmail({ nextStep }: SignUpEmailStepType) {
  const [email, setEmail] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const validateEmail = async () => {
    const schema = yup.object().shape({
      email: yup.string().email("Invalid email").required("Email is required"),
    });

    try {
      await schema.validate({ email }, { abortEarly: false });
      setError(null);
      // await postEmail();
      nextStep();
    } catch (err) {
      if (err instanceof yup.ValidationError) {
        setError(err.errors[0]);
      }
    }
  };
  console.log("page");

  
  

  const postEmail = async () => {
    try {
      await axios.post("http://localhost:4000/users", { email });
      console.log("Email posted successfully");
    } catch (error) {
      console.error("Error posting email", error);
    }
  };

  return (
    <>
    <div className="h-screen w-screen bg-white flex items-center justify-center gap-12">
      {/* <div className="flex flex-col gap-6 w-[416px]">
        <ChevronLeft className="bg-white rounded-[6px] hover:cursor-pointer" />

        <h1 className="text-[24px] font-inter font-600 text-black m-[0]">
          Create your account
        </h1>
        <p className="text-[16px] font-inter font-400 text-[#71717a]">
          Sign up to explore your favorite dishes.
        </p>
        <input
          className="gap-[8px] text-[#71717b] font-400 border-2 rounded-[8px] p-[6px]"
          placeholder="Enter your email address"
          value={email}
          onChange={handleInputChange}
        />
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <button
          className="h-[36px] w-[416px] rounded-[8px] text-white bg-[#d1d1d1] hover:bg-black"
          onClick={validateEmail}
        >
          Let's go
        </button>
        <div className="flex gap-3 justify-center">
          <h1 className="text-[16px] text-400 font-inter text-[#71717a]">
            Already have an account?
          </h1>
          <h1
            className="text-[16px] text-400 font-inter text-[#2762ea] hover:cursor-pointer"
            onClick={() => router.push(`/log-in`)}
          >
            Log in
          </h1>
        </div>
      </div> */}
      <SignUp />
    </div>
    </>
  );
}
