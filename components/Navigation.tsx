"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Home, 
  LayoutDashboard, 
  Map, 
  ClipboardList, 
  FileText, 
  BookOpen, 
  GraduationCap, 
  Users, 
  Link as LinkIcon, 
  Menu, 
  X,
  LogOut
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const { isLoggedIn, user, logout } = useAuth();

  const isAdminPath = pathname?.startsWith("/assement");
  if (isAdminPath) return null;

  const navItems = [
    { id: "home", label: "Home", icon: Home, path: "/" },
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
    { id: "mapping", label: "Mapping", icon: Map, path: "/mapping" },
    { id: "assessments", label: "Assessment Tools", icon: ClipboardList, path: isLoggedIn ? "/assement" : "/assessments" },
    { id: "reports", label: "Reports", icon: FileText, path: "/reports" },
    { id: "sops", label: "SOPs", icon: BookOpen, path: "/sops" },
    { id: "training", label: "Training", icon: GraduationCap, path: "/training" },
    { id: "partners", label: "Cluster Focal Points", icon: Users, path: "/partners" },
    { id: "links", label: "Useful Links", icon: LinkIcon, path: "/links" },
  ];

  return (
    <nav className="bg-primary text-primary-foreground sticky top-0 z-50 border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center w-full justify-between">
            <div className="flex items-center space-x-1 xl:space-x-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.path;
                return (
                  <Link
                    key={item.id}
                    href={item.path}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold transition-all duration-200 cursor-pointer ${
                      isActive 
                        ? "bg-primary-foreground/10 text-primary-foreground border border-primary-foreground/20" 
                        : "text-primary-foreground/80 hover:bg-primary-foreground/5 hover:text-primary-foreground border border-transparent"
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isActive ? "text-primary-foreground" : "text-primary-foreground/60"}`} />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </div>

            {isLoggedIn && (
              <div className="flex items-center gap-3 ml-4 animate-fadeIn">
                <span className="text-xs text-primary-foreground/80 font-semibold bg-primary-foreground/10 border border-primary-foreground/15 px-2.5 py-1 rounded-lg">
                  {user?.username} ({user?.role})
                </span>
                <button
                  onClick={logout}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white transition-all cursor-pointer shadow-sm hover:shadow"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Logout</span>
                </button>
              </div>
            )}
          </div>

          <div className="flex lg:hidden items-center justify-between w-full">
            <span className="text-xs font-bold text-primary-foreground/80">
              DECM Portal Menu
            </span>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-md text-primary-foreground/80 hover:text-primary-foreground hover:bg-primary-foreground/5 focus:outline-none"
            >
              {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {isOpen && (
        <div className="lg:hidden bg-primary border-t border-border px-2 pt-2 pb-3 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.path;
            return (
              <Link
                key={item.id}
                href={item.path}
                onClick={() => setIsOpen(false)}
                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all duration-150 ${
                  isActive 
                    ? "bg-primary-foreground/10 text-primary-foreground" 
                    : "text-primary-foreground/80 hover:bg-primary-foreground/5 hover:text-primary-foreground"
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? "text-primary-foreground" : "text-primary-foreground/60"}`} />
                <span>{item.label}</span>
              </Link>
            );
          })}

          {isLoggedIn && (
            <div className="border-t border-primary-foreground/15 pt-3 mt-3 px-4 flex flex-col gap-2.5">
              <div className="text-xs text-primary-foreground/75 font-semibold">
                Logged in as: <span className="text-primary-foreground font-bold">{user?.username} ({user?.role})</span>
              </div>
              <button
                onClick={() => {
                  setIsOpen(false);
                  logout();
                }}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-bold bg-rose-600 hover:bg-rose-700 text-white transition-all cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </button>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}

