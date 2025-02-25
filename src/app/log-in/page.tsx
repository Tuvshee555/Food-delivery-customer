import axios from "axios";
import { ChevronLeft } from "lucide-react";
import { useState } from "react";

type LogIn = {
  nextStep: () => void;
  stepBack: () => void;
};
type PasswordValue = {
  target: {
    value: string;
  };
};

export default function LogIn() {
  const [emailValue, setEmailValue] = useState("")
  const [passwordValue, setPasswordValue] = useState("")

  const LogIn = async () => {
    try {
      const response = await axios.
    } catch (error) {
      console.log(error);
      
    }
  }

  const emailInput = (e) => {
    setEmailValue(e.target.value)
  }
  const passwordInput = (e) => {
    setPasswordValue(e.target.value)

  }
  return (
    <>
      <div className="h-screen w-screen bg-white flex items-center justify-center gap-12">
        <div className="flex flex-col gap-6 w-[416px]">
          <ChevronLeft className="bg-black rounded-[6px] hover:cursor-pointer" />
          <h1 className="text-[24px] font-inter font-800 text-black m-[0]">
            Log in
          </h1>
          <p className="text-[16px] font-inter font-400 text-[#71717a]">
            Log in to enjoy your favorite dishes.
          </p>
          <input
            className="gap-[8px] text-[#71717b] font-400 border border-2 rounded-[8px] p-[6px]"
            placeholder="Enter your email address"
            type="password"
            value={emailValue}
            onChange={(e) => emailInput(e)}
          ></input>
          <input
            className="gap-[8px] text-[#71717b] font-400 border border-2 rounded-[8px] p-[6px]"
            placeholder="Password"
            type="password"
            value={passwordValue}
            onChange={(e) => passwordInput(e)}
          ></input>
          <p className="text-[14px] font-400 underline text-[black] hover:text-[red] underline-[red] cursor-pointer">
            Forgot your password
          </p>

          <div className="flex gap-3 justify-center">
            <h1 className="text-[16px] text-400 font-inter text-[#71717a]">
              Already have an account?
            </h1>
            <h1 className="text-[16px] text-400 font-inter text-[#2762ea] hover:cursor-pointer">
              Log in
            </h1>
          </div>
        </div>
        <img src="./deliverM.png" className="w-[860px] h-[900px]" />
      </div>
    </>
  );
}
