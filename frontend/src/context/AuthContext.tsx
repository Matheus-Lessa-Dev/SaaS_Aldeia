import { createContext, useEffect, useState, type ReactNode } from "react";

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
  login: (user: User) => void;
  logout: () => void;
  setRole: (role: Role) => void;
  isAuthenticated: boolean;
  hasRole: (role: Role) => boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined,
);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = (u: User) => {
    setUser(u);
    localStorage.setItem("user", JSON.stringify(u));
  };
  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
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
      value={{ user, login, logout, setRole, isAuthenticated, hasRole }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
