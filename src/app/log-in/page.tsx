"use client";

import axios from "axios";
import { ChevronLeft } from "lucide-react";
import { useState } from "react";

export default function LogIn() {
  const [emailValue, setEmailValue] = useState("");
  const [passwordValue, setPasswordValue] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const logIn = async (e: React.FormEvent) => {
    e.preventDefault(); // ✅ Prevent page reload

    try {
      const response = await axios.post("http://localhost:4000/login", {
        email: emailValue,
        password: passwordValue,
      });

      console.log("Login successful", response.data);
    } catch (error) {
      console.log(error);
      setError("Invalid email or password");
    }
  };

  return (
    <div className="h-screen w-screen bg-white flex items-center justify-center gap-12">
      <div className="flex flex-col gap-6 w-[416px]">
        <ChevronLeft className="bg-black rounded-[6px] hover:cursor-pointer" />

        <h1 className="text-[24px] font-inter font-bold text-black m-0">
          Log in
        </h1>
        <p className="text-[16px] font-inter text-[#71717a]">
          Log in to enjoy your favorite dishes.
        </p>

        <form onSubmit={logIn} className="flex flex-col gap-4">
          {/* Email Input */}
          <input
            className="text-[#71717b] border border-gray-300 rounded-[8px] p-2 focus:outline-none focus:ring-2 focus:ring-black"
            placeholder="Enter your email address"
            type="email"
            value={emailValue}
            onChange={(e) => setEmailValue(e.target.value)}
            id="emailInput"
            required
          />

          {/* Password Input */}
          <div className="relative">
            <input
              className="text-[#71717b] border border-gray-300 rounded-[8px] p-2 w-full focus:outline-none focus:ring-2 focus:ring-black"
              placeholder="Password"
              type={showPassword ? "text" : "password"}
              value={passwordValue}
              onChange={(e) => setPasswordValue(e.target.value)}
              id="passwordInput"
              required
            />
          </div>

          {/* Show Password Checkbox */}
          <label className="flex items-center gap-2 text-black text-sm cursor-pointer">
            <input
              type="checkbox"
              checked={showPassword}
              onChange={() => setShowPassword(!showPassword)}
            />
            Show password
          </label>

          {error && <p className="text-red-500">{error}</p>}

          <p className="text-[14px] underline text-black hover:text-red-500 cursor-pointer">
            Forgot your password?
          </p>

          {/* Log In Button */}
          <button
            className="h-[36px] w-full rounded-[8px] text-white bg-[#d1d1d1] hover:bg-black transition duration-300"
            type="submit"
          >
            Log in
          </button>
        </form>

        <div className="flex gap-3 justify-center">
          <p className="text-[16px] text-[#71717a]">Don’t have an account?</p>
          <p className="text-[16px] text-[#2762ea] hover:cursor-pointer">
            Sign up
          </p>
        </div>
      </div>

      <img src="./deliverM.png" className="w-[860px] h-[900px]" />
    </div>
  );
}
