"use client";

import React, { useState, useEffect, useRef } from "react";
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
  LogOut,
  ChevronDown,
  User as UserIcon,
} from "lucide-react";
import { useAuth } from "@/hooks/use-auth";

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const { isLoggedIn, user, logout } = useAuth();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const isAdminPath = pathname?.startsWith("/assement");
  if (isAdminPath) return null;

  const navItems = [
    { id: "home", label: "Home", icon: Home, path: "/" },
    {
      id: "dashboard",
      label: "Dashboard",
      icon: LayoutDashboard,
      path: "/dashboard",
    },
    { id: "mapping", label: "Mapping", icon: Map, path: "/mapping" },
    {
      id: "assessments",
      label: "Assessments",
      icon: ClipboardList,
      path: "/assessments-tools",
    },
    { id: "reports", label: "Reports", icon: FileText, path: "/reports" },
    { id: "sops", label: "SOPs", icon: BookOpen, path: "/sops" },
    {
      id: "response Tracking",
      label: "Response Tracking",
      icon: LayoutDashboard,
      path: "/response-tracking",
    },
    {
      id: "training",
      label: "Training",
      icon: GraduationCap,
      path: "/training",
    },
    {
      id: "partners",
      label: "Cluster Focal Points",
      icon: Users,
      path: "/partners",
    },
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
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg text-[10px] font-semibold transition-all duration-200 cursor-pointer ${
                      isActive
                        ? "bg-primary-foreground/10 text-primary-foreground border border-primary-foreground/20"
                        : "text-primary-foreground/80 hover:bg-primary-foreground/5 hover:text-primary-foreground border border-transparent"
                    }`}
                  >
                    <Icon
                      className={`w-4 h-4 ${isActive ? "text-primary-foreground" : "text-primary-foreground/60"}`}
                    />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </div>

            {isLoggedIn && (
              <div className="relative ml-4 animate-fadeIn" ref={dropdownRef}>
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold bg-primary-foreground/10 border border-primary-foreground/15 text-primary-foreground hover:bg-primary-foreground/15 transition-all cursor-pointer"
                >
                  <UserIcon className="w-3.5 h-3.5" />
                  <span>
                    {user?.email} ({user?.role})
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-primary-foreground/60" />
                </button>

                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 rounded-xl border border-border bg-card p-1.5 shadow-lg z-50 text-card-foreground animate-fadeIn">
                    <div className="px-2.5 py-2 border-b border-border/60">
                      <p className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider">
                        Signed in as
                      </p>
                      <p className="text-xs font-bold text-foreground truncate mt-0.5">
                        {user?.email}
                      </p>
                      <p className="text-[10px] text-muted-foreground mt-0.5">
                        Role: {user?.role}
                      </p>
                    </div>
                    <div className="py-1">
                      <Link
                        href="/assement"
                        onClick={() => setIsDropdownOpen(false)}
                        className="flex w-full items-center gap-2 px-2.5 py-2 rounded-lg text-xs font-bold text-foreground hover:bg-muted transition-colors cursor-pointer"
                      >
                        <ClipboardList className="w-4 h-4 text-muted-foreground" />
                        <span>Assessment Management</span>
                      </Link>
                      <button
                        onClick={() => {
                          setIsDropdownOpen(false);
                          logout();
                        }}
                        className="flex w-full items-center gap-2 px-2.5 py-2 rounded-lg text-xs font-bold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/20 transition-colors cursor-pointer text-left"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                )}
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
              {isOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
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
                <Icon
                  className={`w-4 h-4 ${isActive ? "text-primary-foreground" : "text-primary-foreground/60"}`}
                />
                <span>{item.label}</span>
              </Link>
            );
          })}

          {isLoggedIn && (
            <div className="border-t border-primary-foreground/15 pt-3 mt-3 px-4 flex flex-col gap-2.5">
              <div className="text-xs text-primary-foreground/75 font-semibold">
                Logged in as:{" "}
                <span className="text-primary-foreground font-bold">
                  {user?.email} ({user?.role})
                </span>
              </div>
              <Link
                href="/assement"
                onClick={() => setIsOpen(false)}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-bold bg-primary-foreground/10 hover:bg-primary-foreground/15 text-primary-foreground transition-all cursor-pointer"
              >
                <ClipboardList className="w-4 h-4" />
                <span>Assessment Management</span>
              </Link>
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
