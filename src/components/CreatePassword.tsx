/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
"use client";

import { SignUpEmailStepType } from "@/type/type";
import { ChevronLeft, Eye, EyeOff } from "lucide-react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export const CreatePassword = ({
  nextStep,
  stepBack,
  setUser,
  user,
}: SignUpEmailStepType) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isTouched, setIsTouched] = useState(false);
  const router = useRouter();

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUser((prev) => ({ ...prev, password: e.target.value }));
    setIsTouched(true);
  };

  const handleConfirmPasswordChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setUser((prev) => ({ ...prev, repassword: e.target.value }));
    setIsTouched(true);
  };

  useEffect(() => {
    validatePasswords();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const validatePasswords = () => {
    const { password, repassword } = user;

    // Regex: exactly 6 digits (0-9)
    const passwordRegex = /^\d{6}$/;

    if (!password) {
      setError("Password is required");
    } else if (!passwordRegex.test(password)) {
      setError("Password must be exactly 6 numbers");
    } else if (repassword && password !== repassword) {
      setError("Passwords do not match");
    } else {
      setError(null);
    }
  };

  const handleSubmit = async () => {
    if (!error) {
      nextStep();
    }
  };

  return (
    <div className="h-screen w-screen bg-white flex items-center justify-center gap-12">
      <div className="flex flex-col gap-6 w-[416px]">
        <ChevronLeft
          className="bg-white rounded-[6px] hover:cursor-pointer"
          onClick={stepBack}
        />

        <h1 className="text-[24px] font-semibold text-black">
          Create a password
        </h1>

        {/* Password Input */}
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            className="border-2 rounded-[8px] p-[6px] text-[#71717b] w-full pr-10"
            placeholder="Enter your password"
            value={user.password}
            onChange={handlePasswordChange}
          />
          <button
            type="button"
            className="absolute right-3 top-2 text-gray-500"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>

        {/* Confirm Password Input */}
        <div className="relative">
          <input
            type={showConfirmPassword ? "text" : "password"}
            className="border-2 rounded-[8px] p-[6px] text-[#71717b] w-full pr-10"
            placeholder="Confirm your password"
            value={user.repassword}
            onChange={handleConfirmPasswordChange}
          />
          <button
            type="button"
            className="absolute right-3 top-2 text-gray-500"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
          >
            {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>

        {/* Only show error if user has started typing */}
        {isTouched && error && <p className="text-red-500 text-sm">{error}</p>}

        {/* Submit Button */}
        <button
          className={`h-[36px] w-full rounded-[8px] text-white ${
            error ? "bg-gray-300" : "bg-black hover:bg-gray-800"
          }`}
          onClick={handleSubmit}
          disabled={!!error}
        >
          Continue
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
