"use client";

import React, { useState, createContext, useContext, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useJwt } from "react-jwt";

// JWT can contain either `id` (Google login)
// or `userId` (OTP login)
type UserType = {
  id?: string;
  userId?: string;
};

type AuthContextType = {
  userId: string | null;
  token: string | null;
  setAuthToken: (token: string | null) => void;
  loading: boolean;
};

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();

  const [token, setToken] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const { decodedToken, reEvaluateToken } = useJwt<UserType>(token || "");

  // 🔥 Load token from localStorage
  useEffect(() => {
    if (typeof window === "undefined") return;

    const storedToken = localStorage.getItem("token");

    if (!storedToken) {
      setLoading(false);
      return;
    }

    setToken(storedToken);
    reEvaluateToken(storedToken);
    setLoading(false);
  }, []);

  // 🔥 Extract correct userId from decoded token
  useEffect(() => {
    if (decodedToken) {
      const finalId = decodedToken.id || decodedToken.userId;
      setUserId(finalId ?? null);

      console.log("AUTH PROVIDER → Loaded userId:", finalId);
    }
  }, [decodedToken]);

  // 🔥 Update token from login actions
  const setAuthToken = (newToken: string | null) => {
    if (newToken) {
      localStorage.setItem("token", newToken);
      setToken(newToken);
      reEvaluateToken(newToken);
    } else {
      // Logout
      localStorage.removeItem("token");
      setToken(null);
      setUserId(null);
      router.push("/log-in");
    }
  };

  return (
    <AuthContext.Provider value={{ userId, token, setAuthToken, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
};
