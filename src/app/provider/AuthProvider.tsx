/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import React, { useState, createContext, useContext, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useJwt } from "react-jwt";

type UserType = { id?: string; userId?: string };

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

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedUserId = localStorage.getItem("userId");

    if (storedToken?.startsWith("guest-token-")) {
      setToken(storedToken);
      setUserId(storedUserId || null);
      setLoading(false);
      return;
    }

    if (storedToken) {
      setToken(storedToken);
      reEvaluateToken(storedToken);
    }

    setLoading(false);
  }, []);

  useEffect(() => {
    if (!token) return;

    if (token.startsWith("guest-token-")) {
      setUserId(localStorage.getItem("userId"));
      return;
    }

    if (decodedToken) {
      setUserId(decodedToken.id || decodedToken.userId || null);
    }
  }, [token, decodedToken]);

  useEffect(() => {
    const handler = () => {
      const newToken = localStorage.getItem("token");
      const newUserId = localStorage.getItem("userId");

      if (newToken?.startsWith("guest-token-")) {
        setToken(newToken);
        setUserId(newUserId || null);
        return;
      }

      if (newToken) {
        setToken(newToken);
        reEvaluateToken(newToken);
      } else {
        setToken(null);
        setUserId(null);
      }
    };

    window.addEventListener("auth-changed", handler);
    return () => window.removeEventListener("auth-changed", handler);
  }, []);

  const setAuthToken = (newToken: string | null) => {
    if (newToken) {
      localStorage.setItem("token", newToken);
      setToken(newToken);
      reEvaluateToken(newToken);
      window.dispatchEvent(new Event("auth-changed"));
      return;
    }

    localStorage.removeItem("token");
    localStorage.removeItem("userId");

    setToken(null);
    setUserId(null);

    window.dispatchEvent(new Event("auth-changed"));
    router.push("/sign-in");
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
