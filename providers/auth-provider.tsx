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

const decodeJwt = (token: string) => {
  try {
    const base64Url = token.split(".")[1];
    if (!base64Url) return null;
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      window
        .atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    return JSON.parse(jsonPayload);
  } catch (e) {
    console.error("Failed to decode JWT:", e);
    return null;
  }
};

const mapBackendRole = (role?: string): string => {
  if (!role) return "Viewer";
  const r = role.toLowerCase();
  if (r === "superadmin") return "Superadmin";
  if (r === "viewer") return "Viewer";
  if (r === "data_enumerator") return "Data Enumerator";
  if (r === "field_coordinator") return "Field Coordinator";
  return role.charAt(0).toUpperCase() + role.slice(1).replace(/_/g, " ");
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedToken = localStorage.getItem("decm_auth_token");
      const storedUser = localStorage.getItem("decm_auth_user");

      if (storedToken) {
        setToken(storedToken);
        try {
          let parsedUser = storedUser ? JSON.parse(storedUser) : null;
          const decoded = decodeJwt(storedToken);
          if (decoded) {
            parsedUser = {
              email: decoded.email || parsedUser?.email || "",
              role: mapBackendRole(decoded.role || parsedUser?.role),
            };
            localStorage.setItem("decm_auth_user", JSON.stringify(parsedUser));
          }
          setUser(parsedUser);
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

      const decoded = decodeJwt(authToken);
      const resolvedUser: User = {
        email: decoded?.email || data.user?.email || data.email || credentials.email,
        role: mapBackendRole(decoded?.role || data.user?.role || data.role || credentials.role),
      };

      setToken(authToken);
      setUser(resolvedUser);

      if (typeof window !== "undefined") {
        localStorage.setItem("decm_auth_token", authToken);
        localStorage.setItem("decm_auth_user", JSON.stringify(resolvedUser));
      }

      router.push("/assement");
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
