"use client";

import { useEffect, useState } from "react";

import { CreatePassword } from "@/components/CreatePassword";
import axios from "axios";
import { CreateEmail } from "@/components/CreateEmail";

export const SignUp =() => {
  const [signupStep, setSignupStep] = useState(1);
  const [loading, setloading] = useState(true);

  const GetData = async () => {
    try {
      const response = await axios.get("http://localhost:4000/user");
      console.log(response);
      setloading(false);
    } catch (error) {
      console.log(error);
      setloading(false);
    }
  };

  const nextStep = () => {
    setSignupStep(signupStep + 1);
  };
  const stepBack = () => {
    setSignupStep(signupStep - 1);
  };

  useEffect(() => {
    GetData();
  }, []);

  if(loading) return <div className="flex jusitfy-center items-center text-[30px] text-[white]">loading...</div>

  return (
    <>
      {signupStep === 1 && <CreateEmail nextStep={nextStep} stepBack={stepBack} />}
      {signupStep === 2 && (
        <CreatePassword nextStep={nextStep} stepBack={stepBack} />
      )}
    </>
  );
}
