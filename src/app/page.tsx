"use client";

import { useState } from "react";
import { SignUp } from "@/components/SignUp";
import { CreatePassword } from "@/components/CreatePassword";

export default function Home() {
  const [signupStep, setSignupStep] = useState(1);

  const nextStep = () => {
    setSignupStep(signupStep + 1);
  };
  const stepBack = () => {
    setSignupStep(signupStep - 1);
  };

  return (
    <>
      {signupStep === 1 && <SignUp nextStep={nextStep} stepBack={stepBack} />}
      {signupStep === 2 && <CreatePassword nextStep={nextStep} stepBack={stepBack}/>}
    </>
  );
}
