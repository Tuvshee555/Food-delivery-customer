"use client";

import { useState } from "react";
import axios from "axios";
import { CreatePassword } from "@/components/CreatePassword";
import { CreateEmail } from "@/components/CreateEmail";
import { useRouter } from "next/navigation";

export const PostUser = () => {
  const [signupStep, setSignupStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState({ email: "", password: "", repassword: "" });
  const router = useRouter()

  const PostUser = async () => {
    console.log("User state:", user);
    console.log("User boolean:", !user.email || !user.password);
    if (!user.email || !user.password) {
      console.log("Cannot post empty user data");
      return;
    }
    try {
      console.log("axios");
      const response = await axios.post("http://localhost:4000/user", user);
      console.log("Created User", response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const nextStep = () => {
    if (signupStep === 2) {
      PostUser();
      router.push(`/log-in`)

    } else {
      setSignupStep((prev) => prev + 1);
    }
  };
  const stepBack = () => setSignupStep((prev) => prev - 1);

  if (loading)
    return (
      <div className="flex justify-center items-center text-[30px] text-white">
        Loading...
      </div>
    );

  return (
    <>
      <div className="h-screen w-screen bg-white flex items-center justify-center gap-12">
        {signupStep === 1 && (
          <CreateEmail nextStep={nextStep} setUser={setUser} user={user} />
        )}
        {signupStep === 2 && (
          <CreatePassword
            nextStep={nextStep}
            stepBack={stepBack}
            setUser={setUser}
            user={user}
          />
        )}
      </div>
    </>
  );
};
