"use client";

import React, { useState, createContext, useContext, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useJwt } from "react-jwt";

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

  /** ─────────────────────────────
   *  1️⃣ Load stored token on page load
   *  ───────────────────────────── */
  useEffect(() => {
    const stored = localStorage.getItem("token");
    const storedUserId = localStorage.getItem("userId");

    if (stored) {
      setToken(stored);
      reEvaluateToken(stored);
    }

    // Guest users DO NOT have JWT → set userId manually
    if (stored?.startsWith("guest-token-") && storedUserId) {
      setUserId(storedUserId);
    }

    setLoading(false);
  }, []);

  /** ─────────────────────────────
   *  2️⃣ Extract userId from token OR guest fallback
   *  ───────────────────────────── */
  useEffect(() => {
    if (!token) return;

    // 🔥 Guest login → NOT a JWT
    if (token.startsWith("guest-token-")) {
      const guestId = localStorage.getItem("userId");
      setUserId(guestId);
      return;
    }

    // 🔥 Normal JWT login
    if (decodedToken) {
      const finalId = decodedToken.id || decodedToken.userId || null;
      setUserId(finalId);
    }
  }, [token, decodedToken]);

  /** ─────────────────────────────
   *  3️⃣ Listen for login/logout events
   *  ───────────────────────────── */
  useEffect(() => {
    const handler = () => {
      const newToken = localStorage.getItem("token");
      const newUserId = localStorage.getItem("userId");

      if (newToken) {
        setToken(newToken);
        reEvaluateToken(newToken);

        // If guest login, update userId manually
        if (newToken.startsWith("guest-token-") && newUserId) {
          setUserId(newUserId);
        }
      } else {
        // Logout
        setToken(null);
        setUserId(null);
      }
    };

    window.addEventListener("auth-changed", handler);
    return () => window.removeEventListener("auth-changed", handler);
  }, []);

  /** ─────────────────────────────
   *  4️⃣ Allow manual login/logout
   *  ───────────────────────────── */
  const setAuthToken = (newToken: string | null) => {
    if (newToken) {
      localStorage.setItem("token", newToken);
      setToken(newToken);
      reEvaluateToken(newToken);
      window.dispatchEvent(new Event("auth-changed"));
    } else {
      // Logout
      localStorage.removeItem("token");
      localStorage.removeItem("userId");
      localStorage.removeItem("guest");
      setToken(null);
      setUserId(null);
      window.dispatchEvent(new Event("auth-changed"));
      router.push("/sign-in");
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
