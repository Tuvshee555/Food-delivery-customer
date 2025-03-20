"use client";

import { SignUpEmailStepType } from "@/type/type";
import { ChevronLeft } from "lucide-react";
import { useState } from "react";


export const CreatePassword = ({ nextStep, stepBack, setUser }: SignUpEmailStepType) => {
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const validatePassword = () => {
    if (password.length < 6) {
      setError("Password must be at least 6 characters");
    } else {
      setError(null);
      setUser((prev: any) => ({ ...prev, password }));
      nextStep();
    }
  };

  return (
    <div className="h-screen w-screen bg-white flex items-center justify-center gap-12">
      <div className="flex flex-col gap-6 w-[416px]">
        <ChevronLeft className="bg-white rounded-[6px] hover:cursor-pointer" onClick={stepBack} />

        <h1 className="text-[24px] font-semibold text-black">Create a password</h1>

        <input
          type="password"
          className="border-2 rounded-[8px] p-[6px] text-[#71717b]"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {error && <p className="text-red-500 text-sm">{error}</p>}

        <button
          className="h-[36px] w-full rounded-[8px] text-white bg-[#d1d1d1] hover:bg-black"
          onClick={validatePassword}
        >
          Continue
        </button>
      </div>
      <img src="./deliverM.png" className="w-[860px] h-[900px]" />
    </div>
  );
};
