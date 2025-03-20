"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { CreatePassword } from "@/components/CreatePassword";
import { CreateEmail } from "@/components/CreateEmail";

export const SignUp = () => {
  const [signupStep, setSignupStep] = useState(1);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState({ email: "", password: "" });

  useEffect(() => {
    const getData = async () => {
      try {
        await axios.get("http://localhost:4000/user");
        setLoading(false);
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    };
    getData();
  }, []);

  const nextStep = () => setSignupStep((prev) => prev + 1);
  const stepBack = () => setSignupStep((prev) => prev - 1);

  console.log("fakepage");
  

  if (loading)
    return (
      <div className="flex justify-center items-center text-[30px] text-white">
        Loading...
      </div>
    );

  return (
    <>
      {signupStep === 1 && <CreateEmail nextStep={nextStep} setUser={setUser} />}
      {signupStep === 2 && <CreatePassword nextStep={nextStep} stepBack={stepBack} setUser={setUser} />}
    </>
  );
};
