"use client";

import { useRouter } from "next/navigation";
import React, { createContext, useContext, useEffect, useState } from "react";
import { useJwt } from "react-jwt";

type UserType = {
  userId: string;
};

type AuthContextType = {
  userId?: string;
  token?: string | null;
  setAuthToken: (newToken: string | null) => void;
};

export const AuthContext = createContext<AuthContextType>(
  {} as AuthContextType
);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const [token, setToken] = useState<string | null>(null);
  const { decodedToken, reEvaluateToken } = useJwt<UserType>(token || "");

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (!storedToken) {
      router.push("/log-in");
    } else {
      setToken(storedToken);
      reEvaluateToken(storedToken);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Call this after login
  const setAuthToken = (newToken: string | null) => {
    if (newToken) {
      localStorage.setItem("token", newToken);
      setToken(newToken);
      reEvaluateToken(newToken);
    } else {
      localStorage.removeItem("token");
      setToken(null);
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
