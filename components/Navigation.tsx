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
  X 
} from "lucide-react";

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const navItems = [
    { id: "home", label: "Home", icon: Home, path: "/" },
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
    { id: "mapping", label: "Mapping", icon: Map, path: "/mapping" },
    { id: "assessments", label: "Assessment Tools", icon: ClipboardList, path: "/assessments" },
    { id: "reports", label: "Reports", icon: FileText, path: "/reports" },
    { id: "sops", label: "SOPs", icon: BookOpen, path: "/sops" },
    { id: "training", label: "Training", icon: GraduationCap, path: "/training" },
    { id: "partners", label: "Partners", icon: Users, path: "/partners" },
    { id: "links", label: "Useful Links", icon: LinkIcon, path: "/links" },
  ];

  return (
    <nav className="bg-primary text-primary-foreground sticky top-0 z-50 border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1 xl:space-x-2 w-full justify-between">
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
        </div>
      )}
    </nav>
  );
}
