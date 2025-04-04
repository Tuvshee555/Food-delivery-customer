import { useRouter } from "next/navigation";
import React, { createContext, useContext, useEffect, useState } from "react";
import { useJwt } from "react-jwt";

type UserType = {
  userId: string;
};

type AuthContextType = {
  userId?: string;
  token?: string;
};

export const AuthContext = createContext<AuthContextType>(
  {} as AuthContextType
);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const [token, setToken] = useState<string | null>(null);
  const { decodedToken, reEvaluateToken } = useJwt<UserType>(token as string);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (!storedToken) {
      router.push("/log-in");
    } else {
      setToken(storedToken); // Ensure the token state is set
      reEvaluateToken(storedToken); // Re-evaluate the token
    }
  }, []);

  return (
    <AuthContext.Provider value={{ userId: decodedToken?.userId, token }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
