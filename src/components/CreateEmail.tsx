"use client"

import axios from "axios";
import { ChevronLeft, UserCheck } from "lucide-react";
import * as yup from "yup";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { InputEventType, SignUpEmailStepType, ValidationFunction } from "@/type/type";


export const CreateEmail = ({ nextStep }: SignUpEmailStepType) => {
  const [email, setValue] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const inputValue = (e: InputEventType) => {
    setValue(e.target.value);
  };

  const inputValueCheck: ValidationFunction = (value, nextStep, setError) => {
    const userSchema = yup.object().shape({
      email: yup.string().email("Invalid email").required("Email is required"),
    });

    userSchema
      .validate({ email: value }, { abortEarly: false })
      .then(() => {
        console.log("error");

        nextStep();
      })
      .catch((err) => {
        setError(err.errors[0]);
      });
  };

  const PostEmail = async () => {
    try {
      const response = await axios.post("http://localhost:4000/users", {
        email: email,
      });
      console.log("Email posted successfully", response);
    } catch (error) {
      console.error("Error posting email", error);
    }
  };

  return (
    <>
      <div className="h-screen w-screen bg-[white] flex items-center justify-center gap-12">
        <div className="flex flex-col gap-6 w-[416px]">
          <ChevronLeft className="bg-[white] rounded-[6px] hover:cursor-pointer" />

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
            onChange={(e) => inputValue(e)}
          />
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button
            className="h-[36px] w-[416px] rounded-[8px] text-[white] bg-[#d1d1d1] hover:bg-black"
            onClick={() => {
              inputValueCheck(email, nextStep, setError);
              PostEmail()
            }}
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
