import { useRouter } from "next/navigation";
import React, { createContext, useContext, useEffect, useState } from "react";
import { useJwt } from "react-jwt";

type UserType = {
  userId: string;
};

type AuthContextType = {
  userId?: string;
  email?: string;
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
      reEvaluateToken(storedToken as string);
    }
  }, [token]);

  return (
    <AuthContext.Provider value={{ userId: decodedToken?.userId }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useFood must be used within a FoodPrider");
  }
  return context;
};
