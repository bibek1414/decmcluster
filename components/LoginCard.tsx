"use client";

import React, { useState } from "react";
import { Lock, Unlock, User, CheckCircle2, ShieldAlert } from "lucide-react";

export default function LoginCard() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("Viewer");
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username) {
      setError("Please enter an email or username");
      return;
    }
    if (!password) {
      setError("Please enter your password");
      return;
    }

    setError("");
    setIsLoggingIn(true);

    // Simulate database lookup
    setTimeout(() => {
      setIsLoggingIn(false);
      setIsLoggedIn(true);
    }, 1200);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUsername("");
    setPassword("");
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex flex-col justify-between h-full hover:shadow-md transition-shadow duration-300">
      <div>
        <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
          <h3 className="text-lg font-bold text-blue-900 flex items-center gap-2">
            {isLoggedIn ? (
              <Unlock className="w-5 h-5 text-emerald-500" />
            ) : (
              <Lock className="w-5 h-5 text-blue-600" />
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
                <p className="text-xs text-slate-500 font-semibold">
                  Logged In As
                </p>
                <p className="text-sm font-extrabold text-blue-900">{username || "user@decmvanuatu.org"}</p>
                <p className="text-xs text-emerald-700 font-medium">Role: {role}</p>
              </div>
            </div>
            <div className="text-xs text-slate-500 leading-relaxed bg-slate-50 p-3 rounded-lg border border-slate-100">
              Welcome back. You have access to {role === "Admin" ? "all system panels, database configuration, and partner forms." : "viewing statistical data and maps."}
            </div>
            <button
              onClick={handleLogout}
              className="w-full py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-sm font-semibold transition-all cursor-pointer mt-4"
            >
              Sign Out
            </button>
          </div>
        ) : (
          <form onSubmit={handleLogin} className="space-y-3.5">
            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1">
                Email / Username
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="user@organization.org"
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none text-sm transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none text-sm transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1">
                Role (Simulated)
              </label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none text-sm bg-white text-slate-700 transition-all"
              >
                <option value="Admin">Admin</option>
                <option value="Information Manager">Information Manager</option>
                <option value="Data Officer">Data Officer</option>
                <option value="Partner User">Partner User</option>
                <option value="Viewer">Viewer</option>
              </select>
            </div>

            {error && (
              <div className="flex items-center gap-1.5 text-xs text-rose-600 bg-rose-50 p-2 rounded-lg border border-rose-100">
                <ShieldAlert className="w-3.5 h-3.5 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoggingIn}
              className="w-full py-2.5 rounded-xl bg-blue-900 hover:bg-blue-800 disabled:bg-blue-900/60 text-white text-sm font-semibold shadow-md shadow-blue-900/10 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              {isLoggingIn ? (
                <>
                  <div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin"></div>
                  <span>Authenticating...</span>
                </>
              ) : (
                <span>Login</span>
              )}
            </button>
          </form>
        )}
      </div>

      {!isLoggedIn && (
        <div className="mt-4 text-[11px] text-slate-400 leading-normal bg-slate-50 p-2.5 rounded-lg border border-slate-100">
          <strong>Note:</strong> Select a role above to simulate different level views. This portal uses role-based access for NDMO & partners.
        </div>
      )}
    </div>
  );
}
