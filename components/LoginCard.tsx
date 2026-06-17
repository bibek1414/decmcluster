"use client";

import React, { useState } from "react";
import { Lock, Unlock, User, CheckCircle2, ShieldAlert } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";

export default function LoginCard() {
  const { user, isLoggedIn, isLoading: isAuthLoading, loginMutation, logout } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("Viewer");
  const [validationError, setValidationError] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username) {
      setValidationError("Please enter an email or username");
      return;
    }
    if (!password) {
      setValidationError("Please enter your password");
      return;
    }

    setValidationError("");
    loginMutation.mutate({ email: username, password, role });
  };

  const handleLogout = () => {
    logout();
    setUsername("");
    setPassword("");
  };

  const errorToShow = validationError || loginMutation.error?.message;
  const isLoggingIn = loginMutation.isPending;

  if (isAuthLoading) {
    return (
      <div className="bg-transparent sm:bg-card text-card-foreground sm:rounded-2xl p-0 sm:p-6 border-0 sm:border border-border flex items-center justify-center h-full min-h-[300px]">
        <div className="flex flex-col items-center gap-2">
          <div className="w-6 h-6 rounded-full border-2 border-primary border-t-transparent animate-spin"></div>
          <span className="text-xs text-muted-foreground">Checking session...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-transparent sm:bg-card text-card-foreground sm:rounded-2xl p-0 sm:p-6 border-0 sm:border border-border flex flex-col justify-between h-full transition-colors duration-300">
      <div>
        <div className="flex items-center justify-between mb-4 border-b border-border pb-3">
          <h3 className="text-lg font-bold text-primary flex items-center gap-2">
            {isLoggedIn ? (
              <Unlock className="w-5 h-5 text-emerald-500" />
            ) : (
              <Lock className="w-5 h-5 text-primary" />
            )}
            User Access
          </h3>
          {isLoggedIn && (
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200">
              Active Session
            </span>
          )}
        </div>

        {isLoggedIn ? (
          <div className="space-y-4 py-2">
            <div className="flex items-center gap-3 p-3 rounded-xl bg-emerald-50/50 border border-emerald-100">
              <CheckCircle2 className="w-8 h-8 text-emerald-500 shrink-0" />
              <div>
                <p className="text-xs text-muted-foreground font-semibold">
                  Logged In As
                </p>
                <p className="text-sm font-extrabold text-primary">{user?.username || "user@decmvanuatu.org"}</p>
                <p className="text-xs text-emerald-700 font-medium">Role: {user?.role || role}</p>
              </div>
            </div>
            <div className="text-xs text-muted-foreground leading-relaxed bg-muted p-3 rounded-lg border border-border">
              Welcome back. You have access to {user?.role === "Admin" ? "all system panels, database configuration, and partner forms." : "viewing statistical data and maps."}
            </div>
            <Button
              onClick={handleLogout}
              variant="outline"
              className="w-full mt-4 h-10 rounded-xl cursor-pointer"
            >
              Sign Out
            </Button>
          </div>
        ) : (
          <form onSubmit={handleLogin} className="space-y-3.5">
            <div>
              <label className="block text-xs font-bold text-muted-foreground mb-1">
                Email / Username
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="user@organization.org"
                  className="w-full pl-9 h-10 rounded-xl border border-input bg-background text-foreground"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-muted-foreground mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  className="w-full pl-9 h-10 rounded-xl border border-input bg-background text-foreground"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-muted-foreground mb-1">
                Role (Simulated)
              </label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full h-10 px-3 rounded-xl border border-input focus:border-ring focus:ring-1 focus:ring-ring focus:outline-none text-sm bg-background text-foreground transition-all"
              >
                <option value="Admin">Admin</option>
                <option value="Information Manager">Information Manager</option>
                <option value="Data Officer">Data Officer</option>
                <option value="Partner User">Partner User</option>
                <option value="Viewer">Viewer</option>
              </select>
            </div>

            {errorToShow && (
              <div className="flex items-center gap-1.5 text-xs text-rose-600 bg-rose-50 p-2 rounded-lg border border-rose-100">
                <ShieldAlert className="w-3.5 h-3.5 shrink-0" />
                <span>{errorToShow}</span>
              </div>
            )}

            <Button
              type="submit"
              disabled={isLoggingIn}
              className="w-full h-10 rounded-xl cursor-pointer flex items-center justify-center gap-2 mt-4"
            >
              {isLoggingIn ? (
                <>
                  <div className="w-4 h-4 rounded-full border-2 border-primary-foreground/30 border-t-primary-foreground animate-spin"></div>
                  <span>Authenticating...</span>
                </>
              ) : (
                <span>Login</span>
              )}
            </Button>
          </form>
        )}
      </div>

      {!isLoggedIn && (
        <div className="mt-4 text-[11px] text-muted-foreground leading-normal bg-muted p-2.5 rounded-lg border border-border">
          <strong>Note:</strong> Select a role above to simulate different level views. This portal uses role-based access for NDMO & partners.
        </div>
      )}
    </div>
  );
}

