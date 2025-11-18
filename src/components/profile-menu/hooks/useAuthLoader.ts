"use client";

import { useEffect, useState } from "react";

export const useAuthLoader = () => {
  const [userEmail, setUserEmail] = useState<string | null>(null);

  useEffect(() => {
    // Load Facebook SDK
    if (typeof window !== "undefined" && !window.FB) {
      window.fbAsyncInit = function () {
        window.FB.init({
          appId: process.env.NEXT_PUBLIC_FACEBOOK_APP_ID!,
          cookie: true,
          xfbml: true,
          version: "v20.0",
        });
      };

      const script = document.createElement("script");
      script.id = "facebook-jssdk";
      script.src = "https://connect.facebook.net/en_US/sdk.js";
      script.async = true;
      document.body.appendChild(script);
    }

    // Load email
    const updateEmail = () => {
      setUserEmail(localStorage.getItem("email"));
    };

    updateEmail();
    window.addEventListener("auth-changed", updateEmail);

    return () => {
      window.removeEventListener("auth-changed", updateEmail);
    };
  }, []);

  return { userEmail };
};
