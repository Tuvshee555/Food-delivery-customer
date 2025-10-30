"use client";

import React, { useState, createContext, useContext, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useJwt } from "react-jwt";

type UserType = {
  userId: string;
};

type AuthContextType = {
  userId?: string;
  token?: string | null;
  setAuthToken: (newToken: string | null) => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const { decodedToken, reEvaluateToken, isExpired } = useJwt<UserType>(
    token || ""
  );

  useEffect(() => {
    const storedToken = localStorage.getItem("token");

    if (!storedToken) {
      router.push("/log-in");
      setLoading(false);
      return;
    }

    setToken(storedToken);
    reEvaluateToken(storedToken);

    // ⚠️ Changed: Only redirect if token exists AND isExpired
    if (storedToken && isExpired) {
      localStorage.removeItem("token");
      router.push("/log-in");
    }

    setLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const setAuthToken = (newToken: string | null) => {
    if (newToken) {
      localStorage.setItem("token", newToken);
      setToken(newToken);
      reEvaluateToken(newToken);
    } else {
      localStorage.removeItem("token");
      setToken(null);
      router.push("/log-in"); // ⚠️ Added: redirect on logout
    }
  };

  return (
    <AuthContext.Provider
      value={{ userId: decodedToken?.userId, token, setAuthToken }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};
