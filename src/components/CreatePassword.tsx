"use client"

import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

type CreatePassword = {
  nextStep: () => void;
  stepBack: () => void;
};
type PasswordValue = {
  target: {
    value: string;
  };
};

export const CreatePassword = ({ nextStep, stepBack }: CreatePassword) => {
  const [password, setPassword] = useState("");
  const [checkPassword, setChekPassword] = useState("");
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [confirmPasswordError, setConfirmPasswordError] = useState<
    string | null
  >(null);
  const router = useRouter()

  const passwordValue = (e: PasswordValue) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    if (newPassword.length < 8) {
      setPasswordError("Password must be at least 8 characters");
    } else {
      setPasswordError(null);
    }
  };

  const checkPasswordValue = (e: PasswordValue) => {
    const newCheckPassword = e.target.value;
    setChekPassword(newCheckPassword);

    if (newCheckPassword !== password) {
      setConfirmPasswordError("Password do not match");
    } else {
      setConfirmPasswordError(null);
    }
  };

  const checkValue = () => {
    if (password.length < 8) {
      setPasswordError("Password must be at least 8 characters");
    } else {
      setConfirmPasswordError(null);
    }

    if (password !== checkPassword) {
      setConfirmPasswordError("Password do not match");
    } else setConfirmPasswordError(null);

    if (password.length >= 8 && password === checkPassword) {
      nextStep();
      router.push(`/log-in`)
    }
  };
  return (
    <>
      <div className="h-screen w-screen bg-white flex items-center justify-center gap-12">
        <div className="flex flex-col gap-6 w-[416px]">
          <ChevronLeft
            className="bg-black rounded-[6px] hover:cursor-pointer"
            onClick={() => stepBack()}
          />
          <h1 className="text-[24px] font-inter font-600 text-black m-[0]">
            Create a strong password
          </h1>
          <p className="text-[16px] font-inter font-400 text-[#71717a]">
            Create a strong password with letters, numbers.
          </p>
          <input
            className={`gap-[8px] text-[#71717b] font-400 border-2 rounded-[8px] p-[6px] ${
              passwordError ? "border-red-500" : "border-gray-300"
            }`}
            placeholder="Password"
            type="password"
            value={password}
            onChange={(e) => passwordValue(e)}
          ></input>
          {passwordError && (
            <p className="text-red-500 text-sm">{passwordError}</p>
          )}
          <input
            className={`gap-[8px] text-[#71717b] font-400 border-2 rounded-[8px] p-[6px] ${
              passwordError ? "border-[red]" : "border-[gray]"
            }`}
            placeholder="Confirm"
            type="password"
            value={checkPassword}
            onChange={(e) => checkPasswordValue(e)}
          ></input>
          {confirmPasswordError && (
            <p className="text-red-500 text-sm">{confirmPasswordError}</p>
          )}
          <button
            className="h-[36px] w-[416px] rounded-[8px] text-[white] bg-[#d1d1d1] hover:bg-black"
            onClick={() => checkValue()}
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
        </div>
        <img src="./deliverM.png" className="w-[860px] h-[900px]" />
      </div>
    </>
  );
};
