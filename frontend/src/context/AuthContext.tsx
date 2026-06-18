import { createContext, useEffect, useState, type ReactNode } from "react";
import {
  AUTH_SESSION_EXPIRED_EVENT,
  clearBrowserSession,
  isTokenExpired,
} from "../services/authSession";

export enum Role {
  Student = "student",
  Teacher = "teacher",
  Admin = "admin",
}

export interface User {
  id: string;
  name: string;
  email?: string;
  role: Role;
}

export interface AuthContextType {
  user: User | null;
  login: (user: User, token: string) => void;
  logout: () => void;
  setRole: (role: Role) => void;
  isAuthenticated: boolean;
  hasRole: (role: Role) => boolean;
  loading: boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined,
);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedToken = localStorage.getItem("token");

    if (storedUser && !isTokenExpired(storedToken)) {
      setUser(JSON.parse(storedUser));
    } else {
      clearBrowserSession();
    }

    setLoading(false);
  }, []);

  useEffect(() => {
    const handleExpiredSession = () => setUser(null);

    window.addEventListener(AUTH_SESSION_EXPIRED_EVENT, handleExpiredSession);
    return () => {
      window.removeEventListener(AUTH_SESSION_EXPIRED_EVENT, handleExpiredSession);
    };
  }, []);

  const login = (u: User, token: string) => {
    setUser(u);
    localStorage.setItem("user", JSON.stringify(u));
    localStorage.setItem("token", token);
  };

  const logout = () => {
    setUser(null);
    clearBrowserSession();
  };

  const setRole = (role: Role) => {
    setUser((prev) => (prev ? { ...prev, role } : prev));
    if (user) {
      const updatedUser = { ...user, role };
      localStorage.setItem("user", JSON.stringify(updatedUser));
    }
  };

  const isAuthenticated = Boolean(user);
  const hasRole = (role: Role) => user?.role === role;

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        setRole,
        isAuthenticated,
        hasRole,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
