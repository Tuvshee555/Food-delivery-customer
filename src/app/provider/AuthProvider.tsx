"use client";

import React, { useState, createContext, useContext, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useJwt } from "react-jwt";

type UserType = { id: string };
type AuthContextType = {
  userId?: string | null;
  token?: string | null;
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

  // Only load token. Do NOT redirect.
  useEffect(() => {
    if (typeof window === "undefined") return;

    const storedToken = localStorage.getItem("token");

    if (!storedToken) {
      setLoading(false);
      return; // allow public pages
    }

    setToken(storedToken);
    reEvaluateToken(storedToken);
    setLoading(false);
  }, []);

  // update userId when decoded
  useEffect(() => {
    if (decodedToken) {
      setUserId(decodedToken.id);
    }
  }, [decodedToken]);

  const setAuthToken = (newToken: string | null) => {
    if (newToken) {
      localStorage.setItem("token", newToken);
      setToken(newToken);
      reEvaluateToken(newToken);
    } else {
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
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};
