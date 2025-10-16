"use client";

import { User } from "@/type/type";
import axios, { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { CreatePassword } from "./CreatePassword";
import { CreateEmail } from "./CreateEmail";

export const PostUser = () => {
  const [signUpStep, setSignupStep] = useState(1);
  const [user, setUser] = useState<User>({
    email: "",
    password: "",
    repassword: "",
    role: "USER",
  });

  const router = useRouter();

  const handlePostUser = async () => {
    if (!user.email || !user.password) {
      toast.error("Email and password are required!");
      return;
    }

    if (user.password !== user.repassword) {
      toast.error("Passwords do not match!");
      return;
    }

    try {
      const response = await axios.post(`http://localhost:4000/user`, user);
      console.log("Created admin", response.data);
      toast.success("Welcome aboard! You can now log in.");
      router.push("/log-in");
    } catch (err) {
      const error = err as AxiosError<{ message: string }>;
      const message = error.response?.data?.message;

      if (message) {
        toast.error(message);
      } else {
        toast.error("Something went wrong");
      }

      console.error(error);
    }
  };

  const nextStep = () => {
    if (signUpStep === 2) {
      handlePostUser();
      router.push(`log-in`);
    } else {
      setSignupStep((prev) => prev + 1);
    }
  };

  const stepBack = () => {
    setSignupStep((prev) => prev - 1);
  };

  return (
    <div>
      {signUpStep === 1 && (
        <CreateEmail setUser={setUser} nextStep={nextStep} user={user} />
      )}

      {signUpStep >= 2 && (
        <CreatePassword
          setUser={setUser}
          nextStep={nextStep}
          user={user}
          stepBack={stepBack}
        />
      )}
    </div>
  );
};
