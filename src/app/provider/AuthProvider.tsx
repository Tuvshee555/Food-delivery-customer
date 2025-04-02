// context/AuthContext.tsx
import { createContext, useContext, useEffect, useState } from "react";
import { useJwt } from "react-jwt";

// Type for the decoded JWT token
type UserType = {
  userId: string;
};

// Define the shape of the context
type AuthContextType = {
  userId?: string;
  isExpired?: boolean;
  token?: string | null;
};

// Create the context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// AuthProvider component to manage auth state
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [token, setToken] = useState<string | null>(null);
  const { decodedToken, isExpired } = useJwt<UserType>(token ?? "");

  // Load the token from localStorage when the component mounts
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    setToken(storedToken);
  }, []);

  return (
    <AuthContext.Provider
      value={{ userId: decodedToken?.userId, isExpired, token }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to access authentication state
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
