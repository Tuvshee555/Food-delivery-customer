/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { SignUpEmailStepType } from "@/type/type";
import { ChevronLeft, Eye, EyeOff } from "lucide-react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

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
  }, [user]);

  const validatePasswords = () => {
    const { password, repassword } = user;
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

  const handleSubmit = () => {
    if (!error) nextStep();
  };

  return (
    <div className="min-h-screen w-full flex flex-col md:flex-row items-center justify-center bg-gradient-to-br from-white via-[#f9f9f9] to-[#fff5f5] relative overflow-hidden px-4 sm:px-6 md:px-12 lg:px-20">
      {/* Background pattern */}
      <div className="absolute inset-0 bg-[url('/deliverM.png')] opacity-5" />

      <div className="flex flex-col md:flex-row items-center justify-center gap-10 md:gap-16 z-10 w-full max-w-6xl">
        {/* ===== Left section: Form ===== */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex flex-col gap-6 w-full sm:w-[380px] md:w-[420px] bg-white/90 backdrop-blur-md p-6 sm:p-8 rounded-2xl shadow-2xl border border-gray-100"
        >
          <ChevronLeft
            className="w-6 h-6 text-gray-600 hover:text-black hover:scale-110 transition cursor-pointer"
            onClick={stepBack}
          />

          <h1 className="text-xl sm:text-2xl font-semibold text-gray-900 text-center md:text-left">
            Create a password
          </h1>
          <p className="text-gray-500 text-sm text-center md:text-left">
            Use a 6-digit numeric password for your account.
          </p>

          {/* Password Input */}
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              className="border border-gray-300 rounded-xl p-3 text-gray-700 text-sm focus:ring-2 focus:ring-red-500 outline-none w-full"
              placeholder="Enter your password"
              value={user.password}
              onChange={handlePasswordChange}
            />
            <button
              type="button"
              className="absolute right-3 top-3 text-gray-500"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          {/* Confirm Password Input */}
          <div className="relative">
            <input
              type={showConfirmPassword ? "text" : "password"}
              className="border border-gray-300 rounded-xl p-3 text-gray-700 text-sm focus:ring-2 focus:ring-red-500 outline-none w-full"
              placeholder="Confirm your password"
              value={user.repassword}
              onChange={handleConfirmPasswordChange}
            />
            <button
              type="button"
              className="absolute right-3 top-3 text-gray-500"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          {/* Error message */}
          {isTouched && error && (
            <p className="text-red-500 text-sm text-center md:text-left">
              {error}
            </p>
          )}

          {/* Submit Button */}
          <motion.button
            whileHover={{ scale: !error ? 1.02 : 1 }}
            whileTap={{ scale: !error ? 0.97 : 1 }}
            className={`h-[42px] w-full rounded-xl text-white font-medium shadow-md hover:shadow-lg transition-all ${
              error
                ? "bg-gradient-to-r from-red-300 to-orange-300 cursor-not-allowed"
                : "bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600"
            }`}
            onClick={handleSubmit}
            disabled={!!error}
          >
            Continue
          </motion.button>

          <div className="flex flex-wrap justify-center items-center gap-2 mt-4 text-sm text-center">
            <p className="text-gray-500">Already have an account?</p>
            <span
              className="text-red-500 font-medium hover:underline cursor-pointer"
              onClick={() => router.push("/log-in")}
            >
              Log in
            </span>
          </div>
        </motion.div>

        {/* ===== Right section: Image ===== */}
        <motion.img
          src="./deliverM.png"
          alt="Illustration"
          className="hidden md:block md:w-[420px] lg:w-[700px] rounded-2xl shadow-xl object-cover"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        />
      </div>
    </div>
  );
};
