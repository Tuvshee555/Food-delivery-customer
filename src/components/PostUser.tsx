"use client";

import { useState } from "react";
import axios from "axios";
import { CreatePassword } from "@/components/CreatePassword";
import { CreateEmail } from "@/components/CreateEmail";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export const PostUser = () => {
  const [signupStep, setSignupStep] = useState(1);
  const [user, setUser] = useState({
    email: "",
    password: "",
    repassword: "",
    role: "USER",
  });
  const router = useRouter();

  const PostUser = async () => {
    console.log("User state:", user);
    if (!user.email || !user.password) {
      console.log("Cannot post empty user data");
      return;
    }
    try {
      const response = await axios.post("http://localhost:4000/user", user);
      console.log("Created User", response.data);

      toast("User created successfully!", {
        description: "Welcome aboard! You can now log in.",
        action: {
          label: "Go to login",
          onClick: () => router.push("/log-in"),
        },
      });

      router.push(`/log-in`);
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong. Please try again.");
    }
  };

  const nextStep = () => {
    if (signupStep === 2) {
      PostUser();
    } else {
      setSignupStep((prev) => prev + 1);
    }
  };

  const stepBack = () => setSignupStep((prev) => prev - 1);

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
