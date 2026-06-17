"use client";

import React, { createContext, useState, useEffect } from "react";
import { useMutation, UseMutationResult } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { authService } from "@/services/auth";
import { User, LoginRequest, LoginResponse } from "@/types/login";
import { ApiError } from "@/services/auth";

export interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoggedIn: boolean;
  isLoading: boolean;
  loginMutation: UseMutationResult<LoginResponse, ApiError, LoginRequest>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedToken = localStorage.getItem("decm_auth_token");
      const storedUser = localStorage.getItem("decm_auth_user");

      if (storedToken && storedUser) {
        setToken(storedToken);
        try {
          setUser(JSON.parse(storedUser));
        } catch (e) {
          console.error("Failed to parse stored user", e);
          localStorage.removeItem("decm_auth_token");
          localStorage.removeItem("decm_auth_user");
        }
      }
      setIsLoading(false);
    }
  }, []);

  const loginMutation = useMutation<LoginResponse, ApiError, LoginRequest>({
    mutationFn: (credentials) => authService.login(credentials),
    onSuccess: (data, credentials) => {
      const authToken = data.token || data.key || data.access;
      if (!authToken) {
        throw new Error("No token returned from server");
      }

      const resolvedUser: User = {
        username: data.user?.username || data.username || credentials.email,
        email: data.user?.email || data.email || credentials.email,
        role: data.user?.role || data.role || credentials.role || "Viewer",
      };

      setToken(authToken);
      setUser(resolvedUser);

      if (typeof window !== "undefined") {
        localStorage.setItem("decm_auth_token", authToken);
        localStorage.setItem("decm_auth_user", JSON.stringify(resolvedUser));
      }

      router.push("/dashboard");
    },
  });

  const logout = () => {
    setToken(null);
    setUser(null);
    if (typeof window !== "undefined") {
      localStorage.removeItem("decm_auth_token");
      localStorage.removeItem("decm_auth_user");
    }
    router.push("/");
  };

  const isLoggedIn = !!token;

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoggedIn,
        isLoading,
        loginMutation,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
