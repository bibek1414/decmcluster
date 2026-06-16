"use client";

import React, { useState } from "react";
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

interface NavigationProps {
  activeSection: string;
  setActiveSection: (section: string) => void;
}

export default function Navigation({ activeSection, setActiveSection }: NavigationProps) {
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { id: "home", label: "Home", icon: Home },
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "mapping", label: "Mapping", icon: Map },
    { id: "assessments", label: "Assessment Tools", icon: ClipboardList },
    { id: "reports", label: "Reports", icon: FileText },
    { id: "sops", label: "SOPs", icon: BookOpen },
    { id: "training", label: "Training", icon: GraduationCap },
    { id: "partners", label: "Partners", icon: Users },
    { id: "links", label: "Useful Links", icon: LinkIcon },
  ];

  return (
    <nav className="bg-blue-950 text-white sticky top-0 z-50 border-b border-blue-900 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1 xl:space-x-2 w-full justify-between">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveSection(item.id)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold transition-all duration-200 cursor-pointer ${
                    isActive 
                      ? "bg-blue-800 text-white shadow-inner shadow-blue-900/50" 
                      : "text-blue-100 hover:bg-blue-900/60 hover:text-white"
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? "text-blue-300" : "text-blue-400"}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>

          <div className="flex lg:hidden items-center justify-between w-full">
            <span className="text-xs font-bold text-blue-200">
              DECM Portal Menu
            </span>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-md text-blue-200 hover:text-white hover:bg-blue-900 focus:outline-none"
            >
              {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {isOpen && (
        <div className="lg:hidden bg-blue-950 border-t border-blue-900 px-2 pt-2 pb-3 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveSection(item.id);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all duration-150 ${
                  isActive 
                    ? "bg-blue-800 text-white" 
                    : "text-blue-200 hover:bg-blue-900/70 hover:text-white"
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? "text-blue-300" : "text-blue-400"}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      )}
    </nav>
  );
}
